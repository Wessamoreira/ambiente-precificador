# 📸 GUIA COMPLETO: Criar Conta no Cloudinary

## 🎯 PASSO 1: Acessar Site do Cloudinary

1. Abra seu navegador
2. Acesse: **https://cloudinary.com/users/register_free**
3. Você verá a página de cadastro

---

## ✍️ PASSO 2: Preencher Cadastro

Você tem 3 opções:

### Opção A: Email e Senha (Recomendado)
```
1. Nome: Seu nome
2. Email: seu-email@gmail.com
3. Senha: Crie uma senha forte
4. Marque "I agree to the Terms of Service"
5. Clique em "CREATE FREE ACCOUNT"
```

### Opção B: Google
```
1. Clique no botão "Sign up with Google"
2. Escolha sua conta Google
3. Autorize o acesso
```

### Opção C: GitHub
```
1. Clique no botão "Sign up with GitHub"
2. Faça login no GitHub
3. Autorize o aplicativo
```

---

## 📋 PASSO 3: Questionário Inicial

Após criar a conta, o Cloudinary vai perguntar:

**1. What is your role?**
```
Selecione: "Developer" ou "Full-Stack Developer"
```

**2. What will you use Cloudinary for?**
```
Selecione: "Web Application"
```

**3. What's your main programming language?**
```
Selecione: "Java" ou "JavaScript"
```

Clique em **"CONTINUE"**

---

## 🎉 PASSO 4: Copiar Credenciais

Você será redirecionado para o **Dashboard**.

### Onde encontrar as credenciais:

1. Na página inicial (Dashboard), você verá um card com:
   ```
   Account Details
   ├─ Cloud name: dxxxxxxxxx
   ├─ API Key: 123456789012345
   └─ API Secret: ******************** (clique no olho para ver)
   ```

2. **COPIE ESTAS 3 INFORMAÇÕES:**

```
CLOUDINARY_CLOUD_NAME=dxxxxxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

### 📸 Exemplo Visual:

```
┌─────────────────────────────────────────────┐
│  Account Details                            │
│                                             │
│  Cloud name:    dxxxxxxxxx                  │
│                 [Copy]                      │
│                                             │
│  API Key:       123456789012345             │
│                 [Copy]                      │
│                                             │
│  API Secret:    ********************        │
│                 [👁 Show] [Copy]            │
│                                             │
│  Environment variable:                      │
│  CLOUDINARY_URL=cloudinary://123:abc@...   │
│                 [Copy]                      │
└─────────────────────────────────────────────┘
```

---

## ✅ PASSO 5: Guardar Credenciais com Segurança

**IMPORTANTE:** Guarde essas credenciais em local seguro!

Você vai precisar delas para:
1. Configurar o `.env` do projeto
2. Configurar variáveis de ambiente no Render
3. Configurar CI/CD se tiver

---

## 🔍 PASSO 6: Explorar o Dashboard (Opcional)

### Features Úteis:

**1. Media Library**
- Ver todas as imagens uploadadas
- Organizar em pastas
- Deletar imagens antigas

**2. Transformations**
- Testar redimensionamento
- Ver thumbnails gerados
- Testar filtros e efeitos

**3. Reports**
- Ver uso de storage (quantos MB usados)
- Ver bandwidth (quantos GB transferidos)
- Acompanhar quota do plano gratuito

**4. Settings > Upload**
- Configurar limites de tamanho
- Configurar formatos permitidos
- Criar upload presets

---

## 📊 PASSO 7: Verificar Limites do Plano Gratuito

No Dashboard, vá em **Settings > Account** ou **Reports**:

```
Free Plan Limits:
✅ Credits: 25 (renova todo mês)
✅ Storage: 25 GB
✅ Bandwidth: 25 GB/mês
✅ Transformations: Ilimitadas
✅ Backup: Automático
✅ CDN: Global (mais de 200 POPs)
```

**1 Credit = 1GB de storage OU 1GB de bandwidth**

---

## 🚀 PRÓXIMOS PASSOS

Agora que você tem as credenciais, vou:

1. ✅ Adicionar dependências no projeto
2. ✅ Criar arquivos de configuração
3. ✅ Implementar service de upload
4. ✅ Criar endpoints
5. ✅ Testar no Postman

**GUARDE SUAS CREDENCIAIS!** Você vai precisar em 2 minutos.

---

## 🔐 SEGURANÇA: Onde NÃO Colocar as Credenciais

❌ **NUNCA faça:**
```java
// NÃO FAÇA ISSO! (hardcoded)
String cloudName = "dxxxxxxxxx";
String apiKey = "123456789012345";
String apiSecret = "abc123...";
```

✅ **SEMPRE use:**
```properties
# .env (não commitado no git)
CLOUDINARY_CLOUD_NAME=dxxxxxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abc123...
```

---

## 🆘 PROBLEMAS COMUNS

### 1. Não consigo ver o API Secret
```
Solução: Clique no ícone do olho 👁 ao lado do campo
```

### 2. Esqueci de copiar as credenciais
```
Solução: 
1. Faça login em cloudinary.com
2. Vá em Settings > Account
3. Role até "Account Details"
4. Copie novamente
```

### 3. Conta bloqueada / Limite excedido
```
Solução:
- Plano gratuito tem limite de 25 credits/mês
- Se exceder, upgrade ou aguarde renovação mensal
- Para começar, 25GB é MUITO!
```

---

## ✅ CHECKLIST DE CRIAÇÃO DA CONTA

- [ ] Acessei cloudinary.com/users/register_free
- [ ] Criei conta (email, Google ou GitHub)
- [ ] Completei questionário inicial
- [ ] Cheguei no Dashboard
- [ ] Copiei Cloud Name
- [ ] Copiei API Key  
- [ ] Copiei API Secret (cliquei no olho 👁)
- [ ] Salvei credenciais em local seguro
- [ ] Verifiquei limites do plano (25GB ok!)

---

**PRONTO!** Agora você está pronto para implementar! 🎉

Quando tiver as credenciais, me avise para continuar a implementação.
