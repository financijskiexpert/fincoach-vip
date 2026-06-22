'use client'

import { Trash2 } from 'lucide-react'
import { deleteLead } from './actions'
import { useTransition } from 'react'

export function DeleteLeadButton({ leadId, email }: { leadId: string; email: string }) {
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm(`Obriši lead ${email}?\n\nOvo briše i cijelu email sekvencu za ovog leada.`)) return
    startTransition(() => deleteLead(leadId))
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="flex items-center gap-1.5 px-3 py-2 text-xs text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50"
    >
      <Trash2 className="w-3.5 h-3.5" />
      {pending ? 'Brišem...' : 'Obriši'}
    </button>
  )
}
