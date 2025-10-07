# 🔧 CORREÇÃO - Senha do Banco de Dados

## ❌ Problema Identificado

A senha do PostgreSQL no arquivo `.env` está **incorreta**.

**Erro:**
```
FATAL: password authentication failed for user "postgres_user"
```

## ✅ Solução

Abra o arquivo `/precificapro-api/.env` e altere a linha:

### ❌ SENHA ERRADA (atual):
```bash
DB_PASSWORD=K7mP2vQ9wN8tR5uE4lY1sA6dF3gH0jM7nB2cV9xZ1pW8qS3rT6yU0kL5mO9iP2aQ7bR4cS1tU6vW3xY8zN0h
```

### ✅ SENHA CORRETA:
```bash
DB_PASSWORD=your_super_secret_password_12345
```

## 📝 Passos

1. **Abra o arquivo:**
   - Arquivo: `/Users/macbook/Documents/ambiente-procificador/precificapro-api/.env`
   - Linha: `10` (DB_PASSWORD)

2. **Substitua a senha:**
   ```bash
   DB_PASSWORD=your_super_secret_password_12345
   ```

3. **Salve o arquivo** (Cmd+S)

4. **Reinicie o backend:**
   ```bash
   cd precificapro-api
   export JAVA_HOME=$(/usr/libexec/java_home -v 21)
   mvn spring-boot:run
   ```

## 🎯 Após a correção

O backend irá:
- ✅ Conectar ao PostgreSQL
- ✅ Executar as migrations (incluindo a tabela `product_images`)
- ✅ Iniciar na porta 8080
- ✅ Estar pronto para upload de imagens via Cloudinary

---

**Data:** 06/10/2025 11:09
