'use client'

import { useState } from 'react'
import { useAuthStore } from '@/lib/stores/authStore'
import { useClientsStore } from '@/lib/stores/clientsStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Building2, Users, TrendingUp, Eye, Plus, Edit2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Client } from '@/types'

export default function AdminClientsPage() {
  const { selectClient } = useAuthStore()
  const { clients, addClient, updateClient } = useClientsStore()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    active: true,
  })

  const handleViewClient = (clientId: string) => {
    // Encontra o cliente
    const selectedClient = clients.find((c) => c.id === clientId)
    
    if (selectedClient) {
      // Seleciona o cliente no store
      selectClient(clientId, clients)
      
      // Redireciona imediatamente - o Zustand atualiza síncronamente
      router.push('/dashboard/inbox')
    }
  }

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client)
      setFormData({
        name: client.name,
        active: client.active,
      })
    } else {
      setEditingClient(null)
      setFormData({
        name: '',
        active: true,
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingClient(null)
    setFormData({
      name: '',
      active: true,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingClient) {
      // Editar cliente existente
      updateClient(editingClient.id, formData)
    } else {
      // Criar novo cliente
      addClient({
        name: formData.name,
        active: formData.active,
      })
    }
    
    handleCloseModal()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie todos os clientes da BRENO
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <Badge variant={client.active ? 'success' : 'default'} className="mt-1">
                      {client.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenModal(client)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Usuários</span>
                  </div>
                  <p className="text-2xl font-bold">{client.userCount}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span>Leads</span>
                  </div>
                  <p className="text-2xl font-bold">{client.leadCount}</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Criado em: {new Date(client.createdAt).toLocaleDateString('pt-BR')}
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleViewClient(client.id)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Acessar CRM
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {clients.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Nenhum cliente cadastrado</p>
          </CardContent>
        </Card>
      )}

      {/* Modal de Criar/Editar Cliente */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingClient ? 'Editar Cliente' : 'Novo Cliente'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nome do Cliente *
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome da empresa"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="active" className="text-sm font-medium cursor-pointer">
              Cliente ativo
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingClient ? 'Salvar Alterações' : 'Criar Cliente'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

