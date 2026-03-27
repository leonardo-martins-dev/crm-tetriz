import { z } from 'zod'

export const channelSchema = z.enum(['whatsapp'])
export const leadStatusSchema = z.enum(['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'])

export const broadcastStatusSchema = z.enum(['draft', 'scheduled', 'sent', 'failed'])

export const broadcastSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  message: z.string().min(1),
  channel: channelSchema.optional(),
  tags: z.array(z.string()).optional(),
  leadStatus: leadStatusSchema.optional(),
  pipelineStage: z.string().optional(),
  scheduledAt: z.string().optional(),
  sentAt: z.string().optional(),
  broadcastStatus: broadcastStatusSchema,
  totalRecipients: z.number().int().nonnegative(),
  sentCount: z.number().int().nonnegative(),
  failedCount: z.number().int().nonnegative(),
  createdAt: z.string().min(1),
})

export type BroadcastContractV1 = z.infer<typeof broadcastSchema>
