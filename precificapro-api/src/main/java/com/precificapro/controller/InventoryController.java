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
    public ResponseEntity<List<InventoryDTO>> getAll(
            @AuthenticationPrincipal User owner) {
        return ResponseEntity.ok(inventoryService.findAllByOwner(owner));
    }
    
    @GetMapping("/low-stock")
    @Operation(summary = "Listar produtos com estoque baixo ou zerado")
    public ResponseEntity<List<InventoryDTO>> getLowStock(
            @AuthenticationPrincipal User owner) {
        return ResponseEntity.ok(inventoryService.findLowStockByOwner(owner));
    }
    
    @GetMapping("/summary")
    @Operation(summary = "Resumo do inventário")
    public ResponseEntity<InventorySummaryDTO> getSummary(
            @AuthenticationPrincipal User owner) {
        return ResponseEntity.ok(inventoryService.getSummary(owner));
    }
    
    @GetMapping("/product/{productId}")
    @Operation(summary = "Buscar inventário de um produto específico")
    public ResponseEntity<InventoryDTO> getByProduct(
            @PathVariable UUID productId,
            @AuthenticationPrincipal User owner) {
        return ResponseEntity.ok(inventoryService.findByProductId(productId, owner));
    }
    
    @PostMapping("/product/{productId}/adjust")
    @Operation(summary = "Ajustar estoque (entrada ou saída)")
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
    
    @PostMapping("/product/{productId}/reserve")
    @Operation(summary = "Reservar estoque")
    public ResponseEntity<InventoryDTO> reserveStock(
            @PathVariable UUID productId,
            @RequestParam Integer quantity,
            @AuthenticationPrincipal User owner) {
        return ResponseEntity.ok(inventoryService.reserveStock(productId, quantity, owner));
    }
    
    @PostMapping("/product/{productId}/release")
    @Operation(summary = "Liberar estoque reservado")
    public ResponseEntity<InventoryDTO> releaseStock(
            @PathVariable UUID productId,
            @RequestParam Integer quantity,
            @AuthenticationPrincipal User owner) {
        return ResponseEntity.ok(inventoryService.releaseStock(productId, quantity, owner));
    }
    
    @GetMapping("/product/{productId}/movements")
    @Operation(summary = "Histórico de movimentações de um produto")
    public ResponseEntity<Page<StockMovementDTO>> getMovements(
            @PathVariable UUID productId,
            @AuthenticationPrincipal User owner,
            Pageable pageable) {
        return ResponseEntity.ok(inventoryService.getMovements(productId, owner, pageable));
    }
}
