package com.precificapro.service;

import com.google.api.client.http.FileContent;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;
import com.precificapro.domain.model.BackupMetadata;
import com.precificapro.domain.model.BackupMetadata.BackupStatus;
import com.precificapro.domain.model.BackupMetadata.BackupType;
import com.precificapro.domain.model.User;
import com.precificapro.domain.repository.BackupMetadataRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class BackupService {

    @Autowired(required = false)
    private Drive driveService;

    @Autowired
    private BackupMetadataRepository backupMetadataRepository;

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username}")
    private String dbUsername;

    @Value("${spring.datasource.password}")
    private String dbPassword;

    @Value("${google.drive.backup.folder.id:}")
    private String backupFolderId;

    @Value("${backup.retention.days:30}")
    private int retentionDays;

    private static final String BACKUP_FILE_PREFIX = "precificapro_backup_";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");

    /**
     * Cria backup manual do banco de dados
     */
    @Transactional
    public BackupMetadata createManualBackup(User user) {
        log.info("Creating manual backup requested by user: {}", user.getUsername());
        return performBackup(BackupType.MANUAL, user);
    }

    /**
     * Cria backup automático (chamado pelo scheduler)
     */
    @Async
    @Transactional
    public void createAutomaticBackup() {
        log.info("Starting automatic backup...");
        performBackup(BackupType.AUTOMATIC, null);
    }

    /**
     * Realiza o backup do banco de dados
     */
    private BackupMetadata performBackup(BackupType type, User user) {
        if (driveService == null) {
            log.error("Google Drive service not configured. Cannot perform backup.");
            throw new IllegalStateException("Backup service not configured");
        }

        String timestamp = LocalDateTime.now().format(DATE_FORMATTER);
        String filename = BACKUP_FILE_PREFIX + timestamp + ".sql";
        Path tempFile = null;

        BackupMetadata metadata = BackupMetadata.builder()
                .filename(filename)
                .status(BackupStatus.IN_PROGRESS)
                .type(type)
                .createdBy(user)
                .build();

        metadata = backupMetadataRepository.save(metadata);

        try {
            // 1. Exportar banco de dados PostgreSQL para arquivo
            tempFile = exportDatabase(filename);
            long fileSize = Files.size(tempFile);

            // 2. Upload para Google Drive
            String driveFileId = uploadToGoogleDrive(tempFile.toFile(), filename);

            // 3. Atualizar metadata
            metadata.setS3Key(driveFileId);
            metadata.setFileSize(fileSize);
            metadata.setStatus(BackupStatus.COMPLETED);
            backupMetadataRepository.save(metadata);

            log.info("Backup completed successfully: {} ({}MB)", filename, fileSize / 1024 / 1024);

            // 4. Limpar backups antigos
            cleanOldBackups();

            return metadata;

        } catch (Exception e) {
            log.error("Backup failed: {}", e.getMessage(), e);
            metadata.setStatus(BackupStatus.FAILED);
            metadata.setErrorMessage(e.getMessage());
            backupMetadataRepository.save(metadata);
            throw new RuntimeException("Backup failed: " + e.getMessage(), e);

        } finally {
            // Limpar arquivo temporário
            if (tempFile != null) {
                try {
                    Files.deleteIfExists(tempFile);
                } catch (IOException e) {
                    log.warn("Failed to delete temporary backup file: {}", e.getMessage());
                }
            }
        }
    }

    /**
     * Exporta o banco de dados PostgreSQL usando pg_dump
     */
    private Path exportDatabase(String filename) throws IOException, InterruptedException {
        Path tempFile = Files.createTempFile("backup_", ".sql");

        // Extrair informações de conexão da URL
        String[] urlParts = dbUrl.split("//")[1].split("/");
        String[] hostPort = urlParts[0].split(":");
        String host = hostPort[0];
        String port = hostPort.length > 1 ? hostPort[1] : "5432";
        String dbName = urlParts[1].split("\\?")[0];

        // Comando pg_dump
        ProcessBuilder processBuilder = new ProcessBuilder(
            "pg_dump",
            "-h", host,
            "-p", port,
            "-U", dbUsername,
            "-d", dbName,
            "-F", "p",  // Plain text format
            "-f", tempFile.toString()
        );

        // Configurar senha via variável de ambiente
        processBuilder.environment().put("PGPASSWORD", dbPassword);
        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();

        // Capturar output
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                log.debug("pg_dump: {}", line);
            }
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new IOException("pg_dump failed with exit code: " + exitCode);
        }

        log.info("Database exported to temporary file: {}", tempFile);
        return tempFile;
    }

    /**
     * Faz upload do arquivo para Google Drive
     */
    private String uploadToGoogleDrive(java.io.File file, String filename) throws IOException {
        File fileMetadata = new File();
        fileMetadata.setName(filename);
        fileMetadata.setMimeType("application/sql");

        // Se tiver pasta específica configurada, usar ela
        if (backupFolderId != null && !backupFolderId.isEmpty()) {
            fileMetadata.setParents(Collections.singletonList(backupFolderId));
        }

        FileContent mediaContent = new FileContent("application/sql", file);

        File uploadedFile = driveService.files().create(fileMetadata, mediaContent)
                .setFields("id, name, size, createdTime")
                .execute();

        log.info("File uploaded to Google Drive with ID: {}", uploadedFile.getId());
        return uploadedFile.getId();
    }

    /**
     * Restaura um backup do Google Drive
     */
    @Transactional
    public void restoreBackup(Long backupId) throws IOException, InterruptedException {
        BackupMetadata backup = backupMetadataRepository.findById(backupId)
                .orElseThrow(() -> new IllegalArgumentException("Backup not found: " + backupId));

        if (driveService == null) {
            throw new IllegalStateException("Google Drive service not configured");
        }

        log.info("Starting restore of backup: {}", backup.getFilename());

        // 1. Download do Google Drive
        Path tempFile = Files.createTempFile("restore_", ".sql");
        try (FileOutputStream fos = new FileOutputStream(tempFile.toFile())) {
            driveService.files().get(backup.getS3Key()).executeMediaAndDownloadTo(fos);
        }

        // 2. Restaurar no banco
        restoreDatabase(tempFile);

        // 3. Atualizar metadata
        backup.setRestoredAt(LocalDateTime.now());
        backup.setStatus(BackupStatus.RESTORED);
        backupMetadataRepository.save(backup);

        // 4. Limpar arquivo temporário
        Files.deleteIfExists(tempFile);

        log.info("Backup restored successfully: {}", backup.getFilename());
    }

    /**
     * Restaura o banco de dados usando psql
     */
    private void restoreDatabase(Path backupFile) throws IOException, InterruptedException {
        String[] urlParts = dbUrl.split("//")[1].split("/");
        String[] hostPort = urlParts[0].split(":");
        String host = hostPort[0];
        String port = hostPort.length > 1 ? hostPort[1] : "5432";
        String dbName = urlParts[1].split("\\?")[0];

        ProcessBuilder processBuilder = new ProcessBuilder(
            "psql",
            "-h", host,
            "-p", port,
            "-U", dbUsername,
            "-d", dbName,
            "-f", backupFile.toString()
        );

        processBuilder.environment().put("PGPASSWORD", dbPassword);
        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                log.debug("psql: {}", line);
            }
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new IOException("Database restore failed with exit code: " + exitCode);
        }
    }

    /**
     * Remove backups antigos baseado no período de retenção
     */
    @Transactional
    public void cleanOldBackups() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(retentionDays);
        List<BackupMetadata> oldBackups = backupMetadataRepository.findOldBackups(
            BackupStatus.COMPLETED, 
            cutoffDate
        );

        log.info("Found {} old backups to clean", oldBackups.size());

        for (BackupMetadata backup : oldBackups) {
            try {
                // Deletar do Google Drive
                if (driveService != null && backup.getS3Key() != null) {
                    driveService.files().delete(backup.getS3Key()).execute();
                }

                // Deletar metadata
                backupMetadataRepository.delete(backup);
                log.info("Deleted old backup: {}", backup.getFilename());

            } catch (Exception e) {
                log.error("Failed to delete old backup {}: {}", backup.getFilename(), e.getMessage());
            }
        }
    }

    /**
     * Lista todos os backups disponíveis
     */
    public List<BackupMetadata> listBackups() {
        return backupMetadataRepository.findAllOrderByCreatedAtDesc();
    }

    /**
     * Lista backups no Google Drive (caso metadata esteja dessincronizada)
     */
    public List<String> listGoogleDriveBackups() throws IOException {
        if (driveService == null) {
            return Collections.emptyList();
        }

        String query = "name contains '" + BACKUP_FILE_PREFIX + "' and trashed = false";
        FileList result = driveService.files().list()
                .setQ(query)
                .setFields("files(id, name, size, createdTime)")
                .setOrderBy("createdTime desc")
                .execute();

        return result.getFiles().stream()
                .map(file -> String.format("%s (ID: %s, Size: %d bytes)", 
                    file.getName(), file.getId(), file.getSize()))
                .collect(Collectors.toList());
    }

    /**
     * Verifica se o serviço de backup está configurado
     */
    public boolean isBackupServiceEnabled() {
        return driveService != null;
    }
}
