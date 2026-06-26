import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const env = readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [k, ...rest] = line.split('=')
  if (k && rest.length) acc[k.trim()] = rest.join('=').trim()
  return acc
}, {})

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

// Get current GRANTs for authenticated role
const { data, error } = await sb.rpc('exec_sql', { sql: `SELECT 1` }).catch(() => ({ data: null, error: 'no exec_sql' }))
console.log('exec_sql:', { data, error })

// Try directly via raw query through PostgREST: not available in JS client
// Instead, do a simpler check - try to sign in as brane via password reset, then test
// But that's complex. Let's check via REST API direct.

// Use the REST API to query information_schema with service_role
const resp = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
  method: 'POST',
  headers: {
    'apikey': env.SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ sql: "SELECT grantee, privilege_type FROM information_schema.role_table_grants WHERE table_name = 'affiliates'" }),
})
console.log('REST exec_sql:', resp.status, await resp.text())
