import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextResponse } from 'next/server'

const r2 = new S3Client({
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY!,
  },
})

async function handler() {
  const command = new GetObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET ?? 'fincoach-videos',
    Key: 'starter-paket-landing.mp4',
  })
  const url = await getSignedUrl(r2, command, { expiresIn: 86400 }) // 24h
  return NextResponse.redirect(url, 302)
}

export const GET = handler
export const HEAD = handler
