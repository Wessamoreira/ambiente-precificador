package com.precificapro.controller.dto;

import com.precificapro.domain.model.BackupMetadata.BackupStatus;
import com.precificapro.domain.model.BackupMetadata.BackupType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BackupDTO {
    private Long id;
    private String filename;
    private Long fileSize;
    private String fileSizeFormatted;
    private LocalDateTime createdAt;
    private BackupStatus status;
    private BackupType type;
    private String createdByUsername;
    private LocalDateTime restoredAt;
    private String errorMessage;
}
