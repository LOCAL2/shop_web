import { Suspense } from 'react'
import StoreLayoutClient from "@/components/store/StoreLayoutClient";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { SSEProvider } from "@/lib/sse-context";

async function getUserData(userId: string) {
  'use cache'
  const result = await db.execute({
    sql: 'SELECT id, points FROM users WHERE id = ?',
    args: [userId],
  })
  const row = result.rows[0]
  if (!row) return null
  return { id: String(row.id), points: Number(row.points ?? 0) }
}

async function LayoutContent({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  let username: string | null = null
  let points: number | null = null

  if (session) {
    const row = await getUserData(session.userId)
    if (row) {
      username = session.username
      points = row.points
    }
  }

  return (
    <SSEProvider initialPoints={points}>
      <StoreLayoutClient username={username} points={points}>
        {children}
      </StoreLayoutClient>
    </SSEProvider>
  )
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
        {children}
      </div>
    }>
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  )
}
