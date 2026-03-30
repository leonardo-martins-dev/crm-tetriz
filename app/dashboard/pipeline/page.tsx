'use client'

import { useState, useRef, useEffect } from 'react'
import { useLeadsStore } from '@/lib/stores/leadsStore'
import { usePipelineStore } from '@/lib/stores/pipelineStore'
import { useAuthStore } from '@/lib/stores/authStore'
import { ChannelBadge } from '@/components/ChannelBadge'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { formatRelativeTime } from '@/lib/utils'
import { User, Settings, Plus, Trash2, GripVertical, ChevronDown } from 'lucide-react'
import { renamePipelineStageForLeads } from '@/application/use-cases/pipeline/renamePipelineStage'

export default function PipelinePage() {
  const { client } = useAuthStore()
  const { leads, updateLead, setSelectedLead } = useLeadsStore()
  const { 
    getPipelineForClient, 
    updateStage, 
    addStage, 
    deleteStage,
    updatePipelineForClient,
    reorderStages
  } = usePipelineStore()
  
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null)
  const [draggedOverStageId, setDraggedOverStageId] = useState<string | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [editingStage, setEditingStage] = useState<{ id: string; name: string; color: string } | null>(null)
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null)
  const colorPickerRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [draggedStageId, setDraggedStageId] = useState<string | null>(null)
  const [dragOverStageId, setDragOverStageId] = useState<string | null>(null)
  const [newStageName, setNewStageName] = useState('')
  const [newStageColor, setNewStageColor] = useState('#3b82f6')

  const clientId = client?.id || 'default'
  const pipelineStages = getPipelineForClient(clientId).sort((a, b) => a.order - b.order)

  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setIsDragging(true)
    setDraggedLeadId(leadId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', leadId)
    e.dataTransfer.setData('application/json', JSON.stringify({ leadId }))
    
    // Adiciona classe visual ao elemento sendo arrastado
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5'
      e.currentTarget.style.cursor = 'grabbing'
    }
  }

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false)
    setDraggedLeadId(null)
    setDraggedOverStageId(null)
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1'
      e.currentTarget.style.cursor = 'grab'
    }
  }

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
    setDraggedOverStageId(stageId)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    // Só remove o highlight se realmente saiu da área
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDraggedOverStageId(null)
    }
  }

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    let leadId = draggedLeadId
    
    if (!leadId) {
      try {
        const data = e.dataTransfer.getData('application/json')
        if (data) {
          const parsed = JSON.parse(data)
          leadId = parsed.leadId
        } else {
          leadId = e.dataTransfer.getData('text/plain')
        }
      } catch {
        leadId = e.dataTransfer.getData('text/plain')
      }
    }
    
    if (!leadId) return

    const stage = pipelineStages.find((s) => s.id === stageId)
    if (!stage) return

    // Atualiza o lead
    updateLead(leadId, {
      pipelineStage: stage.name,
      updatedAt: new Date().toISOString(),
    })

    setDraggedLeadId(null)
    setDraggedOverStageId(null)
    setIsDragging(false)
  }

  const getLeadsForStage = (stageName: string) => {
    return leads.filter((lead) => lead.pipelineStage === stageName)
  }

  const handleAddStage = () => {
    if (!newStageName.trim()) return
    
    addStage(clientId, {
      name: newStageName.trim(),
      color: newStageColor,
      leadIds: [],
    })
    
    setNewStageName('')
    setNewStageColor('#3b82f6')
  }

  const handleUpdateStage = () => {
    if (!editingStage) return

    const stageBeforeUpdate = pipelineStages.find((stage) => stage.id === editingStage.id)
    const previousStageName = stageBeforeUpdate?.name

    updateStage(clientId, editingStage.id, {
      name: editingStage.name,
      color: editingStage.color,
    })

    if (previousStageName) {
      const renameUpdates = renamePipelineStageForLeads({
        leads,
        previousStageName,
        nextStageName: editingStage.name,
      })

      renameUpdates.forEach(({ leadId, updates }) => {
        updateLead(leadId, updates)
      })
    }

    setEditingStage(null)
    setShowColorPicker(null)
    // Limpar refs
    colorPickerRefs.current = {}
  }

  const handleDeleteStage = (stageId: string) => {
    const stage = pipelineStages.find((s) => s.id === stageId)
    if (!stage) return
    
    // Move os leads dessa etapa para a primeira etapa
    const firstStage = pipelineStages[0]
    if (firstStage) {
      leads.forEach((lead) => {
        if (lead.pipelineStage === stage.name) {
          updateLead(lead.id, {
            pipelineStage: firstStage.name,
            updatedAt: new Date().toISOString(),
          })
        }
      })
    }
    
    deleteStage(clientId, stageId)
  }

  const handleStageDragStart = (stageId: string) => (e: React.DragEvent) => {
    setDraggedStageId(stageId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', '')
    
    // Adiciona efeito visual ao elemento sendo arrastado
    const target = e.currentTarget as HTMLElement
    target.style.opacity = '0.5'
    target.style.transform = 'rotate(2deg) scale(1.05)'
  }

  const handleStageDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement
    target.style.opacity = '1'
    target.style.transform = 'rotate(0deg) scale(1)'
    setDraggedStageId(null)
    setDragOverStageId(null)
  }

  const handleStageDragOver = (stageId: string) => (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (draggedStageId && draggedStageId !== stageId) {
      setDragOverStageId(stageId)
    }
  }

  const handleStageDragLeave = () => {
    setDragOverStageId(null)
  }

  const handleStageDrop = (targetStageId: string) => (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!draggedStageId || draggedStageId === targetStageId) {
      setDragOverStageId(null)
      return
    }

    const currentOrder = pipelineStages.map((s) => s.id)
    const draggedIndex = currentOrder.indexOf(draggedStageId)
    const targetIndex = currentOrder.indexOf(targetStageId)

    const newOrder = [...currentOrder]
    newOrder.splice(draggedIndex, 1)
    newOrder.splice(targetIndex, 0, draggedStageId)

    reorderStages(clientId, newOrder)
    setDraggedStageId(null)
    setDragOverStageId(null)
  }

  // Fechar seletor de cor ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showColorPicker) {
        const ref = colorPickerRefs.current[showColorPicker]
        if (ref && !ref.contains(e.target as Node)) {
          setShowColorPicker(null)
        }
      }
    }

    if (showColorPicker) {
      // Pequeno delay para não fechar imediatamente ao abrir
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 100)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showColorPicker])

  const colors = [
    { value: '#3b82f6', name: 'Azul' },
    { value: '#8b5cf6', name: 'Roxo' },
    { value: '#f59e0b', name: 'Laranja' },
    { value: '#10b981', name: 'Verde' },
    { value: '#22c55e', name: 'Verde Claro' },
    { value: '#ef4444', name: 'Vermelho' },
    { value: '#ec4899', name: 'Rosa' },
    { value: '#06b6d4', name: 'Ciano' },
    { value: '#84cc16', name: 'Lima' },
    { value: '#f97316', name: 'Laranja Escuro' },
    { value: '#6366f1', name: 'Índigo' },
    { value: '#14b8a6', name: 'Turquesa' },
    { value: '#a855f7', name: 'Roxo Claro' },
    { value: '#0ea5e9', name: 'Azul Claro' },
    { value: '#64748b', name: 'Cinza' },
    { value: '#fbbf24', name: 'Amarelo' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pipeline</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Arraste os leads entre as etapas do funil
          </p>
        </div>
        <Button onClick={() => setIsSettingsOpen(true)}>
          <Settings className="h-4 w-4 mr-2" />
          Personalizar Etapas
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {pipelineStages.map((stage) => {
          const stageLeads = getLeadsForStage(stage.name)
          const isDraggedOver = draggedOverStageId === stage.id
          
          return (
            <div
              key={stage.id}
              className={`flex-shrink-0 w-80 transition-all ${
                isDraggedOver ? 'scale-105' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={(e) => handleDragLeave(e)}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <Card className={`border-border/50 overflow-hidden ${isDraggedOver ? 'ring-2 ring-primary bg-muted/30' : 'bg-muted/10'}`}>
                <div
                  className="p-4 border-b"
                  style={{ borderLeftColor: stage.color, borderLeftWidth: '4px' }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{stage.name}</h3>
                    <Badge variant="default">{stageLeads.length}</Badge>
                  </div>
                </div>
                <div 
                  className="p-2 space-y-2"
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className={`rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm text-card-foreground shadow-sm p-3 hover:shadow-md hover:border-border transition-all select-none ${
                        draggedLeadId === lead.id ? 'opacity-50 cursor-grabbing scale-95 shadow-lg' : 'cursor-grab'
                      }`}
                      draggable={true}
                      onDragStart={(e) => {
                        e.stopPropagation()
                        handleDragStart(e, lead.id)
                      }}
                      onDragEnd={(e) => {
                        e.stopPropagation()
                        handleDragEnd(e)
                      }}
                      onMouseDown={(e) => {
                        // Permite iniciar o drag
                        e.currentTarget.style.cursor = 'grabbing'
                      }}
                      onMouseUp={(e) => {
                        if (!isDragging) {
                          e.currentTarget.style.cursor = 'grab'
                        }
                      }}
                      onClick={(e) => {
                        // Só executa o click se não estiver arrastando
                        if (!isDragging && !draggedLeadId) {
                          setSelectedLead(lead.id)
                        }
                      }}
                      style={{ 
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        MozUserSelect: 'none',
                        msUserSelect: 'none',
                        touchAction: 'none'
                      }}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{lead.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <ChannelBadge channel={lead.channel} />
                            </div>
                          </div>
                        </div>
                        {lead.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {lead.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="default" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {lead.tags.length > 2 && (
                              <Badge variant="default" className="text-xs">
                                +{lead.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                        {lead.assignedTo && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>Atribuído</span>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {formatRelativeTime(lead.updatedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {stageLeads.length === 0 && (
                    <div className="p-8 text-center text-sm text-muted-foreground border-2 border-dashed border-border/50 rounded-lg">
                      {isDraggedOver ? 'Solte aqui' : 'Nenhum lead nesta etapa'}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )
        })}
      </div>

      {/* Modal de Personalização */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => {
          setIsSettingsOpen(false)
          setEditingStage(null)
          setShowColorPicker(null)
          setNewStageName('')
          // Limpar refs
          colorPickerRefs.current = {}
        }}
        title="Personalizar Etapas do Pipeline"
        size="lg"
      >
        <div className="space-y-6">
          {/* Lista de Etapas Existentes */}
          <div className="space-y-3">
            <h3 className="font-semibold">Etapas Atuais</h3>
            {pipelineStages.map((stage) => (
              <div
                key={stage.id}
                className={`flex items-center gap-3 p-3 border rounded-lg transition-all duration-200 ${
                  draggedStageId === stage.id 
                    ? 'opacity-50 scale-95 rotate-1 shadow-lg' 
                    : draggedStageId && dragOverStageId === stage.id
                    ? 'border-primary border-2 bg-primary/5 scale-[1.02] shadow-md'
                    : draggedStageId
                    ? 'opacity-60'
                    : 'hover:shadow-md hover:border-primary/50'
                }`}
                draggable
                onDragStart={handleStageDragStart(stage.id)}
                onDragEnd={handleStageDragEnd}
                onDragOver={handleStageDragOver(stage.id)}
                onDragLeave={handleStageDragLeave}
                onDrop={handleStageDrop(stage.id)}
              >
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                <div
                  className="w-4 h-4 rounded flex-shrink-0"
                  style={{ backgroundColor: stage.color }}
                />
                <div className="flex-1">
                  {editingStage?.id === stage.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editingStage.name}
                        onChange={(e) =>
                          setEditingStage({ ...editingStage, name: e.target.value })
                        }
                        className="w-full"
                        placeholder="Nome da etapa"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Cor:</span>
                        <div 
                          className="relative" 
                          ref={(el) => {
                            colorPickerRefs.current[stage.id] = el
                          }}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              const newPickerId = showColorPicker === stage.id ? null : stage.id
                              setShowColorPicker(newPickerId)
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 border rounded-md hover:bg-accent transition-colors"
                          >
                            <div
                              className="w-5 h-5 rounded border-2 border-border flex-shrink-0"
                              style={{ backgroundColor: editingStage.color }}
                            />
                            <ChevronDown className={`h-4 w-4 transition-transform flex-shrink-0 ${showColorPicker === stage.id ? 'rotate-180' : ''}`} />
                          </button>
                          {showColorPicker === stage.id && (
                            <div 
                              className="absolute top-full left-0 mt-2 p-3 bg-popover border rounded-lg shadow-xl z-50 min-w-[280px]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Selecione uma cor</span>
                                  <div
                                    className="w-6 h-6 rounded border-2 border-border flex-shrink-0"
                                    style={{ backgroundColor: editingStage.color }}
                                  />
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                  {colors.map((color) => (
                                    <button
                                      key={color.value}
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setEditingStage({ ...editingStage, color: color.value })
                                        setShowColorPicker(null)
                                      }}
                                      className={`group relative w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                                        editingStage.color === color.value
                                          ? 'border-foreground scale-110 ring-2 ring-primary ring-offset-1'
                                          : 'border-border hover:border-foreground/50'
                                      }`}
                                      style={{ backgroundColor: color.value }}
                                      title={color.name}
                                    >
                                      {editingStage.color === color.value && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                          <div className="w-3 h-3 rounded-full bg-white/90 shadow-sm" />
                                        </div>
                                      )}
                                    </button>
                                  ))}
                                </div>
                                <div className="pt-2 border-t">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">Cor atual:</span>
                                    <span className="text-xs font-medium">{colors.find(c => c.value === editingStage.color)?.name || 'Personalizada'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleUpdateStage} className="flex-1">
                          Salvar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingStage(null)
                            setShowColorPicker(null)
                            // Limpar refs
                            colorPickerRefs.current = {}
                          }}
                          className="flex-1"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{stage.name}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingStage({
                              id: stage.id,
                              name: stage.name,
                              color: stage.color,
                            })
                            setShowColorPicker(null)
                          }}
                        >
                          Editar
                        </Button>
                        {pipelineStages.length > 1 && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteStage(stage.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Adicionar Nova Etapa */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="font-semibold">Adicionar Nova Etapa</h3>
            <div className="space-y-3">
              <Input
                placeholder="Nome da etapa"
                value={newStageName}
                onChange={(e) => setNewStageName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddStage()}
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Cor:</span>
                <div className="flex gap-2 flex-wrap">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setNewStageColor(color.value)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                        newStageColor === color.value
                          ? 'border-foreground scale-110 ring-2 ring-primary ring-offset-1'
                          : 'border-border hover:border-foreground/50'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              <Button onClick={handleAddStage} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Etapa
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
