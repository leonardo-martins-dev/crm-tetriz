import fs from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '..', '.env')
const text = fs.readFileSync(envPath, 'utf8')
const env = {}
for (const line of text.split('\n')) {
  const tr = line.trim()
  if (!tr || tr.startsWith('#')) continue
  const i = tr.indexOf('=')
  if (i <= 0) continue
  env[tr.slice(0, i).trim()] = tr.slice(i + 1).trim().replace(/\r$/, '')
}

const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const baseUrl = env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
const email = process.argv[2]
const password = process.argv[3]

if (!email || !password) {
  console.error('Usage: node scripts/signup-once.mjs <email> <password>')
  process.exit(1)
}

const res = await fetch(`${baseUrl}/auth/v1/signup`, {
  method: 'POST',
  headers: {
    apikey: anon,
    Authorization: `Bearer ${anon}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email,
    password,
    data: { name: 'Leonardo Martins' },
  }),
})
const body = await res.json()
console.log('signup', res.status, JSON.stringify(body))
