'use client'

import { useConnectionsStore, ConnectionType } from '@/lib/stores/connectionsStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Check, X, RefreshCw } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import { WhatsAppIcon } from '@/components/WhatsAppIcon'

const connectionConfig = {
  whatsapp: {
    name: 'WhatsApp',
    icon: WhatsAppIcon,
    color: 'bg-green-500',
    description: 'Conecte sua conta do WhatsApp para receber e enviar mensagens',
    connectLabel: 'Conectar WhatsApp',
  },
}

export default function ConnectionsPage() {
  const { connections, toggleConnection, getConnectionByType, updateConnection } = useConnectionsStore()

  const handleConnect = (type: ConnectionType) => {
    // Simula o processo de conexão
    toggleConnection(type)
  }

  const handleDisconnect = (type: ConnectionType) => {
    if (confirm('Tem certeza que deseja desconectar esta conta?')) {
      toggleConnection(type)
    }
  }

  const handleSync = (type: ConnectionType) => {
    const connection = getConnectionByType(type)
    if (connection) {
      // Simula sincronização
      updateConnection(type, {
        lastSync: new Date().toISOString(),
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Conexões</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Gerencie sua conexão do WhatsApp
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(['whatsapp'] as ConnectionType[]).map((type) => {
          const connection = getConnectionByType(type)
          const config = connectionConfig[type]
          const Icon = config.icon

          if (!connection) return null

          return (
            <Card key={connection.id} className="relative transition-all hover:shadow-md border-border/50 overflow-hidden">
              <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg ${config.color} text-white`}
                    >
                      {type === 'whatsapp' ? (
                        <Icon className="h-7 w-7" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{config.name}</CardTitle>
                      <Badge
                        variant={connection.connected ? 'success' : 'default'}
                        className="mt-1"
                      >
                        {connection.connected ? 'Conectado' : 'Desconectado'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-3">{config.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {connection.connected ? (
                  <>
                    {connection.accountName && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Conta conectada:</p>
                        <p className="text-sm font-medium">{connection.accountName}</p>
                      </div>
                    )}
                    {connection.connectedAt && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Conectado em:</p>
                        <p className="text-sm">
                          {new Date(connection.connectedAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    )}
                    {connection.lastSync && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Última sincronização:</p>
                        <p className="text-sm">{formatRelativeTime(connection.lastSync)}</p>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleSync(type)}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sincronizar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDisconnect(type)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Desconectar
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleConnect(type)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {config.connectLabel}
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Informações adicionais */}
      <Card className="border-border/50 shadow-sm overflow-hidden bg-card/60 backdrop-blur-md">
        <CardHeader className="bg-muted/20 border-b border-border/50">
          <CardTitle>Como funciona</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            • Conecte sua conta do WhatsApp para centralizar as mensagens no Inbox
          </p>
          <p>
            • Após conectar, todas as mensagens recebidas aparecerão automaticamente no Inbox
          </p>
          <p>
            • Você pode sincronizar manualmente a qualquer momento para atualizar as mensagens
          </p>
          <p>
            • As conexões são seguras e utilizam as APIs oficiais de cada plataforma
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

