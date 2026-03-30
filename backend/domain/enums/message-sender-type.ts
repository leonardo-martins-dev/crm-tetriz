export const MessageSenderType = {
  USER: 'user',
  LEAD: 'lead',
  AI: 'ai',
} as const

export type MessageSenderType = (typeof MessageSenderType)[keyof typeof MessageSenderType]
