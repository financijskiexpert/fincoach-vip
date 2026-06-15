import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const R2_ENDPOINT = process.env.CLOUDFLARE_R2_ENDPOINT!
const R2_ACCESS_KEY = process.env.CLOUDFLARE_R2_ACCESS_KEY!
const R2_SECRET_KEY = process.env.CLOUDFLARE_R2_SECRET_KEY!
const R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET!

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY,
    secretAccessKey: R2_SECRET_KEY,
  },
})

/**
 * Generate a signed URL for a video in Cloudflare R2 (1 hour expiry)
 */
export async function getSignedVideoUrl(videoKey: string, expiresIn = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET,
    Key: videoKey,
  })

  const signedUrl = await getSignedUrl(r2Client, command, { expiresIn })
  return signedUrl
}

/**
 * Generate a signed URL for uploading a video to R2
 */
export async function getSignedUploadUrl(videoKey: string, contentType = 'video/mp4', expiresIn = 3600): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: videoKey,
    ContentType: contentType,
  })

  const signedUrl = await getSignedUrl(r2Client, command, { expiresIn })
  return signedUrl
}

/**
 * Build the video key path for a lesson
 */
export function buildVideoKey(courseSlug: string, dayNumber: number): string {
  return `courses/${courseSlug}/day-${dayNumber}.mp4`
}
