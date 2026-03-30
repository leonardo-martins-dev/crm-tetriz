# Checklist Supabase — Progresso

## Fase 1: Projeto Supabase ✅
- [x] Projeto criado: `ggxdiroqnhddsfelsvjp`
- [x] URL: `https://ggxdiroqnhddsfelsvjp.supabase.co`
- [x] Anon key obtida e configurada
- [x] Dependências instaladas: `@supabase/supabase-js @supabase/ssr`

## Fase 2: Banco de Dados ✅
- [x] Extensões: `pgcrypto`, `uuid-ossp`
- [x] Helper functions: `get_tenant_id()`, `get_user_role()` (com `search_path` fixo)
- [x] 12 tabelas criadas com índices otimizados
- [x] Trigger `updated_at` em leads
- [x] Realtime habilitado para `messages` e `conversations`
- [x] Security advisors limpos (0 warnings)

## Fase 3: RLS (Row Level Security) ✅
- [x] RLS habilitado em TODAS as 12 tabelas
- [x] Políticas `owner_full_access` em todas as tabelas
- [x] Políticas `tenant_access` isolando dados por tenant
- [x] Políticas especiais para `profiles` (client gerencia, user lê)
- [x] Políticas especiais para `lead_tags` (via EXISTS em leads)

## Fase 4: Autenticação ⬜
- [ ] Preencher `SUPABASE_SERVICE_ROLE_KEY` no `.env.local`
  - Copiar de: Dashboard > Settings > API > service_role (secret)
- [ ] Criar seu usuário owner via Supabase Dashboard > Auth > Users
- [ ] Setar custom claims (app_metadata) do owner via SQL:
  ```sql
  UPDATE auth.users
  SET raw_app_meta_data = jsonb_build_object(
    'role', 'owner',
    'tenant_id', '00000000-0000-0000-0000-000000000000'
  )
  WHERE email = 'SEU_EMAIL_AQUI';
  ```
- [ ] Criar perfil do owner na tabela profiles:
  ```sql
  INSERT INTO profiles (id, tenant_id, name, email, role)
  VALUES (
    (SELECT id FROM auth.users WHERE email = 'SEU_EMAIL_AQUI'),
    '00000000-0000-0000-0000-000000000000',
    'Seu Nome',
    'SEU_EMAIL_AQUI',
    'owner'
  );
  ```

## Fase 5: Migrar Stores do Frontend ⬜
- [ ] Substituir `authStore.ts` → login real via `supabase.auth.signInWithPassword()`
- [ ] Substituir `clientsStore.ts` → `TenantRepository` (Supabase)
- [ ] Substituir `usersStore.ts` → `ProfileRepository` (Supabase)
- [ ] Substituir `leadsStore.ts` → `SupabaseLeadRepository`
- [ ] Substituir `conversationsStore.ts` → repos reais
- [ ] Conectar hooks Realtime para inbox

## Fase 6: API Routes ⬜
- [ ] `app/api/webhooks/whatsapp/route.ts` (GET verify, POST incoming)
- [ ] `app/api/conversations/send/route.ts` (POST send message)
- [ ] `app/api/admin/tenants/route.ts` (CRUD tenants, owner only)
- [ ] `app/api/admin/users/route.ts` (CRUD auth users, owner only)

## Fase 7: Meta WhatsApp ⬜
- [ ] Registrar Meta App em developers.facebook.com
- [ ] Habilitar WhatsApp Business API
- [ ] Configurar webhook URL
- [ ] Preencher `META_APP_SECRET` e `META_VERIFY_TOKEN`

## Fase 8: Pré-produção ⬜
- [ ] Habilitar confirmação de email
- [ ] Configurar SMTP
- [ ] Restringir CORS
- [ ] Validar que service_role key não está no client
