# 🏛️ Arquitetura do Sistema

Este projeto segue os princípios da **Clean Architecture** e **S.O.L.I.D.** para garantir que o sistema seja escalável, testável e independente de frameworks externos.

## 🏗️ Estrutura de Pastas e Camadas

O sistema está dividido em uma clara separação entre a lógica de domínio (Backend) e a interface do usuário (Frontend).

### 1. 📂 `backend/` (Regras de Domínio)
- **`domain/`**: Entidades puras e Enums. É o coração do sistema, livre de dependências de framework.
- **`application/`**: Use cases (ex: `renamePipelineStage`) e interfaces de repositórios.
- **`infrastructure/`**: Implementações reais que comunicam com o Supabase (`supabase-lead.repository.ts`, etc.).

### 2. 📂 `infrastructure/repositories/` (Ponto de Entrada Frontend)
- **`index.ts`**: Atua como um **Service Locator/DI Container** simplificado para as Stores do Frontend. Ele instancia as implementações em `backend/infrastructure/repositories` injetando o cliente Supabase.

### 3. 📂 `lib/stores/` (Gerenciamento de Estado)
- Utiliza **Zustand** para manter o estado global da aplicação.
- Cada store (ex: `conversationsStore`) é responsável por buscar dados iniciais e gerenciar o estado local.

---

## ⚡ Realtime e Sincronização de Dados

Diferente de CRMs tradicionais, este sistema é **reativo**.

1.  **Subscription**: Ao carregar o Dashboard, as Stores iniciam subscrições via `supabase.channel()`.
2.  **Mutação**: Quando qualquer parte do sistema (ou a Evolution API via webhook) altera o banco de dados (ex: nova mensagem ou mudança de etapa no pipeline):
    - O banco de dados emite um evento de mudança.
    - O listener na Store intercepta o `payload`.
    - O estado do **Zustand** é atualizado instantaneamente, refletindo na UI sem refresh.
3.  **Fluxo de Update**: `Database -> Supabase Realtime -> Zustand Store -> React Component`.

---

## 🔐 Multi-tenancy e Segurança (RLS)

O isolamento é garantido em duas frentes:
1.  **Código**: Todas as queries nos repositórios incluem `.match({ tenant_id })`.
2.  **Banco (RLS)**: Existe uma camada de segurança no Supabase (Row Level Security) que impede que um usuário autenticado acesse registros de outro `tenant_id`, mesmo que tente burlar as chamadas de API.

---

## 🧪 Testabilidade e Manutenibilidade

- **Desacoplamento**: O Frontend não sabe que está usando Supabase; ele interage com as interfaces de Repositório fornecidas pelo `infrastructure/repositories`.
- **Mocks**: Para testes de interface ou lógica de negócio, as implementações do Supabase podem ser trocadas por repositórios "In-memory" (Mocks) sem alterar uma única linha de código nos componentes React.
