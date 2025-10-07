# ✅ Próximos Passos - Sistema de Backup

## 📋 Checklist de Implementação

### Backend ✅ 100% Completo

- [x] Dependências Maven (Google Drive API)
- [x] Modelo `BackupMetadata`
- [x] Repository `BackupMetadataRepository`
- [x] Config `GoogleDriveConfig`
- [x] Service `BackupService` (export/restore/upload)
- [x] Scheduler `BackupSchedulerConfig`
- [x] Controller `BackupController` (5 endpoints)
- [x] DTOs e Mapper
- [x] Migration Flyway `V12__create_backup_metadata_table.sql`
- [x] Configurações `.env` e `application.properties`

### Frontend ✅ Pronto para Usar

- [x] API Client `backupApi.ts`
- [x] Componente `BackupManager.tsx` (interface completa)

### Documentação ✅ Completa

- [x] `SISTEMA-BACKUP-AUTOMATICO.md` (documentação técnica)
- [x] `GUIA-RAPIDO-GOOGLE-DRIVE.md` (tutorial passo a passo)
- [x] `RESUMO-BACKUP-IMPLEMENTADO.md` (overview)
- [x] `test-backup-api.sh` (script de testes)

---

## 🚀 Como Ativar o Sistema (15 minutos)

### 1️⃣ Instalar Dependências (2 min)

```bash
cd precificapro-api
./mvnw clean install
```

**Isso vai:**
- Baixar as dependências do Google Drive API
- Compilar os novos arquivos
- Verificar se tudo está OK

---

### 2️⃣ Configurar Google Drive (5 min)

**Siga o guia:** `GUIA-RAPIDO-GOOGLE-DRIVE.md`

**Resumo ultra-rápido:**

1. **Google Cloud Console:** https://console.cloud.google.com/
2. **Criar Projeto:** "precificapro-backup"
3. **Ativar API:** Google Drive API
4. **Criar Credencial:** OAuth 2.0 Desktop App
5. **Baixar JSON** das credenciais

---

### 3️⃣ Configurar Variáveis de Ambiente (3 min)

Criar/editar arquivo `.env` na raiz de `precificapro-api/`:

```bash
# Copiar do exemplo
cp .env.example .env

# Editar e adicionar suas credenciais
nano .env
```

**Adicione:**

```bash
# Cole o JSON completo numa linha só (sem quebras!)
GOOGLE_DRIVE_CREDENTIALS_JSON={"installed":{"client_id":"SEU_CLIENT_ID.apps.googleusercontent.com","project_id":"seu-projeto","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"SEU_CLIENT_SECRET","redirect_uris":["http://localhost"]}}

# Configurações opcionais
BACKUP_RETENTION_DAYS=30
BACKUP_AUTOMATIC_ENABLED=true
BACKUP_AUTOMATIC_CRON=0 0 3 * * *
```

**⚠️ IMPORTANTE:** 
- JSON em uma linha só
- Sem espaços extras
- Sem quebras de linha

---

### 4️⃣ Rodar Aplicação (2 min)

```bash
cd precificapro-api
./mvnw spring-boot:run
```

**Na primeira vez:**
- Um navegador abrirá automaticamente
- Faça login com sua conta Google
- Autorize o acesso ao Google Drive
- Pronto! Token salvo em `tokens/`

---

### 5️⃣ Testar (3 min)

#### Opção A: Via Script (Recomendado)

```bash
cd ambiente-procificador
chmod +x test-backup-api.sh
./test-backup-api.sh
```

**O script oferece menu interativo:**
1. Verificar status
2. Listar backups
3. Criar backup manual
4. Restaurar backup
5. Limpar antigos

#### Opção B: Via Swagger UI

```
http://localhost:8080/swagger-ui.html
```

1. Fazer login (copiar token JWT)
2. Clicar em "Authorize" (cadeado no topo)
3. Colar token
4. Testar endpoints na seção **"Backup"**

#### Opção C: Via curl

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"senha123"}' \
  | jq -r '.token')

# 2. Verificar status
curl http://localhost:8080/api/backups/status \
  -H "Authorization: Bearer $TOKEN" | jq

# 3. Criar backup
curl -X POST http://localhost:8080/api/backups/create \
  -H "Authorization: Bearer $TOKEN" | jq

# 4. Listar backups
curl http://localhost:8080/api/backups \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## 🎨 Integrar Frontend (10 min)

### Adicionar Rota

Edite `precificapro-frontend/src/App.tsx`:

```tsx
import BackupManager from './components/BackupManager';

// Adicionar rota (exemplo com React Router):
<Route path="/backups" element={<BackupManager />} />
```

### Adicionar Menu

Adicione link no menu/navbar:

```tsx
<Link to="/backups">
  <Database className="w-5 h-5" />
  Backups
</Link>
```

### Testar

```bash
cd precificapro-frontend
npm run dev
```

Acesse: `http://localhost:5173/backups`

---

## ⏰ Configurar Horário do Backup

### Alterar Horário Padrão (3AM)

Edite `.env`:

```bash
# Exemplos:

# Todo dia às 2:00 AM
BACKUP_AUTOMATIC_CRON=0 0 2 * * *

# Todo dia às 23:00 (11 PM)
BACKUP_AUTOMATIC_CRON=0 0 23 * * *

# A cada 12 horas (meio-dia e meia-noite)
BACKUP_AUTOMATIC_CRON=0 0 */12 * * *

# Toda segunda às 4:00 AM
BACKUP_AUTOMATIC_CRON=0 0 4 * * MON

# Todo domingo às 5:00 AM
BACKUP_AUTOMATIC_CRON=0 0 5 * * SUN
```

**Formato CRON:**
```
┌─────── segundo (0-59)
│ ┌───── minuto (0-59)
│ │ ┌─── hora (0-23)
│ │ │ ┌─ dia do mês (1-31)
│ │ │ │ ┌ mês (1-12)
│ │ │ │ │ ┌ dia da semana (0-7, 0 ou 7 = domingo)
│ │ │ │ │ │
* * * * * *
```

---

## 🚀 Deploy no Render/Produção

### 1. Configurar PostgreSQL Tools

No `render.yaml` ou build command:

```yaml
buildCommand: apt-get update && apt-get install -y postgresql-client && ./mvnw clean package
```

### 2. Adicionar Variáveis de Ambiente

No painel do Render, adicione:
- `GOOGLE_DRIVE_CREDENTIALS_JSON`
- `BACKUP_AUTOMATIC_ENABLED=true`
- `BACKUP_AUTOMATIC_CRON=0 0 3 * * *`

### 3. Primeira Autorização

**Problema:** Servidor não tem navegador para autorizar.

**Soluções:**

#### Opção A: Autorizar Localmente e Copiar Token (Recomendado)

1. Configurar localmente primeiro
2. Autorizar (gera pasta `tokens/`)
3. Copiar conteúdo de `tokens/` para o servidor
4. Via SFTP ou incluir no deploy

#### Opção B: Service Account (Produção)

Para ambientes sem interface gráfica, use Service Account:

1. Google Cloud Console → IAM & Admin → Service Accounts
2. Create Service Account
3. Download JSON key
4. Configurar no código para usar Service Account em vez de OAuth

---

## 🔍 Verificar se Está Funcionando

### Logs da Aplicação

```bash
# Ver logs de backup
tail -f logs/application.log | grep -i backup

# Apenas sucessos
tail -f logs/application.log | grep "Backup completed"

# Apenas erros
tail -f logs/application.log | grep -i "backup.*error\|backup.*failed"
```

### Google Drive

1. Acesse: https://drive.google.com
2. Procure arquivos: `precificapro_backup_`
3. Verifique data/hora e tamanho

### Banco de Dados

```sql
-- Ver todos os backups registrados
SELECT * FROM backup_metadata ORDER BY created_at DESC;

-- Backups bem-sucedidos
SELECT filename, file_size, created_at, type 
FROM backup_metadata 
WHERE status = 'COMPLETED' 
ORDER BY created_at DESC;

-- Último backup
SELECT * FROM backup_metadata 
WHERE status = 'COMPLETED' 
ORDER BY created_at DESC 
LIMIT 1;
```

---

## 🐛 Troubleshooting Rápido

| Problema | Causa | Solução |
|----------|-------|---------|
| "Credentials not configured" | JSON não está no `.env` | Copiar JSON completo em uma linha |
| "Invalid redirect_uri" | OAuth sem redirect configurado | Adicionar `http://localhost` nas URIs |
| "pg_dump: command not found" | PostgreSQL tools não instalados | `apt-get install postgresql-client` |
| Backup não sobe para Drive | Credenciais inválidas | Reautorizar, deletar `tokens/` e rodar novamente |
| Erro na migration | Tabela já existe | Verificar com `SELECT * FROM flyway_schema_history` |

---

## 📊 Monitoramento Contínuo

### Criar Alerta de Backup Falhado

Adicione no código (opcional):

```java
// Enviar email quando backup falhar
// Integrar com serviço de notificações
// Webhook para Slack/Discord
```

### Dashboard de Backups

A tabela `backup_metadata` permite criar visualizações:
- Total de backups
- Taxa de sucesso
- Tamanho médio
- Última execução

---

## ✅ Checklist Final

Antes de considerar completo, verifique:

- [ ] Aplicação compila sem erros
- [ ] Migration `V12` aplicada com sucesso
- [ ] Credenciais Google Drive configuradas
- [ ] Primeira autorização OAuth concluída
- [ ] Backup manual funciona (testado via API)
- [ ] Arquivo aparece no Google Drive
- [ ] Lista de backups retorna dados
- [ ] Scheduler configurado (ver próxima execução nos logs)
- [ ] Frontend integrado (opcional)
- [ ] Documentação lida e entendida

---

## 🎓 Recursos Úteis

### Documentação
- `SISTEMA-BACKUP-AUTOMATICO.md` - Documentação técnica completa
- `GUIA-RAPIDO-GOOGLE-DRIVE.md` - Tutorial de configuração
- `RESUMO-BACKUP-IMPLEMENTADO.md` - Overview do sistema

### Ferramentas
- `test-backup-api.sh` - Script de testes interativo
- Swagger UI: http://localhost:8080/swagger-ui.html

### Links Externos
- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Drive API Docs](https://developers.google.com/drive/api/v3/about-sdk)
- [Cron Expression Generator](https://crontab.guru/)

---

## 🎉 Conclusão

Após seguir este guia, você terá:

✅ Sistema de backup automático funcionando  
✅ Proteção contra perda de dados  
✅ Backup diário no Google Drive (15GB grátis)  
✅ Capacidade de restauração completa  
✅ Interface de gerenciamento (frontend)  
✅ Documentação completa  

**Seus dados estão seguros!** 🛡️

---

**Dúvidas?** Consulte:
1. Logs da aplicação
2. Documentação completa
3. Status da API: `GET /api/backups/status`
4. Google Drive para verificar uploads

**Bom backup!** 🚀
