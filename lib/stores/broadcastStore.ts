import { create } from 'zustand'
import { Broadcast, Channel, LeadStatus } from '@/types'

interface BroadcastState {
  broadcasts: Broadcast[]
  addBroadcast: (broadcast: Omit<Broadcast, 'id' | 'createdAt' | 'sentCount' | 'failedCount'>) => void
  updateBroadcast: (broadcastId: string, updates: Partial<Broadcast>) => void
  deleteBroadcast: (broadcastId: string) => void
  sendBroadcast: (broadcastId: string) => void
}

export const useBroadcastStore = create<BroadcastState>((set, get) => ({
  broadcasts: [
    {
      id: 'broadcast-1',
      name: 'Promoção Black Friday',
      message: 'Olá! Temos uma promoção especial de Black Friday para você! 🎉',
      channel: 'whatsapp',
      tags: ['Interessado', 'Quente'],
      status: 'sent',
      totalRecipients: 20,
      sentCount: 18,
      failedCount: 2,
      sentAt: new Date(Date.now() - 86400000).toISOString(),
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: 'broadcast-2',
      name: 'Follow-up Semanal',
      message: 'Olá! Como está? Gostaria de saber se ainda tem interesse em nossos produtos.',
      channel: 'whatsapp',
      broadcastStatus: 'scheduled',
      totalRecipients: 15,
      sentCount: 0,
      failedCount: 0,
      scheduledAt: new Date(Date.now() + 86400000).toISOString(),
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ],

  addBroadcast: (broadcastData) => {
    const newBroadcast: Broadcast = {
      ...broadcastData,
      id: `broadcast-${Date.now()}`,
      createdAt: new Date().toISOString(),
      sentCount: 0,
      failedCount: 0,
    }

    set((state) => ({
      broadcasts: [...state.broadcasts, newBroadcast],
    }))
  },

  updateBroadcast: (broadcastId: string, updates: Partial<Broadcast>) => {
    set((state) => ({
      broadcasts: state.broadcasts.map((broadcast) =>
        broadcast.id === broadcastId ? { ...broadcast, ...updates } : broadcast
      ),
    }))
  },

  deleteBroadcast: (broadcastId: string) => {
    set((state) => ({
      broadcasts: state.broadcasts.filter((broadcast) => broadcast.id !== broadcastId),
    }))
  },

  sendBroadcast: (broadcastId: string) => {
    const broadcast = get().broadcasts.find((b) => b.id === broadcastId)
    if (!broadcast) return

    // Simula envio
    const sentCount = Math.floor(broadcast.totalRecipients * 0.9)
    const failedCount = broadcast.totalRecipients - sentCount

    set((state) => ({
      broadcasts: state.broadcasts.map((b) =>
        b.id === broadcastId
          ? {
              ...b,
              broadcastStatus: 'sent',
              sentCount,
              failedCount,
              sentAt: new Date().toISOString(),
            }
          : b
      ),
    }))
  },
}))

