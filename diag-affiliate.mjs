import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const env = readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [k, ...rest] = line.split('=')
  if (k && rest.length) acc[k.trim()] = rest.join('=').trim()
  return acc
}, {})

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const { data: brane } = await sb.from('profiles').select('*').eq('email', 'brane.recek@gmail.com').maybeSingle()
console.log('Brane profile:', brane)

const { data: affs } = await sb.from('affiliates').select('*').eq('user_id', brane.id)
console.log('\nBrane affiliates:', affs)

// Test anon client (kar uporablja browser)
const sbAnon = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
const { data: anonAff, error: anonErr } = await sbAnon.from('affiliates').select('*').eq('user_id', brane.id).maybeSingle()
console.log('\nAnon view of brane affiliate:', { anonAff, anonErr })

// Test notes table RLS
const { data: notes, error: notesErr } = await sb.from('notes').select('*').limit(5)
console.log('\nNotes (service):', { notes, notesErr })
