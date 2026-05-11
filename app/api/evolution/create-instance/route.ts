import { NextResponse } from 'next/server'
import {
  buildEvolutionInstanceWebhookConfig,
  resolveEvolutionWebhookTarget,
} from '@/lib/evolution/resolve-webhook-target'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const instanceName = body.instanceName as string | undefined
    const webhookPublicUrl =
      typeof body.webhookPublicUrl === 'string' ? body.webhookPublicUrl.trim() : ''

    if (!instanceName) {
      return NextResponse.json({ error: 'Instance name is required' }, { status: 400 })
    }

    const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080'
    const GLOBAL_API_KEY = process.env.EVOLUTION_API_KEY || 'mude-me'

    const webhookUrl = resolveEvolutionWebhookTarget(webhookPublicUrl || undefined)

    /** `InstanceDto.webhook` na Evolution atual (objeto aninhado; campos planos legados não preenchem o webhook). */
    const payload = {
      instanceName,
      integration: 'WHATSAPP-BAILEYS',
      qrcode: true,
      webhook: buildEvolutionInstanceWebhookConfig(webhookUrl),
    }

    const base = EVOLUTION_API_URL.replace(/\/$/, '')
    const response = await fetch(`${base}/instance/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: GLOBAL_API_KEY,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('[create-instance] Evolution:', response.status, errorBody)
      return NextResponse.json(
        { error: 'Failed to create instance in Evolution API', details: errorBody },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro na API de criar instância:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
