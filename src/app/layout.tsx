import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import CookieBanner from '@/components/CookieBanner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'FinCoach VIP — 90-dnevni financijski tečaj',
  description: 'Preuzmi kontrolu nad svojim financijama za 90 dana. Korak po korak, video po video.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fincoach.vip'),
  openGraph: {
    title: 'FinCoach VIP — 90-dnevni financijski tečaj',
    description: 'Preuzmi kontrolu nad svojim financijama za 90 dana.',
    url: 'https://fincoach.vip',
    siteName: 'FinCoach VIP',
    locale: 'hr_HR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinCoach VIP — 90-dnevni financijski tečaj',
    description: 'Preuzmi kontrolu nad svojim financijama za 90 dana.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="hr" className={inter.variable}>
      <body className="bg-navy text-white antialiased">
        {children}
        <CookieBanner />
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1a2f47',
              border: '1px solid #D4AF37',
              color: '#ffffff',
            },
          }}
        />
      </body>
    </html>
  )
}