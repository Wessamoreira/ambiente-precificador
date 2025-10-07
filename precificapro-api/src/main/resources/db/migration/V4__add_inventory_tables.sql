-- Enum para status de estoque
CREATE TYPE stock_status AS ENUM ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK');

-- Tabela de inventário
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL UNIQUE,
    current_stock INT NOT NULL DEFAULT 0,
    min_stock INT NOT NULL DEFAULT 5,
    reserved_stock INT NOT NULL DEFAULT 0,
    available_stock INT NOT NULL DEFAULT 0,
    stock_status stock_status NOT NULL DEFAULT 'OUT_OF_STOCK',
    last_stock_check TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_inventory_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT check_current_stock_positive CHECK (current_stock >= 0),
    CONSTRAINT check_min_stock_positive CHECK (min_stock >= 0),
    CONSTRAINT check_reserved_stock_positive CHECK (reserved_stock >= 0)
);

-- Tabela de movimentações de estoque
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_id UUID NOT NULL,
    product_id UUID NOT NULL,
    type VARCHAR(20) NOT NULL,
    quantity INT NOT NULL,
    reason VARCHAR(100) NOT NULL,
    notes TEXT,
    performed_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_stock_movement_inventory FOREIGN KEY (inventory_id) 
        REFERENCES inventory(id) ON DELETE CASCADE,
    CONSTRAINT fk_stock_movement_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_stock_movement_user FOREIGN KEY (performed_by) 
        REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT check_quantity_positive CHECK (quantity > 0)
);

-- Índices para performance
CREATE INDEX idx_inventory_product_id ON inventory(product_id);
CREATE INDEX idx_inventory_stock_status ON inventory(stock_status);
CREATE INDEX idx_stock_movements_inventory_id ON stock_movements(inventory_id);
CREATE INDEX idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_created_at ON stock_movements(created_at DESC);

-- Trigger para atualizar available_stock automaticamente
CREATE OR REPLACE FUNCTION update_available_stock()
RETURNS TRIGGER AS $$
BEGIN
    NEW.available_stock = NEW.current_stock - NEW.reserved_stock;
    
    -- Atualizar status automaticamente
    IF NEW.current_stock = 0 THEN
        NEW.stock_status = 'OUT_OF_STOCK';
    ELSIF NEW.current_stock <= NEW.min_stock THEN
        NEW.stock_status = 'LOW_STOCK';
    ELSE
        NEW.stock_status = 'IN_STOCK';
    END IF;
    
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_available_stock
BEFORE INSERT OR UPDATE ON inventory
FOR EACH ROW
EXECUTE FUNCTION update_available_stock();

-- Comentários
COMMENT ON TABLE inventory IS 'Controle de estoque de produtos';
COMMENT ON TABLE stock_movements IS 'Histórico de movimentações de estoque';
COMMENT ON COLUMN inventory.available_stock IS 'Estoque atual - reservado';
COMMENT ON COLUMN inventory.reserved_stock IS 'Estoque reservado em vendas';
COMMENT ON COLUMN stock_movements.type IS 'IN (entrada) ou OUT (saída)';
