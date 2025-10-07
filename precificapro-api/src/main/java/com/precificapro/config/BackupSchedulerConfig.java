package com.precificapro.config;

import com.precificapro.service.BackupService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@EnableScheduling
@Slf4j
public class BackupSchedulerConfig {

    @Autowired
    private BackupService backupService;

    @Value("${backup.automatic.enabled:true}")
    private boolean automaticBackupEnabled;

    /**
     * Executa backup automático todos os dias às 3:00 AM
     * Cron: segundo minuto hora dia mês dia-da-semana
     */
    @Scheduled(cron = "${backup.automatic.cron:0 0 3 * * *}")
    public void scheduledBackup() {
        if (!automaticBackupEnabled) {
            log.debug("Automatic backup is disabled");
            return;
        }

        if (!backupService.isBackupServiceEnabled()) {
            log.warn("Backup service not configured. Skipping automatic backup.");
            return;
        }

        log.info("Starting scheduled automatic backup...");
        try {
            backupService.createAutomaticBackup();
            log.info("Scheduled backup completed successfully");
        } catch (Exception e) {
            log.error("Scheduled backup failed: {}", e.getMessage(), e);
        }
    }

    /**
     * Limpa backups antigos toda segunda-feira às 4:00 AM
     */
    @Scheduled(cron = "${backup.cleanup.cron:0 0 4 * * MON}")
    public void scheduledCleanup() {
        if (!automaticBackupEnabled) {
            return;
        }

        if (!backupService.isBackupServiceEnabled()) {
            return;
        }

        log.info("Starting scheduled backup cleanup...");
        try {
            backupService.cleanOldBackups();
            log.info("Scheduled cleanup completed successfully");
        } catch (Exception e) {
            log.error("Scheduled cleanup failed: {}", e.getMessage(), e);
        }
    }
}
