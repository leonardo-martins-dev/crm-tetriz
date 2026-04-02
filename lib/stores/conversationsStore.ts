import { create } from 'zustand'
import { Message, Conversation, Lead } from '@/types'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/authStore'
import { useConnectionsStore } from '@/lib/stores/connectionsStore'
import { useLeadsStore } from '@/lib/stores/leadsStore'

// Mapper para converter snake_case do Supabase para camelCase do TS
const mapMessageFromDb = (row: any): Message => ({
  id: row.id,
  tenantId: row.tenant_id,
  leadId: row.lead_id,
  content: row.content,
  senderId: row.sender_id,
  senderName: row.sender_name,
  senderType: row.sender_type as any,
  channel: row.channel as any,
  createdAt: row.created_at,
  read: row.read,
  status: row.status as any,
  mediaUrl: row.media_url,
  mediaType: row.media_type as any,
  wamid: row.wamid,
})

interface ConversationsState {
  messages: Message[]
  conversations: Conversation[]
  selectedConversationId: string | null
  initialized: boolean
  isLoading: boolean
  
  initializeConversations: (leads: Lead[]) => Promise<void>
  subscribeToMessages: () => () => void
  setSelectedConversation: (leadId: string | null) => void
  sendMessage: (leadId: string, content: string) => Promise<void>
  sendMediaMessage: (leadId: string, file: File, type: 'image' | 'audio' | 'video' | 'document') => Promise<void>
  getMessagesByLead: (leadId: string) => Message[]
  getConversationByLead: (leadId: string) => Conversation | null
}

export const useConversationsStore = create<ConversationsState>((set, get) => ({
  messages: [],
  conversations: [],
  selectedConversationId: null,
  initialized: false,
  isLoading: false,

  initializeConversations: async (leads: Lead[]) => {
    const tenantId = useAuthStore.getState().user?.tenantId
    if (!tenantId || leads.length === 0) return
    
    set({ isLoading: true })
    const { data: dbMessages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Erro ao buscar mensagens:', error)
      set({ isLoading: false })
      return
    }

    const allMessages = (dbMessages || []).map(mapMessageFromDb)

    const conversations: Conversation[] = leads.map((lead) => {
      const leadMessages = allMessages.filter((m) => m.leadId === lead.id)
      const lastMessage = leadMessages[leadMessages.length - 1]
      const unreadCount = leadMessages.filter((m) => !m.read && m.senderType === 'lead').length

      return {
        tenantId: lead.tenantId,
        leadId: lead.id,
        lead,
        lastMessage,
        unreadCount,
      }
    })

    set({
      messages: allMessages,
      conversations: conversations.sort((a, b) => {
        const aTime = a.lastMessage?.createdAt || a.lead.updatedAt
        const bTime = b.lastMessage?.createdAt || b.lead.updatedAt
        return new Date(bTime).getTime() - new Date(aTime).getTime()
      }),
      initialized: true,
      isLoading: false
    })
  },

  subscribeToMessages: () => {
    const tenantId = useAuthStore.getState().user?.tenantId
    if (!tenantId) return () => {}

    const channel = supabase
      .channel(`tenant_${tenantId}_messages`)
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'messages',
          filter: `tenant_id=eq.${tenantId}`
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage = mapMessageFromDb(payload.new)
            
            set((state) => {
              // De-duplicação de mensagem otimista
              const exists = state.messages.some(m => 
                (m.wamid && m.wamid === newMessage.wamid) || 
                (m.id === newMessage.id)
              )
              
              if (exists) return state

              const updatedMessages = [...state.messages, newMessage]
              const updatedConversations = state.conversations.map((conv) =>
                conv.leadId === newMessage.leadId
                  ? { 
                      ...conv, 
                      lastMessage: newMessage, 
                      unreadCount: newMessage.senderType === 'lead' ? conv.unreadCount + 1 : conv.unreadCount 
                    }
                  : conv
              )

              return {
                messages: updatedMessages,
                conversations: updatedConversations.sort((a, b) => {
                  const aTime = a.lastMessage?.createdAt || a.lead.updatedAt
                  const bTime = b.lastMessage?.createdAt || b.lead.updatedAt
                  return new Date(bTime).getTime() - new Date(aTime).getTime()
                })
              }
            })
          } else if (payload.eventType === 'UPDATE') {
            const updatedMsg = mapMessageFromDb(payload.new)
            set((state) => ({
              messages: state.messages.map(m => m.id === updatedMsg.id ? updatedMsg : m)
            }))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  },

  setSelectedConversation: (leadId: string | null) => {
    set({ selectedConversationId: leadId })
  },

  sendMessage: async (leadId: string, content: string) => {
    const user = useAuthStore.getState().user
    if (!user) return

    const lead = get().conversations.find((c) => c.leadId === leadId)?.lead
    if (!lead) return

    // Mensagem otimista
    const tempId = `temp-${Date.now()}`
    const newMessage: Message = {
      id: tempId,
      tenantId: user.tenantId,
      leadId,
      content,
      senderId: user.id,
      senderName: user.name,
      senderType: 'user',
      channel: lead.channel,
      createdAt: new Date().toISOString(),
      read: true,
      status: 'pending'
    }

    set((state) => ({
      messages: [...state.messages, newMessage],
    }))

    try {
      const activeConnection = useConnectionsStore.getState().getActiveConnection()
      
      const response = await fetch('/api/evolution/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instanceName: activeConnection?.instanceName,
          recipientPhone: lead.phone?.replace(/\D/g, ''),
          message: content,
          tenantId: user.tenantId,
          leadId: lead.id,
          senderId: user.id,
          senderName: user.name
        })
      })
      
      const result = await response.json()
      if (!result.success) throw new Error(result.error)

      // A mensagem real virá pelo Realtime e substituirá a otimista se os IDS baterem ou se usarmos wamid
    } catch (err) {
      console.error('Falha ao enviar mensagem:', err)
      // Marcar como falha na UI
      set((state) => ({
        messages: state.messages.map(m => m.id === tempId ? { ...m, status: 'failed' } : m)
      }))
    }
  },

  sendMediaMessage: async (leadId: string, file: File, type: 'image' | 'audio' | 'video' | 'document') => {
    const user = useAuthStore.getState().user
    if (!user) return

    const lead = get().conversations.find((c) => c.leadId === leadId)?.lead
    if (!lead) return

    const tempUrl = URL.createObjectURL(file)
    const tempId = `temp-media-${Date.now()}`
    
    const newMessage: Message = {
      id: tempId,
      tenantId: user.tenantId,
      leadId,
      content: `[Mídia: ${type}]`,
      senderId: user.id,
      senderName: user.name,
      senderType: 'user',
      channel: lead.channel,
      createdAt: new Date().toISOString(),
      read: true,
      status: 'pending',
      mediaUrl: tempUrl,
      mediaType: type
    }

    set((state) => ({
      messages: [...state.messages, newMessage],
    }))

    try {
      const activeConnection = useConnectionsStore.getState().getActiveConnection()
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)
      formData.append('instanceName', activeConnection?.instanceName || '')
      formData.append('recipientPhone', lead.phone?.replace(/\D/g, '') || '')
      formData.append('tenantId', user.tenantId || '')
      formData.append('leadId', lead.id)
      formData.append('senderId', user.id)
      formData.append('senderName', user.name)

      const response = await fetch('/api/evolution/send-media', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      if (!result.success) throw new Error(result.error)

    } catch (err) {
      console.error('Falha ao enviar mídia:', err)
      set((state) => ({
        messages: state.messages.map(m => m.id === tempId ? { ...m, status: 'failed' } : m)
      }))
    }
  },

  getMessagesByLead: (leadId: string) => {
    return get().messages
      .filter((m) => m.leadId === leadId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  },

  getConversationByLead: (leadId: string) => {
    return get().conversations.find((c) => c.leadId === leadId) || null
  },
}))

