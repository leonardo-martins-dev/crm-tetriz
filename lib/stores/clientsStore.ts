import { create } from 'zustand'
import { Client, ClientPlan } from '@/types'

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
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'userCount' | 'leadCount'>) => void
  updateClient: (id: string, updates: Partial<Client>) => void
  toggleClientActive: (id: string) => void
  deleteClient: (id: string) => void
}

// Mock clients data inicial
const initialClients: Client[] = [
  {
    id: 'client-1',
    name: 'Tech Solutions',
    active: true,
    plan: 'enterprise',
    modules: ['inbox', 'pipeline', 'agents', 'automations', 'broadcast', 'metrics'],
    maxUsers: 15,
    createdAt: '2024-01-15',
    userCount: 5,
    leadCount: 127,
  },
  {
    id: 'client-2',
    name: 'Digital Agency',
    active: true,
    plan: 'professional',
    modules: ['inbox', 'pipeline', 'automations', 'metrics'],
    maxUsers: 8,
    createdAt: '2024-02-20',
    userCount: 3,
    leadCount: 89,
  },
  {
    id: 'client-3',
    name: 'E-commerce Plus',
    active: true,
    plan: 'basic',
    modules: ['inbox', 'pipeline', 'metrics'],
    maxUsers: 3,
    createdAt: '2024-03-10',
    userCount: 8,
    leadCount: 203,
  },
]

export const useClientsStore = create<ClientsState>((set) => ({
  clients: initialClients,

  addClient: (clientData) => {
    const newClient: Client = {
      id: `client-${Date.now()}`,
      ...clientData,
      createdAt: new Date().toISOString().split('T')[0],
      userCount: 0,
      leadCount: 0,
    }
    set((state) => ({
      clients: [...state.clients, newClient],
    }))
  },

  updateClient: (id, updates) => {
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === id ? { ...client, ...updates } : client
      ),
    }))
  },

  toggleClientActive: (id) => {
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === id ? { ...client, active: !client.active } : client
      ),
    }))
  },

  deleteClient: (id) => {
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== id),
    }))
  },
}))

