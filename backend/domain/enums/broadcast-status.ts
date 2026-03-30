export const BroadcastStatus = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  SENDING: 'sending',
  SENT: 'sent',
  FAILED: 'failed',
} as const

export type BroadcastStatus = (typeof BroadcastStatus)[keyof typeof BroadcastStatus]
