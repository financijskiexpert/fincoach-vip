import { redirect } from 'next/navigation'

// Trenutno imamo en tečaj — vse poti vodijo na njegov canonical URL.
// Ko bo več tečajev, /tecaj postane seznam tečajev.
export default function TecajRedirect({ searchParams }: { searchParams: Record<string, string> }) {
  const qs = new URLSearchParams(searchParams).toString()
  redirect(`/volim-svoj-novac${qs ? `?${qs}` : ''}`)
}
