import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock do repository hoisted
const mockProfileRepository = vi.hoisted(() => ({
  findById: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}))

vi.mock('@/infrastructure/repositories', () => ({
  getProfileRepository: () => mockProfileRepository
}))

// Mock do supabase hoisted
const mockSupabase = vi.hoisted(() => ({
  auth: {
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn(),
  }
}))

vi.mock('@/lib/supabase', () => ({
  supabase: mockSupabase
}))

import { useAuthStore } from './authStore'
import { supabase } from '@/lib/supabase'

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false })
  })

  it('should login and fetch profile via repository', async () => {
    const mockAuthUser = { user: { id: 'u1', email: 'test@test.com' } }
    const mockProfile = { id: 'u1', name: 'Test User', email: 'test@test.com', role: 'admin', tenantId: 't1', active: true }

    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({ data: mockAuthUser, error: null } as any)
    mockProfileRepository.findById.mockResolvedValue(mockProfile)

    const result = await useAuthStore.getState().login('test@test.com', 'pass123')

    expect(result.user?.name).toBe('Test User')
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
    expect(mockProfileRepository.findById).toHaveBeenCalledWith('u1')
  })

  it('should handle login error', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({ error: { message: 'Invalid credentials' } } as any)

    const result = await useAuthStore.getState().login('test@test.com', 'wrong')

    expect(result.error).toBe('Invalid credentials')
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })

  it('should refresh session and profile', async () => {
    const mockSession = { session: { user: { id: 'u1' } } }
    const mockProfile = { id: 'u1', name: 'Refreshed User', email: 'test@test.com', role: 'user', tenantId: 't1', active: true }

    vi.mocked(supabase.auth.getSession).mockResolvedValue({ data: mockSession, error: null } as any)
    mockProfileRepository.findById.mockResolvedValue(mockProfile)

    await useAuthStore.getState().refreshUser()

    expect(useAuthStore.getState().user?.name).toBe('Refreshed User')
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
  })

  it('should logout correctly', async () => {
    useAuthStore.setState({ isAuthenticated: true, user: { id: 'u1' } as any })
    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null } as any)

    await useAuthStore.getState().logout()

    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().user).toBeNull()
  })
})
