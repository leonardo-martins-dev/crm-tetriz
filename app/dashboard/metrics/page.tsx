'use client'

import { useLeadsStore } from '@/lib/stores/leadsStore'
import { useConversationsStore } from '@/lib/stores/conversationsStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { TrendingUp, TrendingDown, MessageSquare, Clock, Users, Target, Lock } from 'lucide-react'

export default function MetricsPage() {
  const { leads } = useLeadsStore()
  const { conversations } = useConversationsStore()

  const totalLeads = leads.length
  const activeConversations = conversations.filter((c) => c.lead.window24hOpen).length
  const qualifiedLeads = leads.filter((l) => l.status === 'qualified' || l.status === 'proposal').length
  const wonLeads = leads.filter((l) => l.status === 'won').length
  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0'

  const leadsByWindow24h = {
    open: leads.filter((l) => l.window24hOpen).length,
    closed: leads.filter((l) => !l.window24hOpen).length,
  }

  const leadsByStage = {
    'Novo Lead': leads.filter((l) => l.pipelineStage === 'Novo Lead').length,
    'Em Atendimento': leads.filter((l) => l.pipelineStage === 'Em Atendimento').length,
    'Qualificado': leads.filter((l) => l.pipelineStage === 'Qualificado').length,
    'Proposta Enviada': leads.filter((l) => l.pipelineStage === 'Proposta Enviada').length,
    'Ganhou': leads.filter((l) => l.pipelineStage === 'Ganhou').length,
    'Perdido': leads.filter((l) => l.pipelineStage === 'Perdido').length,
  }

  const metrics = [
    {
      title: 'Total de Leads',
      value: totalLeads,
      icon: Users,
      change: '+12%',
      trend: 'up' as const,
    },
    {
      title: 'Taxa de Conversão',
      value: `${conversionRate}%`,
      icon: Target,
      change: '+2.5%',
      trend: 'up' as const,
    },
    {
      title: 'Conversas Ativas',
      value: activeConversations,
      icon: MessageSquare,
      change: '+5',
      trend: 'up' as const,
    },
    {
      title: 'Leads Qualificados',
      value: qualifiedLeads,
      icon: TrendingUp,
      change: '+8%',
      trend: 'up' as const,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Métricas</h1>
        <p className="text-muted-foreground">
          Acompanhe o desempenho do seu CRM
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
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {metric.change}
                  </span>
                  <span> vs mês anterior</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Leads por Janela 24h</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(leadsByWindow24h).map(([key, count]) => {
                const percentage = totalLeads > 0 ? (count / totalLeads) * 100 : 0

                const isOpen = key === 'open'
                const ItemIcon = isOpen ? Clock : Lock
                const label = isOpen ? 'Janela aberta' : 'Janela fechada'

                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <ItemIcon className="h-4 w-4" />
                        <span>{label}</span>
                      </div>
                      <span className="font-medium">{count} leads</span>
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

        <Card>
          <CardHeader>
            <CardTitle>Leads por Etapa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(leadsByStage).map(([stage, count]) => {
                const percentage = totalLeads > 0 ? (count / totalLeads) * 100 : 0
                return (
                  <div key={stage} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{stage}</span>
                      <span className="font-medium">{count}</span>
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
    </div>
  )
}

