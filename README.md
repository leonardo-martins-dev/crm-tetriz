# 🚀 CRM Omnichannel - NO PONTO

CRM Omnichannel de alta performance para a agência **NO PONTO**, desenvolvido com **Next.js 14**, **Supabase** e **Evolution API**.

O sistema permite a gestão completa de leads, conversas multicanal (WhatsApp/Meta) e automação via Agentes de IA, tudo em uma arquitetura robusta e escalável.

---

## 🏗️ Arquitetura e Guia do Projeto

Para uma documentação detalhada, consulte os guias na pasta `/docs`:

- 🏛️ **[Arquitetura](docs/ARCHITECTURE.md)**: Detalhes sobre Clean Architecture e padrões de design.
- 🚀 **[Guia de Setup](docs/SETUP.md)**: Como rodar localmente e configurar o Supabase.
- 🔐 **[Segurança e RLS](docs/RLS.md)**: Políticas de isolamento de dados por Tenant.

---

## 🛠️ Tecnologias de Ponta

- **Next.js 14+** (App Router): Frontend e API Routes.
- **Supabase**: Autenticação, Banco de Dados Relacional, Realtime e Storage.
- **Evolution API**: Integração avançada com WhatsApp (Docker local/cloud).
- **Zustand**: Gestão de estado global leve e performática.
- **Vitest**: Suite de testes automatizados unitários e de integração.
- **TailwindCSS**: UI moderna, responsiva e customizável.

---

## 🎯 Funcionalidades Principais

### 📥 Inbox Omnichannel Realtime
- Centralize mensagens do WhatsApp (Meta/Evolution) em uma única interface.
- Atualizações em tempo real via **Supabase Postgres Changes**.
- Suporte completo a mídias (imagens, áudios, vídeos e documentos).
- Histórico completo e contador de mensagens não lidas.

### 🧩 Gestão de Leads e Pipeline
- Visualização Kanban com drag & drop.
- Filtros avançados por canal, tags e prioridade.
- Automação de estágios baseada no comportamento do lead.

### 🤖 Agentes de IA Inteligentes
- Configure agentes (GPT-4o / Claude) para responder automaticamente.
- Triggers customizáveis por estágio do pipeline ou tags.
- Memória de conversação para respostas contextualizadas.

### 🏢 Multi-tenancy (SaaS)
- Isolamento total de dados via `tenant_id`.
- Painel Admin para o Owner gerenciar múltiplos clientes (tenants).
- Hierarquia de permissões: Admin (Owner), Manager, User.

---

## 📦 Instalação Rápida

```bash
# Insta-lá dependências
npm install

# Configurar o .env (ver docs/SETUP.md)
cp .env.example .env

# Rodar testes
npm test

# Executar em desenvolvimento
npm run dev
```

---

## 🎨 Design Premium

O CRM foi projetado para oferecer uma experiência de usuário **Premium**, inspirada em ferramentas como Linear, Kommo e Vercel, com suporte completo a **Dark Mode** e micro-interações fluidas.

---

Desenvolvido para a **Agência NO PONTO** 🚀

