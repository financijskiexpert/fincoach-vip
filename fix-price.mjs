import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const env = readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [k, ...rest] = line.split('=')
  if (k && rest.length) acc[k.trim()] = rest.join('=').trim()
  return acc
}, {})

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

// Po dogovoru:
// price_regular = 39700 (€397) — redna cijena, default
// price_launch  = 9700  (€97)  — 24h countdown za leade z aktivnim PDF download
const { data, error } = await supabase
  .from('courses')
  .update({ price_regular: 39700, price_launch: 9700 })
  .eq('slug', 'volim-svojnovac')
  .select('slug, price_regular, price_launch')

console.log(JSON.stringify({ data, error }, null, 2))

// Verify PRILIKA kupon (50% off → €197)
const { data: coupon } = await supabase
  .from('coupons')
  .select('*')
  .eq('code', 'PRILIKA')
  .maybeSingle()
console.log('\nPRILIKA coupon:', coupon)
