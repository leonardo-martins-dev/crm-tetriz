export type UserRole = 'owner' | 'client' | 'user'

export type Channel = 'whatsapp'

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  clientId?: string
  tenantId?: string
  active: boolean
}

export type ClientPlan = 'basic' | 'professional' | 'enterprise'

export interface Client {
  id: string
  name: string
  logo?: string
  active: boolean
  plan: ClientPlan
  modules: string[]
  maxUsers: number
  createdAt: string
  userCount: number
  leadCount: number
}

export interface Lead {
  id: string
  tenantId?: string
  name: string
  channel: Channel
  phone?: string
  email?: string
  avatar?: string
  status: LeadStatus
  pipelineStage: string
  assignedTo?: string
  tags: string[]
  score: number
  campaign?: string
  product?: string
  priority: 'low' | 'medium' | 'high'
  notes: Note[]
  createdAt: string
  updatedAt: string
  lastContactAt?: string
  window24hOpen: boolean
  window24hExpiresAt?: string
}

export interface Note {
  id: string
  content: string
  authorId: string
  authorName: string
  createdAt: string
  internal: boolean
}

export interface Message {
  id: string
  tenantId?: string
  leadId: string
  content: string
  senderId: string
  senderName: string
  senderType: 'user' | 'lead' | 'ai'
  channel: Channel
  createdAt: string
  read: boolean
  wamid?: string
  status?: 'pending' | 'sent' | 'delivered' | 'read' | 'failed'
  mediaUrl?: string
  mediaType?: 'image' | 'audio' | 'video' | 'document'
}

export interface Conversation {
  tenantId?: string
  leadId: string
  lead: Lead
  lastMessage?: Message
  unreadCount: number
}

export interface PipelineStage {
  id: string
  tenantId?: string
  name: string
  order: number
  color: string
  leadIds: string[]
}

export interface Automation {
  id: string
  tenantId?: string
  name: string
  event: string
  condition?: string
  action: string
  active: boolean
}

export interface Metric {
  id: string
  label: string
  value: number
  change?: number
  trend?: 'up' | 'down'
}

export interface Broadcast {
  id: string
  tenantId?: string
  name: string
  message: string
  channel?: Channel
  tags?: string[]
  leadStatus?: LeadStatus
  pipelineStage?: string
  scheduledAt?: string
  sentAt?: string
  broadcastStatus: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'
  totalRecipients: number
  sentCount: number
  failedCount: number
  createdAt: string
}

