import { create } from 'zustand'
import { User, UserRole } from '@/types'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/authStore'

interface UsersState {
  users: User[]
  isLoading: boolean
  fetchUsers: () => Promise<void>
  addUser: (user: Omit<User, 'id' | 'active'>) => Promise<void>
  updateUser: (id: string, updates: Partial<User>) => Promise<void>
  toggleUserActive: (id: string) => Promise<void>
  deleteUser: (id: string) => Promise<void>
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  isLoading: false,

  fetchUsers: async () => {
    const tenantId = useAuthStore.getState().user?.tenantId
    if (!tenantId) return

    set({ isLoading: true })
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('name', { ascending: true })

      if (error) throw error

      const users: User[] = (data || []).map(profile => ({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role as UserRole,
        avatar: profile.avatar_url,
        tenantId: profile.tenant_id,
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
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          role: updates.role,
          avatar_url: updates.avatar,
          active: updates.active
        })
        .eq('id', id)

      if (error) throw error

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
      // Nota: No Supabase, deletar do profiles não deleta do Auth. 
      // Isso deve ser feito via Edge Function de Admin.
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id)

      if (error) throw error

      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
      }))
    } catch (err) {
      console.error('Erro ao deletar usuário:', err)
    }
  },
}))
