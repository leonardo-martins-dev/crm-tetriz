import { create } from 'zustand'

export interface Tag {
  id: string
  name: string
  color: string
  createdAt: string
  leadCount: number
}

interface TagsState {
  tags: Tag[]
  addTag: (name: string, color?: string) => void
  updateTag: (tagId: string, updates: Partial<Tag>) => void
  deleteTag: (tagId: string) => void
  getTagByName: (name: string) => Tag | undefined
}

// Cores padrão para tags
const defaultTagColors = [
  '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#22c55e', '#ef4444',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1', '#14b8a6',
]

// Tags mockadas iniciais
const mockTags: Tag[] = [
  { id: 'tag-1', name: 'Interessado', color: '#10b981', createdAt: new Date().toISOString(), leadCount: 12 },
  { id: 'tag-2', name: 'Quente', color: '#ef4444', createdAt: new Date().toISOString(), leadCount: 8 },
  { id: 'tag-3', name: 'Follow-up', color: '#3b82f6', createdAt: new Date().toISOString(), leadCount: 15 },
  { id: 'tag-4', name: 'Cliente VIP', color: '#f59e0b', createdAt: new Date().toISOString(), leadCount: 5 },
  { id: 'tag-5', name: 'Orçamento', color: '#8b5cf6', createdAt: new Date().toISOString(), leadCount: 20 },
  { id: 'tag-6', name: 'clientes', color: '#22c55e', createdAt: new Date().toISOString(), leadCount: 6 },
]

export const useTagsStore = create<TagsState>((set, get) => ({
  tags: mockTags,

  addTag: (name: string, color?: string) => {
    const existingTag = get().tags.find(t => t.name.toLowerCase() === name.toLowerCase())
    if (existingTag) return

    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      name: name.trim(),
      color: color || defaultTagColors[Math.floor(Math.random() * defaultTagColors.length)],
      createdAt: new Date().toISOString(),
      leadCount: 0,
    }

    set((state) => ({
      tags: [...state.tags, newTag],
    }))
  },

  updateTag: (tagId: string, updates: Partial<Tag>) => {
    set((state) => ({
      tags: state.tags.map((tag) =>
        tag.id === tagId ? { ...tag, ...updates } : tag
      ),
    }))
  },

  deleteTag: (tagId: string) => {
    set((state) => ({
      tags: state.tags.filter((tag) => tag.id !== tagId),
    }))
  },

  getTagByName: (name: string) => {
    return get().tags.find(t => t.name.toLowerCase() === name.toLowerCase())
  },
}))

