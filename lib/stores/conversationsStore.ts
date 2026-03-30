import { create } from 'zustand'
import { Message, Conversation, Lead, Channel } from '@/types'
import { subHours, subMinutes } from 'date-fns'
import { useLeadsStore } from '@/lib/stores/leadsStore'
import { useAuthStore } from '@/lib/stores/authStore'

// Mock messages
const generateMockMessages = (lead: Lead): Message[] => {
  const isAi = lead.assignedTo?.startsWith('agent-')
  const senderId = lead.assignedTo || '1'
  const senderType = isAi ? 'ai' : 'user'
  const senderName = isAi ? 'Assistente IA' : 'Atendente'

  const messages: Message[] = [
    {
      id: `msg-${lead.id}-1`,
      leadId: lead.id,
      content: 'Olá, gostaria de saber mais sobre seus produtos.',
      senderId: lead.id,
      senderName: 'Lead',
      senderType: 'lead',
      channel: lead.channel,
      createdAt: subHours(new Date(), 2).toISOString(),
      read: true,
    },
    {
      id: `msg-${lead.id}-2`,
      leadId: lead.id,
      content: isAi 
        ? 'Olá! Sou um assistente especializado. Fico feliz em ajudar. Qual produto te interessa?' 
        : 'Claro! Fico feliz em ajudar. Qual produto te interessa?',
      senderId,
      senderName,
      senderType,
      channel: lead.channel,
      createdAt: subHours(new Date(), 1).toISOString(),
      read: true,
    },
    {
      id: `msg-${lead.id}-3`,
      leadId: lead.id,
      content: 'Estou interessado no plano premium.',
      senderId: lead.id,
      senderName: 'Lead',
      senderType: 'lead',
      channel: lead.channel,
      createdAt: subMinutes(new Date(), 30).toISOString(),
      read: true,
    },
  ]
  return messages
}

interface ConversationsState {
  messages: Message[]
  conversations: Conversation[]
  selectedConversationId: string | null
  initializeConversations: (leads: Lead[]) => void
  setSelectedConversation: (leadId: string | null) => void
  sendMessage: (leadId: string, content: string) => void
  getMessagesByLead: (leadId: string) => Message[]
  getConversationByLead: (leadId: string) => Conversation | null
}

export const useConversationsStore = create<ConversationsState>((set, get) => {
  const initializeConversations = (leads: Lead[]) => {
    const allMessages: Message[] = []
    leads.forEach((lead) => {
      const leadMessages = generateMockMessages(lead)
      allMessages.push(...leadMessages)
    })

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
    })
  }

  return {
    messages: [],
    conversations: [],
    selectedConversationId: null,
    initializeConversations,

    setSelectedConversation: (leadId: string | null) => {
      set({ selectedConversationId: leadId })
    },

    sendMessage: (leadId: string, content: string) => {
      const currentUser = useAuthStore.getState().user || { id: '1', name: 'Você' }
      
      const newMessage: Message = {
        id: `msg-${leadId}-${Date.now()}`,
        leadId,
        content,
        senderId: currentUser.id,
        senderName: currentUser.name || 'Você',
        senderType: 'user',
        channel: get().conversations.find((c) => c.leadId === leadId)?.lead.channel || 'whatsapp',
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

