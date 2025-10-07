package com.precificapro.domain.model;

import com.precificapro.domain.enums.StockStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "inventory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Inventory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @EqualsAndHashCode.Include
    private UUID id;
    
    @OneToOne
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;
    
    @Column(name = "current_stock", nullable = false)
    @Builder.Default
    private Integer currentStock = 0;
    
    @Column(name = "min_stock", nullable = false)
    @Builder.Default
    private Integer minStock = 5;
    
    @Column(name = "reserved_stock", nullable = false)
    @Builder.Default
    private Integer reservedStock = 0;
    
    @Column(name = "available_stock", nullable = false)
    @Builder.Default
    private Integer availableStock = 0;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "stock_status", nullable = false, columnDefinition = "stock_status")
    @Builder.Default
    private StockStatus stockStatus = StockStatus.OUT_OF_STOCK;
    
    @Column(name = "last_stock_check")
    private OffsetDateTime lastStockCheck;
    
    @Column(name = "created_at")
    private OffsetDateTime createdAt;
    
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
        updatedAt = OffsetDateTime.now();
        lastStockCheck = OffsetDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}
