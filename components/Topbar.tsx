'use client'

import { useAuthStore } from '@/lib/stores/authStore'
import { useTheme } from '@/lib/contexts/ThemeContext'
import { Moon, Sun, LogOut, Building2 } from 'lucide-react'
import { Button } from './ui/Button'

export function Topbar() {
  const { user, client, logout } = useAuthStore()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        {client && (
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

