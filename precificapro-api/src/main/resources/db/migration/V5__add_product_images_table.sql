-- Tabela de imagens de produtos
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

-- Índices para performance
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_is_primary ON product_images(product_id, is_primary);
CREATE INDEX idx_product_images_display_order ON product_images(product_id, display_order);
CREATE INDEX idx_product_images_cloudinary_id ON product_images(cloudinary_public_id);

-- Trigger para garantir apenas uma imagem primária por produto
CREATE OR REPLACE FUNCTION ensure_single_primary_image()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_primary = TRUE THEN
        UPDATE product_images 
        SET is_primary = FALSE 
        WHERE product_id = NEW.product_id 
        AND id != NEW.id 
        AND is_primary = TRUE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ensure_single_primary_image
BEFORE INSERT OR UPDATE ON product_images
FOR EACH ROW
EXECUTE FUNCTION ensure_single_primary_image();

-- Comentários
COMMENT ON TABLE product_images IS 'Imagens de produtos armazenadas no Cloudinary';
COMMENT ON COLUMN product_images.cloudinary_public_id IS 'ID único no Cloudinary para manipulação';
COMMENT ON COLUMN product_images.is_primary IS 'Imagem principal do produto (apenas uma por produto)';
COMMENT ON COLUMN product_images.display_order IS 'Ordem de exibição na galeria';
COMMENT ON COLUMN product_images.thumbnail_url IS 'URL da miniatura (200x200) gerada pelo Cloudinary';
