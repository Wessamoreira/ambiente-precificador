package com.precificapro.service;

import com.precificapro.controller.dto.ProductCreateDTO;
import com.precificapro.controller.dto.ProductResponseDTO;
import com.precificapro.controller.dto.ProductUpdateDTO;
import com.precificapro.domain.model.Product;
import com.precificapro.domain.model.ProductImage;
import com.precificapro.domain.model.User;
import com.precificapro.domain.repository.ProductImageRepository;
import com.precificapro.domain.repository.ProductRepository;
import com.precificapro.mapper.ProductMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
@Service
public class ProductService {

    @Autowired private ProductRepository productRepository;
    @Autowired private ProductMapper productMapper;
    @Autowired private ProductImageRepository productImageRepository;

    @Transactional
    public ProductResponseDTO createProduct(ProductCreateDTO dto, User owner) {
        if (productRepository.existsBySkuAndOwner(dto.sku(), owner)) {
            throw new RuntimeException("SKU já cadastrado para este usuário.");
        }
        Product product = productMapper.toEntity(dto);
        product.setOwner(owner);
        Product savedProduct = productRepository.save(product);
        return toResponseDTOWithImage(savedProduct);
    }

    @Transactional(readOnly = true)
    public ProductResponseDTO findProductById(UUID productId, User owner) {
        Product product = productRepository.findByIdAndOwner(productId, owner)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado."));
        return toResponseDTOWithImage(product);
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> findAllProductsByOwner(User owner) {
        return productRepository.findByOwner(owner).stream()
                .map(this::toResponseDTOWithImage)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponseDTO updateProduct(UUID productId, ProductUpdateDTO dto, User owner) {
        Product product = productRepository.findByIdAndOwner(productId, owner)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado."));
        
        // Verifica se o novo SKU já está em uso por OUTRO produto do mesmo usuário
        productRepository.findBySkuAndOwner(dto.sku(), owner).ifPresent(existingProduct -> {
            if (!existingProduct.getId().equals(productId)) {
                throw new RuntimeException("SKU já está em uso por outro produto.");
            }
        });

        productMapper.updateEntityFromDto(dto, product);
        Product updatedProduct = productRepository.save(product);
        return toResponseDTOWithImage(updatedProduct);
    }

    @Transactional
    public void deleteProduct(UUID productId, User owner) {
        if (!productRepository.existsByIdAndOwner(productId, owner)) {
            throw new RuntimeException("Produto não encontrado.");
        }
        productRepository.deleteById(productId);
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