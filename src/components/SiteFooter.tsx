import Link from 'next/link'
import Image from 'next/image'

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Image src="/logo/fincoach-logo-horizontal.svg" alt="FinCoach VIP" width={160} height={50} />
        <div className="flex flex-wrap justify-center gap-6 text-sm text-white/40">
          <Link href="/tecaj" className="hover:text-white transition-colors">Tečaj</Link>
          <Link href="/uvjetiposlovanja" className="hover:text-white transition-colors">Uvjeti</Link>
          <Link href="/politikaprivatnosti" className="hover:text-white transition-colors">Privatnost</Link>
          <Link href="/odjava" className="hover:text-white transition-colors">Odjava od emailova</Link>
          <Link href="/prijava" className="hover:text-white transition-colors font-medium text-white/60">Prijava →</Link>
        </div>
        <p className="text-white/30 text-sm">© 2026 FinCoach VIP</p>
      </div>
    </footer>
  )
}
