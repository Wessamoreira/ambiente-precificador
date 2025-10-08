# ⚡ DEPLOY RÁPIDO - PRECIFICAPRO

## 🎯 Resumo: 3 Passos Principais

1. **Deploy do Banco de Dados** (Render) - 5 min
2. **Deploy do Backend** (Render) - 10 min
3. **Deploy do Frontend** (Netlify) - 5 min

**Tempo total: ~20 minutos**

---

## 📦 PASSO 1: BANCO DE DADOS (5 min)

### 1.1. Render Dashboard
```
https://dashboard.render.com
→ New + → PostgreSQL
```

### 1.2. Configuração
```
Name: precificapro-db
Database: precificapro_db
User: precificapro_user
Region: Oregon
Plan: Free
```

### 1.3. Criar
- Clique "Create Database"
- **Copie o "Internal Database URL"** → vai precisar no Passo 2

---

## 🔧 PASSO 2: BACKEND (10 min)

### 2.1. Push para GitHub
```bash
cd /Users/macbook/Desktop/ambiente-procificador
git init
git add .
git commit -m "Deploy inicial"
git remote add origin https://github.com/SEU_USUARIO/precificapro.git
git push -u origin main
```

### 2.2. Render Dashboard
```
https://dashboard.render.com
→ New + → Web Service
→ Connect GitHub → Selecionar repositório
```

### 2.3. Configuração
```
Name: precificapro-api
Region: Oregon
Branch: main
Root Directory: precificapro-api
Runtime: Docker
Plan: Free
```

### 2.4. Environment Variables

**Clique em "Advanced" → "Add Environment Variable"**

```bash
# 1. Spring Profile
SPRING_PROFILES_ACTIVE=prod

# 2. Database (colar URL do Passo 1.3)
DATABASE_URL=<URL do PostgreSQL>

# 3. JWT Secret (gerar com comando abaixo)
JWT_SECRET_KEY=<64 caracteres aleatórios>
JWT_EXPIRATION_MS=3600000
JWT_REFRESH_EXPIRATION_MS=86400000

# 4. Gemini AI
GEMINI_API_KEY=AIzaSyCouwY0866wvRw-i_gzqHh3LsBhdc1GVh0

# 5. Cloudinary
CLOUDINARY_CLOUD_NAME=dnobqdrop
CLOUDINARY_API_KEY=715744692319414
CLOUDINARY_API_SECRET=Pu2Ysw3PqWxYKzBQ10NayGyIC38

# 6. CORS (atualizar depois com URL do Netlify)
CORS_ALLOWED_ORIGINS=https://localhost:5173

# 7. Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_DURATION=60
```

**Gerar JWT_SECRET_KEY:**
```bash
openssl rand -base64 64
```

### 2.5. Deploy
- Clique "Create Web Service"
- Aguarde build (~5-10 min)
- **Copie a URL**: `https://precificapro-api.onrender.com`

### 2.6. Testar
```bash
curl https://precificapro-api.onrender.com/actuator/health
```

Deve retornar: `{"status":"UP"}`

---

## 🎨 PASSO 3: FRONTEND (5 min)

### 3.1. Netlify Dashboard
```
https://app.netlify.com
→ Add new site → Import from Git
→ GitHub → Selecionar repositório
```

### 3.2. Configuração
```
Base directory: precificapro-frontend
Build command: npm run build
Publish directory: precificapro-frontend/dist
Branch: main
```

### 3.3. Environment Variables

**Antes de "Deploy":**

```
Site settings → Environment variables → Add variable
```

```bash
VITE_API_BASE_URL=https://precificapro-api.onrender.com
VITE_ENV=production
```

### 3.4. Deploy
- Clique "Deploy site"
- Aguarde build (~2-3 min)
- **Copie a URL**: `https://seu-app-random.netlify.app`

### 3.5. Atualizar CORS no Backend

**IMPORTANTE!**

1. Volte ao Render Dashboard → precificapro-api
2. Environment → Edite `CORS_ALLOWED_ORIGINS`
3. Valor: `https://seu-app.netlify.app` (URL copiada no 3.4)
4. Save → Aguarde redeploy (~2 min)

---

## ✅ VALIDAÇÃO FINAL

### Backend
```bash
# Health
curl https://precificapro-api.onrender.com/actuator/health

# Swagger
open https://precificapro-api.onrender.com/swagger-ui.html
```

### Frontend
1. Abra `https://seu-app.netlify.app`
2. Registre um usuário
3. Faça login
4. Crie uma categoria
5. Crie um produto
6. Teste o dashboard

---

## 🚨 PROBLEMAS COMUNS

### Backend não inicia

**Erro: Connection refused**
- Verificar DATABASE_URL está correto
- Formato: `postgresql://user:password@host:port/database`

**Erro: Port binding**
- Verificar se tem `server.port=${PORT:8080}` no application-prod.properties

### Frontend não conecta

**CORS Error:**
- Verificar `CORS_ALLOWED_ORIGINS` no Render
- Deve ser URL exata do Netlify (com https, sem / no final)

**API não responde:**
- Render free tier hiberna após 15min
- Primeira request demora ~30-60s (cold start)

---

## 📝 URLS IMPORTANTES

Após deploy completo:

```
Backend API: https://precificapro-api.onrender.com
Backend Swagger: https://precificapro-api.onrender.com/swagger-ui.html
Frontend: https://seu-app.netlify.app

Render Dashboard: https://dashboard.render.com
Netlify Dashboard: https://app.netlify.com
```

---

## 🔄 DEPLOY CONTÍNUO

Agora cada push na branch `main` faz deploy automático:

```bash
git add .
git commit -m "Nova funcionalidade"
git push origin main

# Render e Netlify deployam automaticamente!
```

---

## 💰 CUSTOS

- **Primeiros 90 dias**: $0 (tudo gratuito)
- **Após 90 dias**: $7/mês (apenas PostgreSQL)
- **Render Web Service**: Free com limitações (sleep após 15min)
- **Netlify**: Free permanente

---

## 📞 PRÓXIMOS PASSOS

1. ✅ Teste completo da aplicação
2. 📊 Monitorar logs (Render + Netlify)
3. 🌐 Configurar domínio personalizado
4. 📈 Analytics (Google Analytics)
5. 🔒 Rotação de credenciais
6. 💾 Configurar backup Google Drive

---

**Dúvidas?** Consulte o [GUIA-DEPLOY-PRODUCAO.md](./GUIA-DEPLOY-PRODUCAO.md) completo.
