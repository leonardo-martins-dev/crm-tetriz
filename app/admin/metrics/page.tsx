'use client'

import { useClientsStore } from '@/lib/stores/clientsStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Building2, Users, TrendingUp, DollarSign, Activity } from 'lucide-react'
import { defaultTenantConfig } from '@/config/tenant'

export default function AdminMetricsPage() {
  const { clients } = useClientsStore()

  const totalClients = clients.length
  const activeClients = clients.filter((c) => c.active).length
  const totalUsers = clients.reduce((sum, c) => sum + c.userCount, 0)
  const totalLeads = clients.reduce((sum, c) => sum + c.leadCount, 0)
  const avgLeadsPerClient = totalClients > 0 ? Math.round(totalLeads / totalClients) : 0

  const metrics = [
    {
      title: 'Total de Clientes',
      value: totalClients,
      icon: Building2,
      change: '+2',
      trend: 'up' as const,
    },
    {
      title: 'Clientes Ativos',
      value: activeClients,
      icon: Activity,
      change: '+1',
      trend: 'up' as const,
    },
    {
      title: 'Total de Usuários',
      value: totalUsers,
      icon: Users,
      change: '+5',
      trend: 'up' as const,
    },
    {
      title: 'Total de Leads',
      value: totalLeads,
      icon: TrendingUp,
      change: '+127',
      trend: 'up' as const,
    },
  ]

  // Ranking de clientes por leads
  const clientRanking = [...clients]
    .sort((a, b) => b.leadCount - a.leadCount)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Métricas Gerais</h1>
        <p className="text-muted-foreground">
          Visão geral de todos os clientes da {defaultTenantConfig.branding.companyName}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{metric.change}</span> vs mês anterior
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ranking de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clientRanking.map((client, index) => (
                <div key={client.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {client.userCount} usuários
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{client.leadCount}</p>
                    <p className="text-xs text-muted-foreground">leads</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clients.map((client) => {
                const percentage = totalLeads > 0 ? (client.leadCount / totalLeads) * 100 : 0
                return (
                  <div key={client.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{client.name}</span>
                      <span>{client.leadCount} leads</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estatísticas Gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Média de Leads por Cliente</p>
              <p className="text-2xl font-bold">{avgLeadsPerClient}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Clientes Ativos</p>
              <p className="text-2xl font-bold">
                {totalClients > 0 ? Math.round((activeClients / totalClients) * 100) : 0}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Média de Usuários por Cliente</p>
              <p className="text-2xl font-bold">
                {totalClients > 0 ? Math.round(totalUsers / totalClients) : 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

