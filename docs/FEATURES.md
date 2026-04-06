# Documentação de Funcionalidades Detalhada - CRM White Label

Este documento fornece uma visão técnica e operacional 100% precisa de todas as funcionalidades do sistema, validada diretamente contra o código-fonte.

---

## 1. Estados de Negócio vs. Etapas do Funil (Dinâmicas)

O sistema diferencia o "estado de negócio" do lead de sua "posição no processo de vendas".

### Estados de Negócio (Status Fixos)
Estes representam a saúde macro do lead e são usados para métricas globais de conversão:
- **Novo (`new`)**: Lead recém-chegado, sem interação.
- **Qualificado (`qualified`)**: Lead com perfil de compra confirmado.
- **Proposta (`proposal`)**: Negociação de valores em andamento.
- **Ganhou (`won`)**: Cliente fechado.
- **Perdido (`lost`)**: Oportunidade descartada.

### Etapas do Funil (Totalmente Personalizáveis)
As **Etapas** são as colunas visuais no Pipeline (Kanban). 
- **Ações**: Criar, Editar (Nome/Cor), Reordenar e Excluir.
- **Sincronização**: Ao renomear uma etapa, todos os leads vinculados são atualizados instantaneamente.
- **Segurança**: Ao excluir uma etapa, os leads são movidos para a primeira coluna do funil automaticamente.

---

## 2. Gestão de Equipe e Usuários

Controle granular de quem acessa o sistema em cada Tenant.

- **Perfis de Acesso**:
    - **Administrador (`client`)**: Acesso total às configurações da empresa, usuários e conexões.
    - **Usuário Padrão (`user`)**: Focado no atendimento e gestão de leads.
- **Controle de Acesso**: Possibilidade de **Ativar/Desativar** usuários instantaneamente sem remover os dados históricos.
- **Busca**: Filtro em tempo real por nome ou e-mail.

---

## 3. Central de Gerenciamento de Tags

Sistema global de etiquetas para segmentação avançada.

- **Gestão Centralizada**: Local único para criar e padronizar as tags da empresa.
- **Identificação Visual**: 16 cores pré-definidas (Azul, Roxo, Laranja, Verde, etc.) para categorização rápida.
- **Contagem de Uso**: Exibição em tempo real de quantos leads estão vinculados a cada tag.

---

## 4. Configurações e Personalização

### Meu Perfil
- Alteração de Nome e Email.
- Upload de foto de perfil (JPG, PNG, GIF até 5MB).
- Visualização do cargo/função.

### Empresa (Restrito a Admins)
- Alteração do Nome Comercial.
- Visualização de indicadores de uso (Total de Usuários e Leads).
- Gestão de Plano e Assinatura (Ex: Plano Essencial Anual).

> [!NOTE]
> As abas de **Notificações** e **Segurança** estão marcadas como "Em Construção" na interface atual.

---

## 5. Painel do Administrador SaaS (Owner)

Visão consolidada para os donos da plataforma.

### Métricas de Ecossistema
- **Total de Clientes**: Volume de empresas (Tenants) na plataforma.
- **Clientes Ativos**: Taxa de retenção e uso.
- **Total de Leads e Usuários**: Somatório de todos os dados processados na infraestrutura.

### Relatórios e Rankings
- **Ranking de Clientes**: Lista das 5 empresas com maior volume de leads.
- **Distribuição de Carga**: Gráficos comparativos de volume de dados por cliente.
- **Médias Operacionais**: Leads por cliente, Usuários por cliente e Taxa de ativação geral.

---

## 6. Configuração de Agentes IA

Os "funcionários virtuais" que operam via LLM.

- **Modelos**: GPT-4o, GPT-4 Turbo, Claude 3.5 Sonnet, Gemini 1.5 Pro e Llama 3.
- **Gatilhos (Triggers)**: Ativação por entrada em etapa específica ou atribuição de tag.
- **Autonomia**: Permissão para mover leads no pipeline e gerenciar tags de forma independente durante a conversa.

---

## 7. Inbox e Comunicação WhatsApp

- **Omnichannel**: Chat em tempo real com texto, imagens, áudios e documentos.
- **Sincronização**: Status de leitura (Visto) e entrega via Evolution API.
- **Janela de 24h**: Indicador visual de prazo para resposta gratuita.
- **Responsabilidade**: Limpeza visual sobre quem está atendendo (Humano ou IA).

---

## 8. Broadcast (Transmissões)

- **Envios em Massa**: Segmentação por tags ou etapas do funil.
- **Agendamento**: Suporte a disparos programados (campo `scheduleAt`).
- **Monitoramento**: Status em tempo real de cada mensagem da campanha.
- **Interface**: Animações suaves em botões, transições de página e estados de erro.
- **Acessibilidade**: Seguindo boas práticas de contraste e navegação via teclado.
