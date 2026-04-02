import { create } from 'zustand'
import { Client, ClientPlan } from '@/types'
import { getTenantRepository } from '@/infrastructure/repositories'

export const AVAILABLE_MODULES = [
  { id: 'inbox', label: 'Inbox' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'agents', label: 'Agentes IA' },
  { id: 'automations', label: 'Automações' },
  { id: 'broadcast', label: 'Broadcast' },
  { id: 'metrics', label: 'Métricas' },
] as const

interface ClientsState {
  clients: Client[]
  isLoading: boolean
  fetchClients: () => Promise<void>
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'userCount' | 'leadCount'>) => Promise<void>
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>
  toggleClientActive: (id: string) => Promise<void>
  deleteClient: (id: string) => Promise<void>
}

const tenantRepo = getTenantRepository()

export const useClientsStore = create<ClientsState>((set, get) => ({
  clients: [],
  isLoading: false,

  fetchClients: async () => {
    set({ isLoading: true })
    try {
      const tenants = await tenantRepo.listAll()

      const mappedClients: Client[] = tenants.map(row => ({
        id: row.id,
        name: row.name,
        active: row.active,
        plan: row.plan as ClientPlan,
        modules: row.modules as string[] || [],
        maxUsers: row.maxUsers,
        createdAt: row.createdAt,
        userCount: 0,
        leadCount: 0,
      }))

      set({ clients: mappedClients, isLoading: false })
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
      set({ isLoading: false })
    }
  },

  addClient: async (clientData) => {
    try {
      await tenantRepo.create({
        name: clientData.name,
        active: clientData.active,
        plan: clientData.plan,
        modules: clientData.modules as string[],
        maxUsers: clientData.maxUsers,
      })
      await get().fetchClients()
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error)
    }
  },

  updateClient: async (id, updates) => {
    try {
      await tenantRepo.update(id, {
        name: updates.name,
        active: updates.active,
        plan: updates.plan,
        modules: updates.modules as string[],
        maxUsers: updates.maxUsers,
      })
      await get().fetchClients()
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error)
    }
  },

  toggleClientActive: async (id) => {
    try {
      await tenantRepo.toggleActive(id)
      await get().fetchClients()
    } catch (error) {
      console.error('Erro ao alternar status do cliente:', error)
    }
  },

  deleteClient: async (id) => {
    try {
      await tenantRepo.delete(id)
      await get().fetchClients()
    } catch (error) {
      console.error('Erro ao deletar cliente:', error)
    }
  },
}))

