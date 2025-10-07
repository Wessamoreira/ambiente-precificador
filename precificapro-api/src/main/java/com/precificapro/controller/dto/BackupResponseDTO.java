package com.precificapro.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BackupResponseDTO {
    private boolean success;
    private String message;
    private BackupDTO backup;
}
