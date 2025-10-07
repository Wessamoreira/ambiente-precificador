package com.precificapro.controller.dto;

import lombok.Builder;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Builder
public record PriceHistoryResponseDTO(
    UUID id,
    UUID productId,
    BigDecimal suggestedPrice,
    BigDecimal actualPrice,
    String pricingProfileName,
    BigDecimal totalCost,
    BigDecimal netProfitPerUnit,
    BigDecimal netProfitPercentage,
    BigDecimal markupApplied,
    BigDecimal marginOnPrice,
    OffsetDateTime createdAt,
    String createdBy,
    String notes
) {}
