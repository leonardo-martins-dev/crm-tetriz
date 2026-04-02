import { create } from 'zustand'
import { Lead, Note, PipelineStage } from '@/types'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/authStore'
import { createDefaultPipeline } from '@/domain/constants/pipeline'

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
  getLeadsByStage: (stageName: string) => Lead[]
}

const mapLeadFromDb = (row: any): Lead => ({
  id: row.id,
  tenantId: row.tenant_id,
  name: row.name,
  phone: row.phone,
  email: row.email,
  channel: row.channel,
  status: row.status,
  pipelineStage: row.pipeline_stage,
  assignedTo: row.assigned_to,
  tags: row.tags || [],
  score: row.score || 0,
  priority: row.priority,
  campaign: row.campaign,
  product: row.product,
  notes: row.notes || [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  lastContactAt: row.last_contact_at,
  window24hOpen: row.window_24h_open,
  window24hExpiresAt: row.window_24h_expires_at,
})

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
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .eq('tenant_id', tenantId)
          .order('updated_at', { ascending: false })

        if (error) throw error

        const leads = (data || []).map(mapLeadFromDb)
        
        // Atualizar stages com os leadIds
        const stages = get().pipelineStages.map(stage => ({
          ...stage,
          leadIds: leads.filter(l => l.pipelineStage === stage.name).map(l => l.id)
        }))

        set({ leads, pipelineStages: stages, isLoading: false })
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
        const { data, error } = await supabase
          .from('leads')
          .insert({
            tenant_id: tenantId,
            name: input.name,
            phone: input.phone,
            email: input.email,
            channel: input.channel,
            status: input.status,
            pipeline_stage: input.pipelineStage,
            priority: input.priority,
            tags: input.tags,
            score: input.score,
          })
          .select()
          .single()

        if (error) throw error
        
        const newLead = mapLeadFromDb(data)
        set(state => ({ leads: [newLead, ...state.leads] }))
        return newLead
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
        const rowUpdates: any = {}
        if (updates.name !== undefined) rowUpdates.name = updates.name
        if (updates.status !== undefined) rowUpdates.status = updates.status
        if (updates.pipelineStage !== undefined) rowUpdates.pipeline_stage = updates.pipelineStage
        if (updates.priority !== undefined) rowUpdates.priority = updates.priority
        if (updates.assignedTo !== undefined) rowUpdates.assigned_to = updates.assignedTo

        const { error } = await supabase
          .from('leads')
          .update(rowUpdates)
          .eq('id', leadId)
          .eq('tenant_id', tenantId)

        if (error) throw error
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
        const { error } = await supabase
          .from('leads')
          .update({ notes: updatedNotes })
          .eq('id', leadId)
          .eq('tenant_id', tenantId)

        if (error) throw error
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

    getLeadsByStage: (stageName: string) => {
      return get().leads.filter((lead) => lead.pipelineStage === stageName)
    },
  }
})

