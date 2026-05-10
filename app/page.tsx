'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/authStore'
import { defaultTenantConfig } from '@/config/tenant'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { Loader2, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isShaking, setIsShaking] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuthStore()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    setError('')
    setIsSubmitting(true)
    try {
      const { user: loggedUser, error: loginError } = await login(email, password)

      if (loggedUser) {
        if (loggedUser.role === 'owner') {
          router.push('/admin/clients')
        } else {
          router.push('/dashboard/inbox')
        }
      } else {
        setError(loginError || 'Email ou senha inválidos')
        setIsShaking(true)
        setTimeout(() => setIsShaking(false), 500)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 p-4">
      <Card 
        className={cn(
          "w-full max-w-md transition-all duration-300 border-2",
          isShaking ? "animate-shake border-destructive" : error ? "border-destructive/50" : "border-transparent"
        )}
      >
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive animate-in fade-in zoom-in duration-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full relative overflow-hidden group" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
            <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
              <p className="font-semibold">Usuários de teste:</p>
              <p>• joao@noponto.com (Owner)</p>
              <p>• maria@cliente1.com (Cliente)</p>
              <p className="text-xs mt-2 italic text-muted-foreground/70">Dica: use as credenciais cadastradas no sistema</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

