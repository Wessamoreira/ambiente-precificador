-- Script para corrigir o erro da migration V12
-- Execute este script manualmente no PostgreSQL

-- 1. Remover a entrada com falha do histórico do Flyway
DELETE FROM flyway_schema_history WHERE version = '12';

-- 2. Verificar se a tabela backup_metadata foi criada parcialmente
DROP TABLE IF EXISTS backup_metadata CASCADE;

-- Pronto! Agora você pode reiniciar a aplicação Spring Boot
-- A migration V12 será executada novamente com a correção (UUID ao invés de BIGINT)
