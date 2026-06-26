import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const env = readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [k, ...rest] = line.split('=')
  if (k && rest.length) acc[k.trim()] = rest.join('=').trim()
  return acc
}, {})

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const { data, error } = await supabase.from('notes').select('*').limit(1)
console.log('notes table:', { data, error })

// Check brane lesson 1 video access
const { data: lesson1 } = await supabase
  .from('lessons')
  .select('video_key, course_id')
  .eq('day_number', 1)
  .limit(1)
  .maybeSingle()
console.log('\nLesson 1 video_key:', lesson1)

// Check brane purchases for course
const { data: brane } = await supabase
  .from('profiles')
  .select('id')
  .eq('email', 'brane.recek@gmail.com')
  .maybeSingle()
const { data: purchases } = await supabase
  .from('purchases')
  .select('id, course_id, status')
  .eq('user_id', brane.id)
console.log('\nBrane purchases:', purchases)
