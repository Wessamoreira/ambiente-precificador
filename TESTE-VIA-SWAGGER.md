# 🧪 Teste do Sistema de Backup via Swagger UI

## ✅ Forma Mais Fácil (SEM problemas de CSRF!)

Acesse no navegador:
```
http://localhost:8080/swagger-ui.html
```

---

## 📋 Passo a Passo

### 1️⃣ Fazer Login

1. **Encontre a seção:** `Auth Controller`
2. **Clique em:** `POST /api/auth/login`
3. **Clique em:** "Try it out"
4. **Cole este JSON:**
   ```json
   {
     "email": "test@precificapro.com",
     "password": "senha123"
   }
   ```
5. **Clique em:** "Execute"
6. **Copie o token** da resposta (campo "token")

---

### 2️⃣ Autorizar com o Token

1. **No topo da página**, clique no botão **"Authorize"** 🔓
2. Cole o token no campo (sem "Bearer", apenas o token)
3. Clique em **"Authorize"**
4. Clique em **"Close"**

✅ Agora você está autenticado!

---

### 3️⃣ Verificar Status do Backup

1. **Encontre a seção:** `Backup Controller`
2. **Clique em:** `GET /api/backups/status`
3. **Clique em:** "Try it out"
4. **Clique em:** "Execute"

**Resposta esperada:**
```json
{
  "enabled": true,
  "message": "Serviço de backup configurado e ativo",
  "googleDriveBackups": 0,
  "backupFiles": []
}
```

---

### 4️⃣ Criar Backup Manual

1. **Na seção:** `Backup Controller`
2. **Clique em:** `POST /api/backups/create`
3. **Clique em:** "Try it out"
4. **Clique em:** "Execute"

⏳ **Aguarde 10-30 segundos...**

**Primeira vez:** Navegador abrirá para autorizar Google Drive
- Faça login
- Autorize o acesso
- Volte para o Swagger

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Backup criado com sucesso",
  "backup": {
    "id": 1,
    "filename": "precificapro_backup_20251007_182330.sql",
    "fileSizeFormatted": "2.34 MB",
    "status": "COMPLETED",
    "type": "MANUAL"
  }
}
```

---

### 5️⃣ Listar Backups

1. **Clique em:** `GET /api/backups`
2. **Clique em:** "Try it out"
3. **Clique em:** "Execute"

**Resposta:**
```json
[
  {
    "id": 1,
    "filename": "precificapro_backup_20251007_182330.sql",
    "fileSizeFormatted": "2.34 MB",
    "status": "COMPLETED",
    "type": "MANUAL",
    "createdAt": "2025-10-07T18:23:30",
    "createdByUsername": "test@precificapro.com"
  }
]
```

---

### 6️⃣ Verificar no Google Drive

Acesse: **https://drive.google.com**

Procure por: `precificapro_backup_`

✅ **Arquivo deve aparecer lá!** 🎉

---

## 🐛 Troubleshooting

### Erro 401 Unauthorized
❌ **Problema:** Token não foi copiado corretamente

✅ **Solução:** 
1. Refaça o login
2. Copie TODO o token (muito longo!)
3. Cole sem espaços extras

---

### Erro 403 Forbidden
❌ **Problema:** Usuário não tem permissão ADMIN

✅ **Solução:**
Execute no terminal:
```bash
psql -h localhost -U postgres_user -d precificapro_db -c "UPDATE users SET role = 'ADMIN' WHERE email = 'test@precificapro.com';"
```

---

### Status retorna "enabled": false
❌ **Problema:** Google Drive não configurado

✅ **Solução:**
1. Verifique arquivo `.env`
2. Confirme que `GOOGLE_DRIVE_CREDENTIALS_JSON` está preenchido
3. Reinicie a aplicação

---

## ✅ Resultado Final

Se tudo funcionou, você deve ter:

- [x] Login com sucesso (token recebido)
- [x] Status mostra `"enabled": true`
- [x] Backup criado (status COMPLETED)
- [x] Arquivo aparece na lista
- [x] Arquivo visível no Google Drive

**🎉 SISTEMA FUNCIONANDO!**

---

## 📸 Telas Esperadas

### Swagger UI - Tela Inicial
```
http://localhost:8080/swagger-ui.html
```
Você verá:
- Auth Controller
- Backup Controller
- Product Controller
- etc...

### Após Autorização
🔓 Muda para: 🔒 (cadeado fechado)

---

## 🚀 Links Úteis

- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **API Docs:** http://localhost:8080/v3/api-docs
- **Health Check:** http://localhost:8080/actuator/health
- **Google Drive:** https://drive.google.com

---

**Teste agora pelo Swagger! É muito mais fácil!** ✨
