# 🏛️ Arquitetura do Sistema

Este projeto segue os princípios da **Clean Architecture** e **S.O.L.I.D.** para garantir que o sistema seja escalável, testável e independente de frameworks externos.

## 🏗️ Camadas do Backend

O backend está organizado em camadas concêntricas, onde as dependências apontam para dentro (em direção ao domínio).

### 1. 📂 `domain/` (Coração do Sistema)
- **Entidades**: Representam os conceitos de negócio (ex: `Lead`, `Message`, `Agent`). São classes puras TypeScript sem dependências externas.
- **Enums**: Definições globais de tipos e estados (ex: `MessageSenderType`, `LeadStatus`).
- **Erros**: Exceções customizadas para falhas de domínio.

### 2. 📂 `application/` (Regras de Negócio)
- **Use Cases**: Contêm a lógica específica de cada funcionalidade (ex: `handleIncomingMessage.ts`). Eles orquestram as entidades e chamam os repositórios/serviços.
- **Repositories (Interfaces)**: Definem o contrato que a infraestrutura deve seguir. Isso permite trocar o banco de dados (ex: Supabase por Postgres puro) sem alterar a lógica de negócio.
- **Services (Interfaces)**: Definem contratos para serviços externos (ex: `WhatsAppService`, `AiOrchestrator`).

### 3. 📂 `infrastructure/` (Implementação Técnica)
- **Repositories (Supabase)**: Implementações reais que comunicam com as tabelas do Supabase utilizando o cliente `@supabase/supabase-js`.
- **Services**: Implementações reais de integração (ex: `EvolutionApiServiceImpl`, `OpenAiService`).
- **Container**: Sistema de injeção de dependência manual (`container.ts`) que instancia todas as classes e injeta as dependências necessárias nos Use Cases.

---

## ⚡ Fluxo de Dados (Data Flow)

1.  **Entrada**: Uma requisição chega via API Route (ex: `app/api/evolution/webhook/route.ts`).
2.  **Injeção**: O container é inicializado com o cliente Supabase.
3.  **Execução**: O Use Case correspondente é chamado (ex: `handleIncomingMessage`).
4.  **Persistência**: O Use Case interage com as interfaces (Repositories), que por baixo usam o Supabase para salvar os dados.
5.  **Realtime**: O frontend ouve as mudanças no Postgres do Supabase e atualiza a interface via **Zustand**.

---

## 🔐 Multi-tenancy (Isolamento de Dados)

O sistema utiliza um modelo de **Identificador de Tenant** (`tenant_id`).

- Quase todas as tabelas possuem uma coluna `tenant_id`.
- O backend sempre filtra as operações pelo `tenant_id` do usuário ou conexão atual.
- A segurança é reforçada no banco de dados via **RLS (Row Level Security)**, garantindo que mesmo se houver um erro no código, um tenant nunca conseguirá ler dados de outro.

---

## 🧪 Testabilidade

Graças ao desacoplamento via interfaces, podemos testar os **Use Cases** sem tocar no banco de dados, injetando "Mocks" dos repositórios e serviços. Isso garante que os testes sejam extremamente rápidos e rodem em milissegundos.
