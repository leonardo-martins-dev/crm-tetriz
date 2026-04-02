import { create } from 'zustand'
import { Broadcast } from '@/types'
import { getBroadcastRepository } from '@/infrastructure/repositories'
import { useAuthStore } from './authStore'

interface BroadcastState {
  broadcasts: Broadcast[]
  isLoading: boolean
  fetchBroadcasts: () => Promise<void>
  addBroadcast: (broadcast: Omit<Broadcast, 'id' | 'createdAt' | 'sentCount' | 'failedCount'>) => Promise<void>
  updateBroadcast: (broadcastId: string, updates: Partial<Broadcast>) => Promise<void>
  deleteBroadcast: (broadcastId: string) => Promise<void>
  sendBroadcast: (broadcastId: string) => Promise<void>
}

const broadcastRepo = getBroadcastRepository()

export const useBroadcastStore = create<BroadcastState>((set, get) => ({
  broadcasts: [],
  isLoading: false,

  fetchBroadcasts: async () => {
    const tenantId = useAuthStore.getState().user?.tenantId
    if (!tenantId) return

    set({ isLoading: true })
    try {
      const data = await broadcastRepo.findByTenantId(tenantId)
      set({ broadcasts: data as any[], isLoading: false })
    } catch (err) {
      console.error('Erro ao buscar transmissões:', err)
      set({ isLoading: false })
    }
  },

  addBroadcast: async (broadcastData) => {
    const tenantId = useAuthStore.getState().user?.tenantId
    if (!tenantId) return

    try {
      const data = await broadcastRepo.create({
        ...broadcastData,
        tenantId,
      } as any)

      set((state) => ({
        broadcasts: [data as any, ...state.broadcasts],
      }))
    } catch (err) {
      console.error('Erro ao adicionar transmissão:', err)
    }
  },

  updateBroadcast: async (broadcastId, updates) => {
    const tenantId = useAuthStore.getState().user?.tenantId
    if (!tenantId) return

    try {
      const data = await broadcastRepo.update(tenantId, broadcastId, updates as any)

      set((state) => ({
        broadcasts: state.broadcasts.map((b) =>
          b.id === broadcastId ? (data as any) : b
        ),
      }))
    } catch (err) {
      console.error('Erro ao atualizar transmissão:', err)
    }
  },

  deleteBroadcast: async (broadcastId) => {
    const tenantId = useAuthStore.getState().user?.tenantId
    if (!tenantId) return

    try {
      await broadcastRepo.delete(tenantId, broadcastId)
      set((state) => ({
        broadcasts: state.broadcasts.filter((b) => b.id !== broadcastId),
      }))
    } catch (err) {
      console.error('Erro ao deletar transmissão:', err)
    }
  },

  sendBroadcast: async (broadcastId) => {
    const tenantId = useAuthStore.getState().user?.tenantId
    if (!tenantId) return

    const broadcast = get().broadcasts.find((b) => b.id === broadcastId)
    if (!broadcast) return

    set((state) => ({
      broadcasts: state.broadcasts.map((b) =>
        b.id === broadcastId ? { ...b, broadcastStatus: 'sending' } : b
      ),
    }))

    try {
      // Simulação para o MVP, no futuro será via Edge Function Worker
      setTimeout(async () => {
        const sentCount = Math.floor(broadcast.totalRecipients * 0.95)
        const failedCount = broadcast.totalRecipients - sentCount
        
        await get().updateBroadcast(broadcastId, {
          broadcastStatus: 'sent',
          sentCount,
          failedCount,
          sentAt: new Date().toISOString()
        })
      }, 2000)
    } catch (err) {
      console.error('Falha ao enviar transmissão:', err)
    }
  },
}))

