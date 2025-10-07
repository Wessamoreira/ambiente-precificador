# 📊 MÓDULO 4 - HISTÓRICO DE PREÇOS (PRICE HISTORY)

**Prioridade:** 🟡 MÉDIA  
**Tempo Estimado:** 5-7 horas  
**Complexidade:** ⭐⭐⭐ (Alta)

---

## 🎯 OBJETIVO
Implementar sistema de rastreamento e análise de histórico de precificação com gráficos e tendências.

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### BACKEND (3-4h)
- [ ] V6__add_price_history_table.sql - Migration
- [ ] PriceHistory.java - Model
- [ ] PriceHistoryRepository.java - Repository
- [ ] PriceHistoryService.java - Service
- [ ] PriceHistoryController.java - Controller
- [ ] DTOs (Response, Evolution, Statistics)
- [ ] Integrar com SimulationService

### FRONTEND (2-3h)
- [ ] Instalar recharts (biblioteca de gráficos)
- [ ] types/index.ts - Tipos
- [ ] api/priceHistoryService.ts - Service
- [ ] components/PriceHistoryChart.tsx - Gráfico
- [ ] components/PriceHistoryTable.tsx - Tabela
- [ ] pages/PriceHistoryPage.tsx - Página
- [ ] Adicionar rota e links

---

## 🗄️ PASSO 1: MIGRATION (15min)

**Arquivo:** `V6__add_price_history_table.sql`

```sql
CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    
    -- Preços
    suggested_price DECIMAL(10,2) NOT NULL,
    actual_price DECIMAL(10,2),
    
    -- Perfil usado
    pricing_profile_id UUID,
    pricing_profile_name VARCHAR(100),
    
    -- Custos snapshot
    purchase_cost DECIMAL(10,2),
    packaging_cost DECIMAL(10,2),
    other_variable_cost DECIMAL(10,2),
    freight_cost_unit DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    
    -- Métricas calculadas
    net_profit_per_unit DECIMAL(10,2),
    net_profit_percentage DECIMAL(5,2),
    markup_applied DECIMAL(5,2),
    margin_on_price DECIMAL(5,2),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    notes TEXT,
    
    CONSTRAINT fk_price_history_product 
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_price_history_profile 
        FOREIGN KEY (pricing_profile_id) REFERENCES pricing_profiles(id) ON DELETE SET NULL,
    CONSTRAINT fk_price_history_user 
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Índices para performance
CREATE INDEX idx_price_history_product_date ON price_history(product_id, created_at DESC);
CREATE INDEX idx_price_history_created_at ON price_history(created_at);
CREATE INDEX idx_price_history_profile ON price_history(pricing_profile_id);
CREATE INDEX idx_price_history_product_id ON price_history(product_id);

COMMENT ON TABLE price_history IS 'Histórico completo de precificações';
COMMENT ON COLUMN price_history.suggested_price IS 'Preço sugerido pela simulação';
COMMENT ON COLUMN price_history.actual_price IS 'Preço realmente praticado (se diferente)';
```

---

## 🏗️ PASSO 2: MODEL (20min)

**Arquivo:** `PriceHistory.java`

```java
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
public class PriceHistory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
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
```

---

## 📚 PASSO 3: REPOSITORY (10min)

```java
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
```

---

## 🛠️ PASSO 4: SERVICE (1h 30min)

```java
package com.precificapro.service;

import com.precificapro.controller.dto.*;
import com.precificapro.domain.model.*;
import com.precificapro.domain.repository.*;
import com.precificapro.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PriceHistoryService {
    
    private final PriceHistoryRepository priceHistoryRepository;
    private final ProductRepository productRepository;
    
    @Transactional
    public PriceHistory savePriceHistory(
            Product product,
            PricingProfile profile,
            SimulationResponse simulation,
            User user,
            String notes) {
        
        log.info("💾 Salvando histórico de preço para produto: {}", product.getName());
        
        PriceHistory history = PriceHistory.builder()
            .product(product)
            .suggestedPrice(simulation.getSuggestedPrice())
            .pricingProfile(profile)
            .pricingProfileName(profile.getName())
            .purchaseCost(simulation.getCostBreakdown().getPurchaseCost())
            .packagingCost(simulation.getCostBreakdown().getPackagingCost())
            .otherVariableCost(simulation.getCostBreakdown().getOtherVariableCost())
            .freightCostUnit(simulation.getCostBreakdown().getFreightCostUnit())
            .totalCost(simulation.getCostBreakdown().getTotalCost())
            .netProfitPerUnit(simulation.getProfitDetails().getNetProfitPerUnit())
            .netProfitPercentage(simulation.getProfitDetails().getNetProfitPercentage())
            .markupApplied(simulation.getProfitDetails().getMarkupOnTotalCost())
            .marginOnPrice(simulation.getProfitDetails().getMargemDeLucro())
            .createdBy(user)
            .notes(notes)
            .build();
        
        PriceHistory saved = priceHistoryRepository.save(history);
        log.info("✅ Histórico salvo com ID: {}", saved.getId());
        
        return saved;
    }
    
    @Transactional(readOnly = true)
    public Page<PriceHistoryResponseDTO> getPriceHistory(
            UUID productId,
            User owner,
            OffsetDateTime startDate,
            OffsetDateTime endDate,
            Pageable pageable) {
        
        Product product = productRepository.findByIdAndOwner(productId, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", productId));
        
        Page<PriceHistory> history;
        if (startDate != null && endDate != null) {
            history = priceHistoryRepository.findByProductAndCreatedAtBetweenOrderByCreatedAtDesc(
                product, startDate, endDate, pageable
            );
        } else {
            history = priceHistoryRepository.findByProductOrderByCreatedAtDesc(product, pageable);
        }
        
        return history.map(this::toResponseDTO);
    }
    
    @Transactional(readOnly = true)
    public PriceEvolutionDTO getPriceEvolution(UUID productId, User owner, int days) {
        Product product = productRepository.findByIdAndOwner(productId, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", productId));
        
        OffsetDateTime startDate = OffsetDateTime.now().minusDays(days);
        List<PriceHistory> evolution = priceHistoryRepository.findPriceEvolution(product, startDate);
        
        BigDecimal minPrice = priceHistoryRepository.findMinPriceByProduct(product);
        BigDecimal maxPrice = priceHistoryRepository.findMaxPriceByProduct(product);
        BigDecimal avgPrice = priceHistoryRepository.findAvgPriceByProduct(product);
        
        // Calcular variação e tendência
        BigDecimal variation = BigDecimal.ZERO;
        String trend = "STABLE";
        
        if (evolution.size() >= 2) {
            BigDecimal firstPrice = evolution.get(0).getSuggestedPrice();
            BigDecimal lastPrice = evolution.get(evolution.size() - 1).getSuggestedPrice();
            
            if (firstPrice.compareTo(BigDecimal.ZERO) > 0) {
                variation = lastPrice.subtract(firstPrice)
                        .divide(firstPrice, 4, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal("100"));
                
                if (variation.compareTo(new BigDecimal("5")) > 0) {
                    trend = "INCREASING";
                } else if (variation.compareTo(new BigDecimal("-5")) < 0) {
                    trend = "DECREASING";
                }
            }
        }
        
        return PriceEvolutionDTO.builder()
                .productId(product.getId())
                .productName(product.getName())
                .periodDays(days)
                .dataPoints(evolution.stream()
                        .map(this::toDataPoint)
                        .collect(Collectors.toList()))
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .avgPrice(avgPrice)
                .priceVariation(variation)
                .trend(trend)
                .totalRecords((long) evolution.size())
                .build();
    }
    
    @Transactional(readOnly = true)
    public PriceStatisticsDTO getStatistics(UUID productId, User owner) {
        Product product = productRepository.findByIdAndOwner(productId, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", productId));
        
        BigDecimal minPrice = priceHistoryRepository.findMinPriceByProduct(product);
        BigDecimal maxPrice = priceHistoryRepository.findMaxPriceByProduct(product);
        BigDecimal avgPrice = priceHistoryRepository.findAvgPriceByProduct(product);
        long totalRecords = priceHistoryRepository.countByProduct(product);
        
        PriceHistory lastRecord = priceHistoryRepository.findFirstByProductOrderByCreatedAtDesc(product)
                .orElse(null);
        
        return PriceStatisticsDTO.builder()
                .productId(product.getId())
                .productName(product.getName())
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .avgPrice(avgPrice)
                .currentPrice(lastRecord != null ? lastRecord.getSuggestedPrice() : null)
                .currentMargin(lastRecord != null ? lastRecord.getNetProfitPercentage() : null)
                .totalRecords(totalRecords)
                .lastUpdated(lastRecord != null ? lastRecord.getCreatedAt() : null)
                .build();
    }
    
    private PriceHistoryResponseDTO toResponseDTO(PriceHistory history) {
        return PriceHistoryResponseDTO.builder()
                .id(history.getId())
                .productId(history.getProduct().getId())
                .suggestedPrice(history.getSuggestedPrice())
                .actualPrice(history.getActualPrice())
                .pricingProfileName(history.getPricingProfileName())
                .totalCost(history.getTotalCost())
                .netProfitPerUnit(history.getNetProfitPerUnit())
                .netProfitPercentage(history.getNetProfitPercentage())
                .markupApplied(history.getMarkupApplied())
                .marginOnPrice(history.getMarginOnPrice())
                .createdAt(history.getCreatedAt())
                .createdBy(history.getCreatedBy() != null ? history.getCreatedBy().getName() : null)
                .notes(history.getNotes())
                .build();
    }
    
    private PriceEvolutionDTO.DataPoint toDataPoint(PriceHistory history) {
        return PriceEvolutionDTO.DataPoint.builder()
                .date(history.getCreatedAt().toLocalDate())
                .suggestedPrice(history.getSuggestedPrice())
                .profitMargin(history.getNetProfitPercentage())
                .pricingProfile(history.getPricingProfileName())
                .build();
    }
}
```

---

## 🎮 PASSO 5: CONTROLLER (30min)

```java
package com.precificapro.controller;

import com.precificapro.controller.dto.*;
import com.precificapro.domain.model.User;
import com.precificapro.service.PriceHistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/products/{productId}/price-history")
@RequiredArgsConstructor
@Tag(name = "Price History", description = "Histórico de Preços")
public class PriceHistoryController {
    
    private final PriceHistoryService priceHistoryService;
    
    @GetMapping
    @Operation(summary = "Listar histórico de preços")
    public ResponseEntity<Page<PriceHistoryResponseDTO>> getHistory(
            @PathVariable UUID productId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime endDate,
            @AuthenticationPrincipal User owner,
            Pageable pageable) {
        return ResponseEntity.ok(priceHistoryService.getPriceHistory(productId, owner, startDate, endDate, pageable));
    }
    
    @GetMapping("/evolution")
    @Operation(summary = "Evolução de preços (para gráfico)")
    public ResponseEntity<PriceEvolutionDTO> getEvolution(
            @PathVariable UUID productId,
            @RequestParam(defaultValue = "30") int days,
            @AuthenticationPrincipal User owner) {
        return ResponseEntity.ok(priceHistoryService.getPriceEvolution(productId, owner, days));
    }
    
    @GetMapping("/statistics")
    @Operation(summary = "Estatísticas de preços")
    public ResponseEntity<PriceStatisticsDTO> getStatistics(
            @PathVariable UUID productId,
            @AuthenticationPrincipal User owner) {
        return ResponseEntity.ok(priceHistoryService.getStatistics(productId, owner));
    }
}
```

---

## 📝 PASSO 6: DTOs (30min)

**Criar em `controller/dto/`:**

```java
// PriceHistoryResponseDTO.java
@Builder
public record PriceHistoryResponseDTO(
    UUID id,
    UUID productId,
    BigDecimal suggestedPrice,
    BigDecimal actualPrice,
    String pricingProfileName,
    BigDecimal totalCost,
    BigDecimal netProfitPerUnit,
    BigDecimal netProfitPercentage,
    BigDecimal markupApplied,
    BigDecimal marginOnPrice,
    OffsetDateTime createdAt,
    String createdBy,
    String notes
) {}

// PriceEvolutionDTO.java
@Builder
public record PriceEvolutionDTO(
    UUID productId,
    String productName,
    Integer periodDays,
    List<DataPoint> dataPoints,
    BigDecimal minPrice,
    BigDecimal maxPrice,
    BigDecimal avgPrice,
    BigDecimal priceVariation,
    String trend,
    Long totalRecords
) {
    @Builder
    public record DataPoint(
        LocalDate date,
        BigDecimal suggestedPrice,
        BigDecimal profitMargin,
        String pricingProfile
    ) {}
}

// PriceStatisticsDTO.java
@Builder
public record PriceStatisticsDTO(
    UUID productId,
    String productName,
    BigDecimal minPrice,
    BigDecimal maxPrice,
    BigDecimal avgPrice,
    BigDecimal currentPrice,
    BigDecimal currentMargin,
    Long totalRecords,
    OffsetDateTime lastUpdated
) {}
```

---

## 🔗 PASSO 7: INTEGRAR COM SIMULAÇÃO (15min)

**Modificar `PricingSimulationService.java`:**

```java
@Autowired
private PriceHistoryService priceHistoryService;

// No método simulate(), adicionar no final:
@Transactional
public SimulationResponse simulate(UUID productId, UUID profileId, User owner) {
    // ... código existente ...
    
    // Salvar histórico automaticamente
    priceHistoryService.savePriceHistory(product, profile, response, owner, null);
    
    return response;
}
```

---

## 🎨 PASSO 8: FRONTEND (2-3h)

**1. Instalar biblioteca de gráficos:**

```bash
cd precificapro-frontend
npm install recharts
```

**2. Types:**

```typescript
export interface PriceEvolution {
  productId: string;
  productName: string;
  periodDays: number;
  dataPoints: Array<{
    date: string;
    suggestedPrice: number;
    profitMargin: number;
  }>;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  priceVariation: number;
  trend: 'INCREASING' | 'DECREASING' | 'STABLE';
}
```

**3. Service:**

```typescript
export const priceHistoryService = {
  getEvolution: async (productId: string, days: number = 30) => {
    const response = await api.get(`/products/${productId}/price-history/evolution?days=${days}`);
    return response.data;
  },
  
  getStatistics: async (productId: string) => {
    const response = await api.get(`/products/${productId}/price-history/statistics`);
    return response.data;
  },
};
```

**4. Componente de Gráfico:**

```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export const PriceHistoryChart: React.FC<{ productId: string }> = ({ productId }) => {
  const [data, setData] = useState<PriceEvolution | null>(null);
  
  useEffect(() => {
    priceHistoryService.getEvolution(productId, 30).then(setData);
  }, [productId]);
  
  if (!data) return <div>Carregando...</div>;
  
  return (
    <div className="price-chart">
      <h3>{data.productName} - Evolução de Preços (30 dias)</h3>
      
      <LineChart width={800} height={400} data={data.dataPoints}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="suggestedPrice" stroke="#8884d8" name="Preço" />
        <Line type="monotone" dataKey="profitMargin" stroke="#82ca9d" name="Margem %" />
      </LineChart>
      
      <div className="stats">
        <div>Min: R$ {data.minPrice.toFixed(2)}</div>
        <div>Máx: R$ {data.maxPrice.toFixed(2)}</div>
        <div>Média: R$ {data.avgPrice.toFixed(2)}</div>
        <div>Tendência: {getTrendIcon(data.trend)}</div>
      </div>
    </div>
  );
};
```

---

## ✅ CONCLUSÃO

**Tempo Total:** ~5-7 horas  
**Arquivos Criados:** 12+  
**Endpoints:** 3 REST  
**Features:**
- ✅ Salvamento automático em cada simulação
- ✅ Gráficos de evolução temporal
- ✅ Estatísticas (min, max, avg, tendência)
- ✅ Filtros por período
- ✅ Histórico paginado
- ✅ Analytics de margem e markup
