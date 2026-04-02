import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SupabaseProfileRepository } from './supabase-profile.repository'
import { createMockSupabase } from '../../../tests/mocks'

describe('SupabaseProfileRepository', () => {
  let repository: SupabaseProfileRepository
  let mockSupabase: any

  beforeEach(() => {
    mockSupabase = createMockSupabase()
    repository = new SupabaseProfileRepository(mockSupabase as any)
  })

  it('should find a profile by id', async () => {
    const mockData = { id: 'user-1', name: 'Admin User', tenant_id: 't1', active: true, role: 'owner', email: 'admin@test.com' }
    mockSupabase.from().select().eq().single.mockResolvedValue({ data: mockData, error: null })

    const result = await repository.findById('user-1')

    expect(result?.email).toBe('admin@test.com')
    expect(result?.tenantId).toBe('t1')
  })

  it('should list profiles by tenant id', async () => {
    const mockData = [
      { id: 'u1', name: 'User 1', tenant_id: 't1' },
      { id: 'u2', name: 'User 2', tenant_id: 't1' }
    ]
    mockSupabase.from().select().eq().order.mockResolvedValue({ data: mockData, error: null })

    const result = await repository.listByTenant('t1')

    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('u1')
  })

  it('should update a profile', async () => {
    const updates = { name: 'New Name' }
    const mockData = { id: 'u1', name: 'New Name', tenant_id: 't1' }
    mockSupabase.from().update().eq().select().single.mockResolvedValue({ data: mockData, error: null })

    const result = await repository.update('u1', updates)

    expect(result.name).toBe('New Name')
    expect(mockSupabase.from().update).toHaveBeenCalledWith({ name: 'New Name' })
  })

  it('should delete a profile', async () => {
    mockSupabase.from().delete().eq.mockResolvedValue({ error: null })

    await repository.delete('u1')

    expect(mockSupabase.from().delete).toHaveBeenCalled()
    expect(mockSupabase.from().eq).toHaveBeenCalledWith('id', 'u1')
  })
})
