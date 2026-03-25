'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/lib/stores/authStore'

export default function SettingsPage() {
  const { user, client } = useAuthStore()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da sua conta
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Atualize suas informações pessoais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome</label>
              <Input defaultValue={user?.name || ''} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" defaultValue={user?.email || ''} />
            </div>
            <Button>Salvar Alterações</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Empresa</CardTitle>
            <CardDescription>Informações da empresa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome da Empresa</label>
              <Input defaultValue={client?.name || ''} disabled={user?.role !== 'client'} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Usuários</label>
              <Input defaultValue={client?.userCount.toString() || '0'} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Leads</label>
              <Input defaultValue={client?.leadCount.toString() || '0'} disabled />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

