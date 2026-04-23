import { Suspense } from 'react'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { getUserTopups } from '@/lib/actions/topup'
import TopupHistoryClient from '@/components/store/TopupHistoryClient'

async function HistoryContent() {
  const session = await getSession()
  if (!session) redirect('/login')
  const history = await getUserTopups(session.userId)
  return <TopupHistoryClient history={history} />
}

export default function TopupHistoryPage() {
  return (
    <Suspense>
      <HistoryContent />
    </Suspense>
  )
}
