package com.precificapro.controller.dto;

import lombok.Builder;
import java.time.OffsetDateTime;
import java.util.UUID;

@Builder
public record ProductImageDTO(
    UUID id,
    UUID productId,
    String cloudinaryPublicId,
    String imageUrl,
    String thumbnailUrl,
    String secureUrl,
    String format,
    Integer width,
    Integer height,
    Long sizeBytes,
    Boolean isPrimary,
    Integer displayOrder,
    OffsetDateTime uploadedAt
) {}
