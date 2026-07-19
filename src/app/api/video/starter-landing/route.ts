import { S3Client, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { NextRequest, NextResponse } from 'next/server'

const r2 = new S3Client({
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY!,
  },
})

const BUCKET = process.env.CLOUDFLARE_R2_BUCKET ?? 'fincoach-videos'
const KEY = 'starter-paket-landing.mp4'

export async function GET(request: NextRequest) {
  const range = request.headers.get('range')

  const cmdParams: ConstructorParameters<typeof GetObjectCommand>[0] = {
    Bucket: BUCKET,
    Key: KEY,
    ...(range ? { Range: range } : {}),
  }

  try {
    const res = await r2.send(new GetObjectCommand(cmdParams))
    const stream = res.Body as ReadableStream

    const headers: Record<string, string> = {
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=3600',
    }
    if (res.ContentLength) headers['Content-Length'] = String(res.ContentLength)
    if (res.ContentRange)  headers['Content-Range']  = res.ContentRange

    return new NextResponse(stream, {
      status: range ? 206 : 200,
      headers,
    })
  } catch {
    return new NextResponse('Video not found', { status: 404 })
  }
}

export async function HEAD(request: NextRequest) {
  try {
    const res = await r2.send(new HeadObjectCommand({ Bucket: BUCKET, Key: KEY }))
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': String(res.ContentLength ?? 0),
        'Accept-Ranges': 'bytes',
      },
    })
  } catch {
    return new NextResponse(null, { status: 404 })
  }
}
