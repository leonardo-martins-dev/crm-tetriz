'use client'

import { useLeadsStore } from '@/lib/stores/leadsStore'
import { useConversationsStore } from '@/lib/stores/conversationsStore'
import { useUsersStore } from '@/lib/stores/usersStore'
import { useAgentsStore } from '@/lib/stores/agentsStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { TrendingUp, TrendingDown, MessageSquare, Clock, Users, Target, Lock, Tags, UserCircle } from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/90 border border-border/50 shadow-lg p-3 rounded-lg backdrop-blur-md">
        <p className="font-medium text-sm mb-1">{label || payload[0].name}</p>
        <p className="text-primary font-bold">{payload[0].value} <span className="text-muted-foreground font-normal text-xs">leads</span></p>
      </div>
    );
  }
  return null;
}

export default function MetricsPage() {
  const { leads } = useLeadsStore()
  const { conversations } = useConversationsStore()
  const { users } = useUsersStore()
  const { agents } = useAgentsStore()

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

  const windowData = [
    { name: 'Janela Aberta', value: leadsByWindow24h.open },
    { name: 'Janela Fechada', value: leadsByWindow24h.closed },
  ]
  const PIE_COLORS = ['#3b82f6', '#94a3b8']

  const stageData = Object.entries(leadsByStage).map(([name, count]) => ({
    name,
    count
  }))


  const tagsCount = leads.reduce((acc, lead) => {
    lead.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  const tagData = Object.entries(tagsCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const assignedCounts = leads.reduce((acc, lead) => {
    if (lead.assignedTo) {
      acc[lead.assignedTo] = (acc[lead.assignedTo] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const assignedData = Object.entries(assignedCounts).map(([id, count]) => {
    const agent = agents.find(a => a.id === id)
    if (agent) return { name: `🤖 ${agent.name}`, count }
    const user = users.find(u => u.id === id)
    if (user) return { name: user.name.split(' ')[0], count }
    return { name: 'Desconhecido', count }
  }).sort((a, b) => b.count - a.count)

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
        <h1 className="text-3xl font-bold tracking-tight">Métricas</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Acompanhe o desempenho do seu CRM
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.title} className="transition-all hover:shadow-md border-border/50">
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

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card className="transition-all hover:shadow-md border-border/50 overflow-hidden">
          <CardHeader className="bg-muted/10 border-b border-border/50 pb-4 mb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Leads por Janela 24h</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={windowData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {windowData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-foreground font-medium">Aberta <span className="text-muted-foreground font-normal">({windowData[0].value})</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-400" />
                <span className="text-sm text-foreground font-medium">Fechada <span className="text-muted-foreground font-normal">({windowData[1].value})</span></span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md border-border/50 overflow-hidden">
          <CardHeader className="bg-muted/10 border-b border-border/50 pb-4 mb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Comportamento do Funil</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-[240px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={stageData} margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    width={90}
                    tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.8 }} 
                  />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                  <Bar dataKey="count" fill="currentColor" className="fill-primary/80 hover:fill-primary transition-colors" radius={[0, 4, 4, 0]} barSize={16}>
                     {stageData.map((entry, index) => (
                       <Cell key={`cell-${index}`} className="fill-primary/80 hover:fill-primary" />
                     ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>


        <Card className="transition-all hover:shadow-md border-border/50 overflow-hidden">
          <CardHeader className="bg-muted/10 border-b border-border/50 pb-4 mb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Distribuição por Tags</CardTitle>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={tagData}>
                  <PolarGrid stroke="hsl(var(--muted-foreground)/0.2)" />
                  <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.8 }} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Radar name="Leads" dataKey="count" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md border-border/50 overflow-hidden">
          <CardHeader className="bg-muted/10 border-b border-border/50 pb-4 mb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Atendimentos por Responsável</CardTitle>
            <UserCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-[240px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={assignedData} margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    width={90}
                    tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.8 }} 
                  />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                  <Bar dataKey="count" fill="currentColor" className="fill-primary/80 hover:fill-primary transition-colors" radius={[0, 4, 4, 0]} barSize={16}>
                     {assignedData.map((entry, index) => (
                       <Cell key={`cell-${index}`} className={entry.name.includes('🤖') ? 'fill-purple-500/80 hover:fill-purple-500' : 'fill-blue-500/80 hover:fill-blue-500'} />
                     ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

