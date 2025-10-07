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
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class ProductImage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @EqualsAndHashCode.Include
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
