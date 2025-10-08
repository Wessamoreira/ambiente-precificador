# 🚀 GUIA COMPLETO DE DEPLOY - PRECIFICAPRO

## 📋 Visão Geral

Este guia detalha o processo completo de deploy da aplicação PrecificaPro em produção:
- **Backend (API Spring Boot)**: Render.com
- **Banco de Dados**: PostgreSQL no Render.com
- **Frontend (React + Vite)**: Netlify

---

## 🎯 Pré-requisitos

### Contas Necessárias

1. **Render.com** (https://render.com)
   - Criar conta gratuita
   - Free tier: 750 horas/mês
   
2. **Netlify** (https://netlify.com)
   - Criar conta gratuita
   - 100GB bandwidth/mês

3. **GitHub** (opcional, mas recomendado)
   - Para deploy automático via Git

### Chaves de API Externas

Você precisará das seguintes chaves:
- ✅ **Gemini API Key** (Google AI)
- ✅ **Cloudinary** (cloud_name, api_key, api_secret)
- ⚠️ **Google Drive** (opcional para backup)

---

## 📦 PARTE 1: DEPLOY DO BANCO DE DADOS (RENDER)

### 1.1. Criar PostgreSQL no Render

1. Acesse https://dashboard.render.com
2. Clique em **"New +"** → **"PostgreSQL"**
3. Configure:
   ```
   Name: precificapro-db
   Database: precificapro_db
   User: precificapro_user
   Region: Oregon (US West)
   PostgreSQL Version: 16
   Plan: Free
   ```
4. Clique em **"Create Database"**
5. **IMPORTANTE**: Anote as credenciais:
   - Internal Database URL
   - External Database URL
   - Username
   - Password

### 1.2. Verificar Conexão

Após criação (aguarde ~2-3 minutos):
```bash
# Testar conexão via psql (opcional)
psql -h <hostname> -U precificapro_user -d precificapro_db
```

---

## 🔧 PARTE 2: DEPLOY DO BACKEND (RENDER)

### 2.1. Preparar Repositório Git

Se ainda não fez, inicialize o Git:

```bash
cd /Users/macbook/Desktop/ambiente-procificador
git init
git add .
git commit -m "Preparar para deploy em produção"
```

**Push para GitHub:**
```bash
# Criar repositório no GitHub primeiro
git remote add origin https://github.com/SEU_USUARIO/precificapro.git
git branch -M main
git push -u origin main
```

### 2.2. Deploy no Render

#### Opção A: Via Dashboard (Recomendado)

1. Acesse https://dashboard.render.com
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório GitHub
4. Configure:

```yaml
Name: precificapro-api
Region: Oregon (US West)
Branch: main
Root Directory: precificapro-api
Runtime: Docker
Plan: Free

Build Command: (deixe vazio, usa Dockerfile)
Start Command: (deixe vazio, usa ENTRYPOINT do Dockerfile)
```

### 2.3. Configurar Variáveis de Ambiente

No Render Dashboard → **"Environment"**, adicione:

#### Variáveis Obrigatórias:

```bash
# Spring Profile
SPRING_PROFILES_ACTIVE=prod

# Database (Render conecta automaticamente)
DATABASE_URL=<URL do PostgreSQL criado anteriormente>

# JWT Configuration
JWT_SECRET_KEY=<gerar uma chave secreta forte de 64+ caracteres>
JWT_EXPIRATION_MS=3600000
JWT_REFRESH_EXPIRATION_MS=86400000

# Gemini AI
GEMINI_API_KEY=<sua chave do Gemini>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<seu cloud name>
CLOUDINARY_API_KEY=<sua api key>
CLOUDINARY_API_SECRET=<seu api secret>

# CORS (atualizar depois do deploy do frontend)
CORS_ALLOWED_ORIGINS=https://seu-app.netlify.app

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_DURATION=60
```

#### Variáveis Opcionais (Google Drive Backup):

```bash
GOOGLE_DRIVE_CREDENTIALS_JSON=<credenciais JSON>
GOOGLE_DRIVE_BACKUP_FOLDER_ID=<folder ID>
BACKUP_RETENTION_DAYS=30
BACKUP_AUTOMATIC_ENABLED=false
```

### 2.4. Gerar JWT Secret Key

Execute localmente para gerar uma chave forte:

```bash
# Opção 1: OpenSSL
openssl rand -base64 64

# Opção 2: Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# Opção 3: Python
python3 -c "import secrets; print(secrets.token_urlsafe(64))"
```

### 2.5. Iniciar Deploy

1. Clique em **"Create Web Service"**
2. Aguarde o build (~5-10 minutos na primeira vez)
3. Após sucesso, anote a URL: `https://precificapro-api.onrender.com`

### 2.6. Verificar Deployment

```bash
# Health Check
curl https://precificapro-api.onrender.com/actuator/health

# Swagger UI
https://precificapro-api.onrender.com/swagger-ui.html

# API Docs
https://precificapro-api.onrender.com/v3/api-docs
```

---

## 🎨 PARTE 3: DEPLOY DO FRONTEND (NETLIFY)

### 3.1. Preparar Build Local (Teste)

```bash
cd precificapro-frontend

# Criar arquivo .env.production
cat > .env.production << EOF
VITE_API_BASE_URL=https://precificapro-api.onrender.com
VITE_ENV=production
EOF

# Testar build
npm run build

# Verificar dist/
ls -la dist/
```

### 3.2. Deploy no Netlify

#### Opção A: Via Dashboard (Recomendado)

1. Acesse https://app.netlify.com
2. Clique em **"Add new site"** → **"Import an existing project"**
3. Conecte GitHub e selecione o repositório
4. Configure:

```yaml
Base directory: precificapro-frontend
Build command: npm run build
Publish directory: precificapro-frontend/dist
Branch: main
```

### 3.3. Configurar Variáveis de Ambiente no Netlify

No Netlify Dashboard → **"Site settings"** → **"Environment variables"**:

```bash
VITE_API_BASE_URL=https://precificapro-api.onrender.com
VITE_ENV=production
```

### 3.4. Deploy

1. Clique em **"Deploy site"**
2. Aguarde build (~2-3 minutos)
3. Anote a URL: `https://seu-app-random.netlify.app`

### 3.5. Configurar Domínio Personalizado (Opcional)

1. **Site settings** → **"Domain management"**
2. **"Add custom domain"**
3. Siga instruções para configurar DNS

---

## 🔄 PARTE 4: ATUALIZAR CORS NO BACKEND

**IMPORTANTE**: Após obter a URL do Netlify, atualize o CORS no Render:

1. Acesse Render Dashboard → precificapro-api
2. **Environment** → Edite `CORS_ALLOWED_ORIGINS`
3. Valor: `https://seu-app.netlify.app`
4. **Save Changes** → Aguarde redeploy automático

---

## ✅ PARTE 5: VALIDAÇÃO COMPLETA

### 5.1. Checklist Backend

```bash
# 1. Health check
curl https://precificapro-api.onrender.com/actuator/health

# 2. Metrics
curl https://precificapro-api.onrender.com/actuator/metrics

# 3. Info
curl https://precificapro-api.onrender.com/actuator/info

# 4. Swagger UI
open https://precificapro-api.onrender.com/swagger-ui.html
```

### 5.2. Checklist Frontend

1. Acesse `https://seu-app.netlify.app`
2. Teste login/registro
3. Teste navegação entre páginas
4. Verifique console do browser (F12) - não deve ter erros
5. Teste upload de imagens
6. Teste dashboard e gráficos

### 5.3. Testar Integração Completa

1. **Criar usuário** via frontend
2. **Fazer login**
3. **Criar categoria**
4. **Criar produto** com imagem
5. **Testar AI** (análise de precificação)
6. **Verificar dashboard**

---

## 📊 PARTE 6: MONITORAMENTO

### 6.1. Render Monitoring

- Dashboard → precificapro-api → **"Metrics"**
- CPU, Memory, Disk usage
- Request rate, Response time

### 6.2. Netlify Analytics

- Site overview → **"Analytics"**
- Pageviews, Bandwidth, Requests

### 6.3. Logs

**Render Logs:**
```
Dashboard → precificapro-api → "Logs" (real-time)
```

**Netlify Logs:**
```
Dashboard → seu-site → "Functions" → "Logs"
```

---

## 🚨 TROUBLESHOOTING

### Backend não inicia

**Erro: Database connection failed**
```bash
# Verificar DATABASE_URL no Render
# Deve ser: postgresql://user:password@host:port/database

# Testar conexão
psql $DATABASE_URL
```

**Erro: Port binding**
```bash
# Render usa variável PORT automaticamente
# application-prod.properties deve ter:
server.port=${PORT:8080}
```

**Erro: Out of Memory**
```bash
# Verificar Dockerfile - JVM settings:
-XX:MaxRAMPercentage=75.0
```

### Frontend não conecta ao Backend

**CORS Error:**
```bash
# 1. Verificar CORS_ALLOWED_ORIGINS no Render
# 2. Deve incluir URL exata do Netlify (https, sem / no final)
# 3. Exemplo: https://precificapro.netlify.app
```

**API_BASE_URL incorreta:**
```bash
# Netlify Environment Variables:
VITE_API_BASE_URL=https://precificapro-api.onrender.com
```

### Render Free Tier - Sleep Mode

⚠️ **Importante**: Render Free tier hiberna após 15 minutos de inatividade.

**Consequências:**
- Primeira requisição após sleep: ~30-60 segundos
- Não recomendado para produção real

**Soluções:**
1. Upgrade para plano pago ($7/mês)
2. Keep-alive ping service (violar TOS)
3. Aceitar cold starts

---

## 💰 CUSTOS

### Free Tier Limits

**Render:**
- ✅ 750 horas/mês web service
- ✅ PostgreSQL 90 dias free, depois $7/mês
- ⚠️ Sleep após 15min inatividade
- ⚠️ 512MB RAM

**Netlify:**
- ✅ 100GB bandwidth/mês
- ✅ 300 build minutes/mês
- ✅ Deploy ilimitados

**Total: $0-7/mês** (apenas PostgreSQL após 90 dias)

---

## 🔐 SEGURANÇA

### Checklist de Segurança

- ✅ JWT secret com 64+ caracteres aleatórios
- ✅ Variáveis sensíveis apenas no Render/Netlify Dashboard
- ✅ CORS configurado com URL específica
- ✅ Rate limiting ativado
- ✅ HTTPS obrigatório (Render e Netlify fornecem)
- ✅ Senhas hasheadas (BCrypt)
- ⚠️ Nunca commitar .env com credenciais reais

### Rotação de Credenciais

**JWT Secret:**
```bash
# Gerar nova chave
openssl rand -base64 64

# Atualizar no Render → invalida todos os tokens ativos
```

**Database Password:**
```bash
# Render Dashboard → Database → Settings → Reset Password
# Atualizar DATABASE_URL no Web Service
```

---

## 🔄 DEPLOY CONTÍNUO (CI/CD)

### Git Workflow

```bash
# Desenvolvimento local
git checkout -b feature/nova-funcionalidade
# ... fazer alterações ...
git commit -m "feat: adicionar nova funcionalidade"
git push origin feature/nova-funcionalidade

# Merge na main → deploy automático
git checkout main
git merge feature/nova-funcionalidade
git push origin main

# Render e Netlify fazem deploy automático da branch main!
```

### Rollback

**Render:**
```
Dashboard → Deploys → Selecionar deploy anterior → "Redeploy"
```

**Netlify:**
```
Deploys → Selecionar deploy anterior → "Publish deploy"
```

---

## 📝 CHECKLIST FINAL

### Antes do Deploy

- [ ] Backend compila localmente sem erros
- [ ] Frontend builda sem erros (`npm run build`)
- [ ] Migrations Flyway estão corretas
- [ ] Todas as variáveis de ambiente estão documentadas
- [ ] Dockerfile testado localmente
- [ ] CORS configurado corretamente

### Durante o Deploy

- [ ] PostgreSQL criado no Render
- [ ] Backend deployado no Render
- [ ] Variáveis de ambiente configuradas
- [ ] Frontend deployado no Netlify
- [ ] CORS atualizado com URL do Netlify

### Após o Deploy

- [ ] Health check do backend responde
- [ ] Swagger UI acessível
- [ ] Frontend carrega corretamente
- [ ] Login/Registro funcionando
- [ ] Upload de imagens funcionando
- [ ] AI funcionando (Gemini)
- [ ] Dashboard com dados

---

## 🆘 SUPORTE

### Recursos Úteis

- **Render Docs**: https://render.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Spring Boot**: https://spring.io/guides
- **Vite**: https://vitejs.dev/guide

### Community

- Render Community: https://community.render.com
- Netlify Community: https://answers.netlify.com

---

## 🎉 PRÓXIMOS PASSOS

Após deploy bem-sucedido:

1. **Monitoramento**: Configurar alertas (Render + Netlify)
2. **Domínio Personalizado**: Registrar domínio próprio
3. **Analytics**: Google Analytics, Hotjar
4. **SEO**: Meta tags, sitemap.xml
5. **Performance**: Lighthouse audit
6. **Backup**: Verificar rotina de backup do Google Drive
7. **Upgrade**: Considerar planos pagos para produção real

---

**Última atualização**: 2025-01-07
**Versão**: 1.0.0
