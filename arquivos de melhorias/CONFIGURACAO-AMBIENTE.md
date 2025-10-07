# 🔐 GUIA DE CONFIGURAÇÃO - Variáveis de Ambiente

**IMPORTANTE**: Nunca commitar o arquivo `.env` com credenciais reais!

---

## 📋 Passo 1: Criar Arquivo .env

Crie o arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```bash
# ==========================================
# VARIÁVEIS DE AMBIENTE - PrecificaPro API
# ATENÇÃO: Nunca commitar este arquivo!
# ==========================================

# ============ BANCO DE DADOS ============
DB_URL=jdbc:postgresql://localhost:5433/precificapro_db
DB_USERNAME=postgres_user
DB_PASSWORD=SUA_SENHA_POSTGRES_AQUI

# ============ JWT SECURITY ============
# JWT Secret (256+ bits recomendado)
# GERE UMA NOVA: python3 -c "import secrets; print(secrets.token_urlsafe(64))"
JWT_SECRET=SUA_JWT_SECRET_AQUI_MINIMO_256_BITS

# JWT Expiração (em milissegundos)
JWT_EXPIRATION_MS=3600000
JWT_REFRESH_EXPIRATION_MS=86400000

# ============ API GEMINI ============
# Obtenha em: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=SUA_GEMINI_API_KEY_AQUI

# ============ CORS ============
# Múltiplas origens separadas por vírgula
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# ============ OUTROS ============
SHOW_SQL=false
```

---

## 🔑 Passo 2: Gerar Credenciais Seguras

### **JWT Secret (CRÍTICO)**

Execute no terminal:
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(64))"
```

**OU** usando OpenSSL:
```bash
openssl rand -base64 64 | tr -d '\n' && echo
```

**Exemplo de saída**:
```
xK7mP9vQ2wN5tR8uE1lY6sA3dF0gH4jM7nB9cV1xZ2pW3qS5rT7yU9kL0mO6iP8aQ4bR2cS5tU7vW9xY1zN3h
```

### **Senha do Banco de Dados**

Execute no terminal:
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Exemplo de saída**:
```
mN7pQ2rS5tU8vW0xY3zA6bC9dE1fG4hJ
```

### **API Key Gemini**

1. Acesse: https://makersuite.google.com/app/apikey
2. Clique em "Create API Key"
3. Copie a chave gerada

**Formato esperado**:
```
AIzaSyAaaBBBcccDDDeeeFFFgggHHHiiiJJJkkk
```

---

## 📝 Passo 3: Exemplo Completo do .env

```bash
# ==========================================
# VARIÁVEIS DE AMBIENTE - PrecificaPro API
# ==========================================

# BANCO DE DADOS
DB_URL=jdbc:postgresql://localhost:5433/precificapro_db
DB_USERNAME=postgres_user
DB_PASSWORD=mN7pQ2rS5tU8vW0xY3zA6bC9dE1fG4hJ

# JWT SECURITY
JWT_SECRET=xK7mP9vQ2wN5tR8uE1lY6sA3dF0gH4jM7nB9cV1xZ2pW3qS5rT7yU9kL0mO6iP8aQ4bR2cS5tU7vW9xY1zN3h
JWT_EXPIRATION_MS=3600000
JWT_REFRESH_EXPIRATION_MS=86400000

# API GEMINI
GEMINI_API_KEY=AIzaSyAaaBBBcccDDDeeeFFFgggHHHiiiJJJkkk

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173

# DEBUG
SHOW_SQL=false
```

---

## 🚀 Passo 4: Configurar no Eclipse/IntelliJ

### **Opção A: Usando arquivo .env (Recomendado)**

1. Instale plugin "EnvFile" (IntelliJ) ou "launch-config-env-var" (Eclipse)
2. Configure para ler `.env` automaticamente

### **Opção B: Configurar manualmente na IDE**

#### **Eclipse**:
1. Right-click no projeto → `Run As` → `Run Configurations...`
2. Aba `Environment`
3. Clique em `Add...` para cada variável:
   - Name: `DB_PASSWORD`
   - Value: `sua_senha_aqui`
4. Repita para todas as variáveis

#### **IntelliJ IDEA**:
1. `Run` → `Edit Configurations...`
2. `Environment variables:` → Clique no ícone de pasta
3. Adicione cada variável

### **Opção C: Exportar no terminal (Temporário)**

```bash
export DB_PASSWORD="mN7pQ2rS5tU8vW0xY3zA6bC9dE1fG4hJ"
export JWT_SECRET="xK7mP9vQ2wN5tR8uE1lY6sA3dF0gH4jM7nB9cV1xZ2pW3qS5rT7yU9kL0mO6iP8aQ4bR2cS5tU7vW9xY1zN3h"
export GEMINI_API_KEY="AIzaSyAaaBBBcccDDDeeeFFFgggHHHiiiJJJkkk"
export CORS_ALLOWED_ORIGINS="http://localhost:5173"

# Rodar aplicação no mesmo terminal
mvn spring-boot:run
```

---

## ✅ Passo 5: Verificar Configuração

Execute a aplicação e verifique os logs:

```bash
mvn spring-boot:run
```

**Logs esperados**:
```
✅ Flyway migrations applied successfully
✅ HikariPool-1 - Start completed
✅ Started PrecificaproApiApplication in 5.234 seconds
```

**Se algo der errado**:
```
❌ Error creating bean with name 'dataSource'
   → Verifique DB_PASSWORD

❌ JWT secret key must not be null
   → Verifique JWT_SECRET

❌ Invalid API key
   → Verifique GEMINI_API_KEY
```

---

## 🔒 Segurança - IMPORTANTE!

### **NÃO FAÇA**:
- ❌ Commitar arquivo `.env`
- ❌ Compartilhar credenciais por email/Slack
- ❌ Usar mesma senha em dev/prod
- ❌ Colocar credenciais em logs

### **FAÇA**:
- ✅ Adicionar `.env` ao `.gitignore` (já está!)
- ✅ Gerar credenciais diferentes para cada ambiente
- ✅ Rotacionar JWT_SECRET periodicamente
- ✅ Usar secrets manager em produção (AWS Secrets, Azure Key Vault)

---

## 📊 Tabela de Variáveis

| Variável | Obrigatório | Padrão | Descrição |
|----------|-------------|--------|-----------|
| `DB_URL` | ⚠️ | `jdbc:postgresql://localhost:5433/precificapro_db` | URL do PostgreSQL |
| `DB_USERNAME` | ⚠️ | `postgres_user` | Usuário do banco |
| `DB_PASSWORD` | ✅ **SIM** | - | Senha do banco |
| `JWT_SECRET` | ✅ **SIM** | - | Chave secreta JWT (256+ bits) |
| `JWT_EXPIRATION_MS` | ⚠️ | `3600000` | Expiração token (1h) |
| `JWT_REFRESH_EXPIRATION_MS` | ⚠️ | `86400000` | Expiração refresh (24h) |
| `GEMINI_API_KEY` | ✅ **SIM** | - | API Key do Google Gemini |
| `CORS_ALLOWED_ORIGINS` | ⚠️ | `http://localhost:5173` | Origens permitidas |
| `SHOW_SQL` | ⚠️ | `false` | Mostrar SQL nos logs |

---

## 🆘 Troubleshooting

### **Erro: "DB_PASSWORD not found"**
```bash
# Verifique se variável está definida
echo $DB_PASSWORD

# Se vazio, defina:
export DB_PASSWORD="sua_senha"
```

### **Erro: "JWT secret key must not be null"**
```bash
# Gere nova chave
python3 -c "import secrets; print(secrets.token_urlsafe(64))"

# Configure
export JWT_SECRET="chave_gerada"
```

### **Erro: "Connection refused" (PostgreSQL)**
```bash
# Verifique se PostgreSQL está rodando
docker ps

# Se não estiver, inicie
docker-compose up -d
```

---

## 🚀 Deploy em Produção

### **Heroku**:
```bash
heroku config:set DB_PASSWORD="senha_prod"
heroku config:set JWT_SECRET="chave_prod"
heroku config:set GEMINI_API_KEY="key_prod"
```

### **AWS Elastic Beanstalk**:
```bash
eb setenv DB_PASSWORD="senha_prod" JWT_SECRET="chave_prod"
```

### **Docker**:
```dockerfile
# docker-compose.yml
environment:
  - DB_PASSWORD=${DB_PASSWORD}
  - JWT_SECRET=${JWT_SECRET}
  - GEMINI_API_KEY=${GEMINI_API_KEY}
```

---

**Configuração completa!** 🎉
