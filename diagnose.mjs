import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const env = readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [k, ...rest] = line.split('=')
  if (k && rest.length) acc[k.trim()] = rest.join('=').trim()
  return acc
}, {})

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

console.log('=== COURSES ===')
const { data: courses, error: cErr } = await supabase.from('courses').select('*')
if (cErr) console.error('courses error:', cErr)
else console.log(JSON.stringify(courses, null, 2))

console.log('\n=== LESSONS count by course ===')
const { data: lessons, error: lErr } = await supabase.from('lessons').select('course_id, day_number, title, section').order('day_number')
if (lErr) console.error('lessons error:', lErr)
else {
  console.log('Total lessons:', lessons.length)
  const byCourse = {}
  for (const l of lessons) {
    byCourse[l.course_id] = (byCourse[l.course_id] || 0) + 1
  }
  console.log('By course_id:', byCourse)
  console.log('First 3:', lessons.slice(0, 3))
  console.log('Last 3:', lessons.slice(-3))
}

console.log('\n=== AFFILIATES ===')
const { data: affs, error: aErr } = await supabase.from('affiliates').select('*')
if (aErr) console.error('affiliates error:', aErr)
else console.log(JSON.stringify(affs, null, 2))

console.log('\n=== PROFILES (brane) ===')
const { data: profs, error: pErr } = await supabase.from('profiles').select('*').eq('email', 'brane.recek@gmail.com')
if (pErr) console.error('profiles error:', pErr)
else console.log(JSON.stringify(profs, null, 2))

console.log('\n=== PURCHASES (brane) ===')
const branId = profs?.[0]?.id
if (branId) {
  const { data: purch, error: purErr } = await supabase.from('purchases').select('*').eq('user_id', branId)
  if (purErr) console.error('purchases error:', purErr)
  else console.log(JSON.stringify(purch, null, 2))
}

console.log('\n=== LESSONS table columns (sample row) ===')
const { data: oneL } = await supabase.from('lessons').select('*').limit(1)
console.log(oneL?.[0] ? Object.keys(oneL[0]) : 'no lessons')

console.log('\n=== AFFILIATES table columns (try insert dry) ===')
const { data: oneA } = await supabase.from('affiliates').select('*').limit(1)
console.log(oneA?.[0] ? Object.keys(oneA[0]) : 'no affiliates')
