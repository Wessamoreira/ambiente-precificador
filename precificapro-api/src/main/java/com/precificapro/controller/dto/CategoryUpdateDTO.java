package com.precificapro.controller.dto;

public record CategoryUpdateDTO(
    String name,
    String description,
    String icon,
    String color
) {}
