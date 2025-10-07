package com.precificapro.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.precificapro.controller.dto.ProductImageDTO;
import com.precificapro.domain.model.Product;
import com.precificapro.domain.model.ProductImage;
import com.precificapro.domain.repository.ProductImageRepository;
import com.precificapro.domain.repository.ProductRepository;
import com.precificapro.exception.InvalidFileException;
import com.precificapro.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryImageService {
    
    private final Cloudinary cloudinary;
    private final ProductImageRepository imageRepository;
    private final ProductRepository productRepository;
    
    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp", "image/jpg");
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final int MAX_IMAGES_PER_PRODUCT = 10;
    
    @Transactional
    public ProductImageDTO uploadImage(UUID productId, MultipartFile file) {
        validateFile(file);
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", productId));
        
        // Verificar limite de imagens
        long currentCount = imageRepository.countByProduct(product);
        if (currentCount >= MAX_IMAGES_PER_PRODUCT) {
            throw new InvalidFileException("Limite de " + MAX_IMAGES_PER_PRODUCT + " imagens por produto atingido");
        }
        
        try {
            log.info("📸 Iniciando upload para Cloudinary - Produto: {} ({})", product.getName(), productId);
            
            // Upload para Cloudinary com otimizações
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", "precificapro/products",
                    "resource_type", "image",
                    "format", "webp",
                    "quality", "auto:good",
                    "fetch_format", "auto"
            ));
            
            String publicId = (String) uploadResult.get("public_id");
            String imageUrl = (String) uploadResult.get("url");
            String secureUrl = (String) uploadResult.get("secure_url");
            String format = (String) uploadResult.get("format");
            Integer width = (Integer) uploadResult.get("width");
            Integer height = (Integer) uploadResult.get("height");
            Long bytes = ((Number) uploadResult.get("bytes")).longValue();
            
            // Gerar thumbnail otimizado
            @SuppressWarnings("rawtypes")
            com.cloudinary.Transformation thumbnailTransformation = new com.cloudinary.Transformation()
                    .width(200).height(200).crop("fill")
                    .gravity("auto").quality("auto:good")
                    .fetchFormat("auto");
            
            String thumbnailUrl = cloudinary.url()
                    .transformation(thumbnailTransformation)
                    .generate(publicId);
            
            // Determinar se é a primeira imagem (será primária)
            boolean isPrimary = imageRepository.countByProduct(product) == 0;
            int displayOrder = (int) imageRepository.countByProduct(product);
            
            ProductImage image = ProductImage.builder()
                    .product(product)
                    .cloudinaryPublicId(publicId)
                    .imageUrl(imageUrl)
                    .thumbnailUrl(thumbnailUrl)
                    .secureUrl(secureUrl)
                    .format(format)
                    .width(width)
                    .height(height)
                    .sizeBytes(bytes)
                    .isPrimary(isPrimary)
                    .displayOrder(displayOrder)
                    .build();
            
            ProductImage saved = imageRepository.save(image);
            log.info("✅ Imagem salva com sucesso! ID: {} | Public ID: {}", saved.getId(), publicId);
            
            return toDTO(saved);
            
        } catch (IOException e) {
            log.error("❌ Erro ao fazer upload: {}", e.getMessage(), e);
            throw new RuntimeException("Erro ao fazer upload da imagem: " + e.getMessage(), e);
        }
    }
    
    @Transactional(readOnly = true)
    public List<ProductImageDTO> getProductImages(UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", productId));
        
        return imageRepository.findByProductOrderByDisplayOrderAsc(product).stream()
                .map(this::toDTO)
                .toList();
    }
    
    @Transactional
    public void deleteImage(UUID imageId) {
        ProductImage image = imageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Imagem", imageId));
        
        try {
            // Deletar do Cloudinary
            cloudinary.uploader().destroy(image.getCloudinaryPublicId(), ObjectUtils.emptyMap());
            log.info("🗑️ Imagem deletada do Cloudinary: {}", image.getCloudinaryPublicId());
            
            // Deletar do banco
            imageRepository.delete(image);
            log.info("✅ Imagem removida do banco: {}", imageId);
            
        } catch (IOException e) {
            log.error("❌ Erro ao deletar imagem do Cloudinary: {}", e.getMessage(), e);
            throw new RuntimeException("Erro ao deletar imagem: " + e.getMessage(), e);
        }
    }
    
    @Transactional
    public ProductImageDTO setPrimaryImage(UUID productId, UUID imageId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", productId));
        
        // Remover primária atual
        imageRepository.findByProductAndIsPrimaryTrue(product)
                .ifPresent(img -> {
                    img.setIsPrimary(false);
                    imageRepository.save(img);
                });
        
        // Definir nova primária
        ProductImage image = imageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Imagem", imageId));
        
        if (!image.getProduct().getId().equals(productId)) {
            throw new IllegalArgumentException("Imagem não pertence ao produto especificado");
        }
        
        image.setIsPrimary(true);
        ProductImage updated = imageRepository.save(image);
        
        log.info("⭐ Nova imagem primária definida: {} para produto: {}", imageId, productId);
        return toDTO(updated);
    }
    
    private void validateFile(MultipartFile file) {
        // Validar se arquivo existe
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("Arquivo vazio ou inválido");
        }
        
        // Validar tamanho
        if (file.getSize() > MAX_FILE_SIZE) {
            double sizeMB = file.getSize() / (1024.0 * 1024.0);
            throw new InvalidFileException(
                String.format("Arquivo muito grande: %.2f MB. Tamanho máximo: 5 MB", sizeMB)
            );
        }
        
        // Validar tipo
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase())) {
            throw new InvalidFileException(
                "Tipo de arquivo não permitido: " + contentType + ". Use JPG, PNG ou WebP"
            );
        }
        
        // Validar nome do arquivo
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            throw new InvalidFileException("Nome do arquivo inválido");
        }
        
        log.debug("✅ Arquivo validado: {} ({} bytes, {})", originalFilename, file.getSize(), contentType);
    }
    
    private ProductImageDTO toDTO(ProductImage image) {
        return ProductImageDTO.builder()
                .id(image.getId())
                .productId(image.getProduct().getId())
                .cloudinaryPublicId(image.getCloudinaryPublicId())
                .imageUrl(image.getImageUrl())
                .thumbnailUrl(image.getThumbnailUrl())
                .secureUrl(image.getSecureUrl())
                .format(image.getFormat())
                .width(image.getWidth())
                .height(image.getHeight())
                .sizeBytes(image.getSizeBytes())
                .isPrimary(image.getIsPrimary())
                .displayOrder(image.getDisplayOrder())
                .uploadedAt(image.getUploadedAt())
                .build();
    }
}
