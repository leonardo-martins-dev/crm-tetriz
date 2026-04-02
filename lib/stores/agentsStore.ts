import { create } from 'zustand'
import { useAuthStore } from '@/lib/stores/authStore'
import { getAgentRepository } from '@/infrastructure/repositories'

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
  tenantId?: string
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
  isLoading: boolean
  fetchAgents: () => Promise<void>
  addAgent: (agent: Omit<Agent, 'id' | 'createdAt'>) => Promise<void>
  updateAgent: (agentId: string, updates: Partial<Agent>) => Promise<void>
  deleteAgent: (agentId: string) => Promise<void>
  toggleAgentActive: (agentId: string) => Promise<void>
}

const agentRepo = getAgentRepository()

export const useAgentsStore = create<AgentsState>((set, get) => ({
  agents: [],
  isLoading: false,

  fetchAgents: async () => {
    const tenantId = useAuthStore.getState().user?.tenantId
    if (!tenantId) return

    set({ isLoading: true })
    try {
      const agents = await agentRepo.findByTenantId(tenantId)

      set({ 
        agents: agents.map(row => ({
          id: row.id,
          tenantId: row.tenantId,
          name: row.name,
          prompt: row.prompt,
          triggers: row.triggers as any || [],
          permissions: row.permissions as any || { canAssignTags: false, canMovePipeline: false },
          model: row.model,
          apiKey: row.apiKeyEncrypted,
          active: row.active,
          createdAt: row.createdAt,
        })), 
        isLoading: false 
      })
    } catch (err) {
      console.error('Erro ao buscar agentes:', err)
      set({ isLoading: false })
    }
  },

  addAgent: async (agentData) => {
    const tenantId = useAuthStore.getState().user?.tenantId
    if (!tenantId) return

    try {
      const data = await agentRepo.create({
        tenantId,
        name: agentData.name,
        prompt: agentData.prompt,
        triggers: agentData.triggers as any,
        permissions: agentData.permissions as any,
        model: agentData.model,
        apiKeyEncrypted: agentData.apiKey,
        active: agentData.active,
      })

      const newAgent: Agent = {
        id: data.id,
        tenantId: data.tenantId,
        name: data.name,
        prompt: data.prompt,
        triggers: data.triggers as any,
        permissions: data.permissions as any,
        model: data.model,
        apiKey: data.apiKeyEncrypted,
        active: data.active,
        createdAt: data.createdAt,
      }

      set((state) => ({ agents: [...state.agents, newAgent] }))
    } catch (err) {
      console.error('Erro ao adicionar agente:', err)
    }
  },

  updateAgent: async (agentId, updates) => {
    const tenantId = useAuthStore.getState().user?.tenantId
    if (!tenantId) return

    try {
      await agentRepo.update(tenantId, agentId, {
        name: updates.name,
        prompt: updates.prompt,
        triggers: updates.triggers as any,
        permissions: updates.permissions as any,
        model: updates.model,
        apiKeyEncrypted: updates.apiKey,
        active: updates.active
      })

      set((state) => ({
        agents: state.agents.map((agent) =>
          agent.id === agentId ? { ...agent, ...updates } : agent
        ),
      }))
    } catch (err) {
      console.error('Erro ao atualizar agente:', err)
    }
  },

  deleteAgent: async (agentId) => {
    const tenantId = useAuthStore.getState().user?.tenantId
    if (!tenantId) return

    try {
      await agentRepo.delete(tenantId, agentId)

      set((state) => ({
        agents: state.agents.filter((agent) => agent.id !== agentId),
      }))
    } catch (err) {
      console.error('Erro ao deletar agente:', err)
    }
  },

  toggleAgentActive: async (agentId) => {
    const agent = get().agents.find(a => a.id === agentId)
    if (!agent) return
    await get().updateAgent(agentId, { active: !agent.active })
  },
}))
