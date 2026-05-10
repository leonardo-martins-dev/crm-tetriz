'use client'

import { useState, useEffect, useMemo } from 'react'
import { useConnectionsStore, Connection } from '@/lib/stores/connectionsStore'
import { useAuthStore } from '@/lib/stores/authStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Check, X, RefreshCw, QrCode } from 'lucide-react'
import { WhatsAppQrModal } from '@/components/WhatsAppQrModal'

const PROVIDERS = ['evolution'] as const

const connectionConfig = {
  evolution: {
    name: 'WhatsApp via Evolution API',
    icon: QrCode,
    color: 'bg-blue-500',
    description:
      'Conecte escaneando o QR Code. A instância é criada via Evolution API e o webhook recebe as mensagens.',
    connectLabel: 'Conectar com QR',
  },
} as const

export default function ConnectionsPage() {
  const {
    connections,
    disconnectProvider,
    connectEvolution,
    ensureConnectionSlot,
    fetchConnections,
  } = useConnectionsStore()
  const user = useAuthStore((s) => s.user)

  // Modal state
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const [qrBase64, setQrBase64] = useState<string | undefined>()
  const [pairingCode, setPairingCode] = useState<string | undefined>()
  const [currentInstanceName, setCurrentInstanceName] = useState<string | undefined>()
  const [isConnecting, setIsConnecting] = useState(false)

  const tenantId = user?.tenantId ?? ''

  const displayConnections = useMemo((): Connection[] => {
    return PROVIDERS.map((provider) => {
      const row = connections.find((c) => c.provider === provider)
      if (row) return row
      return {
        id: `slot-${provider}`,
        tenantId,
        type: 'whatsapp',
        provider,
        name: connectionConfig[provider].name,
        connected: false,
      }
    })
  }, [connections, tenantId])

  useEffect(() => {
    if (user?.tenantId) fetchConnections()
  }, [user?.tenantId, fetchConnections])

  const handleConnectEvolution = async () => {
    const ensured = await ensureConnectionSlot('evolution')
    if (!ensured) {
      alert(
        'Não foi possível criar o registro de conexão Evolution no banco. Verifique permissões (RLS) e o schema da tabela connections.'
      )
      return
    }
    startEvolutionConnection()
  }

  const startEvolutionConnection = async () => {
    if (!tenantId) {
      alert('Sessão sem tenant. Faça login novamente.')
      return
    }

    setIsConnecting(true)
    setIsQrModalOpen(true)
    setQrBase64(undefined)
    
    try {
      const instanceName = `crm-${tenantId.slice(0, 8)}-${Date.now()}`
      setCurrentInstanceName(instanceName)
      
      const res = await fetch('/api/evolution/create-instance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instanceName })
      })
      
      const data = await res.json()
      if (data.qrcode?.base64) {
        setQrBase64(data.qrcode.base64)
      } else {
        await refreshEvolutionQr(instanceName)
      }
    } catch (err) {
      console.error(err)
      alert('Erro ao iniciar conexão com Evolution')
      setIsQrModalOpen(false)
    } finally {
      setIsConnecting(false)
    }
  }

  const refreshEvolutionQr = async (instanceName: string) => {
    try {
      const res = await fetch(`/api/evolution/connect?instance=${instanceName}`)
      const data = await res.json()
      if (data.base64) setQrBase64(data.base64)
      if (data.pairingCode) setPairingCode(data.pairingCode)
    } catch (err) {
      console.error('Falha ao obter novo QR Code:', err)
    }
  }

  // Polling para checar state
  useEffect(() => {
    if (!isQrModalOpen || !currentInstanceName) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/evolution/connection-state?instance=${currentInstanceName}`)
        const data = await res.json()
        
        if (data?.instance?.state === 'open') {
          // Conectado!
          setIsQrModalOpen(false)
          connectEvolution(currentInstanceName)
          // Configura webhook e events na API Real..
          await fetch('/api/evolution/setup-webhook', {
            method: 'POST',
            body: JSON.stringify({ instanceName: currentInstanceName })
          })
        }
      } catch (e) {
        console.error('Erro no polling:', e)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isQrModalOpen, currentInstanceName, connectEvolution])

  const handleDisconnect = async (conn: Connection) => {
    if (conn.id.startsWith('slot-')) return
    if (!confirm('Tem certeza que deseja desconectar esta conta?')) return

    if (conn.provider === 'evolution' && conn.instanceName) {
      await fetch(`/api/evolution/delete-instance?instance=${conn.instanceName}`, {
        method: 'DELETE'
      })
    }
    
    disconnectProvider(conn.id)
  }

  const handleSync = (conn: unknown) => {
    console.log(conn)
    alert('Sincronizando...')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Conexões</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          WhatsApp via Evolution API — conecte com QR Code.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayConnections.map((connection) => {
          const config = connectionConfig[connection.provider]
          const Icon = config.icon

          return (
            <Card key={connection.id} className="relative transition-all border-border/50 overflow-hidden hover:shadow-md">
               <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg ${config.color} text-white`}
                    >
                      <Icon className="h-6 w-6" />
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

              <CardContent className="space-y-4 pt-4">
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
                    <div className="flex gap-2 pt-2">
                       <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleSync(connection)}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sincronizar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDisconnect(connection)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Desconectar
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button className="w-full" onClick={handleConnectEvolution}>
                    <Check className="h-4 w-4 mr-2" />
                    {config.connectLabel}
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <WhatsAppQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        qrCodeBase64={qrBase64}
        pairingCode={pairingCode}
        isConnecting={isConnecting}
        onRefreshQr={() => currentInstanceName && refreshEvolutionQr(currentInstanceName)}
      />

    </div>
  )
}

