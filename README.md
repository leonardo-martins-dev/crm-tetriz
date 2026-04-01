# NO PONTO CRM - Omnichannel

CRM Omnichannel mockado para a agência NO PONTO, desenvolvido com Next.js, TypeScript e TailwindCSS.

## 🚀 Tecnologias

- **Next.js 14+** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Zustand** (Estado global)
- **Lucide React** (Ícones)
- **date-fns** (Formatação de datas)

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar produção
npm start
```

## 🔐 Usuários de Teste

O sistema possui 3 usuários mockados:

1. **Owner (Dono da NO PONTO)**
   - Email: `joao@noponto.com`
   - Senha: qualquer senha funciona
   - Acesso: área admin completa

2. **Cliente da Agência**
   - Email: `maria@cliente1.com`
   - Senha: qualquer senha funciona
   - Acesso: dashboard do cliente

3. **Usuário do Cliente**
   - Email: `pedro@cliente1.com`
   - Senha: qualquer senha funciona
   - Acesso: dashboard do cliente

## 🎯 Funcionalidades

### Dashboard
- Visão geral com métricas principais
- Leads por canal
- Leads por etapa do pipeline

### Inbox Unificada
- Lista de conversas (Instagram, Facebook, WhatsApp)
- Chat em tempo real (mockado)
- Lead card lateral com informações completas
- Indicador de janela 24h
- Envio de mensagens (bloqueado quando janela fechada)

### Pipeline / Funil
- Visualização Kanban
- Drag & drop entre etapas
- Contador de leads por etapa
- Etapas customizáveis

### Leads
- Lista completa de leads
- Filtros por canal e tags
- Busca por nome, email ou telefone
- Cards com informações resumidas

### Automações
- Interface visual para criar automações
- Ativar/desativar automações
- Eventos, condições e ações

### Métricas
- Métricas gerais do CRM
- Leads por canal
- Leads por etapa
- Taxa de conversão

### Área Admin (Owner)
- Gestão de clientes
- Gestão de usuários
- Métricas gerais da NO PONTO
- Ranking de clientes
- Impersonate (acessar CRM do cliente)

## 🎨 Design

- Design moderno estilo Kommo/Linear/Vercel
- Dark mode + Light mode
- Layout responsivo (desktop-first)
- Microinterações e transições suaves
- Componentes reutilizáveis

## 📁 Estrutura

```
├── app/                    # Páginas Next.js (App Router)
│   ├── dashboard/         # Área do cliente/usuário
│   ├── admin/            # Área do owner
│   └── layout.tsx        # Layout raiz
├── components/            # Componentes React
│   ├── ui/               # Componentes base (Button, Card, etc)
│   └── ...               # Componentes específicos
├── lib/
│   ├── stores/           # Stores Zustand
│   ├── contexts/          # Contexts React
│   └── utils.ts          # Funções utilitárias
└── types/                 # Tipos TypeScript
```

## ⚠️ Importante

- **TODOS os dados são MOCKADOS**
- Não há backend real
- Não há integração com APIs
- Foco total em UX e interface
- Sistema 100% funcional visualmente

## 🎯 Próximos Passos

Para transformar em um sistema real, seria necessário:
1. Implementar backend (API REST ou GraphQL)
2. Integrar com APIs do Instagram, Facebook e WhatsApp
3. Implementar autenticação real
4. Adicionar banco de dados
5. Implementar WebSockets para chat em tempo real
6. Adicionar sistema de notificações

---

Desenvolvido para a **Agência NO PONTO** 🚀

