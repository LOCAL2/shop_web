import { getSession } from '@/lib/session'
import { db } from '@/lib/db'

export async function POST() {
  const session = await getSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  await db.execute({
    sql: 'UPDATE notifications SET read = 1 WHERE user_id = ? AND read = 0',
    args: [session.userId],
  })

  return Response.json({ ok: true })
}
