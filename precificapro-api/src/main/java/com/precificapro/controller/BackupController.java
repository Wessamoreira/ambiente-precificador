package com.precificapro.controller;

import com.precificapro.controller.dto.BackupDTO;
import com.precificapro.controller.dto.BackupResponseDTO;
import com.precificapro.domain.model.BackupMetadata;
import com.precificapro.domain.model.User;
import com.precificapro.mapper.BackupMapper;
import com.precificapro.service.BackupService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/backups")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Backup", description = "Endpoints para gerenciamento de backups do sistema")
@SecurityRequirement(name = "bearer-jwt")
public class BackupController {

    private final BackupService backupService;
    private final BackupMapper backupMapper;

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Criar backup manual", description = "Cria um backup manual do banco de dados e envia para o Google Drive")
    public ResponseEntity<BackupResponseDTO> createBackup(@AuthenticationPrincipal User user) {
        try {
            if (!backupService.isBackupServiceEnabled()) {
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body(BackupResponseDTO.builder()
                                .success(false)
                                .message("Serviço de backup não está configurado. Configure o Google Drive API.")
                                .build());
            }

            log.info("Manual backup requested by user: {}", user.getUsername());
            BackupMetadata backup = backupService.createManualBackup(user);
            BackupDTO backupDTO = backupMapper.toDTO(backup);

            return ResponseEntity.ok(BackupResponseDTO.builder()
                    .success(true)
                    .message("Backup criado com sucesso")
                    .backup(backupDTO)
                    .build());

        } catch (Exception e) {
            log.error("Error creating backup: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(BackupResponseDTO.builder()
                            .success(false)
                            .message("Erro ao criar backup: " + e.getMessage())
                            .build());
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar backups", description = "Lista todos os backups disponíveis")
    public ResponseEntity<List<BackupDTO>> listBackups() {
        try {
            List<BackupMetadata> backups = backupService.listBackups();
            List<BackupDTO> backupDTOs = backupMapper.toDTOList(backups);
            return ResponseEntity.ok(backupDTOs);

        } catch (Exception e) {
            log.error("Error listing backups: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{backupId}/restore")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Restaurar backup", description = "Restaura o banco de dados a partir de um backup específico")
    public ResponseEntity<BackupResponseDTO> restoreBackup(
            @PathVariable Long backupId,
            @AuthenticationPrincipal User user) {
        try {
            if (!backupService.isBackupServiceEnabled()) {
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body(BackupResponseDTO.builder()
                                .success(false)
                                .message("Serviço de backup não está configurado")
                                .build());
            }

            log.info("Restore backup {} requested by user: {}", backupId, user.getUsername());
            backupService.restoreBackup(backupId);

            return ResponseEntity.ok(BackupResponseDTO.builder()
                    .success(true)
                    .message("Backup restaurado com sucesso")
                    .build());

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(BackupResponseDTO.builder()
                            .success(false)
                            .message("Backup não encontrado")
                            .build());

        } catch (Exception e) {
            log.error("Error restoring backup: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(BackupResponseDTO.builder()
                            .success(false)
                            .message("Erro ao restaurar backup: " + e.getMessage())
                            .build());
        }
    }

    @GetMapping("/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Status do serviço de backup", description = "Verifica se o serviço de backup está configurado e funcionando")
    public ResponseEntity<Map<String, Object>> getBackupStatus() {
        try {
            boolean enabled = backupService.isBackupServiceEnabled();
            List<String> driveBackups = enabled ? backupService.listGoogleDriveBackups() : List.of();

            return ResponseEntity.ok(Map.of(
                    "enabled", enabled,
                    "message", enabled ? "Serviço de backup configurado e ativo" : "Serviço de backup não configurado",
                    "googleDriveBackups", driveBackups.size(),
                    "backupFiles", driveBackups
            ));

        } catch (Exception e) {
            log.error("Error checking backup status: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "enabled", false,
                            "message", "Erro ao verificar status: " + e.getMessage()
                    ));
        }
    }

    @DeleteMapping("/cleanup")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Limpar backups antigos", description = "Remove backups antigos baseado no período de retenção configurado")
    public ResponseEntity<BackupResponseDTO> cleanupOldBackups(@AuthenticationPrincipal User user) {
        try {
            if (!backupService.isBackupServiceEnabled()) {
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body(BackupResponseDTO.builder()
                                .success(false)
                                .message("Serviço de backup não está configurado")
                                .build());
            }

            log.info("Cleanup old backups requested by user: {}", user.getUsername());
            backupService.cleanOldBackups();

            return ResponseEntity.ok(BackupResponseDTO.builder()
                    .success(true)
                    .message("Backups antigos removidos com sucesso")
                    .build());

        } catch (Exception e) {
            log.error("Error cleaning up backups: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(BackupResponseDTO.builder()
                            .success(false)
                            .message("Erro ao limpar backups: " + e.getMessage())
                            .build());
        }
    }
}
