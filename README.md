# CRM Whitelabel Omnichannel

## 1) Cabeçalho

- **Projeto**: CRM Whitelabel Omnichannel
- **Repositório**: `https://github.com/leonardo-martins-dev/crm-tetriz.git`
- **Branch atual**: `main`
- **Status geral**: ⏳ Em evolução ativa (frontend + backend no mesmo monorepo)
- **URL local**: `http://localhost:3000` (desenvolvimento)

## 2) Descrição

Este sistema é um CRM SaaS multi-tenant para operação comercial via WhatsApp, com foco em atendimento, pipeline e automações por tenant.

**Contextos de negócio separados:**
- **Portal operacional do cliente (`/dashboard`)**: atendimento em inbox, gestão de leads, pipeline, tags, conexões e configurações do tenant.
- **Painel administrativo da plataforma (`/admin`)**: governança global de clientes/usuários e métricas consolidadas.
- **Camada de integração (`/api/evolution/*`)**: envia/recebe mensagens da Evolution API e persiste eventos no Supabase.

## 3) Stack tecnológica

### Frontend
- `Next.js 14` (App Router)
- `React 18.3.1`
- `TypeScript`
- `TailwindCSS`
- `Zustand`
- `Recharts`

### Backend e dados
- `Next.js Route Handlers` (API interna em `app/api`)
- Módulo backend em `backend/` com separação `domain/application/infrastructure`
- `Supabase` (`@supabase/supabase-js`, `@supabase/ssr`)
- PostgreSQL com RLS e Realtime
- Evolution API (integração WhatsApp)

### Qualidade
- `ESLint` (`next lint`)
- `TypeScript` (`tsc --noEmit`)
- `Vitest` + `Testing Library`

## 4) Rotas da aplicação

| Rota | Descrição | Guard / Permissão |
|---|---|---|
| `/` | Login | Pública |
| `/dashboard` | Entrada da área operacional | Autenticado |
| `/dashboard/inbox` | Inbox WhatsApp com realtime | Autenticado |
| `/dashboard/leads` | Lista e filtros de leads | Autenticado |
| `/dashboard/pipeline` | Kanban de etapas | Autenticado |
| `/dashboard/clients` | Gestão de clientes do tenant | Autenticado |
| `/dashboard/users` | Gestão de usuários do tenant | Autenticado |
| `/dashboard/tags` | Cadastro e uso de tags | Autenticado |
| `/dashboard/connections` | Conexões WhatsApp/Evolution | Autenticado |
| `/dashboard/metrics` | Métricas operacionais do tenant | Autenticado |
| `/dashboard/agents` | Configuração de agentes IA | Autenticado |
| `/dashboard/settings` | Configurações do tenant/perfil | Autenticado |
| `/dashboard/automations/flow` | Builder visual de automações | Autenticado |
| `/admin/clients` | Gestão global de tenants | `owner` |
| `/admin/users` | Gestão global de usuários | `owner` |
| `/admin/metrics` | Métricas globais da plataforma | `owner` |
| `/admin/settings` | Configurações da plataforma | `owner` |

### API Routes

| Rota API | Função |
|---|---|
| `/api/evolution/webhook` | Recebe eventos `messages.upsert` e `messages.update` da Evolution |
| `/api/evolution/send-message` | Envia mensagem texto via Evolution e persiste no Supabase |
| `/api/evolution/send-media` | Envia mídia e persiste histórico |
| `/api/evolution/create-instance` | Provisiona instância Evolution |
| `/api/evolution/delete-instance` | Remove instância Evolution |
| `/api/evolution/connect` | Fluxo de conexão da instância |
| `/api/evolution/connection-state` | Consulta estado da conexão |
| `/api/evolution/setup-webhook` | Configura webhook da instância |

## 5) Funcionalidades por módulo

- **Autenticação e sessão**: login por Supabase Auth; carregamento de perfil e tenant no store.
- **Inbox**: conversa por lead, envio de texto/mídia, sincronização em tempo real, atualização de status.
- **Leads**: CRUD operacional, score/prioridade/tags, vínculo com etapas e conversas.
- **Pipeline**: etapas customizáveis (criar/renomear/reordenar/excluir), drag and drop, segurança de movimentação.
- **Tags**: catálogo de tags por tenant com aplicação em leads.
- **Conexões**: gestão de conexão de canal (WhatsApp) e sincronização.
- **Agentes IA**: configuração de modelo, prompt, triggers e permissões.
- **Broadcasts**: campanhas por segmentação de status/tags/etapa com acompanhamento.
- **Admin SaaS**: visão consolidada de tenants, usuários e métricas globais.

## 6) Regras de negócio

- **Isolamento por tenant**: entidades operacionais usam `tenant_id`; consultas/regras são tenant-aware.
- **Papéis de acesso**:
  - `owner`: governança global
  - `client`: administração do tenant
  - `user`: operação diária
- **Guarda de rota**:
  - `app/admin/layout.tsx` bloqueia não-owner.
  - `app/dashboard/layout.tsx` exige sessão válida.
- **Pipeline**:
  - renomeio de etapa propaga para leads vinculados;
  - exclusão de etapa move leads para a primeira coluna.
- **Mensageria**:
  - mensagens `fromMe` recebidas por webhook são ignoradas para evitar duplicidade;
  - status de mensagem (`sent/delivered/read`) é sincronizado por evento.
- **Fail-safe de segurança**: mesmo que o app erre filtro, RLS no banco bloqueia acesso cross-tenant.

## 7) Arquitetura de código

```txt
app/                          # UI + rotas + route handlers (Next App Router)
  api/evolution/              # integração HTTP com Evolution e webhook
backend/
  domain/                     # entidades e enums puros (regra de negócio)
  application/                # casos de uso e contratos (interfaces)
  infrastructure/             # adapters concretos (Supabase, serviços externos)
components/                   # componentes React de UI e módulos
lib/
  stores/                     # estado global Zustand e coordenação frontend
  supabase.ts                 # cliente Supabase frontend
infrastructure/repositories/  # service locator frontend para repositórios
backend/supabase/migrations/  # schema SQL e políticas RLS
docs/                         # documentação complementar
```

### Fluxo principal de dados

1. Usuário autentica via Supabase Auth.
2. `authStore` carrega perfil e contexto de tenant.
3. Stores do dashboard carregam dados e iniciam subscriptions realtime.
4. Eventos de webhook (`/api/evolution/webhook`) persistem dados no Supabase.
5. Realtime atualiza stores e UI sem refresh.

## 8) Banco de dados

### Tabelas principais (migração `backend/supabase/migrations/001_initial_schema.sql`)
- `tenants`
- `profiles`
- `leads`
- `conversations`
- `messages`
- `pipeline_stages`
- `tags`
- `lead_tags`
- `agents`
- `connections`
- `broadcasts`
- `automations`

### Enums/checks relevantes
- `profiles.role`: `owner | client | user`
- `leads.priority`: `low | medium | high`
- `connections.status`: `active | inactive | pending`
- `broadcasts.status`: `draft | scheduled | sending | sent | failed`
- `messages.sender_type`: `user | lead | ai`
- `tenants.plan`: `basic | professional | enterprise`

### Funções especiais
- `auth.tenant_id()` e `auth.user_role()` para políticas RLS baseadas em JWT.
- Trigger `update_updated_at()` para manter `leads.updated_at`.

### Políticas RLS
- RLS habilitado nas tabelas de negócio.
- `owner` com políticas de acesso total.
- Usuário de tenant acessa somente registros do próprio `tenant_id`.
- `lead_tags` valida posse via subquery no lead.

### Histórico de migrations
- `001_initial_schema.sql` ✅ cria schema completo, índices, funções, trigger, RLS e habilita realtime para `messages` e `conversations`.

## 9) Integrações e serviços externos

- **Supabase Auth**: login/sessão/perfil.
- **Supabase Database + RLS**: persistência multi-tenant.
- **Supabase Realtime**: atualização instantânea de mensagens/conversas.
- **Supabase Storage**: mídias de mensagens.
- **Evolution API**: envio de mensagens e recebimento de eventos webhook.
- **LLM providers (configuráveis)**: suporte a agentes IA (OpenAI/Anthropic via chave de fallback).

## 10) Variáveis de ambiente

Variáveis esperadas (conforme `docs/SETUP.md`):

- `NEXT_PUBLIC_SUPABASE_URL` — URL do projeto Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — chave pública do frontend.
- `SUPABASE_SERVICE_ROLE_KEY` — chave administrativa para operações server-side/webhooks.
- `META_APP_SECRET` — secret da app Meta.
- `META_VERIFY_TOKEN` — token de verificação webhook Meta.
- `OPENAI_API_KEY` — fallback IA global.
- `ANTHROPIC_API_KEY` — fallback IA global.
- `EVOLUTION_API_URL` — endpoint base da Evolution.
- `EVOLUTION_API_KEY` — chave de autenticação da Evolution.

⚠️ **Alerta de segurança**: nunca versionar `.env` com chaves reais (principalmente `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`).

## 11) Comandos

```bash
# desenvolvimento
npm install
npm run dev

# build/execução
npm run build
npm run start

# qualidade
npm run lint
npm run typecheck
npm run test
npm run test:watch
```

## 12) Notas importantes

- ⚠️ O projeto combina frontend e backend no mesmo repo; mudanças de contrato impactam stores e route handlers.
- ⚠️ O frontend depende de variáveis `.env` na raiz do projeto para inicializar `lib/supabase.ts`; arquivo em subpasta não é carregado pelo Next por padrão.
- ⏳ Existem áreas em evolução (automações avançadas, maturidade de agentes e observabilidade), com arquitetura já preparada para expansão.
- ✅ Base multi-tenant com RLS já presente e aplicada em migração.

## 13) Relacionado

- [Arquitetura](docs/ARCHITECTURE.md)
- [Setup](docs/SETUP.md)
- [RLS](docs/RLS.md)
- [Funcionalidades](docs/FEATURES.md)
- [Checklist Supabase](backend/SUPABASE_CHECKLIST.md)

---

## Pontos de atenção para novos devs (obrigatório ler)

1. **Não confiar só no frontend para segurança**: mantenha sempre filtros por `tenant_id` e valide via RLS.
2. **Variáveis do Next ficam na raiz**: se `NEXT_PUBLIC_SUPABASE_URL` faltar, páginas SSR quebram no boot.
3. **Webhook é caminho crítico**: qualquer mudança de payload Evolution deve ser refletida nos use cases e no mapeamento para `messages/conversations`.

