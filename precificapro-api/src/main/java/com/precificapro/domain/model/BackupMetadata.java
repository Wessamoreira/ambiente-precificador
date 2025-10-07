package com.precificapro.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "backup_metadata")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BackupMetadata {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String filename;
    
    @Column(name = "s3_key", nullable = false)
    private String s3Key;
    
    @Column(name = "file_size", nullable = false)
    private Long fileSize;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private BackupStatus status;
    
    @Column(name = "error_message", length = 1000)
    private String errorMessage;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id")
    private User createdBy;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private BackupType type;
    
    @Column(name = "restored_at")
    private LocalDateTime restoredAt;
    
    public enum BackupStatus {
        IN_PROGRESS,
        COMPLETED,
        FAILED,
        RESTORED
    }
    
    public enum BackupType {
        AUTOMATIC,
        MANUAL
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
