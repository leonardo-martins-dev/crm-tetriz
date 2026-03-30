'use client'

import { useState, useRef, useEffect } from 'react'
import { useAgentsStore, Agent, AgentTrigger, TriggerType } from '@/lib/stores/agentsStore'
import { useTagsStore } from '@/lib/stores/tagsStore'
import { usePipelineStore } from '@/lib/stores/pipelineStore'
import { useAuthStore } from '@/lib/stores/authStore'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Bot, Plus, Trash2, Edit2, Power, PowerOff, Tag, ListFilter, X, ArrowRightLeft, ShieldCheck, ChevronDown } from 'lucide-react'

const models = [
  { id: 'gpt-4o', name: 'GPT-4o (OpenAI)' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo (OpenAI)' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet (Anthropic)' },
  { id: 'gemini-1-5-pro', name: 'Gemini 1.5 Pro (Google)' },
  { id: 'llama-3', name: 'Llama 3 (Meta)' },
]

function TriggerValueSelect({ type, value, onChange, tags, pipelineStages }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const options = type === 'tag'
    ? tags.map((t: any) => ({ value: t.name, label: t.name, color: t.color }))
    : pipelineStages.map((s: any) => ({ value: s.name, label: s.name, color: s.color }))

  const selectedOption = options.find((o: any) => o.value === value)

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background/80 px-3 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {selectedOption ? (
          <div className="flex items-center gap-2 truncate">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: selectedOption.color }} />
            <span className="truncate">{selectedOption.label}</span>
          </div>
        ) : (
          <span className="text-muted-foreground truncate">Selecione...</span>
        )}
        <ChevronDown className="h-4 w-4 opacity-50 ml-2 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
          {options.map((opt: any) => (
            <div
              key={opt.value}
              className="relative flex cursor-pointer select-none items-center gap-2 py-1.5 px-3 text-sm hover:bg-accent hover:text-accent-foreground"
              onClick={() => {
                onChange(opt.value)
                setIsOpen(false)
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: opt.color }} />
              <span className="truncate">{opt.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AgentsPage() {
  const { client } = useAuthStore()
  const { agents, addAgent, updateAgent, deleteAgent, toggleAgentActive } = useAgentsStore()
  const { tags } = useTagsStore()
  const { getPipelineForClient } = usePipelineStore()
  
  const clientId = client?.id || 'default'
  const pipelineStages = getPipelineForClient(clientId).sort((a, b) => a.order - b.order)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  
  // States do formulário
  const [name, setName] = useState('')
  const [prompt, setPrompt] = useState('')
  const [triggers, setTriggers] = useState<AgentTrigger[]>([])
  const [canAssignTags, setCanAssignTags] = useState(false)
  const [canMovePipeline, setCanMovePipeline] = useState(false)
  const [model, setModel] = useState('')
  const [apiKey, setApiKey] = useState('')

  const handleOpenModal = (agent?: Agent) => {
    if (agent) {
      setEditingAgent(agent)
      setName(agent.name)
      setPrompt(agent.prompt)
      setTriggers([...agent.triggers])
      setCanAssignTags(agent.permissions.canAssignTags)
      setCanMovePipeline(agent.permissions.canMovePipeline)
      setModel(agent.model)
      setApiKey(agent.apiKey)
    } else {
      setEditingAgent(null)
      setName('')
      setPrompt('')
      setTriggers([{ id: `trig-${Date.now()}`, type: 'pipeline_stage', value: pipelineStages[0]?.name || '' }])
      setCanAssignTags(false)
      setCanMovePipeline(false)
      setModel('')
      setApiKey('')
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingAgent(null)
  }

  const handleAddTrigger = () => {
    setTriggers([
      ...triggers, 
      { id: `trig-${Date.now()}`, type: 'pipeline_stage', value: pipelineStages[0]?.name || '' }
    ])
  }

  const handleRemoveTrigger = (id: string) => {
    setTriggers(triggers.filter(t => t.id !== id))
  }

  const handleUpdateTrigger = (id: string, updates: Partial<AgentTrigger>) => {
    setTriggers(triggers.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...updates }
        if (updates.type && updates.type !== t.type) {
          updated.value = updates.type === 'tag' ? (tags[0]?.name || '') : (pipelineStages[0]?.name || '')
        }
        return updated
      }
      return t
    }))
  }

  const handleSave = () => {
    const validTriggers = triggers.filter(t => t.value.trim() !== '')
    if (!name.trim() || !prompt.trim() || !model || validTriggers.length === 0) return

    const permissions = { canAssignTags, canMovePipeline }

    if (editingAgent) {
      updateAgent(editingAgent.id, {
        name: name.trim(),
        prompt: prompt.trim(),
        triggers: validTriggers,
        permissions,
        model,
        apiKey: apiKey.trim(),
      })
    } else {
      addAgent({
        name: name.trim(),
        prompt: prompt.trim(),
        triggers: validTriggers,
        permissions,
        model,
        apiKey: apiKey.trim(),
        active: true,
      })
    }
    handleCloseModal()
  }

  const handleDelete = (agentId: string) => {
    if (confirm('Tem certeza que deseja excluir permanentemente este agente?')) {
      deleteAgent(agentId)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agentes IA</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Crie automatizações baseadas em prompts de inteligência artificial para interagir com seus leads.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Agente
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card key={agent.id} className="transition-all hover:shadow-md border-border/50 flex flex-col justify-between overflow-hidden">
            <CardContent className="p-5 flex flex-col flex-1">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${agent.active ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">{agent.name}</h3>
                    <Badge variant={agent.active ? 'success' : 'secondary'} className="text-[10px] uppercase">
                      {agent.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="py-2 space-y-3 flex-1 flex flex-col justify-center">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Gatilhos ({agent.triggers.length})</span>
                  <div className="flex flex-wrap gap-1">
                    {agent.triggers.slice(0, 3).map(trigger => (
                      <Badge key={trigger.id} variant="outline" className="text-xs font-normal">
                        {trigger.type === 'tag' ? <Tag className="h-3 w-3 mr-1 inline" /> : <ListFilter className="h-3 w-3 mr-1 inline" />}
                        {trigger.value}
                      </Badge>
                    ))}
                    {agent.triggers.length > 3 && (
                      <Badge variant="outline" className="text-xs font-normal">+{agent.triggers.length - 3}</Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Permissões</span>
                  <div className="flex gap-2">
                    {agent.permissions.canAssignTags ? (
                       <Badge variant="secondary" className="text-xs font-normal bg-primary/10 text-primary hover:bg-primary/20"><Tag className="w-3 h-3 mr-1"/> Tags</Badge>
                    ) : (
                       <Badge variant="outline" className="text-xs font-normal text-muted-foreground line-through opacity-50"><Tag className="w-3 h-3 mr-1"/> Tags</Badge>
                    )}
                    {agent.permissions.canMovePipeline ? (
                       <Badge variant="secondary" className="text-xs font-normal bg-primary/10 text-primary hover:bg-primary/20"><ArrowRightLeft className="w-3 h-3 mr-1"/> Funil</Badge>
                    ) : (
                       <Badge variant="outline" className="text-xs font-normal text-muted-foreground line-through opacity-50"><ArrowRightLeft className="w-3 h-3 mr-1"/> Funil</Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground border-t pt-2 mt-auto">
                  <span>Modelo:</span>
                  <span className="font-medium text-foreground">{models.find(m => m.id === agent.model)?.name || agent.model}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenModal(agent)}
                  className="flex-1"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant={agent.active ? 'outline' : 'default'}
                  size="sm"
                  onClick={() => toggleAgentActive(agent.id)}
                  className={`flex-1 ${agent.active ? 'hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30' : ''}`}
                >
                  {agent.active ? (
                    <>
                      <PowerOff className="h-4 w-4 mr-2" />
                      Desativar
                    </>
                  ) : (
                    <>
                      <Power className="h-4 w-4 mr-2" />
                      Ativar
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-2 text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => handleDelete(agent.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {agents.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
              <Bot className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Nenhum agente IA criado</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
              Você ainda não tem inteligências artificiais configuradas. Crie um agente e forneça um prompt para ele automatizar interações.
            </p>
            <Button onClick={() => handleOpenModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Agente
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal de Criar/Editar Agente */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAgent ? 'Configurar Agente' : 'Novo Agente IA'}
        size="xl"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome do Agente</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Qualificador de Leads, Assistente Técnico..."
            />
          </div>

          <div className="space-y-3 bg-muted/30 p-4 rounded-lg border border-border/50">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <ListFilter className="h-4 w-4 text-primary" />
                Condições de Disparo (Gatilhos OU)
              </label>
            </div>
            <p className="text-xs text-muted-foreground mb-2">O agente será executado quando QUALQUER UMA destas condições for atingida.</p>
            
            <div className="space-y-2">
              {triggers.map((trigger, index) => (
                <div key={trigger.id} className="flex items-end gap-2 animate-in slide-in-from-left-2 fade-in duration-300">
                  <div className="space-y-1 flex-1">
                    <select
                      value={trigger.type}
                      onChange={(e) => handleUpdateTrigger(trigger.id, { type: e.target.value as TriggerType })}
                      className="flex h-9 w-full rounded-md border border-input bg-background/80 px-3 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="pipeline_stage">Entrar na Etapa de Pipeline</option>
                      <option value="tag">Receber Tag</option>
                    </select>
                  </div>
                  <div className="space-y-1 flex-[2]">
                    <TriggerValueSelect
                      type={trigger.type}
                      value={trigger.value}
                      tags={tags}
                      pipelineStages={pipelineStages}
                      onChange={(val: string) => handleUpdateTrigger(trigger.id, { value: val })}
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="px-2 text-muted-foreground hover:text-destructive h-9"
                    onClick={() => handleRemoveTrigger(trigger.id)}
                    disabled={triggers.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Button variant="outline" size="sm" onClick={handleAddTrigger} className="mt-2 w-full border-dashed">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Condição
            </Button>
          </div>

          <div className="space-y-3 bg-card border border-border/50 rounded-lg p-4 shadow-sm">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Permissões do Agente IA
            </h4>
            <p className="text-xs text-muted-foreground mb-3">Defina quais ações a IA pode realizar de forma autônoma no sistema mediante conversa com o cliente.</p>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={canAssignTags}
                  onChange={(e) => setCanAssignTags(e.target.checked)}
                  className="w-4 h-4 rounded border-primary text-primary focus:ring-primary focus:ring-offset-background transition-all"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">Atribuir/Remover Tags</span>
                  <span className="text-xs text-muted-foreground">O agente poderá entender o contexto e marcar o lead sozinho.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={canMovePipeline}
                  onChange={(e) => setCanMovePipeline(e.target.checked)}
                  className="w-4 h-4 rounded border-primary text-primary focus:ring-primary focus:ring-offset-background transition-all"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">Mover Cards no Pipeline</span>
                  <span className="text-xs text-muted-foreground">O agente pode evoluir o lead de coluna conforme o rumo da qualificação.</span>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Prompt do Sistema (Instruções)</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Descreva exatamente como a IA deve agir e o que deve falar com o lead..."
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
            />
            <p className="text-xs text-muted-foreground mt-1">Este será o comportamento raiz do seu robô.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Provedor LLM</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="" disabled>Nenhum selecionado</option>
                {models.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            {model && (
              <div className="space-y-2 animate-in fill-mode-both slide-in-from-right-4 fade-in duration-300">
                <label className="text-sm font-medium text-primary">Chave da API (API Key)</label>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="bg-primary/5 border-primary/20 focus-visible:ring-primary"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!name || !prompt || !model || triggers.length === 0 || triggers.every(t => !t.value)}>
              {editingAgent ? 'Salvar Configurações' : 'Finalizar Criação'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
