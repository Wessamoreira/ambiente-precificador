-- Converter coluna stock_status de ENUM para VARCHAR
-- Solução definitiva para o problema de compatibilidade Hibernate 6.x + PostgreSQL ENUM

-- 1. Alterar a coluna para VARCHAR
ALTER TABLE inventory ALTER COLUMN stock_status TYPE VARCHAR(20);

-- 2. Dropar o tipo ENUM (não é mais necessário)
DROP TYPE IF EXISTS stock_status CASCADE;

-- 3. Comentário
COMMENT ON COLUMN inventory.stock_status IS 'Status do estoque (IN_STOCK, LOW_STOCK, OUT_OF_STOCK) - VARCHAR para compatibilidade com Hibernate';
