import { create } from 'zustand'
import { Lead, Note, PipelineStage } from '@/types'
import { subDays, addHours } from 'date-fns'
import { createDefaultPipeline } from '@/domain/constants/pipeline'

// Mock leads data
const generateMockLeads = (): Lead[] => {
  const channels: Array<'whatsapp'> = ['whatsapp']
  const statuses: Lead['status'][] = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']
  const priorities: Lead['priority'][] = ['low', 'medium', 'high']
  const names = [
    'Ana Paula', 'Carlos Mendes', 'Fernanda Lima', 'Roberto Alves',
    'Juliana Costa', 'Marcos Silva', 'Patricia Souza', 'Ricardo Oliveira',
    'Beatriz Santos', 'Felipe Rocha', 'Gabriela Martins', 'Henrique Dias',
    'Isabela Ferreira', 'Lucas Pereira', 'Mariana Gomes', 'Nicolas Barbosa',
  ]

  const baseLeads = names.map((name, index) => {
    const channel = channels[index % channels.length]
    const status = statuses[index % statuses.length]
    const priority = priorities[index % priorities.length]
    const windowOpen = index % 3 !== 0
    const windowExpiresAt = windowOpen ? addHours(new Date(), 12 - (index % 12)) : undefined
    const isClientStage = status === 'contacted' || status === 'qualified'

    return {
      id: `lead-${index + 1}`,
      name,
      channel,
      phone: `+55 11 9${String(index).padStart(4, '0')}-${String(index).padStart(4, '0')}`,
      email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
      status,
      pipelineStage: status === 'new' ? 'Novo Lead' : 
                    status === 'contacted' ? 'Em Atendimento' :
                    status === 'qualified' ? 'Qualificado' :
                    status === 'proposal' ? 'Proposta Enviada' :
                    status === 'won' ? 'Ganhou' : 'Perdido',
      assignedTo: index % 3 === 0 ? '1' : index % 3 === 1 ? 'agent-1' : '3',
      tags: isClientStage && index % 5 === 0
        ? ['Cliente', 'Quente']
        : index % 3 === 0
        ? ['Quente']
        : index % 3 === 1
        ? ['Interessado', 'Follow-up']
        : ['Novo'],
      score: Math.floor(Math.random() * 100),
      campaign: index % 4 === 0 ? 'Campanha Verão 2024' : undefined,
      product: index % 5 === 0 ? 'Produto Premium' : undefined,
      priority,
      notes: [],
      createdAt: subDays(new Date(), Math.floor(Math.random() * 30)).toISOString(),
      updatedAt: subDays(new Date(), Math.floor(Math.random() * 7)).toISOString(),
      lastContactAt: subDays(new Date(), Math.floor(Math.random() * 5)).toISOString(),
      window24hOpen: windowOpen,
      window24hExpiresAt: windowExpiresAt?.toISOString(),
    }
  })

  const mockClients: Lead[] = [
    {
      id: 'lead-client-1',
      name: 'Cliente Alpha',
      channel: 'whatsapp',
      phone: '+55 11 91234-1111',
      email: 'cliente.alpha@email.com',
      status: 'contacted',
      pipelineStage: 'Em Atendimento',
      assignedTo: '1',
      tags: ['Cliente', 'VIP'],
      score: 86,
      product: 'Plano Premium',
      priority: 'high',
      notes: [],
      createdAt: subDays(new Date(), 20).toISOString(),
      updatedAt: subDays(new Date(), 1).toISOString(),
      lastContactAt: subDays(new Date(), 1).toISOString(),
      window24hOpen: true,
      window24hExpiresAt: addHours(new Date(), 10).toISOString(),
    },
    {
      id: 'lead-client-2',
      name: 'Cliente Beta',
      channel: 'whatsapp',
      phone: '+55 11 91234-2222',
      email: 'cliente.beta@email.com',
      status: 'qualified',
      pipelineStage: 'Qualificado',
      assignedTo: 'agent-1',
      tags: ['Cliente', 'Follow-up'],
      score: 74,
      campaign: 'Campanha Verão 2024',
      priority: 'medium',
      notes: [],
      createdAt: subDays(new Date(), 15).toISOString(),
      updatedAt: subDays(new Date(), 2).toISOString(),
      lastContactAt: subDays(new Date(), 2).toISOString(),
      window24hOpen: true,
      window24hExpiresAt: addHours(new Date(), 8).toISOString(),
    },
    {
      id: 'lead-client-3',
      name: 'Cliente Gama',
      channel: 'whatsapp',
      phone: '+55 11 91234-3333',
      email: 'cliente.gama@email.com',
      status: 'contacted',
      pipelineStage: 'Em Atendimento',
      assignedTo: '3',
      tags: ['Cliente', 'Quente'],
      score: 68,
      priority: 'medium',
      notes: [],
      createdAt: subDays(new Date(), 10).toISOString(),
      updatedAt: subDays(new Date(), 1).toISOString(),
      lastContactAt: subDays(new Date(), 1).toISOString(),
      window24hOpen: false,
      window24hExpiresAt: undefined,
    },
  ]

  return [...baseLeads, ...mockClients]
}

const mockPipelineStages: PipelineStage[] = createDefaultPipeline()

interface LeadsState {
  leads: Lead[]
  pipelineStages: PipelineStage[]
  selectedLeadId: string | null
  selectedLead: Lead | null
  setSelectedLead: (leadId: string | null) => void
  updateLead: (leadId: string, updates: Partial<Lead>) => void
  addNote: (leadId: string, note: Note) => void
  updatePipelineStage: (leadId: string, stageId: string) => void
  addTag: (leadId: string, tag: string) => void
  removeTag: (leadId: string, tag: string) => void
  getLeadsByStage: (stageName: string) => Lead[]
}

export const useLeadsStore = create<LeadsState>((set, get) => {
  const leads = generateMockLeads()
  
  // Distribuir leads pelos estágios
  const stages = mockPipelineStages.map((stage) => {
    const stageLeads = leads.filter((lead) => lead.pipelineStage === stage.name)
    return { ...stage, leadIds: stageLeads.map((l) => l.id) }
  })

  return {
    leads,
    pipelineStages: stages,
    selectedLeadId: null,
    selectedLead: null,

    setSelectedLead: (leadId: string | null) => {
      const lead = leadId ? get().leads.find((l) => l.id === leadId) : null
      set({ selectedLeadId: leadId, selectedLead: lead || null })
    },

    updateLead: (leadId: string, updates: Partial<Lead>) => {
      set((state) => ({
        leads: state.leads.map((lead) =>
          lead.id === leadId ? { ...lead, ...updates } : lead
        ),
        selectedLead: state.selectedLead && state.selectedLeadId === leadId
          ? { ...state.selectedLead, ...updates }
          : state.selectedLead,
      }))
    },

    addNote: (leadId: string, note: Note) => {
      set((state) => ({
        leads: state.leads.map((lead) =>
          lead.id === leadId
            ? { ...lead, notes: [...lead.notes, note] }
            : lead
        ),
        selectedLead: state.selectedLead && state.selectedLeadId === leadId
          ? { ...state.selectedLead, notes: [...state.selectedLead.notes, note] }
          : state.selectedLead,
      }))
    },

    updatePipelineStage: (leadId: string, stageId: string) => {
      const stage = get().pipelineStages.find((s) => s.id === stageId)
      if (!stage) return

      set((state) => {
        // Remove do estágio anterior
        const updatedStages = state.pipelineStages.map((s) => ({
          ...s,
          leadIds: s.leadIds.filter((id) => id !== leadId),
        }))

        // Adiciona ao novo estágio
        const finalStages = updatedStages.map((s) =>
          s.id === stageId ? { ...s, leadIds: [...s.leadIds, leadId] } : s
        )

        // Atualiza o lead
        const updatedLeads = state.leads.map((lead) =>
          lead.id === leadId
            ? { ...lead, pipelineStage: stage.name, updatedAt: new Date().toISOString() }
            : lead
        )

        return {
          leads: updatedLeads,
          pipelineStages: finalStages,
          selectedLead: state.selectedLead && state.selectedLeadId === leadId
            ? { ...state.selectedLead, pipelineStage: stage.name }
            : state.selectedLead,
        }
      })
    },

    addTag: (leadId: string, tag: string) => {
      set((state) => ({
        leads: state.leads.map((lead) =>
          lead.id === leadId && !lead.tags.includes(tag)
            ? { ...lead, tags: [...lead.tags, tag] }
            : lead
        ),
        selectedLead: state.selectedLead && state.selectedLeadId === leadId
          ? { ...state.selectedLead, tags: [...state.selectedLead.tags, tag] }
          : state.selectedLead,
      }))
    },

    removeTag: (leadId: string, tag: string) => {
      set((state) => ({
        leads: state.leads.map((lead) =>
          lead.id === leadId
            ? { ...lead, tags: lead.tags.filter((t) => t !== tag) }
            : lead
        ),
        selectedLead: state.selectedLead && state.selectedLeadId === leadId
          ? { ...state.selectedLead, tags: state.selectedLead.tags.filter((t) => t !== tag) }
          : state.selectedLead,
      }))
    },

    getLeadsByStage: (stageName: string) => {
      return get().leads.filter((lead) => lead.pipelineStage === stageName)
    },
  }
})

