# 🧪 Como Testar o Sistema de Backup Google Drive

## ✅ Pré-requisitos

- [x] Arquivo `.env` criado ✅
- [x] Credenciais Google Drive configuradas ✅
- [ ] Spring Boot rodando

---

## 🚀 Passo 1: Iniciar Aplicação

```bash
cd /Users/macbook/Desktop/ambiente-procificador/precificapro-api
./mvnw spring-boot:run -DskipTests
```

**Aguarde até ver:**
```
Started PrecificaproApiApplication in X seconds
```

---

## 🔐 Passo 2: Fazer Login e Obter Token

```bash
# Login (substitua email/senha se necessário)
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@precificapro.com","password":"admin123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Verificar se pegou o token
echo "Token: $TOKEN"
```

**Se aparecer o token = ✅ Login OK**

---

## 🔍 Passo 3: Testar Status do Backup

```bash
curl -X GET http://localhost:8080/api/backups/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq
```

### Respostas Possíveis:

**✅ Google Drive Configurado:**
```json
{
  "enabled": true,
  "message": "Serviço de backup configurado e ativo",
  "googleDriveBackups": 0,
  "backupFiles": []
}
```

**❌ Google Drive NÃO Configurado:**
```json
{
  "enabled": false,
  "message": "Google Drive credentials not configured",
  "googleDriveBackups": 0,
  "backupFiles": []
}
```

---

## 📦 Passo 4: Criar Backup Manual (TESTE REAL)

```bash
curl -X POST http://localhost:8080/api/backups/create \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq
```

### O Que Vai Acontecer:

1. ⏳ **Primeira vez:** Navegador abrirá pedindo autorização Google
   - Faça login com sua conta Google
   - Autorize o acesso ao Google Drive
   - Feche o navegador depois de autorizar

2. ⏳ **Aguarde 10-30 segundos** (depende do tamanho do banco)

3. ✅ **Resposta de sucesso:**
```json
{
  "success": true,
  "message": "Backup criado com sucesso",
  "backup": {
    "id": 1,
    "filename": "precificapro_backup_20251007_181745.sql",
    "fileSizeFormatted": "2.34 MB",
    "status": "COMPLETED",
    "type": "MANUAL",
    "createdAt": "2025-10-07T18:17:45"
  }
}
```

---

## ☁️ Passo 5: Verificar no Google Drive

1. Acesse: https://drive.google.com/
2. Procure por: `precificapro_backup_`
3. Deve aparecer o arquivo .sql que acabou de criar! 🎉

---

## 📋 Passo 6: Listar Backups

```bash
curl -X GET http://localhost:8080/api/backups \
  -H "Authorization: Bearer $TOKEN" | jq
```

**Resposta:**
```json
[
  {
    "id": 1,
    "filename": "precificapro_backup_20251007_181745.sql",
    "fileSizeFormatted": "2.34 MB",
    "status": "COMPLETED",
    "type": "MANUAL",
    "createdAt": "2025-10-07T18:17:45",
    "createdByUsername": "admin@precificapro.com"
  }
]
```

---

## 🔄 Passo 7: Testar Restauração (OPCIONAL - CUIDADO!)

⚠️ **ATENÇÃO:** Isso sobrescreverá todos os dados atuais!

```bash
# Listar backups e pegar o ID
BACKUP_ID=1  # Use o ID que apareceu no passo 6

# Restaurar
curl -X POST http://localhost:8080/api/backups/$BACKUP_ID/restore \
  -H "Authorization: Bearer $TOKEN" | jq
```

**Só faça isso se tiver certeza!**

---

## 🧹 Passo 8: Limpar Backups Antigos

```bash
curl -X DELETE http://localhost:8080/api/backups/cleanup \
  -H "Authorization: Bearer $TOKEN" | jq
```

Remove backups com mais de 30 dias.

---

## 📊 Script Completo de Teste (Copy & Paste)

```bash
#!/bin/bash

echo "🔐 Fazendo login..."
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@precificapro.com","password":"admin123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Falha no login!"
  exit 1
fi

echo "✅ Login OK!"
echo ""

echo "🔍 Verificando status..."
curl -s -X GET http://localhost:8080/api/backups/status \
  -H "Authorization: Bearer $TOKEN" | jq
echo ""

echo "📦 Criando backup..."
curl -s -X POST http://localhost:8080/api/backups/create \
  -H "Authorization: Bearer $TOKEN" | jq
echo ""

echo "⏳ Aguardando 5 segundos..."
sleep 5

echo "📋 Listando backups..."
curl -s -X GET http://localhost:8080/api/backups \
  -H "Authorization: Bearer $TOKEN" | jq
echo ""

echo "✅ Teste completo!"
echo "🌐 Verifique no Google Drive: https://drive.google.com"
```

**Salve como:** `test-backup.sh`

**Execute:**
```bash
chmod +x test-backup.sh
./test-backup.sh
```

---

## 🐛 Troubleshooting

### Erro: "Google Drive credentials not configured"

**Solução:**
1. Verifique se o `.env` existe:
   ```bash
   ls -la .env
   ```

2. Verifique se tem a variável `GOOGLE_DRIVE_CREDENTIALS_JSON`:
   ```bash
   grep GOOGLE_DRIVE .env
   ```

3. Reinicie a aplicação

---

### Navegador não abre para autorizar

**Solução:**
1. Veja os logs do Spring Boot
2. Procure por uma URL começando com: `https://accounts.google.com/o/oauth2/auth?...`
3. Copie e abra manualmente no navegador

---

### Erro: "Invalid redirect_uri"

**Solução:**
No Google Cloud Console:
1. APIs & Services → Credentials
2. Clique na sua credencial OAuth 2.0
3. Em "Authorized redirect URIs", adicione: `http://localhost`
4. Salve

---

### Backup fica em "IN_PROGRESS" para sempre

**Solução:**
1. Verifique se o PostgreSQL tem `pg_dump`:
   ```bash
   which pg_dump
   ```

2. Se não tiver, instale:
   ```bash
   brew install postgresql
   ```

---

## ✅ Checklist de Sucesso

Após os testes, você deve ter:

- [ ] Aplicação iniciou sem erros
- [ ] Login funcionou (token recebido)
- [ ] Status retorna `"enabled": true`
- [ ] Backup criado com sucesso
- [ ] Arquivo aparece no Google Drive
- [ ] Lista de backups mostra o backup criado

**Se todos os itens acima: ✅ SISTEMA FUNCIONANDO PERFEITAMENTE!** 🎉

---

## 📞 Comandos Úteis

```bash
# Ver logs em tempo real
tail -f logs/application.log | grep -i backup

# Parar aplicação
lsof -ti:8080 | xargs kill -9

# Verificar se está rodando
lsof -i:8080

# Ver arquivos no Google Drive via CLI (requer google-drive-ocamlfuse)
# Ou simplesmente: https://drive.google.com
```

---

**Pronto! Agora você tem tudo para testar o sistema de backup! 🚀**
