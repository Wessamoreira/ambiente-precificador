package com.precificapro.controller.dto;

import lombok.Builder;

import java.time.OffsetDateTime;
import java.util.UUID;

@Builder
public record StockMovementDTO(
    UUID id,
    UUID productId,
    String productName,
    String type,
    String typeDescription,
    Integer quantity,
    String reason,
    String notes,
    String performedBy,
    OffsetDateTime createdAt
) {}
