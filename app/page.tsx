'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/authStore'
import { useClientsStore } from '@/lib/stores/clientsStore'
import { defaultTenantConfig } from '@/config/tenant'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuthStore()
  const { clients } = useClientsStore()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const loggedUser = await login(email, password, clients)
    if (loggedUser) {
      if (loggedUser.role === 'owner') {
        router.push('/admin/clients')
      } else {
        router.push('/dashboard/inbox')
      }
    } else {
      setError('Email ou senha inválidos')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">
            {defaultTenantConfig.branding.fullProductName}
          </CardTitle>
          <CardDescription className="text-center">
            Faça login para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full">
              Entrar
            </Button>
            <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
              <p className="font-semibold">Usuários de teste:</p>
              <p>• joao@noponto.com (Owner)</p>
              <p>• maria@cliente1.com (Cliente)</p>
              <p className="text-xs mt-2">Qualquer senha funciona</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

