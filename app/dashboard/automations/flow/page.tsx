'use client'

import { useEffect } from 'react'
import { useAutomationFlowStore } from '@/lib/stores/automationFlowStore'
import { FlowCanvas } from '@/components/automation/FlowCanvas'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AutomationFlowPage() {
  const { currentFlow, flows, setCurrentFlow, updateFlow, createFlow } = useAutomationFlowStore()
  const router = useRouter()

  useEffect(() => {
    if (flows.length > 0 && !currentFlow) {
      setCurrentFlow(flows[0].id)
    } else if (flows.length === 0) {
      createFlow('Nova Automação')
    }
  }, [flows, currentFlow, setCurrentFlow, createFlow])

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/automations')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <Input
              value={currentFlow?.name || ''}
              onChange={(e) => updateFlow({ name: e.target.value })}
              placeholder="Nome da automação"
              className="text-xl font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 rounded-lg border border-border/50 bg-card/60 backdrop-blur-md shadow-sm overflow-hidden">
        <FlowCanvas />
      </div>
    </div>
  )
}

