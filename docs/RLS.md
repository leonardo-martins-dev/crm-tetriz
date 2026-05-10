# 🔐 Row Level Security (RLS) e Isolamento de Dados

O sistema utiliza **Row Level Security (RLS)** nativo do PostgreSQL (via Supabase) como a camada definitiva de segurança para garantir o isolamento total entre múltiplos tenants (empresas).

---

## 🏗️ Como Funciona o Isolamento

O isolamento baseia-se em informações contidas no **JWT (JSON Web Token)** do usuário autenticado. Duas funções auxiliares extraem esses metadados:

1.  **`public.jwt_tenant_id()`**: Extrai o UUID da empresa (`tenant_id`) de `auth.jwt() -> 'app_metadata'`.
2.  **`public.jwt_user_role()`**: Extrai o nível de acesso (`role`) do usuário (`owner`, `client` ou `user`).

> No Supabase hospedado não é permitido criar funções no schema `auth`; por isso os helpers ficam em `public` (ver migração SQL).

---

## 📜 Políticas de Acesso por Tabela

Quase todas as tabelas possuem a coluna `tenant_id`. Abaixo estão as regras aplicadas:

### 1. Governança Global (`owner`)
Usuários com o papel de **Owner** (administradores do SaaS) possuem acesso total (`FOR ALL`) a todas as tabelas, permitindo suporte técnico e gestão da infraestrutura.

### 2. Gestão de Clientes (`tenants`)
- **Administrador SaaS**: Acesso total.
- **Tenant**: Pode apenas ler seus próprios dados (`id = public.jwt_tenant_id()`).

### 3. Gestão de Equipe (`profiles`)
- **Administrador do Tenant (`client`)**: Pode criar, editar e desativar usuários da sua própria empresa.
- **Usuário Padrão (`user`)**: Pode apenas ler os nomes e avatares dos colegas de equipe.

### 4. Dados Operacionais (`leads`, `messages`, `conversations`, etc.)
- **Acesso Total por Tenant**: Qualquer usuário autenticado tem acesso total aos dados de sua empresa, desde que o `tenant_id` do registro coincida com o de seu JWT.
- **Filtro Nativo**:
  ```sql
  USING (tenant_id = public.jwt_tenant_id())
  WITH CHECK (tenant_id = public.jwt_tenant_id())
  ```

### 5. Tabelas de Ligação (`lead_tags`)
Para tabelas que não possuem `tenant_id` direto, o sistema utiliza subqueries para validar a posse:
- **Regra**: Só é possível vincular uma tag a um lead se o lead pertencer ao mesmo `tenant_id` do usuário.

---

## 🚀 Realtime Seguro

O Supabase Realtime respeita rigorosamente as políticas de RLS.
- Quando uma mensagem é enviada, apenas os usuários que possuem permissão de `SELECT` (ou seja, pertencem ao mesmo tenant) receberão o broadcast via WebSocket.
- O canal `supabase_realtime` está habilitado especificamente para as tabelas de `messages` e `conversations`.

---

## 🛠️ Auditoria e Erros

Caso um usuário tente acessar o ID de um lead de outra empresa via URL ou API:
- O banco de dados retornará um resultado vazio ou erro de permissão.
- Isso garante que, mesmo que a camada de aplicação falhe em filtrar por `tenant_id`, o banco de dados bloqueará o vazamento de informações.
