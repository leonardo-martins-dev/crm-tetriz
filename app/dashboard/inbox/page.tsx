'use client'

import { useState, useEffect } from 'react'
import { useConversationsStore } from '@/lib/stores/conversationsStore'
import { useLeadsStore } from '@/lib/stores/leadsStore'
import { useUsersStore } from '@/lib/stores/usersStore'
import { useAgentsStore } from '@/lib/stores/agentsStore'
import { ChannelBadge } from '@/components/ChannelBadge'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatRelativeTime } from '@/lib/utils'
import { 
  Send, Clock, Lock, ChevronLeft, ChevronRight, Bot, User as UserIcon, 
  Paperclip, Image as ImageIcon, Music, Video, FileText, 
  Check, CheckCheck, AlertCircle 
} from 'lucide-react'
import { LeadCard } from '@/components/LeadCard'
import { useRef } from 'react'

export default function InboxPage() {
  const { 
    conversations, 
    selectedConversationId, 
    setSelectedConversation, 
    sendMessage, 
    sendMediaMessage,
    getMessagesByLead, 
    initializeConversations 
  } = useConversationsStore()
  
  const { setSelectedLead, leads } = useLeadsStore()
  const { users } = useUsersStore()
  const { agents } = useAgentsStore()
  const [messageInput, setMessageInput] = useState('')
  const [isLeadPanelOpen, setIsLeadPanelOpen] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (leads.length > 0 && conversations.length === 0) {
      initializeConversations(leads)
    }
  }, [leads, conversations.length, initializeConversations])

  const selectedConversation = conversations.find((c) => c.leadId === selectedConversationId)
  const messages = selectedConversationId ? getMessagesByLead(selectedConversationId) : []

  const handleSelectConversation = (leadId: string) => {
    setSelectedConversation(leadId)
    setSelectedLead(leadId)
    setIsLeadPanelOpen(true)
  }

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversationId) return
    if (!selectedConversation?.lead.window24hOpen) return

    sendMessage(selectedConversationId, messageInput)
    setMessageInput('')
  }

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedConversationId) return

    let type: 'image' | 'audio' | 'video' | 'document' = 'document'
    if (file.type.startsWith('image/')) type = 'image'
    else if (file.type.startsWith('audio/')) type = 'audio'
    else if (file.type.startsWith('video/')) type = 'video'

    await sendMediaMessage(selectedConversationId, file, type)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'pending': return <Clock className="h-3 w-3 text-muted-foreground/50" />
      case 'sent': return <Check className="h-3 w-3 text-muted-foreground/70" />
      case 'delivered': return <CheckCheck className="h-3 w-3 text-muted-foreground/70" />
      case 'read': return <CheckCheck className="h-3 w-3 text-blue-400" />
      case 'failed': return <AlertCircle className="h-3 w-3 text-destructive" />
      default: return null
    }
  }

  const renderMedia = (message: any) => {
    if (!message.mediaUrl) return null

    switch (message.mediaType) {
      case 'image':
        return (
          <div className="mt-2 rounded-lg overflow-hidden border border-white/10 max-w-sm">
            <img src={message.mediaUrl} alt="Mídia" className="w-full h-auto object-cover max-h-60" />
          </div>
        )
      case 'audio':
        return (
          <div className="mt-2 min-w-[200px]">
            <audio controls className="h-8 w-full">
              <source src={message.mediaUrl} type="audio/mpeg" />
            </audio>
          </div>
        )
      case 'video':
        return (
          <div className="mt-2 rounded-lg overflow-hidden border border-white/10 max-w-sm">
            <video controls className="w-full h-auto max-h-60">
              <source src={message.mediaUrl} type="video/mp4" />
            </video>
          </div>
        )
      case 'document':
        return (
          <a 
            href={message.mediaUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 mt-2 p-2 rounded bg-background/20 hover:bg-background/30 transition-colors border border-white/5"
          >
            <FileText className="h-4 w-4" />
            <span className="text-xs truncate max-w-[150px]">Ver Documento</span>
          </a>
        )
      default:
        return null
    }
  }

  const getAssignedInfo = (assignedId: string | undefined) => {
    if (!assignedId) return null
    const agent = agents.find(a => a.id === assignedId)
    if (agent) return { name: agent.name, type: 'ai', icon: Bot, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' }
    const user = users.find(u => u.id === assignedId)
    if (user) return { name: user.name, type: 'user', icon: UserIcon, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' }
    return null
  }

  const assignedInfo = selectedConversation ? getAssignedInfo(selectedConversation.lead.assignedTo) : null;

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4 overflow-hidden">
      {/* Lista de Conversas */}
      <div className="w-80 flex-shrink-0 border-r bg-card flex flex-col h-full">
        <div className="border-b p-4 flex-shrink-0">
          <h2 className="text-lg font-semibold">Conversas</h2>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hover">
          {conversations.length > 0 ? (
            conversations.map((conv) => {
              const isSelected = selectedConversationId === conv.leadId
              return (
                <div
                  key={conv.leadId}
                  onClick={() => handleSelectConversation(conv.leadId)}
                  className={`cursor-pointer border-b p-4 transition-colors hover:bg-accent ${
                    isSelected ? 'bg-accent' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium truncate">{conv.lead.name}</span>
                        {conv.unreadCount > 0 && (
                          <Badge variant="info" className="h-5 min-w-[20px] px-1.5 text-xs">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <ChannelBadge channel={conv.lead.channel} />
                        {!conv.lead.window24hOpen && (
                          <Badge variant="danger" className="gap-1">
                            <Lock className="h-3 w-3" />
                            Janela fechada
                          </Badge>
                        )}
                      </div>
                      {conv.lastMessage && (
                        <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                          {conv.lastMessage.mediaType === 'image' && <ImageIcon className="h-3 w-3" />}
                          {conv.lastMessage.mediaType === 'audio' && <Music className="h-3 w-3" />}
                          {conv.lastMessage.mediaType === 'video' && <Video className="h-3 w-3" />}
                          {conv.lastMessage.mediaType === 'document' && <FileText className="h-3 w-3" />}
                          {conv.lastMessage.content}
                        </p>
                      )}
                      {conv.lastMessage && (
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-muted-foreground">
                            {formatRelativeTime(conv.lastMessage.createdAt)}
                          </p>
                          {conv.lastMessage.senderType !== 'lead' && getStatusIcon(conv.lastMessage.status)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="p-8 text-center bg-muted/30 h-full flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Bot className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-medium">Nenhuma conversa</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                As conversas aparecerão aqui assim que seus leads entrarem em contato.
              </p>
              {leads.length === 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4 text-xs"
                  onClick={() => window.location.href = '/dashboard/settings/connections'}
                >
                  Configurar Conexão
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Área de Chat */}
      <div className={`flex-1 flex flex-col bg-card h-full overflow-hidden ${isLeadPanelOpen ? 'border-r' : ''}`}>
        {selectedConversation ? (
          <>
            {/* Header do Chat */}
            <div className="border-b p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {selectedConversation.lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{selectedConversation.lead.name}</h3>
                      {assignedInfo && (
                        <Badge variant="outline" className={`gap-1.5 px-2 py-0.5 text-xs font-medium border ${assignedInfo.color}`}>
                          <assignedInfo.icon className="h-3 w-3" />
                          Atribuído a: {assignedInfo.name}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                      <ChannelBadge channel={selectedConversation.lead.channel} />
                      {selectedConversation.lead.window24hOpen ? (
                        <Badge variant="success" className="gap-1">
                          <Clock className="h-3 w-3" />
                          Janela aberta
                        </Badge>
                      ) : (
                        <Badge variant="danger" className="gap-1">
                          <Lock className="h-3 w-3" />
                          Janela fechada
                        </Badge>
                      ) }
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLeadPanelOpen((prev) => !prev)}
                >
                  {isLeadPanelOpen ? (
                    <>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Recolher detalhes
                    </>
                  ) : (
                    <>
                      <ChevronRight className="h-4 w-4 mr-2" />
                      Ver detalhes
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hover">
              {messages.map((message) => {
                const isUser = message.senderType === 'user'
                const isAi = message.senderType === 'ai'
                const isSystem = isUser || isAi
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isSystem ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex flex-col ${isSystem ? 'items-end' : 'items-start'}`}>
                      {isAi && <span className="text-[10px] text-purple-500 font-semibold mb-1 mr-1 flex items-center gap-1"><Bot className="h-3 w-3" /> {message.senderName}</span>}
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          isAi ? 'bg-purple-600 text-white' :
                          isUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {renderMedia(message)}
                        <p className="text-sm mt-1">{message.content}</p>
                        <div className="flex items-center gap-1 mt-1 justify-end">
                          <p className={`text-[10px] ${isSystem ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {formatRelativeTime(message.createdAt)}
                          </p>
                          {isSystem && getStatusIcon(message.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Input de Mensagem */}
            <div className="border-t p-4">
              {!selectedConversation.lead.window24hOpen ? (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span>A janela de 24h está fechada. Não é possível enviar mensagens.</span>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleFileClick}
                    disabled={!selectedConversation.lead.window24hOpen}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Digite sua mensagem..."
                    disabled={!selectedConversation.lead.window24hOpen}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || !selectedConversation.lead.window24hOpen}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium text-muted-foreground">
                Selecione uma conversa para começar
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Lead Card */}
      {selectedConversation && (
        <div
          className={`flex-shrink-0 bg-card h-full flex flex-col overflow-hidden border-l transition-all duration-300 ease-in-out ${
            isLeadPanelOpen ? 'w-96 opacity-100' : 'w-0 opacity-0'
          }`}
        >
          <div
            className={`h-full transition-transform duration-300 ease-in-out ${
              isLeadPanelOpen ? 'translate-x-0' : 'translate-x-4'
            }`}
          >
            <LeadCard leadId={selectedConversation.leadId} />
          </div>
        </div>
      )}
    </div>
  )
}

