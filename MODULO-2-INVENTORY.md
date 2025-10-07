# 📦 MÓDULO 2 - GESTÃO DE ESTOQUE (INVENTORY)

**Prioridade:** 🔴 ALTA  
**Tempo Estimado:** 6-8 horas  
**Complexidade:** ⭐⭐⭐ (Alta)

---

## 🎯 OBJETIVO
Implementar sistema completo de gestão de estoque com movimentações e alertas.

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### BACKEND (4-5h)
- [ ] V4__add_inventory_tables.sql - Migration
- [ ] Inventory.java - Model
- [ ] StockMovement.java - Model
- [ ] StockStatus.java - Enum
- [ ] InventoryRepository.java - Repository
- [ ] StockMovementRepository.java - Repository
- [ ] InventoryService.java - Service
- [ ] InventoryController.java - Controller
- [ ] DTOs (Inventory, StockMovement, Adjust)

### FRONTEND (2-3h)
- [ ] types/index.ts - Tipos
- [ ] api/inventoryService.ts - Service
- [ ] pages/InventoryPage.tsx - Página
- [ ] Adicionar rota e menu

---

## 🗄️ PASSO 1: MIGRATION (20min)

**Arquivo:** `precificapro-api/src/main/resources/db/migration/V4__add_inventory_tables.sql`

```sql
-- Enum para status de estoque
CREATE TYPE stock_status AS ENUM ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK');

-- Tabela de inventário
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL UNIQUE,
    current_stock INT NOT NULL DEFAULT 0,
    min_stock INT NOT NULL DEFAULT 5,
    reserved_stock INT NOT NULL DEFAULT 0,
    available_stock INT NOT NULL DEFAULT 0,
    stock_status stock_status NOT NULL DEFAULT 'OUT_OF_STOCK',
    last_stock_check TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_inventory_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT check_current_stock_positive CHECK (current_stock >= 0),
    CONSTRAINT check_min_stock_positive CHECK (min_stock >= 0),
    CONSTRAINT check_reserved_stock_positive CHECK (reserved_stock >= 0)
);

-- Tabela de movimentações de estoque
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_id UUID NOT NULL,
    type VARCHAR(20) NOT NULL, -- IN (entrada) ou OUT (saída)
    quantity INT NOT NULL,
    reason VARCHAR(100) NOT NULL,
    notes TEXT,
    performed_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_stock_movement_inventory FOREIGN KEY (inventory_id) 
        REFERENCES inventory(id) ON DELETE CASCADE,
    CONSTRAINT fk_stock_movement_user FOREIGN KEY (performed_by) 
        REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT check_quantity_positive CHECK (quantity > 0)
);

-- Índices
CREATE INDEX idx_inventory_product_id ON inventory(product_id);
CREATE INDEX idx_inventory_stock_status ON inventory(stock_status);
CREATE INDEX idx_stock_movements_inventory_id ON stock_movements(inventory_id);
CREATE INDEX idx_stock_movements_created_at ON stock_movements(created_at DESC);

-- Trigger para atualizar available_stock automaticamente
CREATE OR REPLACE FUNCTION update_available_stock()
RETURNS TRIGGER AS $$
BEGIN
    NEW.available_stock = NEW.current_stock - NEW.reserved_stock;
    
    -- Atualizar status automaticamente
    IF NEW.current_stock = 0 THEN
        NEW.stock_status = 'OUT_OF_STOCK';
    ELSIF NEW.current_stock <= NEW.min_stock THEN
        NEW.stock_status = 'LOW_STOCK';
    ELSE
        NEW.stock_status = 'IN_STOCK';
    END IF;
    
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_available_stock
BEFORE INSERT OR UPDATE ON inventory
FOR EACH ROW
EXECUTE FUNCTION update_available_stock();

-- Comentários
COMMENT ON TABLE inventory IS 'Controle de estoque de produtos';
COMMENT ON TABLE stock_movements IS 'Histórico de movimentações de estoque';
COMMENT ON COLUMN inventory.available_stock IS 'Estoque atual - reservado';
COMMENT ON COLUMN inventory.reserved_stock IS 'Estoque reservado em vendas';
```

---

## 🏗️ PASSO 2: ENUMS E MODELS (30min)

**Arquivo 1:** `precificapro-api/src/main/java/com/precificapro/domain/enums/StockStatus.java`

```java
package com.precificapro.domain.enums;

public enum StockStatus {
    IN_STOCK("Em Estoque"),
    LOW_STOCK("Estoque Baixo"),
    OUT_OF_STOCK("Sem Estoque");
    
    private final String description;
    
    StockStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}
```

**Arquivo 2:** `precificapro-api/src/main/java/com/precificapro/domain/model/Inventory.java`

```java
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
public class Inventory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
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
    @Column(name = "stock_status", nullable = false)
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
```

**Arquivo 3:** `precificapro-api/src/main/java/com/precificapro/domain/model/StockMovement.java`

```java
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
public class StockMovement {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_id", nullable = false)
    private Inventory inventory;
    
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
```

---

## 📚 PASSO 3: REPOSITORIES (10min)

**Arquivo 1:** `InventoryRepository.java`

```java
package com.precificapro.domain.repository;

import com.precificapro.domain.enums.StockStatus;
import com.precificapro.domain.model.Inventory;
import com.precificapro.domain.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, UUID> {
    
    Optional<Inventory> findByProduct(Product product);
    
    @Query("SELECT i FROM Inventory i WHERE i.product.owner.id = :ownerId")
    List<Inventory> findByOwnerId(UUID ownerId);
    
    @Query("SELECT i FROM Inventory i WHERE i.product.owner.id = :ownerId AND i.stockStatus = :status")
    List<Inventory> findByOwnerIdAndStatus(UUID ownerId, StockStatus status);
    
    @Query("SELECT i FROM Inventory i WHERE i.product.owner.id = :ownerId " +
           "AND (i.stockStatus = 'LOW_STOCK' OR i.stockStatus = 'OUT_OF_STOCK')")
    List<Inventory> findLowStockByOwnerId(UUID ownerId);
}
```

**Arquivo 2:** `StockMovementRepository.java`

```java
package com.precificapro.domain.repository;

import com.precificapro.domain.model.Inventory;
import com.precificapro.domain.model.StockMovement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, UUID> {
    
    Page<StockMovement> findByInventoryOrderByCreatedAtDesc(Inventory inventory, Pageable pageable);
}
```

---

## 🛠️ PASSO 4: SERVICE (1h)

**Arquivo:** `precificapro-api/src/main/java/com/precificapro/service/InventoryService.java`

```java
package com.precificapro.service;

import com.precificapro.controller.dto.*;
import com.precificapro.domain.enums.StockStatus;
import com.precificapro.domain.model.*;
import com.precificapro.domain.repository.*;
import com.precificapro.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {
    
    private final InventoryRepository inventoryRepository;
    private final StockMovementRepository stockMovementRepository;
    private final ProductRepository productRepository;
    
    @Transactional(readOnly = true)
    public List<InventoryDTO> findAllByOwner(User owner) {
        return inventoryRepository.findByOwnerId(owner.getId()).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<InventoryDTO> findLowStockByOwner(User owner) {
        return inventoryRepository.findLowStockByOwnerId(owner.getId()).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public InventoryDTO findByProductId(UUID productId, User owner) {
        Product product = productRepository.findByIdAndOwner(productId, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", productId));
        
        Inventory inventory = inventoryRepository.findByProduct(product)
                .orElseGet(() -> createInventoryForProduct(product));
        
        return toDTO(inventory);
    }
    
    @Transactional
    public InventoryDTO adjustStock(UUID productId, StockAdjustDTO dto, User owner) {
        Product product = productRepository.findByIdAndOwner(productId, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", productId));
        
        Inventory inventory = inventoryRepository.findByProduct(product)
                .orElseThrow(() -> new ResourceNotFoundException("Inventário não encontrado"));
        
        int oldStock = inventory.getCurrentStock();
        int adjustment = "IN".equals(dto.type()) ? dto.quantity() : -dto.quantity();
        int newStock = Math.max(0, oldStock + adjustment);
        
        inventory.setCurrentStock(newStock);
        inventoryRepository.save(inventory);
        
        // Registrar movimentação
        StockMovement movement = StockMovement.builder()
                .inventory(inventory)
                .type(dto.type())
                .quantity(dto.quantity())
                .reason(dto.reason())
                .notes(dto.notes())
                .performedBy(owner)
                .build();
        stockMovementRepository.save(movement);
        
        log.info("Estoque ajustado: Produto {} de {} para {}", productId, oldStock, newStock);
        
        return toDTO(inventory);
    }
    
    @Transactional
    public InventoryDTO updateMinStock(UUID productId, Integer minStock, User owner) {
        Product product = productRepository.findByIdAndOwner(productId, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", productId));
        
        Inventory inventory = inventoryRepository.findByProduct(product)
                .orElseThrow(() -> new ResourceNotFoundException("Inventário não encontrado"));
        
        inventory.setMinStock(minStock);
        inventoryRepository.save(inventory);
        
        return toDTO(inventory);
    }
    
    @Transactional(readOnly = true)
    public Page<StockMovementDTO> getMovements(UUID productId, User owner, Pageable pageable) {
        Product product = productRepository.findByIdAndOwner(productId, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", productId));
        
        Inventory inventory = inventoryRepository.findByProduct(product)
                .orElseThrow(() -> new ResourceNotFoundException("Inventário não encontrado"));
        
        return stockMovementRepository.findByInventoryOrderByCreatedAtDesc(inventory, pageable)
                .map(this::toMovementDTO);
    }
    
    private Inventory createInventoryForProduct(Product product) {
        Inventory inventory = Inventory.builder()
                .product(product)
                .currentStock(0)
                .minStock(5)
                .build();
        return inventoryRepository.save(inventory);
    }
    
    private InventoryDTO toDTO(Inventory inventory) {
        return new InventoryDTO(
                inventory.getId(),
                inventory.getProduct().getId(),
                inventory.getProduct().getName(),
                inventory.getProduct().getSku(),
                inventory.getCurrentStock(),
                inventory.getMinStock(),
                inventory.getReservedStock(),
                inventory.getAvailableStock(),
                inventory.getStockStatus(),
                inventory.getLastStockCheck(),
                inventory.getUpdatedAt()
        );
    }
    
    private StockMovementDTO toMovementDTO(StockMovement movement) {
        return new StockMovementDTO(
                movement.getId(),
                movement.getType(),
                movement.getQuantity(),
                movement.getReason(),
                movement.getNotes(),
                movement.getPerformedBy().getName(),
                movement.getCreatedAt()
        );
    }
}
```

---

## 🎮 PASSO 5: CONTROLLER E DTOs (30min)

**Controller:**

```java
package com.precificapro.controller;

import com.precificapro.controller.dto.*;
import com.precificapro.domain.model.User;
import com.precificapro.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/inventory")
@RequiredArgsConstructor
@Tag(name = "Inventory", description = "Gestão de Estoque")
public class InventoryController {
    
    private final InventoryService inventoryService;
    
    @GetMapping
    @Operation(summary = "Listar todo o inventário")
    public ResponseEntity<List<InventoryDTO>> getAll(@AuthenticationPrincipal User owner) {
        return ResponseEntity.ok(inventoryService.findAllByOwner(owner));
    }
    
    @GetMapping("/low-stock")
    @Operation(summary = "Listar produtos com estoque baixo")
    public ResponseEntity<List<InventoryDTO>> getLowStock(@AuthenticationPrincipal User owner) {
        return ResponseEntity.ok(inventoryService.findLowStockByOwner(owner));
    }
    
    @GetMapping("/product/{productId}")
    @Operation(summary = "Buscar inventário de um produto")
    public ResponseEntity<InventoryDTO> getByProduct(
            @PathVariable UUID productId,
            @AuthenticationPrincipal User owner) {
        return ResponseEntity.ok(inventoryService.findByProductId(productId, owner));
    }
    
    @PostMapping("/product/{productId}/adjust")
    @Operation(summary = "Ajustar estoque (entrada/saída)")
    public ResponseEntity<InventoryDTO> adjustStock(
            @PathVariable UUID productId,
            @Valid @RequestBody StockAdjustDTO dto,
            @AuthenticationPrincipal User owner) {
        return ResponseEntity.ok(inventoryService.adjustStock(productId, dto, owner));
    }
    
    @PutMapping("/product/{productId}/min-stock")
    @Operation(summary = "Atualizar estoque mínimo")
    public ResponseEntity<InventoryDTO> updateMinStock(
            @PathVariable UUID productId,
            @RequestParam Integer minStock,
            @AuthenticationPrincipal User owner) {
        return ResponseEntity.ok(inventoryService.updateMinStock(productId, minStock, owner));
    }
    
    @GetMapping("/product/{productId}/movements")
    @Operation(summary = "Histórico de movimentações")
    public ResponseEntity<Page<StockMovementDTO>> getMovements(
            @PathVariable UUID productId,
            @AuthenticationPrincipal User owner,
            Pageable pageable) {
        return ResponseEntity.ok(inventoryService.getMovements(productId, owner, pageable));
    }
}
```

**DTOs (criar em `controller/dto/`):**

```java
// InventoryDTO.java
public record InventoryDTO(
    UUID id,
    UUID productId,
    String productName,
    String productSku,
    Integer currentStock,
    Integer minStock,
    Integer reservedStock,
    Integer availableStock,
    StockStatus stockStatus,
    OffsetDateTime lastStockCheck,
    OffsetDateTime updatedAt
) {}

// StockAdjustDTO.java
public record StockAdjustDTO(
    @NotBlank String type, // IN ou OUT
    @Min(1) Integer quantity,
    @NotBlank String reason,
    String notes
) {}

// StockMovementDTO.java
public record StockMovementDTO(
    UUID id,
    String type,
    Integer quantity,
    String reason,
    String notes,
    String performedBy,
    OffsetDateTime createdAt
) {}
```

---

## 🎨 FRONTEND (45min)

**Types, Service e Página** - Similar ao Módulo 1, com campos específicos de inventory.

---

## ✅ CONCLUSÃO
**Tempo:** ~6-8h | **Arquivos:** 15+ | **Endpoints:** 6 REST
