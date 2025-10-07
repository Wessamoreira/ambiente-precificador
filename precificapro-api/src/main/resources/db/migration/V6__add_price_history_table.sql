-- Tabela de histórico de preços
CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    
    -- Preços
    suggested_price DECIMAL(10,2) NOT NULL,
    actual_price DECIMAL(10,2),
    
    -- Perfil usado
    pricing_profile_id UUID,
    pricing_profile_name VARCHAR(100),
    
    -- Custos snapshot
    purchase_cost DECIMAL(10,2),
    packaging_cost DECIMAL(10,2),
    other_variable_cost DECIMAL(10,2),
    freight_cost_unit DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    
    -- Métricas calculadas
    net_profit_per_unit DECIMAL(10,2),
    net_profit_percentage DECIMAL(5,2),
    markup_applied DECIMAL(5,2),
    margin_on_price DECIMAL(5,2),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    notes TEXT,
    
    CONSTRAINT fk_price_history_product 
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_price_history_profile 
        FOREIGN KEY (pricing_profile_id) REFERENCES pricing_profiles(id) ON DELETE SET NULL,
    CONSTRAINT fk_price_history_user 
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Índices para performance
CREATE INDEX idx_price_history_product_date ON price_history(product_id, created_at DESC);
CREATE INDEX idx_price_history_created_at ON price_history(created_at);
CREATE INDEX idx_price_history_profile ON price_history(pricing_profile_id);
CREATE INDEX idx_price_history_product_id ON price_history(product_id);

-- Comentários
COMMENT ON TABLE price_history IS 'Histórico completo de precificações com snapshot de custos e métricas';
COMMENT ON COLUMN price_history.suggested_price IS 'Preço sugerido pela simulação';
COMMENT ON COLUMN price_history.actual_price IS 'Preço realmente praticado (se diferente da sugestão)';
COMMENT ON COLUMN price_history.pricing_profile_name IS 'Nome do perfil usado (salvo para histórico)';
