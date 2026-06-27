'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import CookieManager from '@/components/CookieManager'

export default function SiteFooter() {
  const [cookieManagerOpen, setCookieManagerOpen] = useState(false)

  return (
    <>
      <footer className="border-t border-white/10 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Image src="/logo/fincoach-logo-horizontal.svg" alt="FinCoach VIP" width={160} height={50} />
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/40">
            <Link href="/volim-svoj-novac" className="hover:text-white transition-colors">Tečaj</Link>
            <Link href="/besplatna-edukacija" className="hover:text-white transition-colors">Besplatna edukacija</Link>
            <Link href="/kontakt" className="hover:text-white transition-colors">Kontakt</Link>
            <Link href="/uvjetiposlovanja" className="hover:text-white transition-colors">Uvjeti</Link>
            <Link href="/politikaprivatnosti" className="hover:text-white transition-colors">Privatnost</Link>
            <button
              onClick={() => setCookieManagerOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Upravljanje kolačićima
            </button>
            <Link href="/prijava" className="hover:text-white transition-colors font-medium text-white/60">Prijava →</Link>
          </div>
          <p className="text-white/30 text-sm">© 2026 FinCoach VIP</p>
        </div>
      </footer>

      <CookieManager open={cookieManagerOpen} onClose={() => setCookieManagerOpen(false)} />
    </>
  )
}
