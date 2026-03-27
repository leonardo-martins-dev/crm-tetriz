import { describe, expect, it } from 'vitest'
import { broadcastSchema } from '@/contracts/v1/schemas'

describe('broadcastSchema', () => {
  it('valida payload com broadcastStatus', () => {
    const payload = {
      id: 'broadcast-1',
      name: 'Campanha',
      message: 'Mensagem',
      channel: 'whatsapp',
      broadcastStatus: 'draft',
      totalRecipients: 10,
      sentCount: 0,
      failedCount: 0,
      createdAt: new Date().toISOString(),
    }

    expect(broadcastSchema.safeParse(payload).success).toBe(true)
  })

  it('rejeita payload com campo status legado', () => {
    const payload = {
      id: 'broadcast-1',
      name: 'Campanha',
      message: 'Mensagem',
      channel: 'whatsapp',
      status: 'draft',
      totalRecipients: 10,
      sentCount: 0,
      failedCount: 0,
      createdAt: new Date().toISOString(),
    }

    expect(broadcastSchema.safeParse(payload).success).toBe(false)
  })
})
