'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/authStore'
import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'owner') {
      if (!isAuthenticated) {
        router.push('/')
      } else {
        router.push('/dashboard/inbox')
      }
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== 'owner') {
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

