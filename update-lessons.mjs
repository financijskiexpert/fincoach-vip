import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const env = readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [k, ...rest] = line.split('=')
  if (k && rest.length) acc[k.trim()] = rest.join('=').trim()
  return acc
}, {})

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
const raw = readFileSync('descriptions.json', 'utf8').replace(/^﻿/, '')
const descriptions = JSON.parse(raw)

const { data: course } = await supabase.from('courses').select('id').eq('slug', 'volim-svojnovac').single()
if (!course) { console.error('No course'); process.exit(1) }

let updated = 0
for (let day = 1; day <= 90; day++) {
  const video_key = `courses/volim-svojnovac/day-${day}.mp4`
  const description = descriptions[String(day)] ?? null
  const { error } = await supabase
    .from('lessons')
    .update({ video_key, description })
    .eq('course_id', course.id)
    .eq('day_number', day)
  if (error) {
    console.error(`Day ${day} error:`, error.message)
  } else {
    updated++
  }
}

console.log(`Updated ${updated}/90 lessons.`)

// Verify
const { data: sample } = await supabase
  .from('lessons')
  .select('day_number, title, video_key, description')
  .eq('course_id', course.id)
  .in('day_number', [1, 30, 60, 90])
  .order('day_number')
console.log('\nSample:')
for (const l of sample ?? []) {
  console.log(`Day ${l.day_number}: ${l.title}`)
  console.log(`  video_key: ${l.video_key}`)
  console.log(`  description: ${l.description?.slice(0, 80)}...`)
}
