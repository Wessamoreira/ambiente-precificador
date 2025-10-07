# 📸 MÓDULO 3 - UPLOAD DE IMAGENS (CLOUDINARY)

**Prioridade:** 🔴 ALTA  
**Tempo Estimado:** 5-7 horas  
**Complexidade:** ⭐⭐⭐ (Alta)

---

## 🎯 OBJETIVO
Implementar sistema completo de upload, gestão e otimização de imagens de produtos usando Cloudinary.

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### CONFIGURAÇÃO INICIAL (30min)
- [ ] Criar conta Cloudinary (gratuita)
- [ ] Obter credenciais (Cloud Name, API Key, API Secret)
- [ ] Adicionar dependência no pom.xml
- [ ] Configurar application.properties

### BACKEND (3-4h)
- [ ] V5__add_product_images_table.sql - Migration
- [ ] ProductImage.java - Model
- [ ] ProductImageRepository.java - Repository
- [ ] CloudinaryConfig.java - Config
- [ ] CloudinaryImageService.java - Service
- [ ] ProductImageController.java - Controller
- [ ] DTOs e Exceptions
- [ ] Atualizar Product.java

### FRONTEND (2-3h)
- [ ] types/index.ts - Tipos
- [ ] api/imageService.ts - Service
- [ ] hooks/useImageUpload.ts - Hook customizado
- [ ] components/ImageUpload.tsx - Upload drag-and-drop
- [ ] components/ProductImageGallery.tsx - Galeria
- [ ] pages/ProductImagesPage.tsx - Página completa
- [ ] Rotas e integrações

---

## 🌐 PASSO 1: CRIAR CONTA CLOUDINARY (10min)

1. Acesse: https://cloudinary.com/users/register_free
2. Crie conta (email/Google/GitHub)
3. No Dashboard, copie:
   - **Cloud Name:** dxxxxxxxxx
   - **API Key:** 123456789012345
   - **API Secret:** abcdefg... (clique no ícone 👁)

**Limites Gratuitos:**
- ✅ 25 GB storage
- ✅ 25 GB bandwidth/mês
- ✅ Transformações ilimitadas
- ✅ CDN global

---

## 🔧 PASSO 2: CONFIGURAR BACKEND (20min)

**1. Adicionar ao `pom.xml`:**

```xml
<!-- Cloudinary -->
<dependency>
    <groupId>com.cloudinary</groupId>
    <artifactId>cloudinary-http44</artifactId>
    <version>1.36.0</version>
</dependency>
```

**2. Configurar `application.properties`:**

```properties
# Cloudinary
cloudinary.cloud-name=${CLOUDINARY_CLOUD_NAME}
cloudinary.api-key=${CLOUDINARY_API_KEY}
cloudinary.api-secret=${CLOUDINARY_API_SECRET}

# Upload settings
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=10MB
server.tomcat.max-swallow-size=10MB
server.tomcat.max-http-form-post-size=10MB
```

**3. Criar arquivo `.env` na raiz do projeto:**

```bash
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret
```

**4. Adicionar `.env` ao `.gitignore`:**

```
.env
.env.local
```

---

## 🗄️ PASSO 3: MIGRATION (15min)

**Arquivo:** `V5__add_product_images_table.sql`

```sql
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    cloudinary_public_id VARCHAR(255) NOT NULL UNIQUE,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    secure_url TEXT NOT NULL,
    format VARCHAR(10),
    width INT,
    height INT,
    size_bytes BIGINT,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_is_primary ON product_images(product_id, is_primary);
CREATE INDEX idx_product_images_display_order ON product_images(product_id, display_order);

COMMENT ON TABLE product_images IS 'Imagens de produtos armazenadas no Cloudinary';
COMMENT ON COLUMN product_images.cloudinary_public_id IS 'ID único no Cloudinary para manipulação';
COMMENT ON COLUMN product_images.is_primary IS 'Imagem principal do produto';
```

---

## 🏗️ PASSO 4: MODELS (20min)

**Arquivo:** `ProductImage.java`

```java
package com.precificapro.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "product_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @Column(name = "cloudinary_public_id", nullable = false, unique = true)
    private String cloudinaryPublicId;
    
    @Column(name = "image_url", nullable = false, columnDefinition = "TEXT")
    private String imageUrl;
    
    @Column(name = "thumbnail_url", columnDefinition = "TEXT")
    private String thumbnailUrl;
    
    @Column(name = "secure_url", nullable = false, columnDefinition = "TEXT")
    private String secureUrl;
    
    @Column(length = 10)
    private String format;
    
    private Integer width;
    private Integer height;
    
    @Column(name = "size_bytes")
    private Long sizeBytes;
    
    @Column(name = "is_primary")
    @Builder.Default
    private Boolean isPrimary = false;
    
    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;
    
    @Column(name = "uploaded_at")
    private OffsetDateTime uploadedAt;
    
    @PrePersist
    protected void onCreate() {
        uploadedAt = OffsetDateTime.now();
    }
}
```

**Atualizar `Product.java`** - adicionar:

```java
@OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
@Builder.Default
private List<ProductImage> images = new ArrayList<>();
```

---

## 📚 PASSO 5: REPOSITORY (5min)

```java
package com.precificapro.domain.repository;

import com.precificapro.domain.model.Product;
import com.precificapro.domain.model.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, UUID> {
    
    List<ProductImage> findByProductOrderByDisplayOrderAsc(Product product);
    
    Optional<ProductImage> findByProductAndIsPrimaryTrue(Product product);
    
    Optional<ProductImage> findByCloudinaryPublicId(String publicId);
    
    void deleteByCloudinaryPublicId(String publicId);
}
```

---

## ⚙️ PASSO 6: CLOUDINARY CONFIG (15min)

```java
package com.precificapro.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {
    
    @Value("${cloudinary.cloud-name}")
    private String cloudName;
    
    @Value("${cloudinary.api-key}")
    private String apiKey;
    
    @Value("${cloudinary.api-secret}")
    private String apiSecret;
    
    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
        ));
    }
}
```

---

## 🛠️ PASSO 7: SERVICE (1h)

```java
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
    
    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp");
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    
    @Transactional
    public ProductImageDTO uploadImage(UUID productId, MultipartFile file) {
        validateFile(file);
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", productId));
        
        try {
            log.info("📸 Iniciando upload para Cloudinary - Produto: {}", productId);
            
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
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
            
            // Gerar thumbnail
            String thumbnailUrl = cloudinary.url()
                    .transformation(ObjectUtils.asMap(
                            "width", 200,
                            "height", 200,
                            "crop", "fill",
                            "gravity", "auto",
                            "quality", "auto:good",
                            "fetch_format", "auto"
                    ))
                    .generate(publicId);
            
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
                    .isPrimary(product.getImages().isEmpty()) // Primeira é primária
                    .displayOrder(product.getImages().size())
                    .build();
            
            ProductImage saved = imageRepository.save(image);
            log.info("✅ Imagem salva com sucesso! ID: {}", saved.getId());
            
            return toDTO(saved);
            
        } catch (IOException e) {
            log.error("❌ Erro ao fazer upload: {}", e.getMessage());
            throw new RuntimeException("Erro ao fazer upload da imagem", e);
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
            cloudinary.uploader().destroy(image.getCloudinaryPublicId(), ObjectUtils.emptyMap());
            imageRepository.delete(image);
            log.info("🗑️ Imagem deletada: {}", imageId);
        } catch (IOException e) {
            throw new RuntimeException("Erro ao deletar imagem", e);
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
        
        image.setIsPrimary(true);
        ProductImage updated = imageRepository.save(image);
        
        return toDTO(updated);
    }
    
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new InvalidFileException("Arquivo vazio");
        }
        
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new InvalidFileException("Arquivo muito grande. Máximo: 5MB");
        }
        
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new InvalidFileException("Tipo não permitido. Use JPG, PNG ou WebP");
        }
    }
    
    private ProductImageDTO toDTO(ProductImage image) {
        return new ProductImageDTO(
                image.getId(),
                image.getProduct().getId(),
                image.getCloudinaryPublicId(),
                image.getImageUrl(),
                image.getThumbnailUrl(),
                image.getSecureUrl(),
                image.getFormat(),
                image.getWidth(),
                image.getHeight(),
                image.getSizeBytes(),
                image.getIsPrimary(),
                image.getDisplayOrder(),
                image.getUploadedAt()
        );
    }
}
```

---

## 🎮 PASSO 8: CONTROLLER (20min)

```java
package com.precificapro.controller;

import com.precificapro.controller.dto.ProductImageDTO;
import com.precificapro.service.CloudinaryImageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
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
    
    @PostMapping
    @Operation(summary = "Upload de imagem")
    public ResponseEntity<ProductImageDTO> uploadImage(
            @PathVariable UUID productId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(201).body(imageService.uploadImage(productId, file));
    }
    
    @GetMapping
    @Operation(summary = "Listar imagens do produto")
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
```

---

## 📝 PASSO 9: DTOs E EXCEPTIONS (10min)

**ProductImageDTO.java:**

```java
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
```

**InvalidFileException.java:**

```java
package com.precificapro.exception;

public class InvalidFileException extends RuntimeException {
    public InvalidFileException(String message) {
        super(message);
    }
}
```

---

## 🎨 PASSO 10: FRONTEND (2-3h)

**Ver documentação completa em:** `arquivos de melhorias/RESUMO-UPLOAD-IMAGENS.md`

**Principais arquivos:**
- `types/index.ts` - Tipos ProductImage
- `api/imageService.ts` - 4 funções API
- `hooks/useImageUpload.ts` - Validação e upload
- `components/ImageUpload.tsx` - Drag-and-drop
- `components/ProductImageGallery.tsx` - Galeria + lightbox
- `pages/ProductImagesPage.tsx` - Página completa

---

## ✅ CONCLUSÃO

**Tempo Total:** ~5-7 horas  
**Custo:** R$ 0,00 (até 25GB)  
**Arquivos Criados:** 15+  
**Endpoints:** 4 REST  
**Features:**
- ✅ Upload drag-and-drop
- ✅ Thumbnails automáticos
- ✅ Conversão WebP
- ✅ CDN Global
- ✅ Galeria com lightbox
- ✅ Imagem principal
- ✅ Ordenação customizada
