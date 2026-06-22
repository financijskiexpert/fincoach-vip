'use server'

import { revalidatePath } from 'next/cache'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/prijava')
  const service = await createServiceClient()
  const { data: profile } = await service.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && user.email !== 'brane.recek@gmail.com') redirect('/portal')
  return service
}

export async function deleteLead(leadId: string) {
  const service = await assertAdmin()
  await service.from('email_sequence_queue').delete().eq('lead_id', leadId)
  await service.from('leads').delete().eq('id', leadId)
  revalidatePath('/admin/leadovi')
}

export async function updateLead(leadId: string, fullName: string, email: string) {
  const service = await assertAdmin()
  await service.from('leads').update({ full_name: fullName, email: email.toLowerCase().trim() }).eq('id', leadId)
  revalidatePath('/admin/leadovi')
}
