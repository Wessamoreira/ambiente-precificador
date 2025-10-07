package com.precificapro.domain.repository;

import com.precificapro.domain.model.BackupMetadata;
import com.precificapro.domain.model.BackupMetadata.BackupStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BackupMetadataRepository extends JpaRepository<BackupMetadata, Long> {
    
    List<BackupMetadata> findByStatusOrderByCreatedAtDesc(BackupStatus status);
    
    List<BackupMetadata> findTop10ByStatusOrderByCreatedAtDesc(BackupStatus status);
    
    Optional<BackupMetadata> findByFilename(String filename);
    
    @Query("SELECT b FROM BackupMetadata b WHERE b.status = :status AND b.createdAt < :beforeDate ORDER BY b.createdAt ASC")
    List<BackupMetadata> findOldBackups(BackupStatus status, LocalDateTime beforeDate);
    
    @Query("SELECT b FROM BackupMetadata b ORDER BY b.createdAt DESC")
    List<BackupMetadata> findAllOrderByCreatedAtDesc();
}
