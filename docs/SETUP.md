# 🚀 Guia de Setup e Instalação

Siga os passos abaixo para configurar o ambiente de desenvolvimento local e conectar ao Supabase.

## 📋 Pré-requisitos

- **Node.js** (v18 ou superior)
- **NPM** ou **PNPM**
- **Conta no Supabase** (Grátis ou Pro)
- **Evolution API** (Docker local ou Cloud)

---

## 1. ⚙️ Configuração do Supabase

### Tabelas e Schema
Crie as tabelas seguindo a estrutura de `tenant_id`. Você pode encontrar os scripts de criação de tabelas e RLS em [docs/RLS.md](docs/RLS.md).

### Storage (Buckets)
Crie um bucket público chamado `media-messages` no Storage do Supabase. Este bucket será usado para salvar imagens, áudios e vídeos recebidos via WhatsApp.

---

## 2. 📝 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```bash
# Supabase (Frontend e Backend Admin)
NEXT_PUBLIC_SUPABASE_URL=seu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=seu_anon_key
SUPABASE_SERVICE_ROLE_KEY=seu_service_role_key # Necessário para Webhooks

# WhatsApp (Meta)
META_APP_ID=seu_app_id
META_SECRET=seu_secret_verify_token

# Evolution API (Global)
EVOLUTION_API_URL=http://localhost:8080 # Exemplo de URL local
EVOLUTION_API_KEY=apikey_gerada_na_evolution

# Outros
BASE_URL=http://localhost:3000 # Para callbacks e redirecionamentos
```

---

## 3. 🏗️ Instalação Local

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

---

## 4. 🔗 Configuração dos Webhooks (Local)

Para testar o recebimento de mensagens localmente, você precisará de um túnel HTTP (como **Ngrok** ou **Localtunnel**).

1.  Inicie o túnel: `ngrok http 3000`
2.  Copie a URL gerada (ex: `https://abcd-123.ngrok.io`)
3.  No painel da **Evolution API**, configure o Webhook global:
    - **URL**: `https://abcd-123.ngrok.io/api/evolution/webhook`
    - **Eventos**: `MESSAGES_UPSERT`, `MESSAGES_UPDATE`
4.  No painel da **Meta (Facebook Developers)**, configure o Webhook:
    - **URL**: `https://abcd-123.ngrok.io/api/whatsapp/webhook`

---

## 🧪 Rodando Testes

O projeto utiliza **Vitest** para testes automatizados.

```bash
# Rodar todos os testes
npm test

# Rodar testes em modo watch
npm run test:watch

# Rodar cobertura de testes
npm run test:coverage
```
