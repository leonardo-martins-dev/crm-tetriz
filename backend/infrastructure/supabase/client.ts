import { createBrowserClient } from '@supabase/ssr'

/**
 * Cliente Supabase para uso no browser (client-side).
 * Herda o JWT do usuário logado → RLS ativo automaticamente.
 */
export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
