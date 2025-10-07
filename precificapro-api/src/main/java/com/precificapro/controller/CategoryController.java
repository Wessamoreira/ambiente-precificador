package com.precificapro.controller;

import com.precificapro.controller.dto.CategoryCreateDTO;
import com.precificapro.controller.dto.CategoryDTO;
import com.precificapro.controller.dto.CategoryUpdateDTO;
import com.precificapro.domain.model.User;
import com.precificapro.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Gerenciamento de Categorias")
public class CategoryController {
    
    private final CategoryService categoryService;
    
    @GetMapping
    @Operation(summary = "Listar todas as categorias")
    public ResponseEntity<List<CategoryDTO>> getAll(@AuthenticationPrincipal User owner) {
        return ResponseEntity.ok(categoryService.findAllByOwner(owner));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Buscar categoria por ID")
    public ResponseEntity<CategoryDTO> getById(
            @PathVariable UUID id,
            @AuthenticationPrincipal User owner) {
        return ResponseEntity.ok(categoryService.findById(id, owner));
    }
    
    @PostMapping
    @Operation(summary = "Criar nova categoria")
    public ResponseEntity<CategoryDTO> create(
            @Valid @RequestBody CategoryCreateDTO dto,
            @AuthenticationPrincipal User owner) {
        return ResponseEntity.status(201).body(categoryService.create(dto, owner));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar categoria")
    public ResponseEntity<CategoryDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody CategoryUpdateDTO dto,
            @AuthenticationPrincipal User owner) {
        return ResponseEntity.ok(categoryService.update(id, dto, owner));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar categoria")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id,
            @AuthenticationPrincipal User owner) {
        categoryService.delete(id, owner);
        return ResponseEntity.noContent().build();
    }
}
