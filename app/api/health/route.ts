import { NextResponse } from 'next/server'

/** Confirma que o Node do Next responde por trás do proxy (sem chamar Evolution). */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'crm-next',
    timestamp: new Date().toISOString(),
  })
}
