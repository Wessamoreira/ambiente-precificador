package com.precificapro.domain.repository;

import com.precificapro.domain.model.AuditLog;
import com.precificapro.domain.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {
    
    Page<AuditLog> findByUser(User user, Pageable pageable);
    
    Page<AuditLog> findByAction(String action, Pageable pageable);
    
    @Query("SELECT a FROM AuditLog a WHERE a.timestamp BETWEEN :startDate AND :endDate")
    List<AuditLog> findByTimestampBetween(OffsetDateTime startDate, OffsetDateTime endDate);
    
    @Query("SELECT a FROM AuditLog a WHERE a.user = :user AND a.timestamp BETWEEN :startDate AND :endDate")
    List<AuditLog> findByUserAndTimestampBetween(User user, OffsetDateTime startDate, OffsetDateTime endDate);
}
