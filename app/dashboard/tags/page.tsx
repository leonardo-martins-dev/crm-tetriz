'use client'

import { useState, useRef, useEffect } from 'react'
import { useTagsStore } from '@/lib/stores/tagsStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Plus, Trash2, Edit2, Tag as TagIcon } from 'lucide-react'

const tagColors = [
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

export default function TagsPage() {
  const { tags, addTag, updateTag, deleteTag } = useTagsStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<{ id: string; name: string; color: string } | null>(null)
  const [tagName, setTagName] = useState('')
  const [tagColor, setTagColor] = useState('#3b82f6')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const colorPickerRef = useRef<HTMLDivElement>(null)

  // Fechar seletor de cor ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setShowColorPicker(false)
      }
    }

    if (showColorPicker) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 100)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showColorPicker])

  const handleOpenModal = (tag?: { id: string; name: string; color: string }) => {
    if (tag) {
      setEditingTag(tag)
      setTagName(tag.name)
      setTagColor(tag.color)
    } else {
      setEditingTag(null)
      setTagName('')
      setTagColor('#3b82f6')
    }
    setShowColorPicker(false)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTag(null)
    setTagName('')
    setTagColor('#3b82f6')
    setShowColorPicker(false)
  }

  const handleSaveTag = () => {
    if (!tagName.trim()) return

    if (editingTag) {
      updateTag(editingTag.id, {
        name: tagName.trim(),
        color: tagColor,
      })
    } else {
      addTag(tagName.trim(), tagColor)
    }

    handleCloseModal()
  }

  const handleDeleteTag = (tagId: string) => {
    if (confirm('Tem certeza que deseja excluir esta tag?')) {
      deleteTag(tagId)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gerencie as tags para organizar seus leads
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Tag
        </Button>
      </div>

      {/* Lista de Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tags.map((tag) => (
          <Card key={tag.id} className="transition-all hover:shadow-md border-border/50 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <h3 className="text-lg font-semibold">{tag.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleOpenModal(tag)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteTag(tag.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TagIcon className="h-4 w-4" />
                  <span>{tag.leadCount} leads</span>
                </div>
                <div className="pt-2">
                  <Badge
                    style={{ backgroundColor: tag.color, borderColor: tag.color }}
                    className="text-white"
                  >
                    {tag.name}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {tags.length === 0 && (
        <Card className="border-dashed">
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <TagIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">Nenhuma tag criada</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
              Crie tags para organizar e filtrar seus leads
            </p>
            <Button onClick={() => handleOpenModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Tag
            </Button>
          </div>
        </Card>
      )}

      {/* Modal de Criar/Editar Tag */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTag ? 'Editar Tag' : 'Nova Tag'}
        size="md"
      >
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Nome da Tag</label>
            <Input
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="Ex: Interessado, Quente, VIP..."
              onKeyPress={(e) => e.key === 'Enter' && handleSaveTag()}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Cor</label>
            <div className="relative" ref={colorPickerRef}>
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-accent transition-colors w-full justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded border-2 border-border"
                    style={{ backgroundColor: tagColor }}
                  />
                  <span className="text-sm">
                    {tagColors.find((c) => c.value === tagColor)?.name || 'Personalizada'}
                  </span>
                </div>
              </button>
              {showColorPicker && (
                <div 
                  className="absolute top-full left-0 mt-2 p-3 bg-popover border rounded-lg shadow-xl z-50 w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="grid grid-cols-4 gap-2">
                    {tagColors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => {
                          setTagColor(color.value)
                          setShowColorPicker(false)
                        }}
                        className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                          tagColor === color.value
                            ? 'border-foreground scale-110 ring-2 ring-primary ring-offset-1'
                            : 'border-border hover:border-foreground/50'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      >
                        {tagColor === color.value && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-white/90 shadow-sm" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSaveTag} className="flex-1">
              {editingTag ? 'Salvar Alterações' : 'Criar Tag'}
            </Button>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

