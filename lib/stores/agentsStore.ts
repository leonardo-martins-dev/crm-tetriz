import { create } from 'zustand'

export type TriggerType = 'tag' | 'pipeline_stage'

export interface AgentTrigger {
  id: string
  type: TriggerType
  value: string
}

export interface AgentPermissions {
  canAssignTags: boolean
  canMovePipeline: boolean
}

export interface Agent {
  id: string
  name: string
  prompt: string
  triggers: AgentTrigger[]
  permissions: AgentPermissions
  model: string
  apiKey: string
  active: boolean
  createdAt: string
}

interface AgentsState {
  agents: Agent[]
  addAgent: (agent: Omit<Agent, 'id' | 'createdAt'>) => void
  updateAgent: (agentId: string, updates: Partial<Agent>) => void
  deleteAgent: (agentId: string) => void
  toggleAgentActive: (agentId: string) => void
}

const mockAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Assistente de Qualificação',
    prompt: 'Você é um assistente simpático. Sua função é responder a leads novos e perguntar a renda deles.',
    triggers: [
      { id: 'trig-1', type: 'pipeline_stage', value: 'Novo Lead' }
    ],
    permissions: {
      canAssignTags: true,
      canMovePipeline: false,
    },
    model: 'gpt-4o',
    apiKey: 'sk-mock-12345',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'agent-2',
    name: 'Cobrança Educada',
    prompt: 'Seja polido mas firme relembrando o cliente que um orçamento vence em 24h.',
    triggers: [
      { id: 'trig-2', type: 'tag', value: 'Follow-up' },
      { id: 'trig-3', type: 'pipeline_stage', value: 'Orçamento' }
    ],
    permissions: {
      canAssignTags: false,
      canMovePipeline: true,
    },
    model: 'claude-3-5-sonnet',
    apiKey: 'sk-ant-mock-987',
    active: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

export const useAgentsStore = create<AgentsState>((set) => ({
  agents: mockAgents,

  addAgent: (agentData) => {
    const newAgent: Agent = {
      ...agentData,
      id: `agent-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    set((state) => ({ agents: [...state.agents, newAgent] }))
  },

  updateAgent: (agentId, updates) => {
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === agentId ? { ...agent, ...updates } : agent
      ),
    }))
  },

  deleteAgent: (agentId) => {
    set((state) => ({
      agents: state.agents.filter((agent) => agent.id !== agentId),
    }))
  },

  toggleAgentActive: (agentId) => {
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === agentId ? { ...agent, active: !agent.active } : agent
      ),
    }))
  },
}))
