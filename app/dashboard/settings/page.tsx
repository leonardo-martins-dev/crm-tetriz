'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/lib/stores/authStore'
import { User, Building2, Bell, Shield, Camera, Save, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const { user, client } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: 'Meu Perfil', icon: User, description: 'Gerencie suas informações pessoais' },
    { id: 'company', label: 'Empresa', icon: Building2, description: 'Dados e plano da empresa' },
    { id: 'notifications', label: 'Notificações', icon: Bell, description: 'Preferências de alertas e emails' },
    { id: 'security', label: 'Segurança', icon: Shield, description: 'Senhas e autenticação' },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10 mt-2">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie as preferências da sua conta e configurações do sistema.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar menu */}
        <aside className="w-full md:w-64 shrink-0 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <nav className="flex flex-row md:flex-col gap-1 w-max md:w-full">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Content area */}
        <div className="flex-1 w-full max-w-3xl">
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="border-border/50 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border/50">
                  <CardTitle>Perfil Público</CardTitle>
                  <CardDescription>
                    {tabs.find(t => t.id === 'profile')?.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                      <div className="relative group shrink-0">
                        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold overflow-hidden border-4 border-background shadow-md">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <button className="absolute bottom-0 right-0 h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 active:scale-95">
                          <Camera className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium text-lg">Foto do Perfil</h3>
                        <p className="text-sm text-muted-foreground max-w-xs">
                          JPG, GIF ou PNG. Tamanho máximo de 5MB. Ajustado para 256x256px.
                        </p>
                        <div className="flex gap-3 mt-3">
                          <Button variant="outline" size="sm">Fazer upload</Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">Remover</Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nome Completo</label>
                        <Input defaultValue={user?.name || ''} className="bg-background/50 focus:bg-background transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Endereço de Email</label>
                        <Input type="email" defaultValue={user?.email || ''} className="bg-background/50 focus:bg-background transition-colors" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium gap-2">
                          Cargo / Função de Acesso
                        </label>
                        <Input defaultValue={user?.role === 'owner' ? 'Dono/Administrador' : user?.role === 'client' ? 'Administrador' : 'Usuário Padrão'} disabled className="bg-muted/50 cursor-not-allowed" />
                        <p className="text-xs text-muted-foreground mt-1 text-right">
                          Cargos são definidos e gerenciados pelos administradores da empresa.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <div className="bg-muted/30 border-t border-border/50 py-4 px-6 flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">Última atualização hoje</p>
                  <Button className="gap-2 shadow-sm rounded-full px-6">
                    <Save className="h-4 w-4" />
                    Salvar Alterações
                  </Button>
                </div>
              </Card>

              <Card className="border-red-200/50 bg-red-50/10 dark:bg-red-950/20 dark:border-red-900/50 shadow-sm overflow-hidden border-dashed">
                 <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="text-base font-semibold text-destructive">Sessão e Acesso</h4>
                      <p className="text-sm text-muted-foreground mt-1 max-w-md">
                        Encerre sua sessão atual de forma segura. Em breve você poderá ver seus dispositivos conectados.
                      </p>
                    </div>
                    <Button variant="destructive" className="gap-2 w-full sm:w-auto shadow-sm">
                      <LogOut className="h-4 w-4" />
                      Sair da Conta
                    </Button>
                 </div>
              </Card>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="border-border/50 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border/50">
                   <CardTitle>Detalhes da Empresa</CardTitle>
                   <CardDescription>
                     {tabs.find(t => t.id === 'company')?.description}
                   </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {user?.role !== 'client' && user?.role !== 'owner' && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400 text-sm flex gap-3 shadow-sm">
                      <Shield className="h-5 w-5 shrink-0" />
                      <p>Apenas administradores podem fazer alterações nas configurações da empresa.</p>
                    </div>
                  )}

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex justify-between">
                        Nome da Empresa
                        <span className="text-xs text-muted-foreground">Obrigatório</span>
                      </label>
                      <Input 
                        defaultValue={client?.name || ''} 
                        disabled={user?.role !== 'client' && user?.role !== 'owner'} 
                        className={user?.role !== 'client' && user?.role !== 'owner' ? "bg-muted/50 cursor-not-allowed" : "bg-background/50"}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                      <div className="p-5 rounded-xl bg-card border border-border/50 shadow-sm flex flex-col gap-1 items-center justify-center text-center">
                        <span className="text-4xl font-bold text-primary">{client?.userCount || 0}</span>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Usuários Ativos</span>
                      </div>
                      <div className="p-5 rounded-xl bg-card border border-border/50 shadow-sm flex flex-col gap-1 items-center justify-center text-center">
                        <span className="text-4xl font-bold text-primary">{client?.leadCount || 0}</span>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Leads Totais</span>
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-card to-primary/5 border border-primary/20 shadow-sm flex flex-col items-center justify-center text-center col-span-2">
                        <span className="text-sm font-medium text-muted-foreground mb-1">Plano Atual</span>
                        <span className="text-2xl font-bold text-foreground">Essencial Anual</span>
                        <Button variant="ghost" className="h-auto p-0 mt-3 text-sm font-medium text-primary hover:bg-transparent hover:underline">Gerenciar Assinatura &rarr;</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                {(user?.role === 'client' || user?.role === 'owner') && (
                  <div className="bg-muted/30 border-t border-border/50 py-4 px-6 flex justify-end">
                    <Button className="gap-2 shadow-sm rounded-full px-6">
                      <Save className="h-4 w-4" />
                      Salvar Alterações
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          )}

          {(activeTab === 'notifications' || activeTab === 'security') && (
             <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in duration-500 h-[400px] border border-dashed border-border/60 rounded-xl bg-card/30">
               <div className="w-16 h-16 rounded-full bg-muted shadow-sm flex items-center justify-center mb-6">
                 {activeTab === 'notifications' ? 
                   <Bell className="h-8 w-8 text-muted-foreground" /> : 
                   <Shield className="h-8 w-8 text-muted-foreground" />
                 }
               </div>
               <h3 className="text-xl font-semibold mb-2">Página em Construção</h3>
               <p className="text-muted-foreground max-w-sm">
                 As configurações de {activeTab === 'notifications' ? 'notificações' : 'segurança'} estarão disponíveis em breve.
               </p>
             </div>
          )}
        </div>
      </div>
    </div>
  )
}

