'use client'

import { useMemo, useState } from 'react'
import { useLeadsStore } from '@/lib/stores/leadsStore'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { ChannelBadge } from '@/components/ChannelBadge'
import { Search, Building2 } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

const invalidClientStages = new Set(['Novo Lead', 'Proposta Enviada', 'Ganhou', 'Perdido'])

export default function ClientsPage() {
  const { leads, setSelectedLead } = useLeadsStore()
  const [searchQuery, setSearchQuery] = useState('')

  const clients = useMemo(() => {
    return leads.filter(
      (lead) =>
        lead.tags.some((tag) => tag.toLowerCase() === 'cliente') &&
        !invalidClientStages.has(lead.pipelineStage)
    )
  }, [leads])

  const filteredClients = clients.filter((client) => {
    const query = searchQuery.toLowerCase()
    return (
      client.name.toLowerCase().includes(query) ||
      client.email?.toLowerCase().includes(query) ||
      client.phone?.includes(searchQuery)
    )
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
        <p className="text-muted-foreground mt-1 text-sm">Leads marcados com a tag cliente</p>
      </div>

      <Card className="border-none shadow-sm bg-card/60 backdrop-blur-md">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente por nome, email ou telefone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <Card
            key={client.id}
            className="cursor-pointer transition-all hover:shadow-md border-border/50"
            onClick={() => setSelectedLead(client.id)}
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{client.name}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <ChannelBadge channel={client.channel} />
                    <Badge variant="success">cliente</Badge>
                  </div>
                </div>
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </div>

              {client.email && <p className="text-sm text-muted-foreground">{client.email}</p>}
              {client.phone && <p className="text-sm text-muted-foreground">{client.phone}</p>}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{client.pipelineStage}</span>
                <span>{formatRelativeTime(client.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">Nenhum cliente encontrado</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Nenhum resultado corresponde à sua busca ou você ainda não tem clientes.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
