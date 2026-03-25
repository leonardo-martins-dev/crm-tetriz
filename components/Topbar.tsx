'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '@/lib/stores/authStore'
import { useClientsStore } from '@/lib/stores/clientsStore'
import { useTheme } from '@/lib/contexts/ThemeContext'
import { Moon, Sun, LogOut, Building2, ChevronDown } from 'lucide-react'
import { Button } from './ui/Button'
import { cn } from '@/lib/utils'

export function Topbar() {
  const { user, client, selectClient, logout } = useAuthStore()
  const { clients } = useClientsStore()
  const { theme, toggleTheme } = useTheme()
  const [showClientMenu, setShowClientMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowClientMenu(false)
      }
    }

    if (showClientMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showClientMenu])

  return (
    <div className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        {user?.role === 'owner' && (
          <div className="relative" ref={menuRef}>
            <Button
              variant="ghost"
              className="gap-2"
              onClick={() => setShowClientMenu(!showClientMenu)}
            >
              <Building2 className="h-4 w-4" />
              {client ? client.name : 'Selecionar Cliente'}
              <ChevronDown className="h-4 w-4" />
            </Button>
            {showClientMenu && (
              <div className="absolute left-0 top-full z-50 mt-2 min-w-[200px] rounded-md border bg-popover p-1 shadow-md">
                {clients.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      selectClient(c.id, clients)
                      setShowClientMenu(false)
                    }}
                    className={cn(
                      'cursor-pointer rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent',
                      client?.id === c.id && 'bg-accent'
                    )}
                  >
                    {c.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {client && user?.role !== 'owner' && (
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{client.name}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

