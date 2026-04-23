import { getSession } from '@/lib/session'
import { db } from '@/lib/db'

const encoder = new TextEncoder()

export async function GET() {
  const session = await getSession()

  // Check admin
  let isAdmin = session?.isAdmin ?? false
  if (!isAdmin && session) {
    const r = await db.execute({ sql: 'SELECT is_admin FROM users WHERE id = ?', args: [session.userId] })
    isAdmin = (r.rows[0] as unknown as { is_admin: number } | undefined)?.is_admin === 1
  }
  if (!session) return new Response('Unauthorized', { status: 401 })
  if (!isAdmin) return new Response('Forbidden', { status: 403 })

  let retryRef: ReturnType<typeof setInterval> | null = null
  let lastHash = ''

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        try { controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`)) } catch {}
      }

      // Send initial signal
      const count = await getPendingCount()
      send({ pendingCount: count })
      lastHash = String(count)

      retryRef = setInterval(async () => {
        try {
          const count = await getPendingCount()
          const h = String(count)
          if (h !== lastHash) {
            lastHash = h
            send({ pendingCount: count, refresh: true })
          }
        } catch {}
      }, 3000)
    },
    cancel() {
      if (retryRef) clearInterval(retryRef)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}

async function getPendingCount(): Promise<number> {
  const r = await db.execute("SELECT COUNT(*) as c FROM topups WHERE status = 'pending'")
  return Number((r.rows[0] as unknown as { c: number }).c ?? 0)
}
