import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/authStore'

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

export const useAgentsStore = create<AgentsState>((set, get) => ({
  agents: [],
  isLoading: false,

  fetchAgents: async () => {
    const tenantId = useAuthStore.getState().user?.tenantId
    if (!tenantId) return

    set({ isLoading: true })
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('name', { ascending: true })

      if (error) throw error

      set({ 
        agents: (data || []).map(row => ({
          id: row.id,
          tenantId: row.tenant_id,
          name: row.name,
          prompt: row.prompt,
          triggers: row.triggers || [],
          permissions: row.permissions || { canAssignTags: false, canMovePipeline: false },
          model: row.model,
          apiKey: row.api_key_encrypted, // Note: Encrypted on backend
          active: row.active,
          createdAt: row.created_at,
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
      const { data, error } = await supabase
        .from('agents')
        .insert({
          tenant_id: tenantId,
          name: agentData.name,
          prompt: agentData.prompt,
          triggers: agentData.triggers,
          permissions: agentData.permissions,
          model: agentData.model,
          api_key_encrypted: agentData.apiKey,
          active: agentData.active,
        })
        .select()
        .single()

      if (error) throw error

      const newAgent: Agent = {
        id: data.id,
        tenantId: data.tenant_id,
        name: data.name,
        prompt: data.prompt,
        triggers: data.triggers,
        permissions: data.permissions,
        model: data.model,
        apiKey: data.api_key_encrypted,
        active: data.active,
        createdAt: data.created_at,
      }

      set((state) => ({ agents: [...state.agents, newAgent] }))
    } catch (err) {
      console.error('Erro ao adicionar agente:', err)
    }
  },

  updateAgent: async (agentId, updates) => {
    try {
      const rowUpdates: any = {}
      if (updates.name !== undefined) rowUpdates.name = updates.name
      if (updates.prompt !== undefined) rowUpdates.prompt = updates.prompt
      if (updates.triggers !== undefined) rowUpdates.triggers = updates.triggers
      if (updates.permissions !== undefined) rowUpdates.permissions = updates.permissions
      if (updates.model !== undefined) rowUpdates.model = updates.model
      if (updates.apiKey !== undefined) rowUpdates.api_key_encrypted = updates.apiKey
      if (updates.active !== undefined) rowUpdates.active = updates.active

      const { error } = await supabase
        .from('agents')
        .update(rowUpdates)
        .eq('id', agentId)

      if (error) throw error

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
    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', agentId)

      if (error) throw error

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
