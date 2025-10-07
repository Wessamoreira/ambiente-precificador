package com.precificapro.controller.dto;

import lombok.Builder;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

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
