/**
 * Cria tenant + usuário Auth (owner) + linha em profiles com app_metadata para RLS.
 *
 * Segurança: use OWNER_EMAIL / OWNER_PASSWORD no ambiente (não commite senhas).
 *
 * Uso (PowerShell):
 *   $env:OWNER_EMAIL="leonardo.martins@noponto.io"
 *   $env:OWNER_PASSWORD="sua-senha"
 *   npm run seed:owner
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadDotEnv() {
  const envPath = resolve(__dirname, '..', '.env')
  if (!existsSync(envPath)) return
  const text = readFileSync(envPath, 'utf8')
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq <= 0) continue
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim().replace(/\r$/, '')
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = val
  }
}

loadDotEnv()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/$/, '')
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

const ownerEmail = process.env.OWNER_EMAIL?.trim()
const ownerPassword = process.env.OWNER_PASSWORD
const tenantName = process.env.OWNER_TENANT_NAME?.trim() || 'NO PONTO Platform'
const displayName = process.env.OWNER_DISPLAY_NAME?.trim() || 'Leonardo Martins'

function isDuplicateUserError(msg) {
  return /already|registered|exists|duplicate/i.test(msg || '')
}

async function findUserByEmail(admin, email) {
  let page = 1
  const perPage = 200
  for (let i = 0; i < 20; i++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage })
    if (error) throw error
    const u = data?.users?.find((x) => x.email?.toLowerCase() === email.toLowerCase())
    if (u) return u
    if (!data?.users?.length || data.users.length < perPage) break
    page += 1
  }
  return null
}

async function main() {
  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      'Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY (no .env ou no ambiente).'
    )
    process.exit(1)
  }
  if (!ownerEmail || !ownerPassword) {
    console.error('Defina OWNER_EMAIL e OWNER_PASSWORD antes de rodar o script.')
    process.exit(1)
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  let tenantId = process.env.OWNER_TENANT_ID?.trim()
  let orphanTenantId = null

  if (!tenantId) {
    const { data: tenantRow, error: tenantErr } = await admin
      .from('tenants')
      .insert({ name: tenantName, active: true })
      .select('id')
      .single()

    if (tenantErr) {
      console.error('Erro ao criar tenant:', tenantErr.message)
      process.exit(1)
    }
    tenantId = tenantRow.id
    orphanTenantId = tenantId
    console.log('Tenant criado:', tenantId, tenantName)
  } else {
    console.log('Usando OWNER_TENANT_ID existente:', tenantId)
  }

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email: ownerEmail,
    password: ownerPassword,
    email_confirm: true,
    app_metadata: {
      tenant_id: tenantId,
      role: 'owner',
    },
    user_metadata: {
      name: displayName,
    },
  })

  if (createErr && isDuplicateUserError(createErr.message)) {
    if (orphanTenantId) {
      await admin.from('tenants').delete().eq('id', orphanTenantId)
      console.log('Tenant órfão removido (usuário já existia):', orphanTenantId)
    }

    const existing = await findUserByEmail(admin, ownerEmail)
    if (!existing) {
      console.error('Email já cadastrado mas usuário não encontrado na listagem.')
      process.exit(1)
    }

    const { data: prof } = await admin
      .from('profiles')
      .select('tenant_id')
      .eq('id', existing.id)
      .maybeSingle()

    let effectiveTenant = prof?.tenant_id
    if (!effectiveTenant) {
      const { data: tRow, error: tErr } = await admin
        .from('tenants')
        .insert({ name: `${tenantName} (owner)`, active: true })
        .select('id')
        .single()
      if (tErr) {
        console.error('Erro ao criar tenant para usuário existente:', tErr.message)
        process.exit(1)
      }
      effectiveTenant = tRow.id
      console.log('Tenant criado para usuário existente sem profile:', effectiveTenant)
    }

    const { error: updErr } = await admin.auth.admin.updateUserById(existing.id, {
      password: ownerPassword,
      app_metadata: {
        ...existing.app_metadata,
        tenant_id: effectiveTenant,
        role: 'owner',
      },
      user_metadata: {
        ...existing.user_metadata,
        name: displayName,
      },
    })
    if (updErr) {
      console.error('Erro ao atualizar usuário:', updErr.message)
      process.exit(1)
    }

    const { error: profErr } = await admin.from('profiles').upsert(
      {
        id: existing.id,
        tenant_id: effectiveTenant,
        name: displayName,
        email: ownerEmail,
        role: 'owner',
        active: true,
      },
      { onConflict: 'id' }
    )
    if (profErr) {
      console.error('Erro ao upsert profiles:', profErr.message)
      process.exit(1)
    }

    console.log('OK: usuário existente atualizado para owner.', existing.id)
    return
  }

  if (createErr) {
    console.error('Erro ao criar usuário:', createErr.message)
    if (orphanTenantId) await admin.from('tenants').delete().eq('id', orphanTenantId)
    process.exit(1)
  }

  const userId = created.user.id
  console.log('Usuário Auth criado:', userId)

  const { error: profErr } = await admin.from('profiles').upsert(
    {
      id: userId,
      tenant_id: tenantId,
      name: displayName,
      email: ownerEmail,
      role: 'owner',
      active: true,
    },
    { onConflict: 'id' }
  )

  if (profErr) {
    console.error('Erro ao upsert profiles:', profErr.message)
    process.exit(1)
  }

  console.log('OK: owner criado. Login:', ownerEmail)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
