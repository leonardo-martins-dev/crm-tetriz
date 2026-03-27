import { describe, expect, it } from 'vitest'
import { broadcastSchema } from '@/src/contracts/v1'

describe('broadcast contract v1', () => {
  it('accepts valid payload', () => {
    const parsed = broadcastSchema.parse({
      id: 'broadcast-1',
      name: 'Campanha teste',
      message: 'Mensagem',
      channel: 'whatsapp',
      broadcastStatus: 'draft',
      totalRecipients: 10,
      sentCount: 0,
      failedCount: 0,
      createdAt: '2026-01-01T00:00:00.000Z',
    })

    expect(parsed.broadcastStatus).toBe('draft')
  })

  it('rejects payload with invalid status key/value', () => {
    expect(() =>
      broadcastSchema.parse({
        id: 'broadcast-1',
        name: 'Campanha teste',
        message: 'Mensagem',
        channel: 'whatsapp',
        status: 'sent',
        totalRecipients: 10,
        sentCount: 0,
        failedCount: 0,
        createdAt: '2026-01-01T00:00:00.000Z',
      })
    ).toThrow()
  })
})
