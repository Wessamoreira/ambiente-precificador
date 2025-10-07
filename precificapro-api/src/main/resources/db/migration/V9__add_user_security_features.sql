-- Adicionar colunas de segurança na tabela users
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_non_locked BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_failed_login TIMESTAMP WITH TIME ZONE;

-- Atualizar usuários existentes
UPDATE users SET 
    account_non_locked = TRUE,
    enabled = TRUE,
    failed_login_attempts = 0
WHERE account_non_locked IS NULL 
   OR enabled IS NULL 
   OR failed_login_attempts IS NULL;

-- Criar tabela de roles dos usuários
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL,
    role VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, role),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Adicionar role USER para todos os usuários existentes
INSERT INTO user_roles (user_id, role)
SELECT id, 'USER' FROM users
WHERE NOT EXISTS (
    SELECT 1 FROM user_roles WHERE user_roles.user_id = users.id
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_account_locked ON users(account_non_locked);
