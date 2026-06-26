import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { readFileSync } from 'fs'

const env = readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [k, ...rest] = line.split('=')
  if (k && rest.length) acc[k.trim()] = rest.join('=').trim()
  return acc
}, {})

const s3 = new S3Client({
  region: 'auto',
  endpoint: env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY,
    secretAccessKey: env.CLOUDFLARE_R2_SECRET_KEY,
  },
})

let token
let all = []
do {
  const r = await s3.send(new ListObjectsV2Command({
    Bucket: env.CLOUDFLARE_R2_BUCKET,
    ContinuationToken: token,
  }))
  all.push(...(r.Contents ?? []))
  token = r.NextContinuationToken
} while (token)

console.log(`Total objects: ${all.length}`)
for (const obj of all) {
  console.log(`${obj.Key} (${Math.round(obj.Size / 1024 / 1024)} MB)`)
}
