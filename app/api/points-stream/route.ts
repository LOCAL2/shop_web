import { getSession } from '@/lib/session'
import { db } from '@/lib/db'

const encoder = new TextEncoder()

export async function GET() {
  const session = await getSession()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const userId = session.userId
  let interval: ReturnType<typeof setInterval> | null = null

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: object) => {
        try {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))
        } catch {}
      }

      // Initial points
      try {
        const r = await db.execute({ sql: 'SELECT points FROM users WHERE id = ?', args: [userId] })
        send('points', { points: Number(r.rows[0]?.points ?? 0) })
      } catch {}

      interval = setInterval(async () => {
        try {
          const pr = await db.execute({ sql: 'SELECT points FROM users WHERE id = ?', args: [userId] })
          send('points', { points: Number(pr.rows[0]?.points ?? 0) })
        } catch {}
      }, 3000)
    },
    cancel() {
      if (interval) clearInterval(interval)
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
