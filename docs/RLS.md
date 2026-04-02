# 🔐 Guia de Segurança e RLS (Row Level Security)

Para garantir o isolamento de dados no CRM, o Supabase utiliza **Row Level Security (RLS)**. Isso garante que cada usuário ou organização só possa ver e editar seus próprios dados.

## 🛡️ Ativar RLS em Todas as Tabelas

Você deve executar os comandos abaixo no **SQL Editor** do Supabase para ativar o RLS em todas as tabelas:

```sql
-- Ativar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
```

---

## 📜 Políticas de Segurança (Exemplo)

Execute estas políticas para garantir que o isolamento por `tenant_id` funcione:

### 1. 📂 `profiles` (Perfis de Usuário)
```sql
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);
```

### 2. 📂 `leads` (Leads do CRM)
```sql
CREATE POLICY "Tenant Leads access" 
ON leads FOR ALL 
USING (
  tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid())
);
```

### 3. 📂 `messages` (Mensagens de Chat)
```sql
CREATE POLICY "Tenant Messages access" 
ON messages FOR ALL 
USING (
  tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid())
);
```

---

## 🏗️ Backend e Webhooks (`service_role`)

Algumas operações (como o recebimento de webhooks do WhatsApp) são feitas pelo backend administrativo e precisam de acesso a todas as tabelas.

Para isso, o backend deve utilizar a **SUPABASE_SERVICE_ROLE_KEY**. Esta chave ignora as políticas de RLS e deve ser usada **apenas em código do servidor** (Backend API Routes).

### 🚨 Segurança Importante:
- **NUNCA** use a `service_role_key` no frontend.
- O frontend deve usar apenas a `anon_key`, respeitando o RLS.

---

## ✅ Checklist de Segurança

1.  [ ] Conferiu se o RLS está **ENABLE** no Dashboard do Supabase.
2.  [ ] Validou que as políticas de SELECT/UPDATE/INSERT usam o `auth.uid()` ou o `tenant_id` do perfil.
3.  [ ] Testou efetuar login com dois usuários de tenants diferentes e garantiu que um não vê os dados do outro.
