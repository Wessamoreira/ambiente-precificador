-- =====================================================
-- MIGRATION V13: Índices de Performance (SIMPLIFICADO)
-- Apenas índices essenciais em tabelas principais
-- =====================================================

-- Índices básicos por owner nas tabelas principais
CREATE INDEX IF NOT EXISTS idx_product_owner ON products(owner_id);
CREATE INDEX IF NOT EXISTS idx_sale_owner ON sales(owner_id);
CREATE INDEX IF NOT EXISTS idx_customer_owner ON customers(owner_id);
CREATE INDEX IF NOT EXISTS idx_category_owner ON categories(owner_id);
CREATE INDEX IF NOT EXISTS idx_cost_item_owner ON cost_items(owner_id);

-- Índice composto para busca rápida de produtos por SKU
CREATE INDEX IF NOT EXISTS idx_product_sku_owner ON products(sku, owner_id);

-- Atualiza estatísticas para o query planner
ANALYZE products;
ANALYZE sales;
ANALYZE customers;
ANALYZE categories;
