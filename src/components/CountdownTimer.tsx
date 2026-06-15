'use client'

import { useEffect, useState } from 'react'

interface CountdownTimerProps {
  expiresAt: string // ISO date string
  onExpired?: () => void
  className?: string
  inline?: boolean
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(expiresAt: string): TimeLeft | null {
  const difference = new Date(expiresAt).getTime() - Date.now()

  if (difference <= 0) return null

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

export default function CountdownTimer({ expiresAt, onExpired, className, inline }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => calculateTimeLeft(expiresAt))

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft(expiresAt)
      setTimeLeft(remaining)
      if (!remaining) {
        clearInterval(timer)
        onExpired?.()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [expiresAt, onExpired])

  if (!timeLeft) {
    if (inline) return <span className="text-gold font-mono">isteklo</span>
    return (
      <div className={className}>
        <p className="text-center text-white/60 text-sm">Posebna cijena je istekla.</p>
      </div>
    )
  }

  const units = [
    { label: 'DANA', value: timeLeft.days },
    { label: 'SATI', value: timeLeft.hours },
    { label: 'MINUTA', value: timeLeft.minutes },
    { label: 'SEKUNDI', value: timeLeft.seconds },
  ]

  if (inline) {
    return (
      <span className="text-gold font-mono font-bold">
        {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
      </span>
    )
  }

  return (
    <div className={className}>
      <p className="text-center text-white/70 text-sm mb-4 uppercase tracking-widest">
        Posebna cijena ističe za:
      </p>
      <div className="flex items-center justify-center gap-3">
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <div className="bg-navy-50 border border-gold/30 rounded-lg px-4 py-3 min-w-[70px] text-center">
                <span className="text-3xl font-bold text-gold tabular-nums">{pad(unit.value)}</span>
              </div>
              <span className="text-xs text-white/40 mt-1.5 tracking-widest">{unit.label}</span>
            </div>
            {i < units.length - 1 && (
              <span className="text-2xl text-gold/50 font-bold mb-4">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
