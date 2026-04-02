import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/stores/authStore'
import { useClientsStore, AVAILABLE_MODULES } from '@/lib/stores/clientsStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Building2, Users, TrendingUp, Eye, Plus, Edit2, Power, PowerOff, Crown, Zap, Rocket, Package, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Client, ClientPlan } from '@/types'
import { defaultTenantConfig } from '@/config/tenant'

const PLAN_CONFIG: Record<ClientPlan, { label: string; color: string; icon: typeof Crown }> = {
  basic: { label: 'Básico', color: 'bg-slate-500/10 text-slate-500 border-slate-500/20', icon: Package },
  professional: { label: 'Profissional', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: Zap },
  enterprise: { label: 'Enterprise', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: Crown },
}

export default function AdminClientsPage() {
  const { setClient } = useAuthStore()
  const { clients, isLoading, fetchClients, addClient, updateClient, toggleClientActive } = useClientsStore()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const [formData, setFormData] = useState({
    name: '',
    active: true,
    plan: 'basic' as ClientPlan,
    modules: ['inbox', 'pipeline', 'metrics'] as string[],
    maxUsers: 5,
  })

  const handleViewClient = (clientId: string) => {
    const selectedClient = clients.find((c) => c.id === clientId)
    if (selectedClient) {
      setClient(selectedClient)
      router.push('/dashboard/inbox')
    }
  }

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client)
      setFormData({
        name: client.name,
        active: client.active,
        plan: client.plan,
        modules: [...client.modules],
        maxUsers: client.maxUsers,
      })
    } else {
      setEditingClient(null)
      setFormData({
        name: '',
        active: true,
        plan: 'basic',
        modules: ['inbox', 'pipeline', 'metrics'],
        maxUsers: 5,
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingClient(null)
  }

  const handleToggleModule = (moduleId: string) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.includes(moduleId)
        ? prev.modules.filter((m) => m !== moduleId)
        : [...prev.modules, moduleId],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingClient) {
      updateClient(editingClient.id, formData)
    } else {
      addClient({
        name: formData.name,
        active: formData.active,
        plan: formData.plan,
        modules: formData.modules,
        maxUsers: formData.maxUsers,
      })
    }
    
    handleCloseModal()
  }

  const getModuleLabel = (id: string) => AVAILABLE_MODULES.find((m) => m.id === id)?.label || id

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie todos os clientes da {defaultTenantConfig.branding.companyName}
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => {
          const planConfig = PLAN_CONFIG[client.plan]
          const PlanIcon = planConfig.icon
          return (
            <Card key={client.id} className={`hover:shadow-md transition-shadow ${!client.active ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{client.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={client.active ? 'success' : 'default'}>
                          {client.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                        <Badge variant="outline" className={`gap-1 border ${planConfig.color}`}>
                          <PlanIcon className="h-3 w-3" />
                          {planConfig.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenModal(client)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleClientActive(client.id)}
                      className={client.active ? 'text-destructive hover:text-destructive' : 'text-green-600 hover:text-green-600'}
                    >
                      {client.active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      <span>Usuários</span>
                    </div>
                    <p className="text-xl font-bold">{client.userCount}<span className="text-sm font-normal text-muted-foreground">/{client.maxUsers}</span></p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>Leads</span>
                    </div>
                    <p className="text-xl font-bold">{client.leadCount}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Rocket className="h-3.5 w-3.5" />
                      <span>Módulos</span>
                    </div>
                    <p className="text-xl font-bold">{client.modules.length}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {client.modules.map((modId) => (
                    <Badge key={modId} variant="outline" className="text-[10px] px-1.5 py-0.5">
                      {getModuleLabel(modId)}
                    </Badge>
                  ))}
                </div>

                <div className="text-xs text-muted-foreground">
                  Criado em: {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleViewClient(client.id)}
                  disabled={!client.active}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Acessar CRM
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
      )}

      {!isLoading && clients.length === 0 && (
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
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="plan" className="text-sm font-medium">
                Plano *
              </label>
              <select
                id="plan"
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value as ClientPlan })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="basic">Básico</option>
                <option value="professional">Profissional</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="maxUsers" className="text-sm font-medium">
                Limite de Usuários *
              </label>
              <Input
                id="maxUsers"
                type="number"
                min={1}
                max={999}
                value={formData.maxUsers}
                onChange={(e) => setFormData({ ...formData, maxUsers: parseInt(e.target.value) || 1 })}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Módulos Disponíveis</label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_MODULES.map((mod) => (
                <label
                  key={mod.id}
                  className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
                    formData.modules.includes(mod.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground/30'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.modules.includes(mod.id)}
                    onChange={() => handleToggleModule(mod.id)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium">{mod.label}</span>
                </label>
              ))}
            </div>
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
