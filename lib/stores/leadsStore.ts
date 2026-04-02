import { create } from 'zustand'
import { Lead, Note, PipelineStage } from '@/types'
import { useAuthStore } from '@/lib/stores/authStore'
import { createDefaultPipeline } from '@/domain/constants/pipeline'
import { getLeadRepository } from '@/infrastructure/repositories'

interface LeadsState {
  leads: Lead[]
  pipelineStages: PipelineStage[]
  selectedLeadId: string | null
  selectedLead: Lead | null
  isLoading: boolean
  
  fetchLeads: () => Promise<void>
  setSelectedLead: (leadId: string | null) => void
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Lead | null>
  updateLead: (leadId: string, updates: Partial<Lead>) => Promise<void>
  addNote: (leadId: string, note: Omit<Note, 'id' | 'createdAt'>) => Promise<void>
  updatePipelineStage: (leadId: string, stageId: string) => Promise<void>
  addTag: (leadId: string, tag: string) => Promise<void>
  removeTag: (leadId: string, tag: string) => Promise<void>
  deleteLead: (leadId: string) => Promise<void>
  getLeadsByStage: (stageName: string) => Lead[]
}

const leadRepo = getLeadRepository()

export const useLeadsStore = create<LeadsState>((set, get) => {
  const defaultStages = createDefaultPipeline()

  return {
    leads: [],
    pipelineStages: defaultStages,
    selectedLeadId: null,
    selectedLead: null,
    isLoading: false,

    fetchLeads: async () => {
      const tenantId = useAuthStore.getState().user?.tenantId
      if (!tenantId) return

      set({ isLoading: true })
      try {
        const leads = await leadRepo.list(tenantId)
        
        // Atualizar stages com os leadIds
        const stages = get().pipelineStages.map(stage => ({
          ...stage,
          leadIds: (leads as any[]).filter(l => l.pipelineStage === stage.name).map(l => l.id)
        }))

        set({ leads: leads as any[], pipelineStages: stages, isLoading: false })
      } catch (err) {
        console.error('Erro ao buscar leads:', err)
        set({ isLoading: false })
      }
    },

    setSelectedLead: (leadId: string | null) => {
      const lead = leadId ? get().leads.find((l) => l.id === leadId) : null
      set({ selectedLeadId: leadId, selectedLead: lead || null })
    },

    addLead: async (input) => {
      const tenantId = useAuthStore.getState().user?.tenantId
      if (!tenantId) return null

      try {
        const newLead = await leadRepo.create({
          tenantId,
          ...input,
          tags: input.tags || [],
          notes: []
        } as any)
        
        set(state => ({ leads: [newLead as any, ...state.leads] }))
        return newLead as any
      } catch (err) {
        console.error('Erro ao adicionar lead:', err)
        return null
      }
    },

    updateLead: async (leadId: string, updates: Partial<Lead>) => {
      const tenantId = useAuthStore.getState().user?.tenantId
      if (!tenantId) return

      // Update otimista
      const previousLeads = get().leads
      set((state) => ({
        leads: state.leads.map((lead) =>
          lead.id === leadId ? { ...lead, ...updates } : lead
        ),
      }))

      try {
        await leadRepo.update(tenantId, leadId, updates as any)
      } catch (err) {
        console.error('Erro ao atualizar lead:', err)
        set({ leads: previousLeads }) // Rollback
      }
    },

    addNote: async (leadId: string, note) => {
      const tenantId = useAuthStore.getState().user?.tenantId
      if (!tenantId) return

      const lead = get().leads.find(l => l.id === leadId)
      if (!lead) return

      const newNote: Note = {
        id: crypto.randomUUID(),
        ...note,
        createdAt: new Date().toISOString()
      }

      const updatedNotes = [...(lead.notes || []), newNote]

      set((state) => ({
        leads: state.leads.map((l) =>
          l.id === leadId ? { ...l, notes: updatedNotes } : l
        ),
      }))

      try {
        await leadRepo.update(tenantId, leadId, { notes: updatedNotes } as any)
      } catch (err) {
        console.error('Erro ao adicionar nota:', err)
      }
    },

    updatePipelineStage: async (leadId: string, stageId: string) => {
      const stage = get().pipelineStages.find((s) => s.id === stageId)
      if (!stage) return

      await get().updateLead(leadId, { pipelineStage: stage.name })
      
      // Atualizar estrutura de stages local
      set((state) => ({
        pipelineStages: state.pipelineStages.map(s => ({
          ...s,
          leadIds: s.id === stageId 
            ? [...s.leadIds.filter(id => id !== leadId), leadId]
            : s.leadIds.filter(id => id !== leadId)
        }))
      }))
    },

    addTag: async (leadId: string, tag: string) => {
      const lead = get().leads.find(l => l.id === leadId)
      if (!lead || lead.tags.includes(tag)) return

      const updatedTags = [...lead.tags, tag]
      await get().updateLead(leadId, { tags: updatedTags })
    },

    removeTag: async (leadId: string, tag: string) => {
      const lead = get().leads.find(l => l.id === leadId)
      if (!lead) return

      const updatedTags = lead.tags.filter(t => t !== tag)
      await get().updateLead(leadId, { tags: updatedTags })
    },

    deleteLead: async (leadId: string) => {
      const tenantId = useAuthStore.getState().user?.tenantId
      if (!tenantId) return

      try {
        await leadRepo.delete(tenantId, leadId)
        set((state) => ({
          leads: state.leads.filter((l) => l.id !== leadId),
          selectedLeadId: state.selectedLeadId === leadId ? null : state.selectedLeadId,
          selectedLead: state.selectedLeadId === leadId ? null : state.selectedLead,
        }))
      } catch (err) {
        console.error('Erro ao deletar lead:', err)
      }
    },

    getLeadsByStage: (stageName: string) => {
      return get().leads.filter((lead) => lead.pipelineStage === stageName)
    },
  }
})

