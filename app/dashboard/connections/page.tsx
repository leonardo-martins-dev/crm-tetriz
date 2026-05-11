'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useConnectionsStore, Connection } from '@/lib/stores/connectionsStore'
import { useAuthStore } from '@/lib/stores/authStore'
import {
  extractInstanceTimeSuffix,
  formatWhatsAppPhoneFromJid,
  isEvolutionInstanceConnected,
  isEvolutionRawConnectionOpen,
  parseFetchInstancesBody,
  partitionInstancesByVerifiedOpen,
  pickCanonicalEvolutionInstance,
  tenantEvolutionPrefix,
  type EvolutionInstanceRow,
} from '@/lib/evolution/evolution-instances'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Check, X, RefreshCw, QrCode, Server } from 'lucide-react'
import { WhatsAppQrModal } from '@/components/WhatsAppQrModal'
import { Modal } from '@/components/ui/Modal'
import { refreshWorkspaceData } from '@/lib/dashboard/refresh-workspace'
import { cn } from '@/lib/utils'

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
  const activeTenantId = useAuthStore((s) => s.getActiveTenantId())

  // Modal state
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const [qrBase64, setQrBase64] = useState<string | undefined>()
  const [pairingCode, setPairingCode] = useState<string | undefined>()
  const [currentInstanceName, setCurrentInstanceName] = useState<string | undefined>()
  /** UUID Evolution — alguns servidores só aceitam /instance/connect/{id} */
  const [currentInstanceId, setCurrentInstanceId] = useState<string | undefined>()
  const [isConnecting, setIsConnecting] = useState(false)
  const finishingRef = useRef(false)

  const [instancePickerOpen, setInstancePickerOpen] = useState(false)
  const [instancePickerLoading, setInstancePickerLoading] = useState(false)
  const [instancePickerConnecting, setInstancePickerConnecting] = useState(false)
  const [instancePickerActive, setInstancePickerActive] = useState<EvolutionInstanceRow[]>([])
  const [instancePickerInactive, setInstancePickerInactive] = useState<EvolutionInstanceRow[]>([])
  const [selectedInstanceName, setSelectedInstanceName] = useState<string | null>(null)
  const [instancePickerError, setInstancePickerError] = useState<string | null>(null)

  const [isWorkspaceSyncing, setIsWorkspaceSyncing] = useState(false)

  const tenantId = activeTenantId ?? ''

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
    if (tenantId) fetchConnections()
  }, [tenantId, fetchConnections])

  /**
   * Lista instâncias do tenant na Evolution, confere connection-state e associa ao CRM
   * a que está realmente aberta (evita criar nova quando já existe uma Connected).
   */
  const adoptConnectedTenantInstance = useCallback(
    async (notify: boolean): Promise<boolean> => {
      if (!tenantId) return false

      let instances: EvolutionInstanceRow[] = []
      try {
        const res = await fetch('/api/evolution/fetch-instances')
        if (!res.ok) return false
        instances = parseFetchInstancesBody(await res.json())
      } catch {
        return false
      }

      const prefix = tenantEvolutionPrefix(tenantId)
      const ours = instances.filter((i) => i.instanceName.toLowerCase().startsWith(prefix.toLowerCase()))
      if (ours.length === 0) return false

      const { verifiedOpen } = await partitionInstancesByVerifiedOpen(ours, (name) =>
        fetch(`/api/evolution/connection-state?instance=${encodeURIComponent(name)}`).then((r) => r.json())
      )

      if (verifiedOpen.length === 0) return false

      verifiedOpen.sort(
        (a, b) => extractInstanceTimeSuffix(b.instanceName) - extractInstanceTimeSuffix(a.instanceName)
      )
      const best = verifiedOpen[0]

      const crm = useConnectionsStore.getState().connections.find((c) => c.provider === 'evolution')
      if (crm?.connected && crm.instanceName === best.instanceName) {
        return false
      }

      await connectEvolution(best.instanceName, undefined, {
        ownerJid: best.owner || undefined,
        profileName: best.profileName || undefined,
        instanceId: best.instanceId || undefined,
      })
      await fetchConnections()

      if (notify) {
        alert(
          `Já existe uma instância Evolution conectada para este tenant. O CRM foi associado a ela (sem criar outra).\n\nInstância: ${best.instanceName}` +
            (best.profileName ? `\nPerfil: ${best.profileName}` : '') +
            (best.owner ? `\nNúmero: ${formatWhatsAppPhoneFromJid(best.owner)}` : '')
        )
      }

      return true
    },
    [tenantId, connectEvolution, fetchConnections]
  )

  const loadInstancePickerData = useCallback(async () => {
    if (!tenantId) return
    setInstancePickerLoading(true)
    setInstancePickerError(null)
    try {
      const res = await fetch('/api/evolution/fetch-instances')
      if (!res.ok) {
        throw new Error(`Evolution retornou ${res.status}`)
      }
      const instances = parseFetchInstancesBody(await res.json())
      const prefix = tenantEvolutionPrefix(tenantId)
      const ours = instances.filter((i) => i.instanceName.toLowerCase().startsWith(prefix.toLowerCase()))

      const { verifiedOpen, notOpen } = await partitionInstancesByVerifiedOpen(ours, (name) =>
        fetch(`/api/evolution/connection-state?instance=${encodeURIComponent(name)}`).then((r) => r.json())
      )

      verifiedOpen.sort(
        (a, b) => extractInstanceTimeSuffix(b.instanceName) - extractInstanceTimeSuffix(a.instanceName)
      )

      setInstancePickerActive(verifiedOpen)
      setInstancePickerInactive(notOpen)
      setSelectedInstanceName(verifiedOpen[0]?.instanceName ?? null)
    } catch (e) {
      setInstancePickerError(e instanceof Error ? e.message : 'Não foi possível listar as instâncias.')
      setInstancePickerActive([])
      setInstancePickerInactive([])
      setSelectedInstanceName(null)
    } finally {
      setInstancePickerLoading(false)
    }
  }, [tenantId])

  const openInstancePicker = async () => {
    if (!tenantId) {
      alert('Sessão sem tenant. Faça login novamente.')
      return
    }
    const ensured = await ensureConnectionSlot('evolution')
    if (!ensured) {
      alert(
        'Não foi possível criar o registro de conexão Evolution no banco. Verifique permissões (RLS) e o schema da tabela connections.'
      )
      return
    }
    setInstancePickerOpen(true)
    await loadInstancePickerData()
  }

  const confirmConnectSelectedInstance = async () => {
    if (!selectedInstanceName) return
    const row = instancePickerActive.find((i) => i.instanceName === selectedInstanceName)
    if (!row) return

    setInstancePickerConnecting(true)
    try {
      await connectEvolution(row.instanceName, undefined, {
        ownerJid: row.owner || undefined,
        profileName: row.profileName || undefined,
        instanceId: row.instanceId || undefined,
      })
      await fetchConnections()
      setInstancePickerOpen(false)
    } catch (e) {
      console.error(e)
      alert('Não foi possível associar esta instância ao CRM.')
    } finally {
      setInstancePickerConnecting(false)
    }
  }

  /** Ao abrir a página: alinha CRM com instância já Connected na Evolution (sem alert) */
  useEffect(() => {
    if (!tenantId) return
    let cancelled = false
    ;(async () => {
      await fetchConnections()
      if (cancelled) return
      const adopted = await adoptConnectedTenantInstance(false)
      if (!cancelled && adopted) await fetchConnections()
    })()
    return () => {
      cancelled = true
    }
  }, [tenantId, fetchConnections, adoptConnectedTenantInstance])

  const handleConnectEvolution = async () => {
    const ensured = await ensureConnectionSlot('evolution')
    if (!ensured) {
      alert(
        'Não foi possível criar o registro de conexão Evolution no banco. Verifique permissões (RLS) e o schema da tabela connections.'
      )
      return
    }
    await fetchConnections()

    const reused = await reconcileEvolutionBeforeQr()
    if (reused) return

    await startEvolutionConnection()
  }

  /** Antes de abrir QR: adota instância já Connected na Evolution; fallback se lista vier incompleta */
  const reconcileEvolutionBeforeQr = async (): Promise<boolean> => {
    if (!tenantId) return false

    if (await adoptConnectedTenantInstance(true)) return true

    let instances: EvolutionInstanceRow[] = []
    try {
      const res = await fetch('/api/evolution/fetch-instances')
      if (res.ok) instances = parseFetchInstancesBody(await res.json())
    } catch {
      return false
    }

    const evolutionConn = useConnectionsStore.getState().connections.find((c) => c.provider === 'evolution')

    if (evolutionConn?.instanceName && !evolutionConn.connected) {
      const row = instances.find((i) => i.instanceName === evolutionConn.instanceName)
      const looksOpen =
        row && isEvolutionInstanceConnected(row.status)
          ? true
          : await fetch(
              `/api/evolution/connection-state?instance=${encodeURIComponent(evolutionConn.instanceName)}`
            )
              .then((r) => r.json())
              .then((j) => isEvolutionRawConnectionOpen(j))

      if (looksOpen) {
        await connectEvolution(evolutionConn.instanceName, undefined, {
          ownerJid: row?.owner || undefined,
          profileName: row?.profileName || undefined,
          instanceId: row?.instanceId || undefined,
        })
        await fetchConnections()
        alert(
          'Conexão recuperada: a instância já estava ativa na Evolution. Você pode usar o WhatsApp normalmente.'
        )
        return true
      }
    }

    return false
  }

  const startEvolutionConnection = async () => {
    if (!tenantId) {
      alert('Sessão sem tenant. Faça login novamente.')
      return
    }

    setIsConnecting(true)
    setQrBase64(undefined)
    finishingRef.current = false

    await fetchConnections()

    try {
      if (await adoptConnectedTenantInstance(true)) {
        setIsConnecting(false)
        return
      }

      setIsQrModalOpen(true)

      const evolutionConn = useConnectionsStore.getState().connections.find((c) => c.provider === 'evolution')

      // 1) Tenta QR na instância já salva (reconexão)
      if (evolutionConn?.instanceName) {
        setCurrentInstanceName(evolutionConn.instanceName)
        setCurrentInstanceId(evolutionConn.instanceId || undefined)
        const gotQr = await refreshEvolutionQr(
          evolutionConn.instanceName,
          evolutionConn.instanceId,
          { quiet: true }
        )
        if (gotQr) return
        // Instância sumiu na Evolution (404): segue para criar outra e mostrar QR
        setQrBase64(undefined)
        setPairingCode(undefined)
      }

      const instanceName = `${tenantEvolutionPrefix(tenantId)}${Date.now()}`
      setCurrentInstanceName(instanceName)
      setCurrentInstanceId(undefined)

      const res = await fetch('/api/evolution/create-instance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instanceName,
          webhookPublicUrl:
            typeof window !== 'undefined' ? window.location.origin : undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(
          typeof data?.error === 'string'
            ? data.error
            : 'Não foi possível criar a instância na Evolution. Verifique EVOLUTION_API_URL e a apikey no servidor.'
        )
        setIsQrModalOpen(false)
        return
      }

      const createdIdRaw = data?.instance?.instanceId ?? data?.instanceId
      const createdId = typeof createdIdRaw === 'string' ? createdIdRaw : undefined
      if (createdId) setCurrentInstanceId(createdId)

      if (evolutionConn && !evolutionConn.id.startsWith('slot-')) {
        await useConnectionsStore.getState().updateConnection(evolutionConn.id, {
          connected: false,
          instanceName,
          instanceId: createdId,
          evolutionOwnerJid: null,
          evolutionProfileName: null,
        })
        await fetchConnections()
      }

      if (data.qrcode?.base64) {
        let b64 = data.qrcode.base64 as string
        if (b64 && !b64.startsWith('data:')) b64 = `data:image/png;base64,${b64}`
        setQrBase64(b64)
      } else {
        const qrOk = await refreshEvolutionQr(instanceName, createdId, { quiet: true })
        if (!qrOk) {
          alert(
            'Instância criada na Evolution, mas o QR não foi obtido. Toque em "Gerar novo código" no modal ou verifique a API.'
          )
        }
      }
    } catch (err) {
      console.error(err)
      alert('Erro ao iniciar conexão com Evolution')
      setIsQrModalOpen(false)
    } finally {
      setIsConnecting(false)
    }
  }

  const refreshEvolutionQr = async (
    instanceName: string,
    instanceId?: string | null,
    opts?: { quiet?: boolean }
  ): Promise<boolean> => {
    try {
      const qs = new URLSearchParams({ instance: instanceName })
      if (instanceId) qs.set('instanceId', instanceId)
      const res = await fetch(`/api/evolution/connect?${qs}`)
      const data = await res.json()
      if (!res.ok) {
        const msg =
          typeof data.details === 'object' && data.details !== null && 'message' in data.details
            ? JSON.stringify((data.details as { message?: unknown }).message)
            : data.error || res.statusText
        console.error('[connect]', res.status, data)
        if (!opts?.quiet) {
          alert(
            `Evolution não gerou o QR (${res.status}).\n\n` +
              `Se a instância foi apagada no servidor, será criada uma nova automaticamente ao fechar este aviso (use "Conectar com QR" de novo) ou use "Verificar instâncias".\n\n` +
              `Detalhe: ${String(msg).slice(0, 200)}`
          )
        }
        return false
      }
      let b64 = typeof data.base64 === 'string' ? data.base64 : ''
      if (b64 && !b64.startsWith('data:')) {
        b64 = `data:image/png;base64,${b64}`
      }
      if (b64) setQrBase64(b64)
      if (data.pairingCode) setPairingCode(data.pairingCode)

      const keyUsed = data.evolutionConnectKeyUsed
      const uuidRe =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      if (typeof keyUsed === 'string' && uuidRe.test(keyUsed)) {
        setCurrentInstanceId(keyUsed)
        const conn = useConnectionsStore.getState().connections.find((c) => c.provider === 'evolution')
        if (conn && conn.instanceId !== keyUsed) {
          await useConnectionsStore.getState().updateConnection(conn.id, { instanceId: keyUsed })
        }
      }

      return Boolean(b64 || data.pairingCode)
    } catch (err) {
      console.error('Falha ao obter novo QR Code:', err)
      if (!opts?.quiet) {
        alert('Falha de rede ao pedir QR à Evolution.')
      }
      return false
    }
  }

  // Polling: não depende só do modal (quem fecha o modal após escanear ainda precisa sincronizar)
  useEffect(() => {
    if (!currentInstanceName) return

    const tryFinish = async () => {
      if (finishingRef.current || !currentInstanceName) return
      try {
        const res = await fetch(
          `/api/evolution/connection-state?instance=${encodeURIComponent(currentInstanceName)}`
        )
        const data = await res.json()
        if (!isEvolutionRawConnectionOpen(data)) return
        if (finishingRef.current) return
        finishingRef.current = true
        setIsQrModalOpen(false)

        let instances: EvolutionInstanceRow[] = []
        try {
          const fi = await fetch('/api/evolution/fetch-instances')
          if (fi.ok) {
            instances = parseFetchInstancesBody(await fi.json())
          }
        } catch {
          /* ignore */
        }

        const detail = instances.find((i) => i.instanceName === currentInstanceName)
        const ownerJid = detail?.owner || ''
        const dbEv = useConnectionsStore.getState().connections.find((c) => c.provider === 'evolution')

        let targetName = currentInstanceName
        let meta = {
          ownerJid: detail?.owner || undefined,
          profileName: detail?.profileName || undefined,
          instanceId: detail?.instanceId || undefined,
        }

        if (ownerJid) {
          const { canonicalName, redundantNames } = pickCanonicalEvolutionInstance({
            instances,
            currentName: currentInstanceName,
            ownerJid,
            dbInstanceName: dbEv?.instanceName,
          })
          const prefix = tenantEvolutionPrefix(tenantId)
          const safeRedundant = redundantNames.filter((n) =>
            n.toLowerCase().startsWith(prefix.toLowerCase())
          )

          for (const name of safeRedundant) {
            try {
              await fetch(`/api/evolution/delete-instance?instance=${encodeURIComponent(name)}`, {
                method: 'DELETE',
              })
            } catch {
              /* ignore */
            }
          }

          if (canonicalName !== currentInstanceName) {
            const canonDetail = instances.find((i) => i.instanceName === canonicalName)
            targetName = canonicalName
            meta = {
              ownerJid: canonDetail?.owner || meta.ownerJid,
              profileName: canonDetail?.profileName || meta.profileName,
              instanceId: canonDetail?.instanceId || meta.instanceId,
            }
            alert(
              `Este WhatsApp já estava vinculado à instância "${canonicalName}". A instância duplicada foi encerrada na Evolution.`
            )
          }
        }

        await connectEvolution(targetName, undefined, meta)
        await fetchConnections()

        const evAfter = useConnectionsStore.getState().connections.find((c) => c.provider === 'evolution')
        if (!evAfter?.connected) {
          console.error(
            '[Evolution sync] O CRM não gravou "Conectado". Verifique RLS no Supabase, migration da tabela connections e o console em updateConnection.'
          )
        }

        setCurrentInstanceName(undefined)
        finishingRef.current = false
      } catch (e) {
        console.error('Erro ao sincronizar conexão Evolution:', e)
        finishingRef.current = false
      }
    }

    tryFinish()
    const interval = setInterval(tryFinish, 3000)
    return () => clearInterval(interval)
  }, [currentInstanceName, connectEvolution, fetchConnections])

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

  const handleSync = async (_conn: Connection) => {
    setIsWorkspaceSyncing(true)
    try {
      const r = await refreshWorkspaceData({ inboxSync: true })
      const ev = r.evolutionSync
      if (ev?.skipped) {
        alert(
          'Conecte o WhatsApp (QR Code) antes de sincronizar. Depois disso, os chats serão importados para o CRM.'
        )
      } else if (ev && ev.ok === false) {
        alert(
          `Sincronização Evolution falhou${ev.status ? ` (HTTP ${ev.status})` : ''}: ${ev.detail || 'erro desconhecido'}`
        )
      }
    } catch (e) {
      console.error(e)
      alert('Não foi possível sincronizar leads e conversas. Verifique o Supabase e tente de novo.')
    } finally {
      setIsWorkspaceSyncing(false)
    }
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
          const config = connectionConfig[connection.provider as keyof typeof connectionConfig]
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
                    {connection.instanceName && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Instância Evolution</p>
                        <p className="text-sm font-mono break-all">{connection.instanceName}</p>
                      </div>
                    )}
                    {connection.evolutionWebhookUrl && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">URL do webhook (igual para todos os tenants)</p>
                        <p className="text-xs font-mono break-all text-muted-foreground">
                          {connection.evolutionWebhookUrl}
                        </p>
                        {connection.evolutionWebhookSyncedAt && (
                          <p className="text-[10px] text-muted-foreground">
                            Gravado no Supabase em{' '}
                            {new Date(connection.evolutionWebhookSyncedAt).toLocaleString('pt-BR')}
                          </p>
                        )}
                      </div>
                    )}
                    {(connection.accountName || connection.evolutionProfileName) && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Perfil WhatsApp</p>
                        <p className="text-sm font-medium">
                          {connection.evolutionProfileName || connection.accountName}
                        </p>
                      </div>
                    )}
                    {connection.evolutionOwnerJid && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Número</p>
                        <p className="text-sm">{formatWhatsAppPhoneFromJid(connection.evolutionOwnerJid)}</p>
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
                        type="button"
                        disabled={isWorkspaceSyncing}
                        onClick={() => handleSync(connection)}
                      >
                        <RefreshCw className={cn('h-4 w-4 mr-2', isWorkspaceSyncing && 'animate-spin')} />
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
                  <div className="flex flex-col gap-2">
                    <Button className="w-full" onClick={handleConnectEvolution}>
                      <Check className="h-4 w-4 mr-2" />
                      {config.connectLabel}
                    </Button>
                    <Button variant="outline" className="w-full" onClick={openInstancePicker} type="button">
                      <Server className="h-4 w-4 mr-2" />
                      Verificar instâncias
                    </Button>
                  </div>
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
        onRefreshQr={() =>
          currentInstanceName && void refreshEvolutionQr(currentInstanceName, currentInstanceId)
        }
      />

      <Modal
        isOpen={instancePickerOpen}
        onClose={() => !instancePickerConnecting && setInstancePickerOpen(false)}
        title="Instâncias Evolution ativas"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Instâncias com o prefixo do seu tenant que estão <strong>conectadas</strong> na Evolution. Escolha uma
            para vincular ao CRM (sem novo QR).
          </p>

          {instancePickerLoading && (
            <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Consultando Evolution…
            </div>
          )}

          {instancePickerError && (
            <p className="text-sm text-destructive">{instancePickerError}</p>
          )}

          {!instancePickerLoading && !instancePickerError && instancePickerActive.length === 0 && (
            <p className="text-sm text-muted-foreground py-4">
              Nenhuma instância ativa encontrada para este tenant. Use &quot;Conectar com QR&quot; para criar ou
              reconectar.
            </p>
          )}

          {!instancePickerLoading && instancePickerActive.length > 0 && (
            <ul className="space-y-2 max-h-[min(50vh,360px)] overflow-y-auto pr-1">
              {instancePickerActive.map((row) => {
                const id = `ev-inst-${row.instanceName}`
                const selected = selectedInstanceName === row.instanceName
                return (
                  <li key={row.instanceName}>
                    <label
                      htmlFor={id}
                      className={`flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors ${
                        selected ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/40'
                      }`}
                    >
                      <input
                        id={id}
                        type="radio"
                        name="evolution-instance"
                        className="mt-1"
                        checked={selected}
                        onChange={() => setSelectedInstanceName(row.instanceName)}
                      />
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Instância</p>
                        <p className="text-sm font-mono break-all">{row.instanceName}</p>
                        {(row.profileName || row.owner) && (
                          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-sm">
                            {row.profileName && (
                              <span>
                                <span className="text-muted-foreground">Perfil: </span>
                                {row.profileName}
                              </span>
                            )}
                            {row.owner && (
                              <span>
                                <span className="text-muted-foreground">Número: </span>
                                {formatWhatsAppPhoneFromJid(row.owner)}
                              </span>
                            )}
                          </div>
                        )}
                        {row.status && (
                          <p className="text-xs text-muted-foreground">Estado na API: {row.status}</p>
                        )}
                      </div>
                    </label>
                  </li>
                )
              })}
            </ul>
          )}

          {!instancePickerLoading && instancePickerInactive.length > 0 && (
            <details className="text-sm">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                Outras instâncias do tenant (desconectadas na Evolution){' '}
                <span className="font-medium">({instancePickerInactive.length})</span>
              </summary>
              <ul className="mt-2 space-y-1 pl-2 font-mono text-xs text-muted-foreground break-all">
                {instancePickerInactive.map((row) => (
                  <li key={row.instanceName}>{row.instanceName}</li>
                ))}
              </ul>
            </details>
          )}

          <div className="flex flex-wrap gap-2 justify-end border-t pt-4">
            <Button
              variant="outline"
              type="button"
              disabled={instancePickerConnecting}
              onClick={() => setInstancePickerOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={
                instancePickerLoading ||
                !selectedInstanceName ||
                instancePickerActive.length === 0 ||
                instancePickerConnecting
              }
              onClick={confirmConnectSelectedInstance}
            >
              {instancePickerConnecting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Associando…
                </>
              ) : (
                'Usar esta instância no CRM'
              )}
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  )
}

