import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SupabaseConnectionRepository } from './supabase-connection.repository'
import { createMockSupabase } from '../../../tests/mocks'

describe('SupabaseConnectionRepository', () => {
  let repository: SupabaseConnectionRepository
  let mockSupabase: any

  beforeEach(() => {
    mockSupabase = createMockSupabase()
    repository = new SupabaseConnectionRepository(mockSupabase as any)
  })

  it('should find connections by tenant id', async () => {
    const mockData = [
      { id: 'c1', tenant_id: 't1', provider: 'evolution' as any, status: 'active' as any },
      { id: 'c2', tenant_id: 't1', provider: 'meta' as any, status: 'inactive' as any }
    ]
    mockSupabase.from().select().eq.mockResolvedValue({ data: mockData, error: null })

    const result = await repository.findByTenantId('t1')

    expect(result).toHaveLength(2)
    expect(result[0].provider).toBe('evolution')
  })

  it('should find a connection by id', async () => {
    const mockData = { id: 'c1', tenant_id: 't1', provider: 'evolution' }
    mockSupabase.from().select().match().single.mockResolvedValue({ data: mockData, error: null })

    const result = await repository.findById('t1', 'c1')

    expect(result?.id).toBe('c1')
    expect(mockSupabase.from().select().match).toHaveBeenCalledWith({ id: 'c1', tenant_id: 't1' })
  })

  it('should find connection by phone number id', async () => {
    const mockData = { id: 'c1', phone_number_id: 'p1' }
    mockSupabase.from().select().match().single.mockResolvedValue({ data: mockData, error: null })

    const result = await repository.findByPhoneNumberId('p1')

    expect(result?.id).toBe('c1')
  })

  it('should update a connection', async () => {
    const updates = { status: 'active' as any }
    const mockData = { id: 'c1', status: 'active' }
    mockSupabase.from().update().match().select().single.mockResolvedValue({ data: mockData, error: null })

    const result = await repository.update('t1', 'c1', updates)

    expect(result.status).toBe('active')
    expect(mockSupabase.from().update().match).toHaveBeenCalledWith({ id: 'c1', tenant_id: 't1' })
  })

  it('should delete a connection', async () => {
    mockSupabase.from().delete().match.mockResolvedValue({ error: null })

    await repository.delete('t1', 'c1')

    expect(mockSupabase.from().delete).toHaveBeenCalled()
    expect(mockSupabase.from().delete().match).toHaveBeenCalledWith({ id: 'c1', tenant_id: 't1' })
  })
})
