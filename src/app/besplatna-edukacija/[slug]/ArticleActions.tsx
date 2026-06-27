'use client'

import { useEffect, useState } from 'react'
import { Heart, Share2, Facebook, Twitter, Link as LinkIcon, MessageCircle } from 'lucide-react'

export default function ArticleActions({
  postId,
  postTitle,
  postUrl,
  initialLikes,
}: {
  postId: string
  postTitle: string
  postUrl: string
  initialLikes: number
}) {
  const [likes, setLikes] = useState(initialLikes)
  const [liked, setLiked] = useState(false)
  const [pending, setPending] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]')
    setLiked(likedPosts.includes(postId))
  }, [postId])

  async function toggleLike() {
    if (pending) return
    setPending(true)
    const newLiked = !liked
    try {
      const res = await fetch('/api/blog/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, action: newLiked ? 'like' : 'unlike' }),
      })
      const data = await res.json()
      if (data.ok) {
        setLikes(data.like_count)
        setLiked(newLiked)
        const stored = JSON.parse(localStorage.getItem('liked_posts') || '[]')
        const updated = newLiked ? [...stored, postId] : stored.filter((id: string) => id !== postId)
        localStorage.setItem('liked_posts', JSON.stringify(updated))
      }
    } catch {
      // silent
    } finally {
      setPending(false)
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(postUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const encodedUrl = encodeURIComponent(postUrl)
  const encodedTitle = encodeURIComponent(postTitle)

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  }

  return (
    <div
      className="flex items-center justify-between flex-wrap gap-4 my-10 py-6 px-6 rounded-xl"
      style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.15)' }}
    >
      <button
        onClick={toggleLike}
        disabled={pending}
        className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
        style={{
          backgroundColor: liked ? 'rgba(244,63,94,0.15)' : 'rgba(255,255,255,0.06)',
          border: `1px solid ${liked ? 'rgba(244,63,94,0.4)' : 'rgba(255,255,255,0.1)'}`,
        }}
      >
        <Heart className="w-5 h-5" fill={liked ? '#f43f5e' : 'none'} stroke={liked ? '#f43f5e' : 'currentColor'} />
        <span className="text-sm font-semibold" style={{ color: liked ? '#f43f5e' : '#fff' }}>
          {likes} {liked ? 'sviđa ti se' : 'sviđa mi se'}
        </span>
      </button>

      <div className="flex items-center gap-2">
        <span className="text-sm mr-1 opacity-60 hidden sm:inline">
          <Share2 className="w-4 h-4 inline mr-1" />Podijeli:
        </span>
        <a href={shareUrls.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
          className="w-9 h-9 rounded-lg flex items-center justify-center hover:opacity-80"
          style={{ backgroundColor: 'rgba(59,89,152,0.2)', color: '#3b5998' }}>
          <Facebook className="w-4 h-4" />
        </a>
        <a href={shareUrls.twitter} target="_blank" rel="noopener noreferrer" aria-label="X"
          className="w-9 h-9 rounded-lg flex items-center justify-center hover:opacity-80"
          style={{ backgroundColor: 'rgba(29,161,242,0.2)', color: '#1da1f2' }}>
          <Twitter className="w-4 h-4" />
        </a>
        <a href={shareUrls.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
          className="w-9 h-9 rounded-lg flex items-center justify-center hover:opacity-80"
          style={{ backgroundColor: 'rgba(37,211,102,0.2)', color: '#25D366' }}>
          <MessageCircle className="w-4 h-4" />
        </a>
        <button onClick={copyLink} aria-label="Kopiraj link"
          className="w-9 h-9 rounded-lg flex items-center justify-center hover:opacity-80"
          style={{ backgroundColor: 'rgba(212,175,55,0.2)', color: '#D4AF37' }}>
          <LinkIcon className="w-4 h-4" />
        </button>
        {copied && <span className="text-xs ml-1" style={{ color: '#D4AF37' }}>Kopirano!</span>}
      </div>
    </div>
  )
}
