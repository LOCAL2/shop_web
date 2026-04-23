import { Suspense } from 'react'
import AppDetailClient from '@/components/store/AppDetailClient'

export default function AppDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: 'var(--bg)' }} />}>
      {params.then(({ id }) => (
        <AppDetailClient id={id} />
      ))}
    </Suspense>
  )
}
