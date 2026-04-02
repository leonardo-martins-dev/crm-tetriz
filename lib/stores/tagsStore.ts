import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/authStore'

export interface Tag {
  id: string
  tenantId?: string
  name: string
  color: string
  createdAt: string
  leadCount: number
}

interface TagsState {
  tags: Tag[]
  isLoading: boolean
  fetchTags: () => Promise<void>
  addTag: (name: string, color?: string) => Promise<void>
  updateTag: (tagId: string, updates: Partial<Tag>) => Promise<void>
  deleteTag: (tagId: string) => Promise<void>
  getTagByName: (name: string) => Tag | undefined
}

// Cores padrão para tags
const defaultTagColors = [
  '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#22c55e', '#ef4444',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1', '#14b8a6',
]

export const useTagsStore = create<TagsState>((set, get) => ({
  tags: [],
  isLoading: false,

  fetchTags: async () => {
    const tenantId = useAuthStore.getState().user?.tenantId
    if (!tenantId) return

    set({ isLoading: true })
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('name', { ascending: true })

      if (error) throw error

      set({ 
        tags: (data || []).map(row => ({
          id: row.id,
          tenantId: row.tenant_id,
          name: row.name,
          color: row.color,
          createdAt: row.created_at,
          leadCount: 0 // TODO: Calcular via join ou RPC se necessário
        })), 
        isLoading: false 
      })
    } catch (err) {
      console.error('Erro ao buscar tags:', err)
      set({ isLoading: false })
    }
  },

  addTag: async (name, color) => {
    const tenantId = useAuthStore.getState().user?.tenantId
    if (!tenantId) return

    const existingTag = get().tags.find(t => t.name.toLowerCase() === name.toLowerCase())
    if (existingTag) return

    const finalColor = color || defaultTagColors[Math.floor(Math.random() * defaultTagColors.length)]

    try {
      const { data, error } = await supabase
        .from('tags')
        .insert({
          tenant_id: tenantId,
          name: name.trim(),
          color: finalColor
        })
        .select()
        .single()

      if (error) throw error

      const newTag: Tag = {
        id: data.id,
        tenantId: data.tenant_id,
        name: data.name,
        color: data.color,
        createdAt: data.created_at,
        leadCount: 0
      }

      set((state) => ({ tags: [...state.tags, newTag] }))
    } catch (err) {
      console.error('Erro ao adicionar tag:', err)
    }
  },

  updateTag: async (tagId, updates) => {
    try {
      const { error } = await supabase
        .from('tags')
        .update({
          name: updates.name,
          color: updates.color
        })
        .eq('id', tagId)

      if (error) throw error

      set((state) => ({
        tags: state.tags.map((tag) =>
          tag.id === tagId ? { ...tag, ...updates } : tag
        ),
      }))
    } catch (err) {
      console.error('Erro ao atualizar tag:', err)
    }
  },

  deleteTag: async (tagId) => {
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId)

      if (error) throw error

      set((state) => ({
        tags: state.tags.filter((tag) => tag.id !== tagId),
      }))
    } catch (err) {
      console.error('Erro ao deletar tag:', err)
    }
  },

  getTagByName: (name: string) => {
    return get().tags.find(t => t.name.toLowerCase() === name.toLowerCase())
  },
}))

