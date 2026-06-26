import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const env = readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [k, ...rest] = line.split('=')
  if (k && rest.length) acc[k.trim()] = rest.join('=').trim()
  return acc
}, {})

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

// Brane email → profile id
const { data: brane } = await supabase
  .from('profiles').select('id').eq('email', 'brane.recek@gmail.com').maybeSingle()

const { data: purchases } = await supabase
  .from('purchases').select('id, course_id').eq('user_id', brane.id).order('purchased_at', { ascending: true })

console.log(`Brane ima ${purchases.length} purchases.`)

// Pustimo najstarejši nakup, ostale izbrišemo
if (purchases.length > 1) {
  const toDelete = purchases.slice(1).map(p => p.id)
  const { error } = await supabase.from('purchases').delete().in('id', toDelete)
  console.log(`Izbrisano ${toDelete.length} duplikatov:`, error ? error : 'OK')
}

const { data: after } = await supabase
  .from('purchases').select('id').eq('user_id', brane.id)
console.log(`Po čiščenju: ${after.length} purchase.`)
