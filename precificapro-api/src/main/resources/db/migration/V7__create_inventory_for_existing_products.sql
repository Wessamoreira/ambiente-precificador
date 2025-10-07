-- Migration para criar inventory para produtos existentes que não têm
-- Isso corrige produtos criados antes da implementação automática

-- Criar inventory para produtos que ainda não têm
INSERT INTO inventory (id, product_id, current_stock, min_stock, reserved_stock, available_stock, stock_status, created_at, updated_at, last_stock_check)
SELECT 
    gen_random_uuid(),
    p.id,
    0,  -- estoque inicial zero
    5,  -- estoque mínimo padrão
    0,  -- sem reserva
    0,  -- disponível zero
    'OUT_OF_STOCK',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM products p
LEFT JOIN inventory i ON i.product_id = p.id
WHERE i.id IS NULL;

-- Comentário
COMMENT ON TABLE inventory IS 'Inventário de produtos - Criado automaticamente para produtos existentes';
