import { create } from 'zustand'
import { User, UserRole } from '@/types'
import { useAuthStore } from '@/lib/stores/authStore'
import { getProfileRepository } from '@/infrastructure/repositories'

interface UsersState {
  users: User[]
  isLoading: boolean
  fetchUsers: () => Promise<void>
  addUser: (user: Omit<User, 'id' | 'active'>) => Promise<void>
  updateUser: (id: string, updates: Partial<User>) => Promise<void>
  toggleUserActive: (id: string) => Promise<void>
  deleteUser: (id: string) => Promise<void>
}

const profileRepo = getProfileRepository()

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  isLoading: false,

  fetchUsers: async () => {
    const tenantId = useAuthStore.getState().user?.tenantId
    if (!tenantId) return

    set({ isLoading: true })
    try {
      const profiles = await profileRepo.listByTenant(tenantId)

      const users: User[] = profiles.map(profile => ({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role as UserRole,
        avatar: profile.avatarUrl,
        tenantId: profile.tenantId,
        active: profile.active,
      }))

      set({ users, isLoading: false })
    } catch (err) {
      console.error('Erro ao buscar usuários:', err)
      set({ isLoading: false })
    }
  },

  addUser: async (userData) => {
    // Implementação via Edge Function ou Invites no futuro
    console.warn('addUser real deve ser implementado via Edge Function para criar o Auth User')
  },

  updateUser: async (id, updates) => {
    try {
      await profileRepo.update(id, {
        name: updates.name,
        role: updates.role as any,
        avatarUrl: updates.avatar,
        active: updates.active
      })

      set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? { ...user, ...updates } : user
        ),
      }))
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err)
    }
  },

  toggleUserActive: async (id) => {
    const user = get().users.find(u => u.id === id)
    if (!user) return
    await get().updateUser(id, { active: !user.active })
  },

  deleteUser: async (id) => {
    try {
      await profileRepo.delete(id)
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
      }))
    } catch (err) {
      console.error('Erro ao deletar usuário:', err)
    }
  },
}))
