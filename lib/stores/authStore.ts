import { create } from 'zustand'
import { User, Client } from '@/types'

interface AuthState {
  user: User | null
  client: Client | null
  isAuthenticated: boolean
  login: (email: string, password: string, clients?: Client[]) => Promise<User | null>
  logout: () => void
  selectClient: (clientId: string, clients: Client[]) => void
  setUser: (user: User) => void
}

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@breno.com',
    role: 'owner',
    active: true,
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@cliente1.com',
    role: 'client',
    clientId: 'client-1',
    active: true,
  },
  {
    id: '3',
    name: 'Pedro Costa',
    email: 'pedro@cliente1.com',
    role: 'user',
    clientId: 'client-1',
    active: true,
  },
]

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  client: null,
  isAuthenticated: false,

  login: async (email: string, password: string, clients?: Client[]) => {
    // Mock login - aceita qualquer senha
    const user = mockUsers.find((u) => u.email === email)
    if (user) {
      set({ user, isAuthenticated: true })
      
      // Se for cliente ou usuário, seleciona o cliente automaticamente
      if (user.role !== 'owner' && user.clientId && clients) {
        const client = clients.find((c) => c.id === user.clientId)
        if (client) {
          set({ client })
        }
      }
      
      return user
    }
    return null
  },

  logout: () => {
    set({ user: null, client: null, isAuthenticated: false })
  },

  selectClient: (clientId: string, clients: Client[]) => {
    const client = clients.find((c) => c.id === clientId)
    if (client) {
      set({ client })
    }
  },

  setUser: (user: User) => {
    set({ user })
  },
}))

