import { z } from 'zod'

export const userRoleSchema = z.enum(['owner', 'client', 'user'])
export const channelSchema = z.enum(['whatsapp'])
export const leadStatusSchema = z.enum(['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'])
export const broadcastStatusSchema = z.enum(['draft', 'scheduled', 'sent', 'failed'])

export const noteSchema = z.object({
  id: z.string(),
  content: z.string().min(1),
  authorId: z.string(),
  authorName: z.string(),
  createdAt: z.string().datetime(),
  internal: z.boolean(),
})

export const leadSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  channel: channelSchema,
  phone: z.string().optional(),
  email: z.string().email().optional(),
  status: leadStatusSchema,
  pipelineStage: z.string().min(1),
  assignedTo: z.string().optional(),
  tags: z.array(z.string()),
  score: z.number(),
  priority: z.enum(['low', 'medium', 'high']),
  notes: z.array(noteSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  lastContactAt: z.string().datetime().optional(),
  window24hOpen: z.boolean(),
  window24hExpiresAt: z.string().datetime().optional(),
})

export const pipelineStageSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  order: z.number().int().nonnegative(),
  color: z.string().min(1),
  leadIds: z.array(z.string()),
})

export const broadcastSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  message: z.string().min(1),
  channel: channelSchema.optional(),
  tags: z.array(z.string()).optional(),
  leadStatus: leadStatusSchema.optional(),
  pipelineStage: z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
  sentAt: z.string().datetime().optional(),
  broadcastStatus: broadcastStatusSchema,
  totalRecipients: z.number().int().nonnegative(),
  sentCount: z.number().int().nonnegative(),
  failedCount: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
})

export type LeadContract = z.infer<typeof leadSchema>
export type PipelineStageContract = z.infer<typeof pipelineStageSchema>
export type BroadcastContract = z.infer<typeof broadcastSchema>
