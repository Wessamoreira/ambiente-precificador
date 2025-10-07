# 🔒 Sistema de Backup Automático - PrecificaPro

## 📋 Visão Geral

Sistema completo de backup automático que protege todos os dados do sistema (vendas, produtos, clientes, balanços, lucros, etc.) usando **Google Drive API com 15GB GRATUITOS**.

### ✨ Funcionalidades

- ✅ **Backup Automático Diário** (configurável)
- ✅ **Backup Manual** via API
- ✅ **Restauração Completa** do banco de dados
- ✅ **Armazenamento no Google Drive** (15GB grátis permanente)
- ✅ **Limpeza Automática** de backups antigos
- ✅ **Histórico de Backups** com rastreamento
- ✅ **Compressão PostgreSQL** nativa

---

## 🚀 Como Configurar

### Passo 1: Criar Projeto no Google Cloud

1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto (ex: "precificapro-backup")
3. Ative a **Google Drive API**:
   - Menu → APIs & Services → Library
   - Busque "Google Drive API" → Enable

### Passo 2: Criar Credenciais OAuth 2.0

1. Menu → APIs & Services → Credentials
2. Clique em **"+ CREATE CREDENTIALS"** → OAuth client ID
3. Configure:
   - Application type: **Desktop app**
   - Name: "PrecificaPro Backup Client"
4. Clique em **DOWNLOAD JSON**

### Passo 3: Configurar o Sistema

#### 3.1. Copiar conteúdo do JSON

Abra o arquivo JSON baixado e copie todo o conteúdo.

#### 3.2. Adicionar no arquivo `.env`

```bash
# No arquivo .env (criar se não existir)
GOOGLE_DRIVE_CREDENTIALS_JSON={"installed":{"client_id":"SEU_CLIENT_ID.apps.googleusercontent.com","project_id":"seu-projeto","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"SEU_CLIENT_SECRET","redirect_uris":["http://localhost"]}}

# Pasta específica no Google Drive (opcional)
GOOGLE_DRIVE_BACKUP_FOLDER_ID=

# Quantos dias manter backups (padrão: 30)
BACKUP_RETENTION_DAYS=30

# Ativar backup automático
BACKUP_AUTOMATIC_ENABLED=true

# Quando fazer backup (padrão: 3:00 AM todo dia)
# Formato: segundo minuto hora dia mês dia-da-semana
BACKUP_AUTOMATIC_CRON=0 0 3 * * *
```

#### 3.3. Primeira Autenticação

Na **primeira vez** que o sistema rodar, ele abrirá um navegador para você autorizar o acesso ao Google Drive:

1. Uma página do Google abrirá automaticamente
2. Faça login com sua conta Google
3. Clique em **"Permitir"**
4. Pronto! O sistema salvará o token e não pedirá novamente

---

## 📡 Endpoints da API

### 1. Criar Backup Manual

```http
POST /api/backups/create
Authorization: Bearer {seu-token-jwt}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Backup criado com sucesso",
  "backup": {
    "id": 1,
    "filename": "precificapro_backup_20251007_030000.sql",
    "fileSize": 5242880,
    "fileSizeFormatted": "5.00 MB",
    "createdAt": "2025-10-07T03:00:00",
    "status": "COMPLETED",
    "type": "MANUAL",
    "createdByUsername": "admin"
  }
}
```

### 2. Listar Todos os Backups

```http
GET /api/backups
Authorization: Bearer {seu-token-jwt}
```

**Resposta:**
```json
[
  {
    "id": 2,
    "filename": "precificapro_backup_20251007_030000.sql",
    "fileSizeFormatted": "5.23 MB",
    "createdAt": "2025-10-07T03:00:00",
    "status": "COMPLETED",
    "type": "AUTOMATIC"
  },
  {
    "id": 1,
    "filename": "precificapro_backup_20251006_030000.sql",
    "fileSizeFormatted": "4.89 MB",
    "createdAt": "2025-10-06T03:00:00",
    "status": "COMPLETED",
    "type": "AUTOMATIC"
  }
]
```

### 3. Restaurar Backup

```http
POST /api/backups/{backupId}/restore
Authorization: Bearer {seu-token-jwt}
```

**Exemplo:**
```bash
curl -X POST http://localhost:8080/api/backups/1/restore \
  -H "Authorization: Bearer seu-token-jwt"
```

**⚠️ ATENÇÃO:** Restaurar um backup **sobrescreverá todos os dados atuais** do banco!

### 4. Verificar Status do Serviço

```http
GET /api/backups/status
Authorization: Bearer {seu-token-jwt}
```

**Resposta:**
```json
{
  "enabled": true,
  "message": "Serviço de backup configurado e ativo",
  "googleDriveBackups": 15,
  "backupFiles": [
    "precificapro_backup_20251007_030000.sql (ID: 1abc..., Size: 5242880 bytes)",
    "precificapro_backup_20251006_030000.sql (ID: 2def..., Size: 4890112 bytes)"
  ]
}
```

### 5. Limpar Backups Antigos Manualmente

```http
DELETE /api/backups/cleanup
Authorization: Bearer {seu-token-jwt}
```

---

## ⏰ Backup Automático

### Configuração Padrão

- **Quando:** Todo dia às **3:00 AM**
- **Tipo:** Backup completo do PostgreSQL
- **Destino:** Google Drive (pasta raiz ou pasta específica)
- **Retenção:** 30 dias (configurável)

### Alterar Horário

Edite a variável `BACKUP_AUTOMATIC_CRON` no `.env`:

```bash
# Exemplos de CRON:
# Todo dia às 2:00 AM
BACKUP_AUTOMATIC_CRON=0 0 2 * * *

# Todo dia às 23:00 (11 PM)
BACKUP_AUTOMATIC_CRON=0 0 23 * * *

# A cada 12 horas
BACKUP_AUTOMATIC_CRON=0 0 */12 * * *

# Todo domingo às 4:00 AM
BACKUP_AUTOMATIC_CRON=0 0 4 * * SUN
```

### Desativar Backup Automático

```bash
BACKUP_AUTOMATIC_ENABLED=false
```

---

## 🔄 Como Restaurar Dados Após Trocar de Banco

### Cenário: Render desativou o banco após 2 meses

1. **Criar novo banco PostgreSQL**
2. **Atualizar variáveis de ambiente** com nova conexão
3. **Listar backups disponíveis:**

```bash
curl http://localhost:8080/api/backups \
  -H "Authorization: Bearer seu-token"
```

4. **Escolher o backup mais recente e restaurar:**

```bash
curl -X POST http://localhost:8080/api/backups/5/restore \
  -H "Authorization: Bearer seu-token"
```

5. **Pronto!** Todos os dados foram restaurados ✅

---

## 📦 Estrutura dos Arquivos

### Backup no Google Drive

```
📁 Google Drive (Meu Drive ou pasta específica)
  ├── 📄 precificapro_backup_20251007_030000.sql (5.23 MB)
  ├── 📄 precificapro_backup_20251006_030000.sql (4.89 MB)
  ├── 📄 precificapro_backup_20251005_030000.sql (4.76 MB)
  └── ...
```

### Metadata no Banco

Tabela `backup_metadata` rastreia todos os backups:

```sql
SELECT * FROM backup_metadata ORDER BY created_at DESC;
```

---

## 🛡️ Segurança

### Apenas Administradores

Todos os endpoints de backup requerem:
- ✅ Autenticação JWT válida
- ✅ Role **ADMIN**

### Credenciais Protegidas

- ❌ **NUNCA** commitar o `.env` com credenciais
- ✅ Usar variáveis de ambiente
- ✅ Token OAuth armazenado localmente em `tokens/`

---

## 🎯 Requisitos do Sistema

### No Servidor (Render/AWS/etc)

```bash
# PostgreSQL client tools devem estar instalados
sudo apt-get install postgresql-client

# Verificar instalação
pg_dump --version
psql --version
```

### Variáveis de Ambiente Obrigatórias

```bash
DB_HOST=seu-host-postgres
DB_PORT=5432
DB_NAME=seu-banco
DB_USERNAME=seu-usuario
DB_PASSWORD=sua-senha
GOOGLE_DRIVE_CREDENTIALS_JSON={...json-completo...}
```

---

## 🔧 Troubleshooting

### Erro: "Google Drive service not configured"

**Causa:** Credenciais não configuradas ou inválidas.

**Solução:**
1. Verifique se `GOOGLE_DRIVE_CREDENTIALS_JSON` está no `.env`
2. Confirme que o JSON está completo e válido
3. Reinicie a aplicação

### Erro: "pg_dump: command not found"

**Causa:** PostgreSQL client não instalado no servidor.

**Solução (Render):**
Adicionar no `render.yaml`:
```yaml
buildCommand: apt-get install -y postgresql-client && mvn clean package
```

### Erro: "Invalid redirect_uri"

**Causa:** URI de redirect não configurado no Google Cloud.

**Solução:**
1. Google Cloud Console → Credentials
2. Editar OAuth Client
3. Adicionar `http://localhost` em "Authorized redirect URIs"

### Backup muito grande

**Solução:**
- Ajustar período de retenção: `BACKUP_RETENTION_DAYS=15`
- Backups são automaticamente comprimidos pelo `pg_dump`

---

## 📊 Monitoramento

### Logs do Sistema

```bash
# Ver logs de backup
grep "backup" logs/application.log

# Backups bem-sucedidos
grep "Backup completed successfully" logs/application.log

# Erros de backup
grep "Backup failed" logs/application.log
```

### Verificar via Swagger

Acesse: `http://localhost:8080/swagger-ui.html`

Procure pela tag **"Backup"** para testar os endpoints.

---

## 💰 Custos

### Google Drive - GRATUITO! 🎉

- **15GB permanentes gratuitos** por conta Google
- Backup médio: ~5MB por dia
- **Capacidade:** ~3000 backups antes de encher (anos de uso!)
- Sem custo adicional

---

## 🎓 Perguntas Frequentes

### 1. Posso usar minha conta Google pessoal?

✅ **Sim!** Pode usar qualquer conta Google (pessoal ou corporativa).

### 2. O backup automático afeta a performance?

❌ **Não.** Roda de madrugada (3AM) quando há menos uso.

### 3. Posso fazer backup antes de atualizar o sistema?

✅ **Sim!** Use o endpoint `/api/backups/create` antes de qualquer mudança crítica.

### 4. Como compartilhar backups com outra pessoa?

1. Acesse seu Google Drive
2. Encontre o arquivo de backup
3. Clique direito → Compartilhar → Adicionar pessoa

### 5. O sistema continua funcionando se o backup falhar?

✅ **Sim!** Erros de backup não afetam o sistema principal. Apenas são logados.

---

## 🚀 Próximos Passos

1. Configure as credenciais do Google Drive
2. Teste criar um backup manual
3. Verifique no seu Google Drive
4. Configure o horário do backup automático
5. Relaxe! Seus dados estão protegidos 🛡️

---

## 📝 Changelog

**v1.0.0 - 07/10/2025**
- ✨ Sistema de backup completo implementado
- 🔐 Integração com Google Drive API
- ⏰ Scheduler automático configurável
- 🔄 Restauração completa de backups
- 📊 Endpoints REST completos
- 🧹 Limpeza automática de backups antigos

---

## 🤝 Suporte

Se tiver dúvidas ou problemas:

1. Verifique os logs: `logs/application.log`
2. Teste o status: `GET /api/backups/status`
3. Valide as credenciais do Google Drive
4. Confirme que `pg_dump` está instalado

---

**Implementado por:** Sistema PrecificaPro  
**Tecnologias:** Java 17, Spring Boot 3.3.4, Google Drive API v3, PostgreSQL
