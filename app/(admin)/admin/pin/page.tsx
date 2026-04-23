import { Suspense } from 'react'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import AdminPinClient from '@/components/admin/AdminPinClient'

async function PinContent() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (!session.isAdmin) redirect('/')
  return <AdminPinClient />
}

export default function AdminPinPage() {
  return (
    <Suspense>
      <PinContent />
    </Suspense>
  )
}
