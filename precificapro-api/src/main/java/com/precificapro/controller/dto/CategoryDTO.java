package com.precificapro.controller.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record CategoryDTO(
    UUID id,
    String name,
    String description,
    String icon,
    String color,
    int productCount,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {}
