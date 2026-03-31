'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/authStore'
import { useConversationsStore } from '@/lib/stores/conversationsStore'
import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, user, client } = useAuthStore()
  const { subscribeToMessages } = useConversationsStore()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (client?.id) {
      const unsubscribe = subscribeToMessages(client.id)
      return () => unsubscribe()
    }
  }, [client?.id, subscribeToMessages])

  useEffect(() => {
    // Pequeno delay para permitir que o estado seja atualizado após o selectClient
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push('/')
        setIsChecking(false)
        return
      }

      // Se for owner, só permite acessar se tiver um cliente selecionado
      if (user?.role === 'owner') {
        if (!client) {
          router.push('/admin/clients')
          setIsChecking(false)
          return
        }
      }

      // Se não for owner e não tiver cliente, redireciona para login
      if (user?.role !== 'owner' && !client) {
        router.push('/')
        setIsChecking(false)
        return
      }

      setIsChecking(false)
    }, 50)

    return () => clearTimeout(timer)
  }, [isAuthenticated, user, client, router])

  if (isChecking || !isAuthenticated) {
    return null
  }

  // Se for owner sem cliente selecionado, não renderiza
  if (user?.role === 'owner' && !client) {
    return null
  }

  // Se não for owner e não tiver cliente, não renderiza
  if (user?.role !== 'owner' && !client) {
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

