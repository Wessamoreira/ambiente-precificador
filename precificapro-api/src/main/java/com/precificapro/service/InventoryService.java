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
        log.info("📦 Buscando inventário completo do usuário: {}", owner.getEmail());
        return inventoryRepository.findByOwnerId(owner.getId()).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<InventoryDTO> findLowStockByOwner(User owner) {
        log.info("⚠️ Buscando produtos com estoque baixo do usuário: {}", owner.getEmail());
        return inventoryRepository.findLowStockByOwnerId(owner.getId()).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public InventoryDTO findByProductId(UUID productId, User owner) {
        log.info("🔍 Buscando inventário do produto: {}", productId);
        
        Product product = productRepository.findByIdAndOwner(productId, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", productId));
        
        Inventory inventory = inventoryRepository.findByProduct(product)
                .orElseGet(() -> createInventoryForProduct(product));
        
        return toDTO(inventory);
    }
    
    @Transactional
    public InventoryDTO adjustStock(UUID productId, StockAdjustDTO dto, User owner) {
        log.info("📊 Ajustando estoque do produto: {} - Tipo: {} - Qtd: {}", 
                 productId, dto.type(), dto.quantity());
        
        Product product = productRepository.findByIdAndOwner(productId, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", productId));
        
        Inventory inventory = inventoryRepository.findByProduct(product)
                .orElseThrow(() -> new ResourceNotFoundException("Inventário não encontrado para o produto: " + productId));
        
        int oldStock = inventory.getCurrentStock();
        int adjustment = "IN".equals(dto.type()) ? dto.quantity() : -dto.quantity();
        int newStock = Math.max(0, oldStock + adjustment);
        
        inventory.setCurrentStock(newStock);
        Inventory savedInventory = inventoryRepository.save(inventory);
        
        // Registrar movimentação
        StockMovement movement = StockMovement.builder()
                .inventory(inventory)
                .product(product)
                .type(dto.type())
                .quantity(dto.quantity())
                .reason(dto.reason())
                .notes(dto.notes())
                .performedBy(owner)
                .build();
        stockMovementRepository.save(movement);
        
        log.info("✅ Estoque ajustado: {} → {} ({}{})", 
                 oldStock, newStock, adjustment > 0 ? "+" : "", adjustment);
        
        return toDTO(savedInventory);
    }
    
    @Transactional
    public InventoryDTO updateMinStock(UUID productId, Integer minStock, User owner) {
        log.info("📏 Atualizando estoque mínimo do produto: {} para {}", productId, minStock);
        
        Product product = productRepository.findByIdAndOwner(productId, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", productId));
        
        Inventory inventory = inventoryRepository.findByProduct(product)
                .orElseThrow(() -> new ResourceNotFoundException("Inventário não encontrado"));
        
        inventory.setMinStock(minStock);
        Inventory saved = inventoryRepository.save(inventory);
        
        log.info("✅ Estoque mínimo atualizado para: {}", minStock);
        return toDTO(saved);
    }
    
    @Transactional
    public InventoryDTO reserveStock(UUID productId, Integer quantity, User owner) {
        log.info("🔒 Reservando {} unidades do produto: {}", quantity, productId);
        
        Product product = productRepository.findByIdAndOwner(productId, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", productId));
        
        Inventory inventory = inventoryRepository.findByProduct(product)
                .orElseThrow(() -> new ResourceNotFoundException("Inventário não encontrado"));
        
        if (inventory.getAvailableStock() < quantity) {
            throw new IllegalStateException("Estoque disponível insuficiente. Disponível: " + 
                                          inventory.getAvailableStock() + ", Solicitado: " + quantity);
        }
        
        inventory.setReservedStock(inventory.getReservedStock() + quantity);
        Inventory saved = inventoryRepository.save(inventory);
        
        log.info("✅ {} unidades reservadas. Reservado total: {}", quantity, saved.getReservedStock());
        return toDTO(saved);
    }
    
    @Transactional
    public InventoryDTO releaseStock(UUID productId, Integer quantity, User owner) {
        log.info("🔓 Liberando {} unidades do produto: {}", quantity, productId);
        
        Product product = productRepository.findByIdAndOwner(productId, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", productId));
        
        Inventory inventory = inventoryRepository.findByProduct(product)
                .orElseThrow(() -> new ResourceNotFoundException("Inventário não encontrado"));
        
        int newReserved = Math.max(0, inventory.getReservedStock() - quantity);
        inventory.setReservedStock(newReserved);
        Inventory saved = inventoryRepository.save(inventory);
        
        log.info("✅ {} unidades liberadas. Reservado total: {}", quantity, saved.getReservedStock());
        return toDTO(saved);
    }
    
    @Transactional(readOnly = true)
    public Page<StockMovementDTO> getMovements(UUID productId, User owner, Pageable pageable) {
        log.info("📜 Buscando histórico de movimentações do produto: {}", productId);
        
        Product product = productRepository.findByIdAndOwner(productId, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", productId));
        
        return stockMovementRepository.findByProductOrderByCreatedAtDesc(product, pageable)
                .map(this::toMovementDTO);
    }
    
    @Transactional(readOnly = true)
    public InventorySummaryDTO getSummary(User owner) {
        log.info("📊 Gerando resumo de inventário para usuário: {}", owner.getEmail());
        
        List<Inventory> allInventory = inventoryRepository.findByOwnerId(owner.getId());
        long total = allInventory.size();
        
        long inStock = allInventory.stream()
                .filter(i -> i.getStockStatus() == StockStatus.IN_STOCK)
                .count();
        
        long lowStock = inventoryRepository.countLowStockByOwnerId(owner.getId());
        long outOfStock = inventoryRepository.countOutOfStockByOwnerId(owner.getId());
        
        double lowStockPercentage = total > 0 ? (lowStock * 100.0 / total) : 0;
        double outOfStockPercentage = total > 0 ? (outOfStock * 100.0 / total) : 0;
        
        return InventorySummaryDTO.builder()
                .totalProducts(total)
                .inStock(inStock)
                .lowStock(lowStock)
                .outOfStock(outOfStock)
                .lowStockPercentage(lowStockPercentage)
                .outOfStockPercentage(outOfStockPercentage)
                .build();
    }
    
    @Transactional
    private Inventory createInventoryForProduct(Product product) {
        log.info("🆕 Criando inventário para produto: {}", product.getName());
        
        Inventory inventory = Inventory.builder()
                .product(product)
                .currentStock(0)
                .minStock(5)
                .reservedStock(0)
                .build();
        
        return inventoryRepository.save(inventory);
    }
    
    private InventoryDTO toDTO(Inventory inventory) {
        return InventoryDTO.builder()
                .id(inventory.getId())
                .productId(inventory.getProduct().getId())
                .productName(inventory.getProduct().getName())
                .productSku(inventory.getProduct().getSku())
                .currentStock(inventory.getCurrentStock())
                .minStock(inventory.getMinStock())
                .reservedStock(inventory.getReservedStock())
                .availableStock(inventory.getAvailableStock())
                .stockStatus(inventory.getStockStatus())
                .stockStatusDescription(inventory.getStockStatus().getDescription())
                .lastStockCheck(inventory.getLastStockCheck())
                .updatedAt(inventory.getUpdatedAt())
                .build();
    }
    
    private StockMovementDTO toMovementDTO(StockMovement movement) {
        String typeDescription = "IN".equals(movement.getType()) ? "Entrada" : "Saída";
        
        return StockMovementDTO.builder()
                .id(movement.getId())
                .productId(movement.getProduct().getId())
                .productName(movement.getProduct().getName())
                .type(movement.getType())
                .typeDescription(typeDescription)
                .quantity(movement.getQuantity())
                .reason(movement.getReason())
                .notes(movement.getNotes())
                .performedBy(movement.getPerformedBy().getName())
                .createdAt(movement.getCreatedAt())
                .build();
    }
}
