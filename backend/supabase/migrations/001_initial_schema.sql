-- ============================================================
-- CRM WHITELABEL — Migração Completa
-- Executar no Supabase SQL Editor ou via `supabase db push`
-- ============================================================

-- 1. Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 2. Funções helper para RLS (extraem dados do JWT)
-- ============================================================
CREATE OR REPLACE FUNCTION auth.tenant_id()
RETURNS uuid AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid
  );
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS text AS $$
  SELECT COALESCE(
    auth.jwt() -> 'app_metadata' ->> 'role',
    'user'
  );
$$ LANGUAGE sql STABLE;

-- ============================================================
-- 3. TABELAS
-- ============================================================

-- TENANTS (clientes da plataforma SaaS)
CREATE TABLE tenants (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       text NOT NULL,
  logo_url   text,
  active     boolean NOT NULL DEFAULT true,
  plan       text NOT NULL DEFAULT 'basic' CHECK (plan IN ('basic', 'professional', 'enterprise')),
  modules    text[] NOT NULL DEFAULT ARRAY['inbox', 'pipeline', 'metrics'],
  max_users  integer NOT NULL DEFAULT 5,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- PROFILES (perfis de usuários, ligados ao auth.users)
CREATE TABLE profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id  uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name       text NOT NULL,
  email      text NOT NULL,
  role       text NOT NULL DEFAULT 'user' CHECK (role IN ('owner', 'client', 'user')),
  avatar_url text,
  active     boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_tenant ON profiles(tenant_id);

-- LEADS
CREATE TABLE leads (
  id                    uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id             uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name                  text NOT NULL,
  phone                 text,
  email                 text,
  channel               text NOT NULL DEFAULT 'whatsapp',
  status                text NOT NULL DEFAULT 'new',
  pipeline_stage        text NOT NULL DEFAULT 'Novo Lead',
  assigned_to           uuid REFERENCES profiles(id) ON DELETE SET NULL,
  score                 integer NOT NULL DEFAULT 0,
  priority              text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  campaign              text,
  product               text,
  window_24h_open       boolean NOT NULL DEFAULT true,
  window_24h_expires_at timestamptz,
  last_contact_at       timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_leads_tenant ON leads(tenant_id);
CREATE INDEX idx_leads_phone ON leads(tenant_id, phone);
CREATE INDEX idx_leads_status ON leads(tenant_id, status);

-- CONVERSATIONS
CREATE TABLE conversations (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  lead_id         uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  assigned_to     uuid REFERENCES profiles(id) ON DELETE SET NULL,
  unread_count    integer NOT NULL DEFAULT 0,
  last_message_at timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_conversations_tenant ON conversations(tenant_id);
CREATE INDEX idx_conversations_lead ON conversations(tenant_id, lead_id);

-- MESSAGES
CREATE TABLE messages (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  lead_id         uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  content         text NOT NULL,
  sender_id       text NOT NULL,
  sender_name     text NOT NULL,
  sender_type     text NOT NULL DEFAULT 'lead' CHECK (sender_type IN ('user', 'lead', 'ai')),
  channel         text NOT NULL DEFAULT 'whatsapp',
  read            boolean NOT NULL DEFAULT false,
  wamid           text, -- WhatsApp message ID (Meta)
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_tenant ON messages(tenant_id);

-- PIPELINE STAGES
CREATE TABLE pipeline_stages (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id  uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name       text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  color      text NOT NULL DEFAULT '#3b82f6',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_pipeline_stages_tenant ON pipeline_stages(tenant_id);

-- TAGS
CREATE TABLE tags (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id  uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name       text NOT NULL,
  color      text NOT NULL DEFAULT '#3b82f6',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_tags_tenant ON tags(tenant_id);

-- LEAD_TAGS (tabela de junção)
CREATE TABLE lead_tags (
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  tag_id  uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (lead_id, tag_id)
);

-- AGENTS (agentes IA)
CREATE TABLE agents (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id         uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name              text NOT NULL,
  prompt            text NOT NULL DEFAULT '',
  model             text NOT NULL DEFAULT 'gpt-4o',
  api_key_encrypted text,
  triggers          jsonb NOT NULL DEFAULT '[]',
  permissions       jsonb NOT NULL DEFAULT '{"canAssignTags": false, "canMovePipeline": false}',
  active            boolean NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_agents_tenant ON agents(tenant_id);

-- CONNECTIONS (WhatsApp Business)
CREATE TABLE connections (
  id                     uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id              uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  provider               text NOT NULL DEFAULT 'meta',
  phone_number_id        text NOT NULL,
  waba_id                text NOT NULL DEFAULT '',
  access_token_encrypted text NOT NULL,
  verify_token           text NOT NULL DEFAULT '',
  status                 text NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at             timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_connections_tenant ON connections(tenant_id);
CREATE UNIQUE INDEX idx_connections_phone ON connections(phone_number_id);

-- BROADCASTS
CREATE TABLE broadcasts (
  id                    uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id             uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name                  text NOT NULL,
  message               text NOT NULL,
  target_tags           text[],
  target_status         text,
  target_pipeline_stage text,
  status                text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  total_recipients      integer NOT NULL DEFAULT 0,
  sent_count            integer NOT NULL DEFAULT 0,
  failed_count          integer NOT NULL DEFAULT 0,
  scheduled_at          timestamptz,
  sent_at               timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_broadcasts_tenant ON broadcasts(tenant_id);

-- AUTOMATIONS
CREATE TABLE automations (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id  uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name       text NOT NULL,
  event      text NOT NULL,
  condition  text,
  action     text NOT NULL,
  active     boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_automations_tenant ON automations(tenant_id);

-- ============================================================
-- 4. TRIGGER: auto-update updated_at em leads
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Helper macro: habilita RLS + cria políticas padrão para tabelas com tenant_id
-- Vamos fazê-lo tabela por tabela para controle granular.

-- ── TENANTS ──────────────────────────────────────
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_full_access_tenants" ON tenants
  FOR ALL USING (auth.user_role() = 'owner')
  WITH CHECK (auth.user_role() = 'owner');

CREATE POLICY "tenant_reads_own" ON tenants
  FOR SELECT USING (id = auth.tenant_id());

-- ── PROFILES ─────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_full_access_profiles" ON profiles
  FOR ALL USING (auth.user_role() = 'owner')
  WITH CHECK (auth.user_role() = 'owner');

CREATE POLICY "client_manages_tenant_profiles" ON profiles
  FOR ALL
  USING (tenant_id = auth.tenant_id() AND auth.user_role() = 'client')
  WITH CHECK (tenant_id = auth.tenant_id() AND auth.user_role() = 'client');

CREATE POLICY "user_reads_tenant_profiles" ON profiles
  FOR SELECT USING (tenant_id = auth.tenant_id());

-- ── LEADS ────────────────────────────────────────
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_full_access_leads" ON leads
  FOR ALL USING (auth.user_role() = 'owner')
  WITH CHECK (auth.user_role() = 'owner');

CREATE POLICY "tenant_access_leads" ON leads
  FOR ALL
  USING (tenant_id = auth.tenant_id())
  WITH CHECK (tenant_id = auth.tenant_id());

-- ── CONVERSATIONS ────────────────────────────────
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_full_access_conversations" ON conversations
  FOR ALL USING (auth.user_role() = 'owner')
  WITH CHECK (auth.user_role() = 'owner');

CREATE POLICY "tenant_access_conversations" ON conversations
  FOR ALL
  USING (tenant_id = auth.tenant_id())
  WITH CHECK (tenant_id = auth.tenant_id());

-- ── MESSAGES ─────────────────────────────────────
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_full_access_messages" ON messages
  FOR ALL USING (auth.user_role() = 'owner')
  WITH CHECK (auth.user_role() = 'owner');

CREATE POLICY "tenant_access_messages" ON messages
  FOR ALL
  USING (tenant_id = auth.tenant_id())
  WITH CHECK (tenant_id = auth.tenant_id());

-- ── PIPELINE_STAGES ──────────────────────────────
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_full_access_pipeline_stages" ON pipeline_stages
  FOR ALL USING (auth.user_role() = 'owner')
  WITH CHECK (auth.user_role() = 'owner');

CREATE POLICY "tenant_access_pipeline_stages" ON pipeline_stages
  FOR ALL
  USING (tenant_id = auth.tenant_id())
  WITH CHECK (tenant_id = auth.tenant_id());

-- ── TAGS ─────────────────────────────────────────
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_full_access_tags" ON tags
  FOR ALL USING (auth.user_role() = 'owner')
  WITH CHECK (auth.user_role() = 'owner');

CREATE POLICY "tenant_access_tags" ON tags
  FOR ALL
  USING (tenant_id = auth.tenant_id())
  WITH CHECK (tenant_id = auth.tenant_id());

-- ── LEAD_TAGS ────────────────────────────────────
ALTER TABLE lead_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_full_access_lead_tags" ON lead_tags
  FOR ALL USING (auth.user_role() = 'owner')
  WITH CHECK (auth.user_role() = 'owner');

CREATE POLICY "tenant_access_lead_tags" ON lead_tags
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM leads WHERE leads.id = lead_tags.lead_id AND leads.tenant_id = auth.tenant_id())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM leads WHERE leads.id = lead_tags.lead_id AND leads.tenant_id = auth.tenant_id())
  );

-- ── AGENTS ───────────────────────────────────────
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_full_access_agents" ON agents
  FOR ALL USING (auth.user_role() = 'owner')
  WITH CHECK (auth.user_role() = 'owner');

CREATE POLICY "tenant_access_agents" ON agents
  FOR ALL
  USING (tenant_id = auth.tenant_id())
  WITH CHECK (tenant_id = auth.tenant_id());

-- ── CONNECTIONS ──────────────────────────────────
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_full_access_connections" ON connections
  FOR ALL USING (auth.user_role() = 'owner')
  WITH CHECK (auth.user_role() = 'owner');

CREATE POLICY "tenant_access_connections" ON connections
  FOR ALL
  USING (tenant_id = auth.tenant_id())
  WITH CHECK (tenant_id = auth.tenant_id());

-- ── BROADCASTS ───────────────────────────────────
ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_full_access_broadcasts" ON broadcasts
  FOR ALL USING (auth.user_role() = 'owner')
  WITH CHECK (auth.user_role() = 'owner');

CREATE POLICY "tenant_access_broadcasts" ON broadcasts
  FOR ALL
  USING (tenant_id = auth.tenant_id())
  WITH CHECK (tenant_id = auth.tenant_id());

-- ── AUTOMATIONS ──────────────────────────────────
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_full_access_automations" ON automations
  FOR ALL USING (auth.user_role() = 'owner')
  WITH CHECK (auth.user_role() = 'owner');

CREATE POLICY "tenant_access_automations" ON automations
  FOR ALL
  USING (tenant_id = auth.tenant_id())
  WITH CHECK (tenant_id = auth.tenant_id());

-- ============================================================
-- 6. Habilitar Realtime para mensagens e conversas
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
