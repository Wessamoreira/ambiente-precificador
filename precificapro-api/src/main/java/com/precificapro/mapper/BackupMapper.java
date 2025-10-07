package com.precificapro.mapper;

import com.precificapro.controller.dto.BackupDTO;
import com.precificapro.domain.model.BackupMetadata;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.text.DecimalFormat;
import java.util.List;

@Mapper(componentModel = "spring")
public interface BackupMapper {

    @Mapping(target = "createdByUsername", source = "createdBy.username")
    @Mapping(target = "fileSizeFormatted", source = "fileSize", qualifiedByName = "formatFileSize")
    BackupDTO toDTO(BackupMetadata backupMetadata);

    List<BackupDTO> toDTOList(List<BackupMetadata> backupMetadataList);

    @Named("formatFileSize")
    default String formatFileSize(Long bytes) {
        if (bytes == null) {
            return "0 B";
        }

        if (bytes < 1024) {
            return bytes + " B";
        } else if (bytes < 1024 * 1024) {
            return new DecimalFormat("#.##").format(bytes / 1024.0) + " KB";
        } else if (bytes < 1024 * 1024 * 1024) {
            return new DecimalFormat("#.##").format(bytes / (1024.0 * 1024)) + " MB";
        } else {
            return new DecimalFormat("#.##").format(bytes / (1024.0 * 1024 * 1024)) + " GB";
        }
    }
}
