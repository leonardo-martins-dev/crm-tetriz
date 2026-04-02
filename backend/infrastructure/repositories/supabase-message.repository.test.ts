import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SupabaseMessageRepository } from './supabase-message.repository'
import { createMockSupabase } from '../../../tests/mocks'

describe('SupabaseMessageRepository', () => {
  let repository: SupabaseMessageRepository
  let mockSupabase: any

  beforeEach(() => {
    mockSupabase = createMockSupabase()
    repository = new SupabaseMessageRepository(mockSupabase as any)
  })

  it('should find messages by conversation id', async () => {
    const mockData = [
      { id: 'm1', content: 'hello', conversation_id: 'c1', sender_id: 'u1', sender_type: 'user' },
      { id: 'm2', content: 'hi', conversation_id: 'c1', sender_id: 'l1', sender_type: 'lead' }
    ]
    mockSupabase.from().select().eq().order.mockResolvedValue({ data: mockData, error: null })

    const result = await repository.findByConversationId('t1', 'c1')

    expect(result).toHaveLength(2)
    expect(result[0].content).toBe('hello')
    expect(result[0].senderType).toBe('user')
  })

  it('should find messages by tenant id', async () => {
    const mockData = [
      { id: 'm1', content: 'tenant message', tenant_id: 't1' }
    ]
    mockSupabase.from().select().eq().order.mockResolvedValue({ data: mockData, error: null })

    const result = await repository.listByTenant('t1')

    expect(result).toHaveLength(1)
    expect(result[0].content).toBe('tenant message')
  })

  it('should update a message status', async () => {
    const updates = { status: 'delivered' as any }
    const mockData = { id: 'm1', content: 'hi', status: 'delivered' }
    mockSupabase.from().update().eq().select().single.mockResolvedValue({ data: mockData, error: null })

    const result = await repository.update('t1', 'm1', updates)

    expect(result.status).toBe('delivered')
    expect(mockSupabase.from().update).toHaveBeenCalledWith({ status: 'delivered' })
  })

  it('should find message by wamid', async () => {
    const mockData = { id: 'm1', wamid: 'wa1' }
    mockSupabase.from().select().eq().maybeSingle.mockResolvedValue({ data: mockData, error: null })

    const result = await repository.findByWamid('t1', 'wa1')

    expect(result?.id).toBe('m1')
  })
})
