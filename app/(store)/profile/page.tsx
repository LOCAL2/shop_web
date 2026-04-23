import { Suspense } from 'react'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { getUserPoints } from '@/lib/actions/topup'
import ProfileClient from '@/components/store/ProfileClient'

async function ProfileContent() {
  const session = await getSession()
  if (!session) redirect('/login')
  const points = await getUserPoints(session.userId)
  return <ProfileClient username={session.username} isAdmin={session.isAdmin} points={points} />
}

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfileContent />
    </Suspense>
  )
}
