'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Mantém o usuário sempre no Inbox (pedido: /dashboard/inbox)
    router.replace('/dashboard/inbox')
  }, [router])

  return null
}

