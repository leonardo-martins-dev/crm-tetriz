import { createClient } from '@supabase/supabase-js'

/**
 * Cliente Supabase com service_role (bypassa RLS).
 * Usar APENAS em API routes server-side para operações administrativas.
 *
 * ⚠️ NUNCA expor este client no browser.
 */
export function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
