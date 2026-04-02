import { create } from 'zustand'
import { User, Client, UserRole } from '@/types'
import { supabase } from '@/lib/supabase'

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
        // Buscar perfil do usuário na tabela profiles
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single()

        if (profileError) throw profileError

        const user: User = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role as UserRole,
          avatar: profile.avatar_url,
          tenantId: profile.tenant_id,
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
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profile) {
        const user: User = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role as UserRole,
          avatar: profile.avatar_url,
          tenantId: profile.tenant_id,
          active: profile.active,
        }
        set({ user, isAuthenticated: true })
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

