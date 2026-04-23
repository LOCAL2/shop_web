import { Suspense } from 'react'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { getUserPoints } from '@/lib/actions/topup'
import TopupClient from '@/components/store/TopupClient'

async function TopupContent() {
  const session = await getSession()
  if (!session) redirect('/login')
  const points = await getUserPoints(session.userId)
  return <TopupClient initialPoints={points} />
}

export default function TopupPage() {
  return (
    <Suspense>
      <TopupContent />
    </Suspense>
  )
}
