'use client'

import { useEffect, useRef, useState } from 'react'
import { useLeadsStore } from '@/lib/stores/leadsStore'
import { ChannelBadge } from './ChannelBadge'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { formatDate } from '@/lib/utils'
import {
  User,
  Phone,
  Mail,
  Plus,
  X,
  ChevronDown,
  UserCircle,
} from 'lucide-react'

interface LeadCardProps {
  leadId: string
}

export function LeadCard({ leadId }: LeadCardProps) {
  const { selectedLead, addNote, addTag, removeTag } = useLeadsStore()
  const mockTagOptions = ['Quente', 'Interessado', 'Follow-up', 'Novo', 'VIP', 'Recuperar']
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isTagSelectOpen, setIsTagSelectOpen] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [showNoteInput, setShowNoteInput] = useState(false)
  const tagSelectRef = useRef<HTMLDivElement>(null)

  if (!selectedLead || selectedLead.id !== leadId) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Carregando informações do lead...
      </div>
    )
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tagSelectRef.current && !tagSelectRef.current.contains(event.target as Node)) {
        setIsTagSelectOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggleSelectedTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const availableTagOptions = mockTagOptions.filter(
    (tag) => !selectedLead.tags.includes(tag) && !selectedTags.includes(tag)
  )

  const handleAddSelectedTags = () => {
    selectedTags.forEach((tag) => {
      if (!selectedLead.tags.includes(tag)) addTag(leadId, tag)
    })
    setSelectedTags([])
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNote(leadId, {
        id: `note-${Date.now()}`,
        content: newNote.trim(),
        authorId: 'user-1',
        authorName: 'Você',
        createdAt: new Date().toISOString(),
        internal: true,
      })
      setNewNote('')
      setShowNoteInput(false)
    }
  }

  return (
    <div className="h-full overflow-y-auto border-l scrollbar-hover">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-semibold">
              {selectedLead.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{selectedLead.name}</h3>
              <ChannelBadge channel={selectedLead.channel} />
            </div>
          </div>
        </div>

        {/* Informações de Contato */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {selectedLead.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{selectedLead.phone}</span>
              </div>
            )}
            {selectedLead.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{selectedLead.email}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="info">{selectedLead.pipelineStage}</Badge>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {selectedLead.tags.map((tag) => (
                <Badge key={tag} variant="default" className="gap-1">
                  {tag}
                  <button
                    onClick={() => removeTag(leadId, tag)}
                    className="ml-1 hover:opacity-70"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Selecione uma ou mais tags e adicione ao lead</div>
              <div ref={tagSelectRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsTagSelectOpen((prev) => !prev)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm"
                >
                  <span className={selectedTags.length ? '' : 'text-muted-foreground'}>
                    {selectedTags.length
                      ? selectedTags.length > 2
                        ? `${selectedTags.slice(0, 2).join(', ')} +${selectedTags.length - 2}`
                        : selectedTags.join(', ')
                      : 'Selecione tags...'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>

                {isTagSelectOpen && (
                  <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                    {availableTagOptions.length > 0 ? (
                      availableTagOptions.map((tag) => (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => handleToggleSelectedTag(tag)}
                          className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          {tag}
                        </button>
                      ))
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        Nenhuma tag disponível
                      </div>
                    )}
                  </div>
                )}
              </div>
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <Badge key={tag} variant="info" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleToggleSelectedTag(tag)}
                        className="ml-1 hover:opacity-70"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAddSelectedTags}
                  disabled={selectedTags.length === 0}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar tag
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Identificadores */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Identificadores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Score:</span>
              <Badge variant={selectedLead.score > 70 ? 'success' : selectedLead.score > 40 ? 'warning' : 'default'}>
                {selectedLead.score}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Prioridade:</span>
              <Badge
                variant={
                  selectedLead.priority === 'high'
                    ? 'danger'
                    : selectedLead.priority === 'medium'
                    ? 'warning'
                    : 'default'
                }
              >
                {selectedLead.priority === 'high' ? 'Alta' : selectedLead.priority === 'medium' ? 'Média' : 'Baixa'}
              </Badge>
            </div>
            {selectedLead.campaign && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Campanha:</span>
                <span className="font-medium">{selectedLead.campaign}</span>
              </div>
            )}
            {selectedLead.product && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Produto:</span>
                <span className="font-medium">{selectedLead.product}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Responsável */}
        {selectedLead.assignedTo && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Responsável</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <UserCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Atendente</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Histórico */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Histórico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Criado em:</span>
              <p className="font-medium">{formatDate(selectedLead.createdAt)}</p>
            </div>
            {selectedLead.lastContactAt && (
              <div>
                <span className="text-muted-foreground">Último contato:</span>
                <p className="font-medium">{formatDate(selectedLead.lastContactAt)}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Anotações */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Anotações Internas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedLead.notes.length > 0 ? (
              <div className="space-y-2">
                {selectedLead.notes.map((note) => (
                  <div key={note.id} className="rounded-md bg-muted p-2 text-sm">
                    <p>{note.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {note.authorName} • {formatDate(note.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma anotação ainda</p>
            )}
            {showNoteInput ? (
              <div className="space-y-2">
                <Input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Digite uma anotação..."
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddNote}>
                    Salvar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => {
                    setShowNoteInput(false)
                    setNewNote('')
                  }}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => setShowNoteInput(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Anotação
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

