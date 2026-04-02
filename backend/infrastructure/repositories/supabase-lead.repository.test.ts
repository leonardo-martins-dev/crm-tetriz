import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SupabaseLeadRepository } from './supabase-lead.repository'
import { createMockSupabase } from '../../../tests/mocks'

describe('SupabaseLeadRepository', () => {
  let repository: SupabaseLeadRepository
  let mockSupabase: any

  beforeEach(() => {
    mockSupabase = createMockSupabase()
    repository = new SupabaseLeadRepository(mockSupabase as any)
  })

  it('should find a lead by id', async () => {
    const mockLead = { id: '1', name: 'Test Lead', tenant_id: 't1' }
    mockSupabase.from().select().match().single.mockResolvedValue({ data: mockLead, error: null })

    const result = await repository.findById('t1', '1')

    expect(result?.name).toBe('Test Lead')
    expect(mockSupabase.from().select().match).toHaveBeenCalledWith({ id: '1', tenant_id: 't1' })
  })

  it('should create a lead', async () => {
    const leadInput = {
      tenantId: 't1',
      name: 'Jane Doe',
      status: 'new' as any,
      channel: 'whatsapp' as any,
      priority: 'high' as any,
      score: 10,
      tags: [],
      notes: [],
      pipelineStage: 's1',
      window24hOpen: false,
    }

    const mockResponse = { ...leadInput, id: '2', tenant_id: 't1', created_at: 'now' }
    mockSupabase.from().insert().select().single.mockResolvedValue({ data: mockResponse, error: null })

    const result = await repository.create(leadInput as any)

    expect(result.id).toBe('2')
    expect(mockSupabase.from().insert).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Jane Doe',
      tenant_id: 't1'
    }))
  })

  it('should list leads by tenant', async () => {
    const mockData = [
      { id: '1', name: 'Lead 1', tenant_id: 't1' },
      { id: '2', name: 'Lead 2', tenant_id: 't1' }
    ]
    mockSupabase.from().select().eq().order.mockResolvedValue({ data: mockData, error: null })

    const result = await repository.list('t1')

    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('Lead 1')
  })

  it('should handle errors on delete', async () => {
    mockSupabase.from().delete().match.mockResolvedValue({ error: { message: 'Database error' } })

    await expect(repository.delete('t1', '1')).rejects.toThrow('Database error')
  })
})
