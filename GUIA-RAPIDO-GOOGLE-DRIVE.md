# 🚀 Guia Rápido - Configurar Google Drive em 5 Minutos

## Passo a Passo Simplificado

### 1️⃣ Criar Projeto no Google Cloud (2 min)

1. Acesse: **https://console.cloud.google.com/**
2. No topo, clique em **"Select a project"** → **"NEW PROJECT"**
3. Nome do projeto: `precificapro-backup`
4. Clique em **"CREATE"**
5. Aguarde ~30 segundos até o projeto ser criado

---

### 2️⃣ Ativar Google Drive API (1 min)

1. No menu lateral (☰), vá em: **APIs & Services** → **Library**
2. Na busca, digite: `Google Drive API`
3. Clique no card **"Google Drive API"**
4. Clique no botão azul **"ENABLE"**
5. Aguarde ativar

---

### 3️⃣ Criar Credenciais OAuth 2.0 (2 min)

#### 3.1. Configure a Tela de Consentimento

1. Menu lateral: **APIs & Services** → **OAuth consent screen**
2. Escolha: **External** (ou Internal se tiver Google Workspace)
3. Clique **CREATE**
4. Preencha:
   - App name: `PrecificaPro Backup`
   - User support email: (seu email)
   - Developer contact: (seu email)
5. Clique **SAVE AND CONTINUE** (3x até finalizar)
6. Clique **BACK TO DASHBOARD**

#### 3.2. Criar Credencial

1. Menu lateral: **APIs & Services** → **Credentials**
2. Topo da página: **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Preencha:
   - Application type: **Desktop app**
   - Name: `Backup Client`
4. Clique **CREATE**
5. Uma janela aparece mostrando Client ID e Secret
6. Clique no ícone **⬇️ DOWNLOAD JSON** (canto direito)
7. Salve o arquivo (exemplo: `client_secret_123.json`)

---

### 4️⃣ Configurar no Sistema (30 seg)

#### 4.1. Abrir o arquivo JSON baixado

Abra o arquivo `client_secret_xxxxx.json` num editor de texto.

O conteúdo será algo assim:

```json
{
  "installed": {
    "client_id": "123456789-abcdefg.apps.googleusercontent.com",
    "project_id": "precificapro-backup",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "GOCSPX-xxxxxxxxxxxx",
    "redirect_uris": ["http://localhost"]
  }
}
```

#### 4.2. Copiar TODO o conteúdo (CTRL+A, CTRL+C)

#### 4.3. Adicionar no arquivo `.env`

No diretório do projeto `precificapro-api`, crie ou edite o arquivo `.env`:

```bash
# Cole o JSON INTEIRO numa linha só:
GOOGLE_DRIVE_CREDENTIALS_JSON={"installed":{"client_id":"123456789-abcdefg.apps.googleusercontent.com","project_id":"precificapro-backup","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"GOCSPX-xxxxxxxxxxxx","redirect_uris":["http://localhost"]}}

# Outras configs (opcional):
BACKUP_RETENTION_DAYS=30
BACKUP_AUTOMATIC_ENABLED=true
```

**⚠️ IMPORTANTE:** O JSON deve estar em **UMA LINHA SÓ**, sem quebras de linha!

---

### 5️⃣ Primeira Execução - Autorizar Acesso

1. **Inicie a aplicação:**
   ```bash
   cd precificapro-api
   ./mvnw spring-boot:run
   ```

2. **Na primeira vez que tentar fazer um backup**, o sistema abrirá automaticamente o navegador pedindo autorização

3. **Na página do Google:**
   - Faça login com sua conta Google
   - Pode aparecer "Google hasn't verified this app" → Clique em **"Advanced"** → **"Go to PrecificaPro Backup (unsafe)"**
   - Clique em **"Allow"** / **"Permitir"**

4. **Pronto!** Uma pasta `tokens/` será criada automaticamente com o token de acesso

5. **Não precisa autorizar novamente** - o token é salvo e renovado automaticamente

---

## ✅ Testar se Funcionou

### Teste 1: Verificar Status

```bash
curl -X GET http://localhost:8080/api/backups/status \
  -H "Authorization: Bearer SEU-TOKEN-JWT"
```

**Resposta esperada:**
```json
{
  "enabled": true,
  "message": "Serviço de backup configurado e ativo"
}
```

### Teste 2: Criar Backup Manual

```bash
curl -X POST http://localhost:8080/api/backups/create \
  -H "Authorization: Bearer SEU-TOKEN-JWT"
```

**Aguarde ~10-30 segundos...**

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Backup criado com sucesso",
  "backup": {
    "filename": "precificapro_backup_20251007_171500.sql",
    "fileSizeFormatted": "2.34 MB",
    "status": "COMPLETED"
  }
}
```

### Teste 3: Ver no Google Drive

1. Acesse: **https://drive.google.com/**
2. Procure por arquivos começando com `precificapro_backup_`
3. Você verá o backup que acabou de criar! 🎉

---

## 🎯 Configurações Opcionais

### Criar Pasta Específica no Drive

1. No Google Drive, crie uma pasta: `Backups PrecificaPro`
2. Entre na pasta
3. Na URL do navegador, copie o ID da pasta:
   ```
   https://drive.google.com/drive/folders/1a2B3c4D5e6F7g8H9i0J
                                           ^^^^^^^^^^^^^^^^^^^^
                                           Este é o Folder ID
   ```
4. Adicione no `.env`:
   ```bash
   GOOGLE_DRIVE_BACKUP_FOLDER_ID=1a2B3c4D5e6F7g8H9i0J
   ```
5. Reinicie a aplicação

**Agora os backups vão direto para essa pasta!**

---

## 🔧 Solução de Problemas

### "Credentials not configured"

❌ **Problema:** Variável `GOOGLE_DRIVE_CREDENTIALS_JSON` não está no `.env`

✅ **Solução:** Verifique se copiou o JSON completo, numa linha só, sem quebras

### "Invalid redirect_uri"

❌ **Problema:** OAuth Client não tem redirect configurado

✅ **Solução:**
1. Google Cloud Console → Credentials
2. Edite seu OAuth Client
3. Em "Authorized redirect URIs", adicione: `http://localhost`
4. Salve

### "pg_dump: command not found"

❌ **Problema:** PostgreSQL tools não instalados

✅ **Solução:**
```bash
# Linux/Ubuntu
sudo apt-get install postgresql-client

# Mac
brew install postgresql

# Verificar
pg_dump --version
```

### Navegador não abre automaticamente

❌ **Problema:** Servidor sem interface gráfica (Render, AWS, etc.)

✅ **Solução:**
Para servidores em produção, você precisa fazer a primeira autorização localmente:

1. Configure e autorize **localmente** primeiro (no seu computador)
2. Copie a pasta `tokens/` gerada para o servidor
3. Ou use Service Account (mais avançado)

---

## 📱 Resumo Final

| Item | Status | Tempo |
|------|--------|-------|
| ✅ Projeto criado | Completo | 2 min |
| ✅ API ativada | Completo | 1 min |
| ✅ Credenciais geradas | Completo | 2 min |
| ✅ Sistema configurado | Completo | 30 seg |
| ✅ Backup testado | Completo | - |

**Total: ~5 minutos** ⚡

---

## 🎉 Pronto!

Seu sistema agora:
- ✅ Faz backup automático todo dia às 3AM
- ✅ Salva no Google Drive (15GB grátis)
- ✅ Mantém histórico de 30 dias
- ✅ Permite restauração completa
- ✅ Limpa backups antigos automaticamente

**Seus dados estão seguros!** 🛡️
