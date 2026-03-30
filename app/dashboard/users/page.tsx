'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useAuthStore } from '@/lib/stores/authStore'
import { useUsersStore } from '@/lib/stores/usersStore'
import { User as UserIcon, Plus, Search, Edit2, Power, PowerOff } from 'lucide-react'
import { User, UserRole } from '@/types'

export default function DashboardUsersPage() {
  const { client } = useAuthStore()
  const { users, addUser, updateUser, toggleUserActive } = useUsersStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as UserRole,
    active: true,
  })

  // Filter users by current client and search query
  const filteredUsers = users.filter((user) => {
    if (user.clientId !== client?.id) return false;
    
    return (
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      owner: 'Dono',
      client: 'Administrador', // Mapeando client role para Admin no contexto do dashboard
      user: 'Usuário',
    }
    return labels[role] || role
  }

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
      })
    } else {
      setEditingUser(null)
      setFormData({
        name: '',
        email: '',
        role: 'user',
        active: true,
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingUser(null)
    setFormData({
      name: '',
      email: '',
      role: 'user',
      active: true,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingUser) {
      updateUser(editingUser.id, {
        ...formData,
        clientId: client?.id
      })
    } else {
      addUser({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        clientId: client?.id,
        active: formData.active,
      })
    }
    
    handleCloseModal()
  }

  const handleToggleActive = (userId: string) => {
    toggleUserActive(userId)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Usuários</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gerencie o acesso da sua equipe à plataforma.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} className="sm:w-auto w-full">
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      <Card className="border-none shadow-sm bg-card/60 backdrop-blur-md">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="transition-all hover:shadow-md border-border/50">
            <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <Badge variant={user.active ? 'success' : 'secondary'} className="text-xs">
                      {user.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs font-normal bg-background">
                      {getRoleLabel(user.role)}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenModal(user)}
                  className="flex-1 sm:flex-none"
                >
                  <Edit2 className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Editar</span>
                </Button>
                <Button
                  variant={user.active ? 'ghost' : 'default'}
                  size="sm"
                  onClick={() => handleToggleActive(user.id)}
                  className={`flex-1 sm:flex-none ${user.active ? 'text-destructive hover:text-destructive hover:bg-destructive/10' : ''}`}
                >
                  {user.active ? (
                    <>
                      <PowerOff className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Desativar</span>
                    </>
                  ) : (
                    <>
                      <Power className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Ativar</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <UserIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">Nenhum usuário encontrado</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Você ainda não tem outros usuários ou nenhum resultado correspondeu à sua busca.
            </p>
            {searchQuery && (
              <Button variant="ghost" onClick={() => setSearchQuery('')} className="mt-2 text-primary hover:bg-transparent hover:underline">
                Limpar busca
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal de Criar/Editar Usuário */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nome Completo *
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Digite o nome"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email *
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="usuario@empresa.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Perfil de Acesso *
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            >
              <option value="user">Usuário Padrão</option>
              <option value="client">Administrador</option>
            </select>
          </div>

          <div className="pt-2">
            <div className="flex items-center p-3 rounded-lg border bg-card/50">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <div className="ml-3">
                <label htmlFor="active" className="text-sm font-medium cursor-pointer">
                  Acesso ativo
                </label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Permitir que este usuário faça login no sistema.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t mt-6">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingUser ? 'Salvar Alterações' : 'Convidar Usuário'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
