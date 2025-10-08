package com.precificapro.controller.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record ProductSalesChartDTO(
    String productId,
    String productName,
    String productSku,
    List<DataPoint> dataPoints,
    BigDecimal totalRevenue,
    Long totalQuantitySold,
    BigDecimal avgDailyRevenue
) {
    public record DataPoint(
        LocalDate date,
        Long quantitySold,
        BigDecimal revenue,
        BigDecimal profit,
        Integer salesCount
    ) {}
}
