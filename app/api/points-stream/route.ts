import { getSession } from '@/lib/session'
import { db } from '@/lib/db'

const encoder = new TextEncoder()

export async function GET() {
  const session = await getSession()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const userId = session.userId
  let interval: ReturnType<typeof setInterval> | null = null
  const sentIds = new Set<string>() // track ที่ส่งไปแล้วใน session นี้

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

      // Load unread notifications ที่มีอยู่แล้วตอน connect
      try {
        const existing = await db.execute({
          sql: 'SELECT id, message FROM notifications WHERE user_id = ? AND read = 0 ORDER BY created_at ASC',
          args: [userId],
        })
        for (const row of existing.rows) {
          const id = String(row.id)
          send('notification', { id, message: String(row.message) })
          sentIds.add(id)
        }
      } catch {}

      interval = setInterval(async () => {
        try {
          // Poll points
          const pr = await db.execute({ sql: 'SELECT points FROM users WHERE id = ?', args: [userId] })
          send('points', { points: Number(pr.rows[0]?.points ?? 0) })

          // Poll new unread notifications — ส่งเฉพาะที่ยังไม่เคยส่งใน session นี้
          const nr = await db.execute({
            sql: 'SELECT id, message FROM notifications WHERE user_id = ? AND read = 0 ORDER BY created_at ASC',
            args: [userId],
          })
          for (const row of nr.rows) {
            const id = String(row.id)
            if (!sentIds.has(id)) {
              send('notification', { id, message: String(row.message) })
              sentIds.add(id)
            }
          }
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
