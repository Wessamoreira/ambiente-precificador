package com.precificapro.controller;

import com.precificapro.controller.dto.ProductImageDTO;
import com.precificapro.service.CloudinaryImageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/products/{productId}/images")
@RequiredArgsConstructor
@Tag(name = "Product Images", description = "Gestão de Imagens de Produtos")
public class ProductImageController {
    
    private final CloudinaryImageService imageService;
    
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload de imagem do produto")
    public ResponseEntity<ProductImageDTO> uploadImage(
            @PathVariable UUID productId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(201).body(imageService.uploadImage(productId, file));
    }
    
    @GetMapping
    @Operation(summary = "Listar todas as imagens do produto")
    public ResponseEntity<List<ProductImageDTO>> getImages(@PathVariable UUID productId) {
        return ResponseEntity.ok(imageService.getProductImages(productId));
    }
    
    @DeleteMapping("/{imageId}")
    @Operation(summary = "Deletar imagem")
    public ResponseEntity<Void> deleteImage(
            @PathVariable UUID productId,
            @PathVariable UUID imageId) {
        imageService.deleteImage(imageId);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{imageId}/primary")
    @Operation(summary = "Definir como imagem principal")
    public ResponseEntity<ProductImageDTO> setPrimary(
            @PathVariable UUID productId,
            @PathVariable UUID imageId) {
        return ResponseEntity.ok(imageService.setPrimaryImage(productId, imageId));
    }
}
