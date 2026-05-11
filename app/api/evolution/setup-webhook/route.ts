import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { SupabaseConnectionRepository } from '@/backend/infrastructure/repositories/supabase-connection.repository'
import {
  EVOLUTION_WEBHOOK_EVENTS,
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

    const WEBHOOK_TARGET = resolveEvolutionWebhookTarget(webhookPublicUrl || undefined)

    /** Evolution API | v2.0 Postman — Webhook → Set Webhook */
    const payload = {
      enabled: true,
      url: WEBHOOK_TARGET,
      webhookByEvents: true,
      webhookBase64: false,
      events: [...EVOLUTION_WEBHOOK_EVENTS],
    }

    const base = EVOLUTION_API_URL.replace(/\/$/, '')
    const path = `/webhook/set/${encodeURIComponent(instanceName)}`

    const response = await fetch(`${base}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: GLOBAL_API_KEY,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('[setup-webhook] Evolution rejeitou:', {
        status: response.status,
        evolutionPath: `${base}${path}`,
        webhookTarget: WEBHOOK_TARGET,
        details: errorBody,
      })
      let parsed: unknown
      try {
        parsed = JSON.parse(errorBody)
      } catch {
        parsed = errorBody
      }
      return NextResponse.json(
        {
          error: 'Failed to configure Evolution Webhook',
          details: parsed,
          webhookTargetUsed: WEBHOOK_TARGET,
        },
        { status: response.status }
      )
    }

    const raw = await response.text()
    let data: unknown = { ok: true }
    if (raw) {
      try {
        data = JSON.parse(raw)
      } catch {
        data = { raw }
      }
    }

    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (url && key) {
        const supabase = createClient(url, key)
        const repo = new SupabaseConnectionRepository(supabase)
        const conn = await repo.findByInstanceName(instanceName)
        if (conn) {
          await repo.update(conn.tenantId, conn.id, {
            evolutionWebhookUrl: WEBHOOK_TARGET,
            evolutionWebhookSyncedAt: new Date().toISOString(),
          })
        }
      }
    } catch (persistErr) {
      console.error('[setup-webhook] Falha ao gravar URL no Supabase:', persistErr)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro na API de webhook config:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
