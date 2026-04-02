'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/authStore'
import { useConversationsStore } from '@/lib/stores/conversationsStore'
import { useLeadsStore } from '@/lib/stores/leadsStore'
import { useConnectionsStore } from '@/lib/stores/connectionsStore'
import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, user, refreshUser } = useAuthStore()
  const { fetchLeads, leads } = useLeadsStore()
  const { fetchConnections } = useConnectionsStore()
  const { initializeConversations, subscribeToMessages } = useConversationsStore()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  // 1. Verificar sessão ao montar
  useEffect(() => {
    refreshUser().finally(() => setIsChecking(false))
  }, [refreshUser])

  // 2. Carregar dados iniciais quando o tenantId estiver disponível
  useEffect(() => {
    if (user?.tenantId) {
      fetchLeads()
      fetchConnections()
    }
  }, [user?.tenantId, fetchLeads, fetchConnections])

  // 3. Inicializar conversas e Realtime
  useEffect(() => {
    if (user?.tenantId && leads.length > 0) {
      initializeConversations(leads)
      const unsubscribe = subscribeToMessages()
      return () => unsubscribe()
    }
  }, [user?.tenantId, leads, initializeConversations, subscribeToMessages])

  // 4. Proteção de rota
  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push('/')
    }
  }, [isChecking, isAuthenticated, router])

  if (isChecking || !isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

