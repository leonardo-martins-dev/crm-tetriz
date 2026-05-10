# 🚀 Guia de Setup e Instalação

Siga os passos abaixo para configurar o ambiente de desenvolvimento local e conectar ao Supabase.

---

## 📋 Pré-requisitos

- **Node.js** (v18 ou superior)
- **NPM** ou **PNPM**
- **Conta no Supabase** (Grátis ou Pro)
- **Evolution API** (Docker local ou Cloud)

---

## 1. ⚙️ Configuração do Supabase

### Banco de Dados (Schema)
O projeto utiliza um esquema relacional pronto para multi-tenancy.

> **Supabase hospedado (Dashboard):** não é permitido criar funções no schema `auth`. A migração define os helpers em `public` (`jwt_tenant_id`, `jwt_user_role`). Se você rodou uma versão antiga da migração que falhou no primeiro comando, apague objetos parciais ou use um projeto limpo antes de reaplicar.

1. Acesse o **SQL Editor** do seu projeto no Supabase.
2. Copie e execute o conteúdo do arquivo localizado em:
   [backend/supabase/migrations/001_initial_schema.sql](backend/supabase/migrations/001_initial_schema.sql)
   - *Este script criará todas as tabelas, índices, funções de RLS e políticas de segurança.*

### Storage (Buckets)
Crie um bucket chamado `media-messages` no menu Storage.
- **Configuração**: Marque como Público (Public) para que os links de mídia funcionem nas conversas.

---

## 2. 📝 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto. Abaixo estão as variáveis obrigatórias:

```bash
# ============================================================
# SUPABASE
# ============================================================
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key # Usado em webhooks/admin

# ============================================================
# META WHATSAPP (Opcional se usar apenas Evolution)
# ============================================================
META_APP_SECRET=seu-app-secret
META_VERIFY_TOKEN=seu-verify-token

# ============================================================
# AI (Agentes)
# ============================================================
# Estas chaves servem como fallback caso o cliente (tenant)
# não configure uma chave própria no banco de dados.
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# ============================================================
# EVOLUTION API
# ============================================================
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=apikey-gerada
```

---

## 3. 🏗️ Instalação Local

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   - O sistema estará disponível em `http://localhost:3000`.

3. **Schema extra (mensagens)**: após aplicar `001_initial_schema.sql`, rode também [`backend/supabase/migrations/002_messages_media_status.sql`](backend/supabase/migrations/002_messages_media_status.sql) no SQL Editor — adiciona `status`, `media_url` e `media_type` em `messages`, usados pelo código.

---

## 3.1 Primeiro usuário owner (script)

Após o schema estar aplicado e o `.env` com `SUPABASE_SERVICE_ROLE_KEY`:

```powershell
# PowerShell — não commite senha
$env:OWNER_EMAIL="seu-email@dominio.com"
$env:OWNER_PASSWORD="senha-segura"
$env:OWNER_DISPLAY_NAME="Seu Nome"
npm run seed:owner
```

O script cria um **tenant**, o usuário em **Auth** com `app_metadata` (`tenant_id`, `role: owner`) para o RLS funcionar, e a linha em **`profiles`**.

Variáveis opcionais: `OWNER_TENANT_NAME`, `OWNER_TENANT_ID` (se quiser amarrar a um tenant já existente).

---

## 4. 🔗 Configuração de Webhooks

Para que o CRM receba mensagens em tempo real, os parceiros (Evolution/Meta) precisam enviar dados para os seus endpoints.

### Endpoints Disponíveis:
- **Evolution API**: `[URL_BASE]/api/evolution/webhook`
- **WhatsApp Webhook**: `[URL_BASE]/api/whatsapp/webhook`

*Dica: Use Ngrok ou Cloudflare Tunnel para expor seu `localhost:3000` durante o desenvolvimento.*

---

## 🧪 Rodando Testes

O projeto utiliza **Vitest** para garantir a estabilidade das regras de negócio.

```bash
# Rodar todos os testes
npm test

# Modo Watch
npm run test:watch
```
