package com.precificapro.controller.dto;

import java.math.BigDecimal;

public record ProductRankingDTO(
    String productId,
    String productName,
    String productSku,
    Long totalQuantitySold,
    BigDecimal totalRevenue,
    BigDecimal totalNetProfit,
    Double avgProfitMargin
) {}
