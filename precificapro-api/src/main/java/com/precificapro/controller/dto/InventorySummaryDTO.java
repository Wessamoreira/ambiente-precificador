package com.precificapro.controller.dto;

import lombok.Builder;

@Builder
public record InventorySummaryDTO(
    long totalProducts,
    long inStock,
    long lowStock,
    long outOfStock,
    double lowStockPercentage,
    double outOfStockPercentage
) {}
