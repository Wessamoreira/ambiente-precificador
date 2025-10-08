package com.precificapro.service;

import com.precificapro.controller.dto.ProductCreateDTO;
import com.precificapro.controller.dto.ProductResponseDTO;
import com.precificapro.controller.dto.ProductUpdateDTO;
import com.precificapro.domain.model.Inventory;
import com.precificapro.domain.model.Product;
import com.precificapro.domain.model.ProductImage;
import com.precificapro.domain.model.User;
import com.precificapro.domain.repository.InventoryRepository;
import com.precificapro.domain.repository.ProductImageRepository;
import com.precificapro.domain.repository.ProductRepository;
import com.precificapro.mapper.ProductMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ProductService {

    @Autowired private ProductRepository productRepository;
    @Autowired private ProductMapper productMapper;
    @Autowired private ProductImageRepository productImageRepository;
    @Autowired private InventoryRepository inventoryRepository;
    @Autowired private AuditLogService auditLogService;

    @Transactional
    @CacheEvict(value = {"products", "dashboardMetrics"}, key = "#owner.id")
    public ProductResponseDTO createProduct(ProductCreateDTO dto, User owner) {
        if (productRepository.existsBySkuAndOwner(dto.sku(), owner)) {
            throw new com.precificapro.exception.ResourceAlreadyExistsException("SKU já cadastrado para este usuário.");
        }
        Product product = productMapper.toEntity(dto);
        product.setOwner(owner);
        Product savedProduct = productRepository.save(product);
        
        // ✅ CRIAR INVENTORY AUTOMATICAMENTE AO CRIAR PRODUTO
        Inventory inventory = Inventory.builder()
                .product(savedProduct)
                .currentStock(0)
                .minStock(5)
                .reservedStock(0)
                .availableStock(0)
                .build();
        inventoryRepository.save(inventory);
        log.info("Inventory criado automaticamente para produto: {} (SKU: {})", savedProduct.getName(), savedProduct.getSku());
        
        // Auditoria
        auditLogService.logAction(owner, "PRODUCT_CREATED", "Product", savedProduct.getId().toString(),
            "Produto criado: " + savedProduct.getName() + " (SKU: " + savedProduct.getSku() + ")");
        
        return toResponseDTOWithImage(savedProduct);
    }

    @Transactional(readOnly = true)
    public ProductResponseDTO findProductById(UUID productId, User owner) {
        Product product = productRepository.findByIdAndOwner(productId, owner)
                .orElseThrow(() -> new com.precificapro.exception.ResourceNotFoundException("Produto não encontrado."));
        return toResponseDTOWithImage(product);
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> findAllProductsByOwner(User owner) {
        return productRepository.findByOwner(owner).stream()
                .map(this::toResponseDTOWithImage)
                .collect(Collectors.toList());
    }
    
    // NOVO: Método paginado (recomendado para produção)
    @Transactional(readOnly = true)
    @Cacheable(value = "products", key = "#owner.id + '-' + #pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<ProductResponseDTO> findAllProductsByOwnerPaginated(User owner, Pageable pageable) {
        return productRepository.findByOwner(owner, pageable)
                .map(this::toResponseDTOWithImage);
    }

    @Transactional
    @CacheEvict(value = "products", key = "#owner.id")
    public ProductResponseDTO updateProduct(UUID productId, ProductUpdateDTO dto, User owner) {
        Product product = productRepository.findByIdAndOwner(productId, owner)
                .orElseThrow(() -> new com.precificapro.exception.ResourceNotFoundException("Produto não encontrado."));
        
        // Verifica se o novo SKU já está em uso por OUTRO produto do mesmo usuário
        productRepository.findBySkuAndOwner(dto.sku(), owner).ifPresent(existingProduct -> {
            if (!existingProduct.getId().equals(productId)) {
                throw new com.precificapro.exception.ResourceAlreadyExistsException("SKU já está em uso por outro produto.");
            }
        });

        productMapper.updateEntityFromDto(dto, product);
        Product updatedProduct = productRepository.save(product);
        
        // Auditoria
        auditLogService.logAction(owner, "PRODUCT_UPDATED", "Product", updatedProduct.getId().toString(),
            "Produto atualizado: " + updatedProduct.getName() + " (SKU: " + updatedProduct.getSku() + ")");
        
        return toResponseDTOWithImage(updatedProduct);
    }

    @Transactional
    @CacheEvict(value = {"products", "dashboardMetrics"}, key = "#owner.id")
    public void deleteProduct(UUID productId, User owner) {
        Product product = productRepository.findByIdAndOwner(productId, owner)
                .orElseThrow(() -> new com.precificapro.exception.ResourceNotFoundException("Produto não encontrado."));
        
        String productName = product.getName();
        String sku = product.getSku();
        
        productRepository.deleteById(productId);
        
        // Auditoria
        auditLogService.logAction(owner, "PRODUCT_DELETED", "Product", productId.toString(),
            "Produto deletado: " + productName + " (SKU: " + sku + ")");
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> findProductsByCategory(UUID categoryId, User owner) {
        return productRepository.findByOwnerAndCategoryId(owner, categoryId).stream()
                .map(this::toResponseDTOWithImage)
                .collect(Collectors.toList());
    }
    
    private ProductResponseDTO toResponseDTOWithImage(Product product) {
        String primaryImageUrl = productImageRepository.findByProductAndIsPrimaryTrue(product)
                .map(ProductImage::getThumbnailUrl)
                .orElse(null);
        
        return new ProductResponseDTO(
                product.getId(),
                product.getName(),
                product.getSku(),
                product.getDefaultPurchaseCost(),
                product.getDefaultPackagingCost(),
                product.getDefaultOtherVariableCost(),
                primaryImageUrl,
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }
}