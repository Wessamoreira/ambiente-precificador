-- Tabela de categorias
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    owner_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_categories_owner FOREIGN KEY (owner_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_category_name_owner UNIQUE (name, owner_id)
);

-- Índices
CREATE INDEX idx_categories_owner_id ON categories(owner_id);
CREATE INDEX idx_categories_name ON categories(name);

-- Adicionar categoria_id na tabela products
ALTER TABLE products ADD COLUMN category_id UUID;
ALTER TABLE products ADD CONSTRAINT fk_products_category 
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
CREATE INDEX idx_products_category_id ON products(category_id);

-- Comentários
COMMENT ON TABLE categories IS 'Categorias de produtos';
COMMENT ON COLUMN categories.icon IS 'Nome do ícone (ex: Package, Box, etc)';
COMMENT ON COLUMN categories.color IS 'Cor hexadecimal para identificação visual';
