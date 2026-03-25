import { create } from 'zustand'
import { Automation } from '@/types'

const mockAutomations: Automation[] = [
  {
    id: 'auto-1',
    name: 'Boas-vindas para novos leads',
    event: 'lead_created',
    action: 'send_message',
    active: true,
  },
  {
    id: 'auto-2',
    name: 'Notificar mudança de etapa',
    event: 'pipeline_stage_changed',
    action: 'notify_team',
    active: true,
  },
  {
    id: 'auto-3',
    name: 'Alerta após 24h sem resposta',
    event: '24h_no_response',
    condition: 'window_closed',
    action: 'alert_assigned_user',
    active: true,
  },
  {
    id: 'auto-4',
    name: 'Follow-up automático',
    event: 'lead_qualified',
    action: 'schedule_followup',
    active: false,
  },
]

interface AutomationsState {
  automations: Automation[]
  toggleAutomation: (id: string) => void
  addAutomation: (automation: Automation) => void
  updateAutomation: (id: string, updates: Partial<Automation>) => void
  deleteAutomation: (id: string) => void
}

export const useAutomationsStore = create<AutomationsState>((set) => ({
  automations: mockAutomations,

  toggleAutomation: (id: string) => {
    set((state) => ({
      automations: state.automations.map((auto) =>
        auto.id === id ? { ...auto, active: !auto.active } : auto
      ),
    }))
  },

  addAutomation: (automation: Automation) => {
    set((state) => ({
      automations: [...state.automations, automation],
    }))
  },

  updateAutomation: (id: string, updates: Partial<Automation>) => {
    set((state) => ({
      automations: state.automations.map((auto) =>
        auto.id === id ? { ...auto, ...updates } : auto
      ),
    }))
  },

  deleteAutomation: (id: string) => {
    set((state) => ({
      automations: state.automations.filter((auto) => auto.id !== id),
    }))
  },
}))

