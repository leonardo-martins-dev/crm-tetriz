'use client'

import { useState } from 'react'
import { useLeadsStore } from '@/lib/stores/leadsStore'
import { ChannelBadge } from '@/components/ChannelBadge'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { formatRelativeTime } from '@/lib/utils'
import { Search, Filter } from 'lucide-react'

export default function LeadsPage() {
  const { leads, setSelectedLead } = useLeadsStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const allTags = Array.from(new Set(leads.flatMap((lead) => lead.tags)))

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone?.includes(searchQuery)
    const matchesChannel = !selectedChannel || lead.channel === selectedChannel
    const matchesTag = !selectedTag || lead.tags.includes(selectedTag)
    return matchesSearch && matchesChannel && matchesTag
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Gerencie todos os seus leads em um só lugar
        </p>
      </div>

      {/* Filtros */}
      <Card className="border-none shadow-sm bg-card/60 backdrop-blur-md">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, email ou telefone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedChannel || ''}
                onChange={(e) => setSelectedChannel(e.target.value || null)}
                className="h-10 rounded-md border border-input bg-background/50 px-3 text-sm transition-colors focus:bg-background"
              >
                <option value="">Todos os canais</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
              <select
                value={selectedTag || ''}
                onChange={(e) => setSelectedTag(e.target.value || null)}
                className="h-10 rounded-md border border-input bg-background/50 px-3 text-sm transition-colors focus:bg-background"
              >
                <option value="">Todas as tags</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Leads */}
      {filteredLeads.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLeads.map((lead) => (
            <Card
              key={lead.id}
              className="cursor-pointer transition-all hover:shadow-md border-border/50"
              onClick={() => setSelectedLead(lead.id)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{lead.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <ChannelBadge channel={lead.channel} />
                      </div>
                    </div>
                    <Badge
                      variant={
                        lead.priority === 'high'
                          ? 'danger'
                          : lead.priority === 'medium'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {lead.priority === 'high' ? 'Alta' : lead.priority === 'medium' ? 'Média' : 'Baixa'}
                    </Badge>
                  </div>

                  {lead.email && (
                    <p className="text-sm text-muted-foreground">{lead.email}</p>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {lead.tags.map((tag) => (
                      <Badge key={tag} variant="default" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="info">{lead.pipelineStage}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Score:</span>
                      <Badge
                        variant={lead.score > 70 ? 'success' : lead.score > 40 ? 'warning' : 'default'}
                        className="text-xs"
                      >
                        {lead.score}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(lead.updatedAt)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed h-[400px] flex items-center justify-center">
          <CardContent className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            {leads.length === 0 ? (
              <>
                <h3 className="text-lg font-medium mb-1">Inicie sua operação</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Ainda não existem leads cadastrados. Conecte um canal de atendimento ou importe sua base.
                </p>
                <div className="flex gap-2 mt-4">
                  <Button onClick={() => window.location.href = '/dashboard/settings/connections'}>
                    Conectar WhatsApp
                  </Button>
                  <Button variant="outline" onClick={() => useLeadsStore.getState().fetchLeads()}>
                    Sincronizar
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium mb-1">Nenhum lead encontrado</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Nenhum resultado corresponde aos filtros aplicados.
                </p>
                <Button variant="ghost" onClick={() => { setSearchQuery(''); setSelectedChannel(null); setSelectedTag(null); }} className="mt-4 text-primary hover:bg-transparent hover:underline">
                  Limpar filtros
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

