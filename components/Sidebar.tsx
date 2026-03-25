'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Inbox,
  GitBranch,
  Users,
  BarChart3,
  Settings,
  Building2,
  UserCog,
  Link2,
  Tag,
} from 'lucide-react'
import { useAuthStore } from '@/lib/stores/authStore'

const dashboardNav = [
  { name: 'Inbox', href: '/dashboard/inbox', icon: Inbox },
  { name: 'Clientes', href: '/dashboard/clients', icon: Building2 },
  { name: 'Pipeline', href: '/dashboard/pipeline', icon: GitBranch },
  { name: 'Leads', href: '/dashboard/leads', icon: Users },
  { name: 'Conexões', href: '/dashboard/connections', icon: Link2 },
  { name: 'Tags', href: '/dashboard/tags', icon: Tag },
  { name: 'Métricas', href: '/dashboard/metrics', icon: BarChart3 },
  { name: 'Configurações', href: '/dashboard/settings', icon: Settings },
]

const adminNav = [
  { name: 'Clientes', href: '/admin/clients', icon: Building2 },
  { name: 'Usuários', href: '/admin/users', icon: UserCog },
  { name: 'Métricas', href: '/admin/metrics', icon: BarChart3 },
  { name: 'Configurações', href: '/admin/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const isAdmin = pathname.startsWith('/admin')
  const navItems = isAdmin ? adminNav : dashboardNav

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold text-primary">BRENO CRM</h1>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      {user && (
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

