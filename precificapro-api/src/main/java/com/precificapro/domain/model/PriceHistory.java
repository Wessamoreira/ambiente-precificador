package com.precificapro.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "price_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class PriceHistory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @EqualsAndHashCode.Include
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    // Preços
    @Column(name = "suggested_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal suggestedPrice;
    
    @Column(name = "actual_price", precision = 10, scale = 2)
    private BigDecimal actualPrice;
    
    // Perfil
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pricing_profile_id")
    private PricingProfile pricingProfile;
    
    @Column(name = "pricing_profile_name", length = 100)
    private String pricingProfileName;
    
    // Custos snapshot
    @Column(name = "purchase_cost", precision = 10, scale = 2)
    private BigDecimal purchaseCost;
    
    @Column(name = "packaging_cost", precision = 10, scale = 2)
    private BigDecimal packagingCost;
    
    @Column(name = "other_variable_cost", precision = 10, scale = 2)
    private BigDecimal otherVariableCost;
    
    @Column(name = "freight_cost_unit", precision = 10, scale = 2)
    private BigDecimal freightCostUnit;
    
    @Column(name = "total_cost", precision = 10, scale = 2)
    private BigDecimal totalCost;
    
    // Métricas
    @Column(name = "net_profit_per_unit", precision = 10, scale = 2)
    private BigDecimal netProfitPerUnit;
    
    @Column(name = "net_profit_percentage", precision = 5, scale = 2)
    private BigDecimal netProfitPercentage;
    
    @Column(name = "markup_applied", precision = 5, scale = 2)
    private BigDecimal markupApplied;
    
    @Column(name = "margin_on_price", precision = 5, scale = 2)
    private BigDecimal marginOnPrice;
    
    // Metadata
    @Column(name = "created_at")
    private OffsetDateTime createdAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
    }
}
