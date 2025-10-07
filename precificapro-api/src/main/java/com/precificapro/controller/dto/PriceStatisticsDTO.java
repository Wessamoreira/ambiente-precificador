package com.precificapro.controller.dto;

import lombok.Builder;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

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
