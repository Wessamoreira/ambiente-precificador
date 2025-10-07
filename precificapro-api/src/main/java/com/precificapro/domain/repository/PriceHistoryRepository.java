package com.precificapro.domain.repository;

import com.precificapro.domain.model.PriceHistory;
import com.precificapro.domain.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PriceHistoryRepository extends JpaRepository<PriceHistory, UUID> {
    
    Page<PriceHistory> findByProductOrderByCreatedAtDesc(Product product, Pageable pageable);
    
    Page<PriceHistory> findByProductAndCreatedAtBetweenOrderByCreatedAtDesc(
        Product product, 
        OffsetDateTime startDate, 
        OffsetDateTime endDate,
        Pageable pageable
    );
    
    Optional<PriceHistory> findFirstByProductOrderByCreatedAtDesc(Product product);
    
    @Query("SELECT ph FROM PriceHistory ph WHERE ph.product = :product " +
           "AND ph.createdAt >= :startDate ORDER BY ph.createdAt ASC")
    List<PriceHistory> findPriceEvolution(
        @Param("product") Product product, 
        @Param("startDate") OffsetDateTime startDate
    );
    
    @Query("SELECT MIN(ph.suggestedPrice) FROM PriceHistory ph WHERE ph.product = :product")
    BigDecimal findMinPriceByProduct(@Param("product") Product product);
    
    @Query("SELECT MAX(ph.suggestedPrice) FROM PriceHistory ph WHERE ph.product = :product")
    BigDecimal findMaxPriceByProduct(@Param("product") Product product);
    
    @Query("SELECT AVG(ph.suggestedPrice) FROM PriceHistory ph WHERE ph.product = :product")
    BigDecimal findAvgPriceByProduct(@Param("product") Product product);
    
    @Query("SELECT COUNT(ph) FROM PriceHistory ph WHERE ph.product = :product")
    long countByProduct(@Param("product") Product product);
}
