# 📋 PLANO DE UPGRADE - PRECIFICAPRO
**Data:** 06/10/2025  
**Objetivo:** Implementar melhorias mantendo compatibilidade total com sistema existente

---

## 🎯 FASE 1 - HISTÓRICO DE PREÇOS (2-3 dias)

### ✅ CHECKLIST DE IMPLEMENTAÇÃO

#### 📊 BACKEND (Spring Boot)

##### 1. **DATABASE & MIGRATION** ⏱️ 30min
- [ ] Criar migration `V5__add_price_history_table.sql`
- [ ] Testar migration no banco local
- [ ] Validar índices e constraints

##### 2. **DOMAIN LAYER** ⏱️ 45min
- [ ] Criar entidade `PriceHistory.java`
- [ ] Criar repository `PriceHistoryRepository.java`
- [ ] Adicionar queries customizadas

##### 3. **SERVICE LAYER** ⏱️ 1h30min
- [ ] Criar `PriceHistoryService.java`
- [ ] Implementar `savePriceHistory()`
- [ ] Implementar `getPriceHistory(productId)`
- [ ] Implementar `getPriceEvolution(productId, days)`
- [ ] Implementar `comparePrices(productId, date1, date2)`

##### 4. **CONTROLLER LAYER** ⏱️ 1h
- [ ] Criar `PriceHistoryController.java`
- [ ] Endpoint GET `/products/{id}/price-history`
- [ ] Endpoint GET `/products/{id}/price-evolution?days=30`
- [ ] Endpoint GET `/products/{id}/price-comparison`
- [ ] Adicionar documentação Swagger

##### 5. **DTOs** ⏱️ 45min
- [ ] `PriceHistoryResponseDTO.java`
- [ ] `PriceEvolutionDTO.java`
- [ ] `PriceComparisonDTO.java`

##### 6. **INTEGRAÇÃO** ⏱️ 1h
- [ ] Modificar `SimulationService` para salvar histórico
- [ ] Listener automático em simulações
- [ ] Garantir que não quebra fluxo existente

---

#### 🎨 FRONTEND (React + TypeScript)

##### 1. **TYPES** ⏱️ 20min
- [ ] Criar interfaces em `types/index.ts`
- [ ] `PriceHistory`, `PriceEvolution`, `PriceComparison`

##### 2. **API SERVICE** ⏱️ 30min
- [ ] Criar `priceHistoryService.ts`
- [ ] Funções para todos os endpoints

##### 3. **COMPONENTES** ⏱️ 3h
- [ ] `PriceHistoryChart.tsx` - Gráfico de evolução
- [ ] `PriceHistoryTable.tsx` - Tabela de histórico
- [ ] `PriceComparison.tsx` - Comparação de períodos
- [ ] `PriceAlert.tsx` - Alertas de variação

##### 4. **PÁGINA** ⏱️ 1h
- [ ] Criar `ProductPriceHistory.tsx`
- [ ] Integrar com rota `/products/:id/price-history`
- [ ] Adicionar link na página de produtos

##### 5. **VISUALIZAÇÃO** ⏱️ 2h
- [ ] Integrar biblioteca de gráficos (Recharts)
- [ ] Criar gráfico de linha para evolução
- [ ] Criar cards de métricas
- [ ] Responsividade mobile

---

### 🧪 TESTES

#### POSTMAN ⏱️ 1h
- [ ] Collection completa de testes
- [ ] Testes de integração
- [ ] Casos de erro
- [ ] Validação de dados

#### MANUAL ⏱️ 1h
- [ ] Testar fluxo completo
- [ ] Validar gráficos
- [ ] Testar em diferentes produtos
- [ ] Verificar performance

---

## 📐 DESIGN DETALHADO

### 1. DATABASE SCHEMA

```sql
CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    
    -- Preços
    suggested_price DECIMAL(10,2) NOT NULL,
    actual_price DECIMAL(10,2),
    
    -- Contexto da precificação
    pricing_profile_id UUID,
    pricing_profile_name VARCHAR(100),
    
    -- Custos na época
    purchase_cost DECIMAL(10,2),
    packaging_cost DECIMAL(10,2),
    other_variable_cost DECIMAL(10,2),
    freight_cost_unit DECIMAL(10,2),
    
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
        FOREIGN KEY (pricing_profile_id) REFERENCES pricing_profiles(id) ON DELETE SET NULL
);

-- Índices para performance
CREATE INDEX idx_price_history_product_date ON price_history(product_id, created_at DESC);
CREATE INDEX idx_price_history_created_at ON price_history(created_at);
CREATE INDEX idx_price_history_profile ON price_history(pricing_profile_id);
```

---

### 2. API ENDPOINTS

#### **2.1 Listar Histórico de Preços**
```http
GET /products/{productId}/price-history
```

**Query Params:**
- `page` (default: 0)
- `size` (default: 20)
- `startDate` (opcional)
- `endDate` (opcional)

**Response:**
```json
{
  "content": [
    {
      "id": "uuid",
      "productId": "uuid",
      "suggestedPrice": 150.00,
      "actualPrice": 145.00,
      "pricingProfileName": "Perfil Padrão",
      "netProfitPercentage": 25.5,
      "markupApplied": 2.5,
      "createdAt": "2025-10-06T10:00:00Z",
      "costs": {
        "purchase": 50.00,
        "packaging": 10.00,
        "freight": 5.00
      }
    }
  ],
  "totalElements": 45,
  "totalPages": 3,
  "number": 0
}
```

---

#### **2.2 Evolução de Preços (Gráfico)**
```http
GET /products/{productId}/price-evolution?days=30
```

**Response:**
```json
{
  "productId": "uuid",
  "productName": "Produto X",
  "period": {
    "start": "2025-09-06",
    "end": "2025-10-06"
  },
  "dataPoints": [
    {
      "date": "2025-09-06",
      "suggestedPrice": 100.00,
      "actualPrice": 98.00,
      "profitMargin": 20.5
    },
    {
      "date": "2025-09-13",
      "suggestedPrice": 105.00,
      "actualPrice": 103.00,
      "profitMargin": 22.0
    }
  ],
  "statistics": {
    "minPrice": 98.00,
    "maxPrice": 150.00,
    "avgPrice": 120.50,
    "priceVariation": 53.06,
    "trend": "INCREASING"
  }
}
```

---

#### **2.3 Comparação de Preços**
```http
GET /products/{productId}/price-comparison?date1=2025-09-01&date2=2025-10-01
```

**Response:**
```json
{
  "period1": {
    "date": "2025-09-01",
    "price": 100.00,
    "profitMargin": 20.0,
    "costs": { "total": 80.00 }
  },
  "period2": {
    "date": "2025-10-01",
    "price": 120.00,
    "profitMargin": 25.0,
    "costs": { "total": 90.00 }
  },
  "changes": {
    "priceChange": 20.00,
    "priceChangePercentage": 20.0,
    "marginChange": 5.0,
    "costChange": 10.00
  }
}
```

---

#### **2.4 Alertas de Preço**
```http
GET /products/{productId}/price-alerts
```

**Response:**
```json
{
  "alerts": [
    {
      "type": "SUDDEN_INCREASE",
      "severity": "WARNING",
      "message": "Preço aumentou 15% em 7 dias",
      "date": "2025-10-05",
      "oldPrice": 100.00,
      "newPrice": 115.00
    },
    {
      "type": "LOW_MARGIN",
      "severity": "ERROR",
      "message": "Margem abaixo de 15%",
      "date": "2025-10-06",
      "currentMargin": 12.5
    }
  ]
}
```

---

### 3. DOMAIN MODEL

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

    // Perfil usado
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pricing_profile_id")
    private PricingProfile pricingProfile;

    @Column(name = "pricing_profile_name", length = 100)
    private String pricingProfileName;

    // Custos da época
    @Column(name = "purchase_cost", precision = 10, scale = 2)
    private BigDecimal purchaseCost;

    @Column(name = "packaging_cost", precision = 10, scale = 2)
    private BigDecimal packagingCost;

    @Column(name = "other_variable_cost", precision = 10, scale = 2)
    private BigDecimal otherVariableCost;

    @Column(name = "freight_cost_unit", precision = 10, scale = 2)
    private BigDecimal freightCostUnit;

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

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @PrePersist
    public void onPrePersist() {
        createdAt = OffsetDateTime.now();
    }
}
```

---

### 4. REPOSITORY

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

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PriceHistoryRepository extends JpaRepository<PriceHistory, UUID> {
    
    // Histórico de um produto específico
    Page<PriceHistory> findByProductOrderByCreatedAtDesc(Product product, Pageable pageable);
    
    // Histórico com filtro de data
    Page<PriceHistory> findByProductAndCreatedAtBetweenOrderByCreatedAtDesc(
        Product product, 
        OffsetDateTime startDate, 
        OffsetDateTime endDate,
        Pageable pageable
    );
    
    // Último registro de preço
    Optional<PriceHistory> findFirstByProductOrderByCreatedAtDesc(Product product);
    
    // Evolução nos últimos N dias
    @Query("SELECT ph FROM PriceHistory ph WHERE ph.product = :product " +
           "AND ph.createdAt >= :startDate ORDER BY ph.createdAt ASC")
    List<PriceHistory> findPriceEvolution(
        @Param("product") Product product, 
        @Param("startDate") OffsetDateTime startDate
    );
    
    // Estatísticas de preço
    @Query("SELECT MIN(ph.suggestedPrice) FROM PriceHistory ph WHERE ph.product = :product")
    BigDecimal findMinPriceByProduct(@Param("product") Product product);
    
    @Query("SELECT MAX(ph.suggestedPrice) FROM PriceHistory ph WHERE ph.product = :product")
    BigDecimal findMaxPriceByProduct(@Param("product") Product product);
    
    @Query("SELECT AVG(ph.suggestedPrice) FROM PriceHistory ph WHERE ph.product = :product")
    BigDecimal findAvgPriceByProduct(@Param("product") Product product);
    
    // Contar registros
    long countByProduct(Product product);
}
```

---

### 5. SERVICE

```java
package com.precificapro.service;

import com.precificapro.controller.dto.PriceEvolutionDTO;
import com.precificapro.controller.dto.PriceHistoryResponseDTO;
import com.precificapro.controller.dto.SimulationResponse;
import com.precificapro.domain.model.PriceHistory;
import com.precificapro.domain.model.PricingProfile;
import com.precificapro.domain.model.Product;
import com.precificapro.domain.model.User;
import com.precificapro.domain.repository.PriceHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PriceHistoryService {

    private final PriceHistoryRepository priceHistoryRepository;

    /**
     * Salva um registro de histórico de preço
     * Chamado automaticamente após cada simulação
     */
    @Transactional
    public PriceHistory savePriceHistory(
            Product product,
            PricingProfile profile,
            SimulationResponse simulation,
            User user,
            String notes
    ) {
        log.info("Salvando histórico de preço para produto: {}", product.getName());

        PriceHistory history = PriceHistory.builder()
            .product(product)
            .suggestedPrice(simulation.getSuggestedPrice())
            .pricingProfile(profile)
            .pricingProfileName(profile.getName())
            
            // Custos
            .purchaseCost(simulation.getCostBreakdown().getPurchaseCost())
            .packagingCost(simulation.getCostBreakdown().getPackagingCost())
            .otherVariableCost(simulation.getCostBreakdown().getOtherVariableCost())
            .freightCostUnit(simulation.getCostBreakdown().getFreightCostUnit())
            
            // Métricas
            .netProfitPerUnit(simulation.getProfitDetails().getNetProfitPerUnit())
            .netProfitPercentage(simulation.getProfitDetails().getNetProfitPercentage())
            .markupApplied(simulation.getProfitDetails().getMarkupOnTotalCost())
            .marginOnPrice(simulation.getProfitDetails().getMargemDeLucro())
            
            // Metadata
            .createdBy(user)
            .notes(notes)
            .build();

        PriceHistory saved = priceHistoryRepository.save(history);
        log.info("Histórico salvo com ID: {}", saved.getId());
        
        return saved;
    }

    /**
     * Busca histórico de preços de um produto
     */
    @Transactional(readOnly = true)
    public Page<PriceHistoryResponseDTO> getPriceHistory(
            Product product,
            OffsetDateTime startDate,
            OffsetDateTime endDate,
            Pageable pageable
    ) {
        Page<PriceHistory> history;
        
        if (startDate != null && endDate != null) {
            history = priceHistoryRepository.findByProductAndCreatedAtBetweenOrderByCreatedAtDesc(
                product, startDate, endDate, pageable
            );
        } else {
            history = priceHistoryRepository.findByProductOrderByCreatedAtDesc(product, pageable);
        }
        
        return history.map(this::toDTO);
    }

    /**
     * Evolução de preços para gráfico
     */
    @Transactional(readOnly = true)
    public PriceEvolutionDTO getPriceEvolution(Product product, int days) {
        OffsetDateTime startDate = OffsetDateTime.now().minusDays(days);
        
        List<PriceHistory> evolution = priceHistoryRepository.findPriceEvolution(product, startDate);
        
        BigDecimal minPrice = priceHistoryRepository.findMinPriceByProduct(product);
        BigDecimal maxPrice = priceHistoryRepository.findMaxPriceByProduct(product);
        BigDecimal avgPrice = priceHistoryRepository.findAvgPriceByProduct(product);
        
        return PriceEvolutionDTO.builder()
            .productId(product.getId())
            .productName(product.getName())
            .periodDays(days)
            .dataPoints(evolution.stream()
                .map(this::toEvolutionPoint)
                .collect(Collectors.toList()))
            .minPrice(minPrice)
            .maxPrice(maxPrice)
            .avgPrice(avgPrice)
            .build();
    }

    private PriceHistoryResponseDTO toDTO(PriceHistory history) {
        return PriceHistoryResponseDTO.builder()
            .id(history.getId())
            .productId(history.getProduct().getId())
            .suggestedPrice(history.getSuggestedPrice())
            .actualPrice(history.getActualPrice())
            .pricingProfileName(history.getPricingProfileName())
            .netProfitPercentage(history.getNetProfitPercentage())
            .markupApplied(history.getMarkupApplied())
            .createdAt(history.getCreatedAt())
            .notes(history.getNotes())
            .build();
    }

    private PriceEvolutionDTO.DataPoint toEvolutionPoint(PriceHistory history) {
        return PriceEvolutionDTO.DataPoint.builder()
            .date(history.getCreatedAt().toLocalDate())
            .suggestedPrice(history.getSuggestedPrice())
            .actualPrice(history.getActualPrice())
            .profitMargin(history.getNetProfitPercentage())
            .build();
    }
}
```

---

## ⏱️ CRONOGRAMA

### DIA 1 - Backend Foundation (6-8h)
- **Manhã:** Database + Domain + Repository
- **Tarde:** Service + DTOs
- **Noite:** Testes unitários

### DIA 2 - Backend Integration + Frontend Start (6-8h)
- **Manhã:** Controller + Swagger + Integração com SimulationService
- **Tarde:** Frontend Types + API Service
- **Noite:** Início dos componentes

### DIA 3 - Frontend + Tests (6-8h)
- **Manhã:** Componentes de visualização
- **Tarde:** Página completa + Rotas
- **Noite:** Testes Postman + Documentação

---

## 🎨 UI/UX DESIGN

### Página: Product Price History

```
┌─────────────────────────────────────────────────────┐
│ ← Voltar para Produtos                              │
│                                                      │
│ 📊 Histórico de Preços - Produto X                  │
│                                                      │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│ │ Preço    │ │ Variação │ │ Margem   │             │
│ │ Atual    │ │ 30 dias  │ │ Média    │             │
│ │ R$ 150,00│ │ +12,5%   │ │ 25,5%    │             │
│ └──────────┘ └──────────┘ └──────────┘             │
│                                                      │
│ Evolução de Preços (30 dias)                        │
│ ┌────────────────────────────────────────────────┐  │
│ │      📈 GRÁFICO DE LINHA                       │  │
│ │                                                 │  │
│ │  150┤        ╭─╮                               │  │
│ │     │       ╱   ╰╮                             │  │
│ │  120┤    ╭─╯     ╰─╮                           │  │
│ │     │  ╭─╯          ╰╮                         │  │
│ │  100├──╯             ╰────                     │  │
│ │     └────────────────────────────────────────  │  │
│ │      Set    Out     Nov                        │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ 📋 Histórico Detalhado                              │
│ ┌────────────────────────────────────────────────┐  │
│ │ Data       │ Preço  │ Margem │ Perfil          │  │
│ ├────────────┼────────┼────────┼─────────────────│  │
│ │ 06/10/2025 │ 150,00 │ 25,5%  │ Perfil Padrão   │  │
│ │ 01/10/2025 │ 145,00 │ 24,0%  │ Perfil Padrão   │  │
│ │ 25/09/2025 │ 130,00 │ 22,0%  │ Perfil Promo    │  │
│ └────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 📦 DELIVERABLES

### Arquivos Backend:
1. `V5__add_price_history_table.sql`
2. `PriceHistory.java`
3. `PriceHistoryRepository.java`
4. `PriceHistoryService.java`
5. `PriceHistoryController.java`
6. `PriceHistoryResponseDTO.java`
7. `PriceEvolutionDTO.java`

### Arquivos Frontend:
1. `types/index.ts` (atualizado)
2. `api/priceHistoryService.ts`
3. `components/PriceHistoryChart.tsx`
4. `components/PriceHistoryTable.tsx`
5. `pages/ProductPriceHistory.tsx`
6. `routes/AppRoutes.tsx` (atualizado)

### Documentação:
1. `PRICE-HISTORY-API.md` - Documentação de endpoints
2. `PrecificaPro.postman_collection.json` - Collection Postman
3. `PRICE-HISTORY-GUIDE.md` - Guia de uso

---

## 🚨 SIDE-EFFECTS A CONSIDERAR

### ⚠️ Impactos no Sistema Existente:

1. **SimulationService**
   - Adicionar hook para salvar histórico após simulação
   - NÃO MUDAR lógica de cálculo
   - Apenas adicionar `priceHistoryService.save()` no final

2. **Performance**
   - Tabela crescerá com tempo
   - Adicionar política de limpeza (opcional)
   - Índices já otimizados

3. **Storage**
   - Estimar ~500 bytes por registro
   - 1000 simulações = ~500KB
   - Aceitável para anos de uso

4. **Migrations**
   - Testar rollback
   - Garantir que não quebra dados existentes

---

## ✅ CRITÉRIOS DE ACEITE

- [ ] Histórico salvo automaticamente em cada simulação
- [ ] Gráfico renderiza corretamente
- [ ] Filtros de data funcionam
- [ ] Paginação funciona
- [ ] Performance < 500ms
- [ ] Responsivo mobile
- [ ] Testes Postman passam 100%
- [ ] Sem erros no console
- [ ] Documentação completa

---

**Próximo passo:** Implementar! Vou começar? 🚀
