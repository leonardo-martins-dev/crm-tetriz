import { create } from 'zustand'
import { Automation } from '@/types'
import { useAuthStore } from './authStore'
import { getAutomationRepository } from '@/infrastructure/repositories'

interface AutomationsState {
  automations: Automation[]
  isLoading: boolean
  fetchAutomations: () => Promise<void>
  toggleAutomation: (id: string) => Promise<void>
  addAutomation: (automation: Omit<Automation, 'id'>) => Promise<void>
  updateAutomation: (id: string, updates: Partial<Automation>) => Promise<void>
  deleteAutomation: (id: string) => Promise<void>
}

const automationRepo = getAutomationRepository()

export const useAutomationsStore = create<AutomationsState>((set, get) => ({
  automations: [],
  isLoading: false,

  fetchAutomations: async () => {
    const tenantId = useAuthStore.getState().user?.tenantId
    if (!tenantId) return

    set({ isLoading: true })
    try {
      const data = await automationRepo.findByTenantId(tenantId)

      set({ 
        automations: data.map(row => ({
          id: row.id,
          tenantId: row.tenantId,
          name: row.name,
          event: row.event,
          condition: row.condition,
          action: row.action,
          active: row.active,
        })), 
        isLoading: false 
      })
    } catch (error) {
      console.error('Erro ao buscar automações:', error)
      set({ isLoading: false })
    }
  },

  toggleAutomation: async (id: string) => {
    const auto = get().automations.find(a => a.id === id)
    if (!auto) return
    await get().updateAutomation(id, { active: !auto.active })
  },

  addAutomation: async (automationData) => {
    const tenantId = useAuthStore.getState().user?.tenantId
    if (!tenantId) return

    try {
      await automationRepo.create({
        ...automationData,
        tenantId,
      })

      await get().fetchAutomations()
    } catch (error) {
      console.error('Erro ao adicionar automação:', error)
    }
  },

  updateAutomation: async (id, updates) => {
    const tenantId = useAuthStore.getState().user?.tenantId
    if (!tenantId) return

    try {
      await automationRepo.update(tenantId, id, updates)
      await get().fetchAutomations()
    } catch (error) {
      console.error('Erro ao atualizar automação:', error)
    }
  },

  deleteAutomation: async (id) => {
    const tenantId = useAuthStore.getState().user?.tenantId
    if (!tenantId) return

    try {
      await automationRepo.delete(tenantId, id)
      await get().fetchAutomations()
    } catch (error) {
      console.error('Erro ao deletar automação:', error)
    }
  },
}))

