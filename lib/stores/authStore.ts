import { create } from 'zustand'
import { User, Client, UserRole } from '@/types'
import { supabase } from '@/lib/supabase'
import { getProfileRepository } from '@/infrastructure/repositories'

interface AuthState {
  user: User | null
  client: Client | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  setUser: (user: User | null) => void
  setClient: (client: Client | null) => void
}

const profileRepo = getProfileRepository()

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  client: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      if (authData.user) {
        // Buscar perfil do usuário no repositório de perfis
        const profile = await profileRepo.findById(authData.user.id)

        if (!profile) throw new Error('Perfil do usuário não encontrado')

        const user: User = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role as UserRole,
          avatar: profile.avatarUrl,
          tenantId: profile.tenantId,
          active: profile.active,
        }

        set({ user, isAuthenticated: true, isLoading: false })
        return { user, error: null }
      }

      set({ isLoading: false })
      return { user: null, error: 'Usuário não encontrado' }
    } catch (err: any) {
      console.error('Erro no login:', err)
      set({ isLoading: false, user: null, isAuthenticated: false })
      return { user: null, error: err.message || 'Falha na autenticação' }
    }
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null, client: null, isAuthenticated: false })
  },

  refreshUser: async () => {
    set({ isLoading: true })
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.user) {
      try {
        const profile = await profileRepo.findById(session.user.id)

        if (profile) {
          const user: User = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role as UserRole,
            avatar: profile.avatarUrl,
            tenantId: profile.tenantId,
            active: profile.active,
          }
          set({ user, isAuthenticated: true })
        }
      } catch (err) {
        console.error('Erro ao recarregar usuário:', err)
      }
    } else {
      set({ user: null, isAuthenticated: false })
    }
    set({ isLoading: false })
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user })
  },

  setClient: (client: Client | null) => {
    set({ client })
  },
}))

