import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

type Body = {
  tenantId?: string
  name?: string
  email?: string
  role?: 'owner' | 'client' | 'user'
  password?: string
  active?: boolean
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body
    const tenantId = body.tenantId?.trim()
    const name = body.name?.trim()
    const email = body.email?.trim().toLowerCase()
    const role = body.role
    const password = body.password || ''
    const active = body.active ?? true

    if (!tenantId || !name || !email || !role || !password) {
      return NextResponse.json({ error: 'tenantId, name, email, role e password são obrigatórios' }, { status: 400 })
    }
    if (!['client', 'user', 'owner'].includes(role)) {
      return NextResponse.json({ error: 'role inválido' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Senha deve ter ao menos 6 caracteres' }, { status: 400 })
    }
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Supabase não configurado no servidor' }, { status: 500 })
    }

    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { tenant_id: tenantId, role },
      user_metadata: { name },
    })

    if (createErr || !created.user?.id) {
      return NextResponse.json({ error: createErr?.message || 'Falha ao criar auth user' }, { status: 400 })
    }

    const userId = created.user.id

    const { error: profileErr } = await admin.from('profiles').insert({
      id: userId,
      tenant_id: tenantId,
      name,
      email,
      role,
      active,
    })

    if (profileErr) {
      // best-effort rollback
      await admin.auth.admin.deleteUser(userId)
      return NextResponse.json({ error: profileErr.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true, id: userId })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}

