package com.precificapro.controller.dto;

import com.precificapro.domain.enums.StockStatus;
import lombok.Builder;

import java.time.OffsetDateTime;
import java.util.UUID;

@Builder
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
    String stockStatusDescription,
    OffsetDateTime lastStockCheck,
    OffsetDateTime updatedAt
) {}
