import { create } from 'zustand'
import { Message, Conversation, Lead } from '@/types'
import { subHours, subMinutes } from 'date-fns'
import { useLeadsStore } from '@/lib/stores/leadsStore'
import { useAuthStore } from '@/lib/stores/authStore'
import { useConnectionsStore } from '@/lib/stores/connectionsStore'
import { supabase } from '@/lib/supabase'

// Mapper para converter snake_case do Supabase para camelCase do TS
const mapMessageFromDb = (row: any): Message => ({
  id: row.id,
  tenantId: row.tenant_id,
  leadId: row.lead_id,
  content: row.content,
  senderId: row.sender_id,
  senderName: row.sender_name,
  senderType: row.sender_type,
  channel: row.channel,
  createdAt: row.created_at,
  read: row.read,
})

interface ConversationsState {
  messages: Message[]
  conversations: Conversation[]
  selectedConversationId: string | null
  initialized: boolean
  initializeConversations: (leads: Lead[]) => Promise<void>
  subscribeToMessages: (tenantId: string) => () => void
  setSelectedConversation: (leadId: string | null) => void
  sendMessage: (leadId: string, content: string) => Promise<void>
  getMessagesByLead: (leadId: string) => Message[]
  getConversationByLead: (leadId: string) => Conversation | null
}

export const useConversationsStore = create<ConversationsState>((set, get) => {
  const initializeConversations = async (leads: Lead[]) => {
    if (get().initialized) return
    
    // Buscar mensagens reais do Supabase
    const { data: dbMessages, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })

    const allMessages = (dbMessages || []).map(mapMessageFromDb)

    const conversations: Conversation[] = leads.map((lead) => {
      const leadMessages = allMessages.filter((m) => m.leadId === lead.id)
      const lastMessage = leadMessages[leadMessages.length - 1]
      const unreadCount = leadMessages.filter((m) => !m.read && m.senderType === 'lead').length

      return {
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
      initialized: true
    })
  }

  const subscribeToMessages = (tenantId: string) => {
    const channel = supabase
      .channel('realtime_inbox')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `tenant_id=eq.${tenantId}`
        },
        (payload) => {
          const newMessage = mapMessageFromDb(payload.new)
          
          set((state) => {
            // Evitar duplicados (caso o sendMessage ja tenha adicionado localmente)
            if (state.messages.find(m => m.id === newMessage.id)) return state

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
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  return {
    messages: [],
    conversations: [],
    selectedConversationId: null,
    initialized: false,
    initializeConversations,
    subscribeToMessages,

    setSelectedConversation: (leadId: string | null) => {
      set({ selectedConversationId: leadId })
    },

    sendMessage: async (leadId: string, content: string) => {
      const currentUser = useAuthStore.getState().user || { id: '1', name: 'Você' }
      const lead = get().conversations.find((c) => c.leadId === leadId)?.lead
      
      const newMessage: Message = {
        id: `msg-${leadId}-${Date.now()}`,
        leadId,
        content,
        senderId: currentUser.id,
        senderName: currentUser.name || 'Você',
        senderType: 'user',
        channel: lead?.channel || 'whatsapp',
        createdAt: new Date().toISOString(),
        read: true,
      }

      set((state) => ({
        messages: [...state.messages, newMessage],
        conversations: state.conversations.map((conv) =>
          conv.leadId === leadId
            ? { ...conv, lastMessage: newMessage, unreadCount: 0 }
            : conv
        ),
      }))

      try {
        const activeConnection = useConnectionsStore.getState().getActiveConnection()
        
        if (activeConnection?.provider === 'evolution' && activeConnection.instanceName && lead?.phone) {
          await fetch('/api/evolution/send-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              instanceName: activeConnection.instanceName,
              recipientPhone: lead.phone.replace(/\D/g, ''), // limpar mascara, deixar so numeros
              message: content,
              tenantId: lead.tenantId,
              leadId: lead.id,
              senderId: currentUser.id,
              senderName: currentUser.name || 'Você'
            })
          })
        } else if (activeConnection?.provider === 'meta') {
           // TODO: implementar rota de envio via Meta!
           console.log('Envio via Meta sera roteado aqui.')
        } else {
             console.warn('Nenhuma conexao ativa encontrada. Mensagem criada apenas localmente.')
        }
      } catch (err) {
        console.error('Falha ao enviar mensagem para API:', err)
      }

      // "Assumir" lead
      useLeadsStore.getState().updateLead(leadId, { assignedTo: currentUser.id })
    },

    getMessagesByLead: (leadId: string) => {
      return get().messages
        .filter((m) => m.leadId === leadId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    },

    getConversationByLead: (leadId: string) => {
      return get().conversations.find((c) => c.leadId === leadId) || null
    },
  }
})

