import { z } from 'zod'
import { channelSchema, leadStatusSchema } from '@/src/contracts/v1/broadcast'

const noteSchema = z.object({
  id: z.string().min(1),
  content: z.string().min(1),
  authorId: z.string().min(1),
  authorName: z.string().min(1),
  createdAt: z.string().min(1),
  internal: z.boolean(),
})

export const leadSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  channel: channelSchema,
  phone: z.string().optional(),
  email: z.string().optional(),
  avatar: z.string().optional(),
  status: leadStatusSchema,
  pipelineStage: z.string().min(1),
  assignedTo: z.string().optional(),
  tags: z.array(z.string()),
  score: z.number(),
  campaign: z.string().optional(),
  product: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  notes: z.array(noteSchema),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
  lastContactAt: z.string().optional(),
  window24hOpen: z.boolean(),
  window24hExpiresAt: z.string().optional(),
})

export type LeadContractV1 = z.infer<typeof leadSchema>
