'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

// ─── Tab helpers ──────────────────────────────────────────────────────────────

const TABS = [
  'Proračun',
  'Hitni fond',
  'Otplata duga',
  'Složena kamata',
]

// ─── Calculator 1: Proračun ───────────────────────────────────────────────────

const DEFAULT_EXPENSES = [
  { label: 'Stan / stanarina', amount: 500 },
  { label: 'Hrana', amount: 300 },
  { label: 'Prijevoz', amount: 150 },
  { label: 'Odjeća', amount: 100 },
  { label: 'Zabava', amount: 100 },
  { label: 'Zdravlje', amount: 80 },
  { label: 'Ostalo', amount: 70 },
]

function ProracunCalc() {
  const [income, setIncome] = useState(2000)
  const [expenses, setExpenses] = useState(DEFAULT_EXPENSES)

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const remaining = income - totalExpenses
  const remainingPct = income > 0 ? (remaining / income) * 100 : 0

  return (
    <div className="space-y-6">
      <p className="text-white/50 text-sm">Koristi ovaj kalkulator uz Dan 36–38 programa.</p>

      <div>
        <label className="block text-sm text-white/60 mb-1">Ukupni prihod (€/mj.)</label>
        <input
          type="number"
          value={income}
          onChange={e => setIncome(Math.max(0, Number(e.target.value)))}
          className="w-full max-w-xs bg-navy border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/40"
        />
      </div>

      <div className="space-y-3">
        {expenses.map((exp, i) => {
          const pct = income > 0 ? Math.min((exp.amount / income) * 100, 100) : 0
          return (
            <div key={exp.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white/70">{exp.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/40">{income > 0 ? pct.toFixed(1) : 0}%</span>
                  <input
                    type="number"
                    value={exp.amount}
                    onChange={e => {
                      const next = [...expenses]
                      next[i] = { ...next[i], amount: Math.max(0, Number(e.target.value)) }
                      setExpenses(next)
                    }}
                    className="w-24 bg-navy border border-white/10 rounded-lg px-2 py-1 text-white text-sm text-right focus:outline-none focus:border-gold/40"
                  />
                  <span className="text-xs text-white/40 w-3">€</span>
                </div>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold/70 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className={`border rounded-xl p-5 ${remaining >= 0 ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/40 mb-1">Ostatak na kraju mjeseca</p>
            <p className={`text-3xl font-black ${remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {remaining >= 0 ? '+' : ''}{remaining.toFixed(0)} €
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/40 mb-1">Ukupni troškovi</p>
            <p className="text-lg font-bold text-white">{totalExpenses.toFixed(0)} €</p>
            <p className="text-xs text-white/40">{income > 0 ? ((totalExpenses / income) * 100).toFixed(1) : 0}% prihoda</p>
          </div>
        </div>
        {remaining < 0 && (
          <p className="text-red-400/70 text-xs mt-3">Troškovi premašuju prihode. Provjeri kategorije!</p>
        )}
      </div>
    </div>
  )
}

// ─── Calculator 2: Hitni fond ─────────────────────────────────────────────────

function HitniFondCalc() {
  const [monthly, setMonthly] = useState(1500)
  const [savings, setSavings] = useState(500)
  const [contribution, setContribution] = useState(200)

  const goal3 = monthly * 3
  const goal6 = monthly * 6
  const pct3 = Math.min((savings / goal3) * 100, 100)
  const pct6 = Math.min((savings / goal6) * 100, 100)
  const needed3 = Math.max(0, goal3 - savings)
  const needed6 = Math.max(0, goal6 - savings)
  const months3 = contribution > 0 ? Math.ceil(needed3 / contribution) : null
  const months6 = contribution > 0 ? Math.ceil(needed6 / contribution) : null

  return (
    <div className="space-y-6">
      <p className="text-white/50 text-sm">Koristi uz Dan 39, 52 i 54 programa.</p>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Mesečni troškovi (€)', val: monthly, set: setMonthly },
          { label: 'Trenutne uštedine (€)', val: savings, set: setSavings },
          { label: 'Mesečna uštedina (€)', val: contribution, set: setContribution },
        ].map(f => (
          <div key={f.label}>
            <label className="block text-sm text-white/60 mb-1">{f.label}</label>
            <input
              type="number"
              value={f.val}
              onChange={e => f.set(Math.max(0, Number(e.target.value)))}
              className="w-full bg-navy border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/40"
            />
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { label: 'Cilj 3×', goal: goal3, pct: pct3, months: months3 },
          { label: 'Cilj 6×', goal: goal6, pct: pct6, months: months6 },
        ].map(g => (
          <div key={g.label} className="bg-navy border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-white">{g.label} Hitni fond</span>
              <span className="text-gold font-bold">{g.goal.toFixed(0)} €</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gold rounded-full transition-all"
                style={{ width: `${g.pct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-white/40">
              <span>{g.pct.toFixed(0)}% dostignuto</span>
              <span>{savings.toFixed(0)} € / {g.goal.toFixed(0)} €</span>
            </div>
            {g.pct < 100 && (
              <p className="text-xs text-white/50 mt-2">
                {g.months !== null
                  ? `Još ${g.months} mj. uz ${contribution} €/mj. uštedine`
                  : 'Unesi mesečnu uštedinu'}
              </p>
            )}
            {g.pct >= 100 && (
              <p className="text-xs text-green-400 mt-2">Cilj dostignut!</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Calculator 3: Otplata duga ───────────────────────────────────────────────

interface Debt {
  id: number
  name: string
  balance: number
  rate: number
  minPayment: number
}

interface PayoffResult {
  name: string
  months: number
  interest: number
  order: number
}

function simulatePayoff(debts: Debt[], extra: number, avalanche: boolean): { months: number; totalInterest: number; results: PayoffResult[] } {
  if (debts.length === 0 || debts.every(d => d.balance <= 0)) {
    return { months: 0, totalInterest: 0, results: [] }
  }

  // deep copy
  let remaining = debts.map(d => ({ ...d, balance: d.balance }))
  const results: PayoffResult[] = remaining.map(d => ({ name: d.name, months: 0, interest: 0, order: 0 }))
  let month = 0
  let totalInterest = 0
  let orderCount = 0

  while (remaining.some(d => d.balance > 0) && month < 1200) {
    month++

    // accrue interest
    remaining.forEach((d, i) => {
      if (d.balance <= 0) return
      const interest = (d.balance * d.rate) / 100 / 12
      d.balance += interest
      results[i].interest += interest
      totalInterest += interest
    })

    // pay minimums
    remaining.forEach(d => {
      if (d.balance <= 0) return
      const pay = Math.min(d.minPayment, d.balance)
      d.balance = Math.max(0, d.balance - pay)
    })

    // apply extra to target debt
    const active = remaining
      .map((d, i) => ({ ...d, origIdx: i }))
      .filter(d => d.balance > 0)

    if (active.length > 0) {
      let target: typeof active[0]
      if (avalanche) {
        target = active.reduce((a, b) => b.rate > a.rate ? b : a)
      } else {
        target = active.reduce((a, b) => b.balance < a.balance ? b : a)
      }
      const pay = Math.min(extra, remaining[target.origIdx].balance)
      remaining[target.origIdx].balance = Math.max(0, remaining[target.origIdx].balance - pay)
    }

    // mark paid off debts
    remaining.forEach((d, i) => {
      if (d.balance <= 0.01 && results[i].months === 0) {
        results[i].months = month
        results[i].order = ++orderCount
        d.balance = 0
      }
    })
  }

  return { months: month, totalInterest, results }
}

function OtplataDugaCalc() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: 1, name: 'Kreditna kartica', balance: 2000, rate: 18, minPayment: 60 },
    { id: 2, name: 'Kredit za auto', balance: 8000, rate: 6, minPayment: 200 },
  ])
  const [extra, setExtra] = useState(100)
  const [strategy, setStrategy] = useState<'snowball' | 'avalanche'>('snowball')
  const [nextId, setNextId] = useState(3)

  const addDebt = () => {
    setDebts(prev => [...prev, { id: nextId, name: 'Novi dug', balance: 1000, rate: 10, minPayment: 50 }])
    setNextId(n => n + 1)
  }

  const removeDebt = (id: number) => setDebts(prev => prev.filter(d => d.id !== id))

  const updateDebt = (id: number, field: keyof Debt, val: string | number) => {
    setDebts(prev => prev.map(d => d.id === id ? { ...d, [field]: val } : d))
  }

  const result = simulatePayoff(debts, extra, strategy === 'avalanche')

  return (
    <div className="space-y-6">
      <p className="text-white/50 text-sm">Koristi uz Dan 29 i 42 programa.</p>

      {/* Debts list */}
      <div className="space-y-3">
        {debts.map(debt => (
          <div key={debt.id} className="bg-navy border border-white/10 rounded-xl p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs text-white/40 mb-1">Naziv</label>
                <input
                  value={debt.name}
                  onChange={e => updateDebt(debt.id, 'name', e.target.value)}
                  className="w-full bg-navy-50 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-gold/40"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">Saldo (€)</label>
                <input
                  type="number"
                  value={debt.balance}
                  onChange={e => updateDebt(debt.id, 'balance', Math.max(0, Number(e.target.value)))}
                  className="w-full bg-navy-50 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-gold/40"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">Kamata (%)</label>
                <input
                  type="number"
                  value={debt.rate}
                  onChange={e => updateDebt(debt.id, 'rate', Math.max(0, Number(e.target.value)))}
                  className="w-full bg-navy-50 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-gold/40"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">Min. rata (€)</label>
                <input
                  type="number"
                  value={debt.minPayment}
                  onChange={e => updateDebt(debt.id, 'minPayment', Math.max(0, Number(e.target.value)))}
                  className="w-full bg-navy-50 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-gold/40"
                />
              </div>
            </div>
            <button
              onClick={() => removeDebt(debt.id)}
              className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
            >
              Ukloni dug
            </button>
          </div>
        ))}
        <button
          onClick={addDebt}
          className="w-full border border-dashed border-white/20 rounded-xl py-3 text-sm text-white/40 hover:text-white/70 hover:border-white/40 transition-colors"
        >
          + Dodaj dug
        </button>
      </div>

      {/* Extra + strategy */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-1">Dodatno plaćanje (€/mj.)</label>
          <input
            type="number"
            value={extra}
            onChange={e => setExtra(Math.max(0, Number(e.target.value)))}
            className="w-full bg-navy border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/40"
          />
        </div>
        <div>
          <p className="text-sm text-white/60 mb-2">Strategija otplate</p>
          <div className="space-y-2">
            {[
              { val: 'snowball', label: 'Snježna gruda (najmanji dug prvi)' },
              { val: 'avalanche', label: 'Lavina (najveća kamata prva)' },
            ].map(s => (
              <label key={s.val} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="strategy"
                  value={s.val}
                  checked={strategy === s.val}
                  onChange={() => setStrategy(s.val as 'snowball' | 'avalanche')}
                  className="accent-gold"
                />
                <span className="text-sm text-white/70">{s.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {debts.length > 0 && (
        <div className="bg-navy border border-gold/20 rounded-xl p-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-xs text-white/40 mb-1">Bez duga za</p>
              <p className="text-3xl font-black text-gold">
                {result.months >= 1200 ? '100+ god.' : result.months < 12
                  ? `${result.months} mj.`
                  : `${Math.floor(result.months / 12)} god. ${result.months % 12} mj.`}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-white/40 mb-1">Ukupna kamata</p>
              <p className="text-3xl font-black text-red-400">{result.totalInterest.toFixed(0)} €</p>
            </div>
          </div>

          {result.results.length > 0 && (
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Redoslijed otplate</p>
              <div className="space-y-1.5">
                {result.results
                  .sort((a, b) => a.order - b.order)
                  .map(r => (
                    <div key={r.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-xs text-gold font-bold">
                          {r.order}
                        </div>
                        <span className="text-white/70">{r.name}</span>
                      </div>
                      <span className="text-white/40 text-xs">
                        {r.months} mj. · +{r.interest.toFixed(0)} € kamata
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Calculator 4: Složena kamata ─────────────────────────────────────────────

function SlozenaKamataCalc() {
  const [principal, setPrincipal] = useState(1000)
  const [monthly, setMonthly] = useState(200)
  const [rate, setRate] = useState(7)
  const [years, setYears] = useState(20)

  // Compute data points at 5-year intervals up to selected years
  const milestones = [5, 10, 15, 20, 25, 30, 35, 40].filter(y => y <= years)
  if (milestones[milestones.length - 1] !== years) milestones.push(years)

  const compute = useCallback((y: number) => {
    const r = rate / 100 / 12
    const n = y * 12
    let total: number
    if (r === 0) {
      total = principal + monthly * n
    } else {
      total = principal * Math.pow(1 + r, n) + monthly * ((Math.pow(1 + r, n) - 1) / r)
    }
    const contributed = principal + monthly * n
    const interest = total - contributed
    return { total, contributed, interest }
  }, [principal, monthly, rate])

  const final = compute(years)
  const dataPoints = milestones.map(y => ({ y, ...compute(y) }))
  const maxTotal = Math.max(...dataPoints.map(d => d.total), 1)
  const chartHeight = 180

  return (
    <div className="space-y-6">
      <p className="text-white/50 text-sm">Koristi uz Dan 74 i 80 programa.</p>
      <p className="text-gold/60 text-xs italic">"Einstein je ovo nazvao 8. čudom svijeta."</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Početni iznos (€)', val: principal, set: setPrincipal, min: 0 },
          { label: 'Mesečni doprinos (€)', val: monthly, set: setMonthly, min: 0 },
          { label: 'Godišnji prinos (%)', val: rate, set: setRate, min: 0 },
        ].map(f => (
          <div key={f.label}>
            <label className="block text-sm text-white/60 mb-1">{f.label}</label>
            <input
              type="number"
              value={f.val}
              onChange={e => f.set(Math.max(f.min, Number(e.target.value)))}
              className="w-full bg-navy border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/40"
            />
          </div>
        ))}
        <div>
          <label className="block text-sm text-white/60 mb-1">Broj godina: <span className="text-gold font-bold">{years}</span></label>
          <input
            type="range"
            min={1}
            max={40}
            value={years}
            onChange={e => setYears(Number(e.target.value))}
            className="w-full accent-gold mt-2"
          />
          <div className="flex justify-between text-xs text-white/20 mt-0.5">
            <span>1</span><span>40</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-navy border border-gold/30 rounded-xl p-5 text-center sm:col-span-1">
          <p className="text-xs text-white/40 mb-1">Ukupno nakon {years} god.</p>
          <p className="text-4xl font-black text-gold leading-tight">
            {final.total >= 1_000_000
              ? `${(final.total / 1_000_000).toFixed(2)}M`
              : final.total >= 1000
                ? `${(final.total / 1000).toFixed(1)}k`
                : final.total.toFixed(0)} €
          </p>
        </div>
        <div className="bg-navy border border-white/10 rounded-xl p-5 text-center">
          <p className="text-xs text-white/40 mb-1">Ukupno uloženo</p>
          <p className="text-2xl font-bold text-white">{final.contributed.toFixed(0)} €</p>
        </div>
        <div className="bg-navy border border-white/10 rounded-xl p-5 text-center">
          <p className="text-xs text-white/40 mb-1">Zarada od kamate</p>
          <p className="text-2xl font-bold text-green-400">{final.interest.toFixed(0)} €</p>
        </div>
      </div>

      {/* SVG bar chart */}
      <div className="bg-navy border border-white/10 rounded-xl p-5">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-4">Rast kroz godine</p>
        <svg
          viewBox={`0 0 ${dataPoints.length * 60 + 20} ${chartHeight + 40}`}
          className="w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {dataPoints.map((d, i) => {
            const barW = 38
            const gap = 60
            const x = i * gap + 11
            const totalH = (d.total / maxTotal) * chartHeight
            const contribH = (d.contributed / maxTotal) * chartHeight
            const interestH = totalH - contribH
            const barY = chartHeight - totalH

            return (
              <g key={d.y}>
                {/* interest (gold, top) */}
                <rect
                  x={x}
                  y={barY}
                  width={barW}
                  height={interestH}
                  rx={3}
                  fill="#D4AF37"
                  fillOpacity={0.8}
                />
                {/* contributions (navy lighter, bottom) */}
                <rect
                  x={x}
                  y={barY + interestH}
                  width={barW}
                  height={contribH}
                  rx={3}
                  fill="#1a3355"
                />
                {/* year label */}
                <text
                  x={x + barW / 2}
                  y={chartHeight + 16}
                  textAnchor="middle"
                  fontSize={9}
                  fill="rgba(255,255,255,0.3)"
                >
                  {d.y}g
                </text>
                {/* total label */}
                {totalH > 20 && (
                  <text
                    x={x + barW / 2}
                    y={barY - 4}
                    textAnchor="middle"
                    fontSize={8}
                    fill="#D4AF37"
                    fillOpacity={0.7}
                  >
                    {d.total >= 1000 ? `${(d.total / 1000).toFixed(0)}k` : d.total.toFixed(0)}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
        <div className="flex items-center gap-4 mt-1">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-[#1a3355]" />
            <span className="text-xs text-white/40">Uloženo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-gold/80" />
            <span className="text-xs text-white/40">Kamata</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function KalkulatoriPage() {
  const searchParams = useSearchParams()
  const tabParam = parseInt(searchParams.get('tab') ?? '0', 10)
  const initialTab = isNaN(tabParam) || tabParam < 0 || tabParam >= TABS.length ? 0 : tabParam
  const [activeTab, setActiveTab] = useState(initialTab)

  useEffect(() => {
    const t = parseInt(searchParams.get('tab') ?? '0', 10)
    if (!isNaN(t) && t >= 0 && t < TABS.length) setActiveTab(t)
  }, [searchParams])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-white/40 mb-6">
        <Link href="/portal" className="hover:text-white transition-colors">Dashboard</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-white/70">Financijski kalkulatori</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Financijski kalkulatori</h1>
        <p className="text-white/50">Interaktivni alati koji ti pomažu primijeniti lekcije u praksi.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === i
                ? 'bg-gold text-navy font-bold'
                : 'bg-navy border border-white/10 text-white/60 hover:text-white hover:border-white/30'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Calculator cards */}
      <div className="bg-navy-50 border border-white/10 rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-bold text-white mb-6">
          {activeTab === 0 && 'Kalkulator proračuna'}
          {activeTab === 1 && 'Kalkulator hitnog fonda'}
          {activeTab === 2 && 'Kalkulator otplate duga'}
          {activeTab === 3 && 'Kalkulator složene kamate'}
        </h2>
        {activeTab === 0 && <ProracunCalc />}
        {activeTab === 1 && <HitniFondCalc />}
        {activeTab === 2 && <OtplataDugaCalc />}
        {activeTab === 3 && <SlozenaKamataCalc />}
      </div>
    </div>
  )
}
