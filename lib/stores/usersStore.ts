import { create } from 'zustand'
import { User } from '@/types'

interface UsersState {
  users: User[]
  addUser: (user: Omit<User, 'id'>) => void
  updateUser: (id: string, updates: Partial<User>) => void
  toggleUserActive: (id: string) => void
  deleteUser: (id: string) => void
}

// Mock users data inicial
const initialUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@noponto.com',
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
  {
    id: '4',
    name: 'Ana Oliveira',
    email: 'ana@cliente2.com',
    role: 'client',
    clientId: 'client-2',
    active: true,
  },
  {
    id: '5',
    name: 'Carlos Mendes',
    email: 'carlos@cliente2.com',
    role: 'user',
    clientId: 'client-2',
    active: false,
  },
]

export const useUsersStore = create<UsersState>((set) => ({
  users: initialUsers,

  addUser: (userData) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      ...userData,
    }
    set((state) => ({
      users: [...state.users, newUser],
    }))
  },

  updateUser: (id, updates) => {
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, ...updates } : user
      ),
    }))
  },

  toggleUserActive: (id) => {
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, active: !user.active } : user
      ),
    }))
  },

  deleteUser: (id) => {
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    }))
  },
}))

