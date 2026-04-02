import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuthStore } from './authStore'
import { supabase } from '../supabase'

vi.mock('../supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
    },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
  },
}))

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false })
  })

  it('deve realizar login com sucesso e carregar o perfil', async () => {
    const mockAuthData = { user: { id: 'user-123' }, session: { access_token: 'token' } }
    const mockProfileData = { id: 'user-123', name: 'Admin', tenant_id: 'tenant-1' }

    ;(supabase.auth.signInWithPassword as any).mockResolvedValue({ data: mockAuthData, error: null })
    ;(supabase.from as any)().select().eq().single.mockResolvedValue({ data: mockProfileData, error: null })

    await useAuthStore.getState().login('test@test.com', 'password')

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.user?.name).toBe('Admin')
    expect(state.user?.tenantId).toBe('tenant-1')
  })

  it('deve capturar erro se o login falhar', async () => {
    ;(supabase.auth.signInWithPassword as any).mockResolvedValue({ 
      data: { user: null, session: null }, 
      error: { message: 'Dados inválidos' } 
    })

    const { error } = await useAuthStore.getState().login('wrong@test.com', 'wrong')

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(error).toBe('Dados inválidos')
  })

  it('deve limpar o estado no logout', async () => {
    useAuthStore.setState({ 
      isAuthenticated: true, 
      user: { id: '1', name: 'X', role: 'user', tenantId: 'T1', email: 'x@x.com', active: true } 
    })
    ;(supabase.auth.signOut as any).mockResolvedValue({ error: null })

    await useAuthStore.getState().logout()

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBe(null)
  })
})
