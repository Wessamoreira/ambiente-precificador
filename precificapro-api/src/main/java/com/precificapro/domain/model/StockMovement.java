package com.precificapro.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "stock_movements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class StockMovement {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @EqualsAndHashCode.Include
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_id", nullable = false)
    private Inventory inventory;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @Column(nullable = false, length = 20)
    private String type; // IN ou OUT
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(nullable = false, length = 100)
    private String reason;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performed_by", nullable = false)
    private User performedBy;
    
    @Column(name = "created_at")
    private OffsetDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
    }
}
