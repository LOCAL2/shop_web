'use server'

import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'

export async function approveTopup(topupId: string) {
  const session = await getSession()
  if (!session?.isAdmin) throw new Error('Unauthorized')

  const result = await db.execute({
    sql: 'SELECT * FROM topups WHERE id = ? AND status = ?',
    args: [topupId, 'pending'],
  })
  const topup = result.rows[0] as unknown as { id: string; user_id: string; amount: number } | undefined
  if (!topup) throw new Error('ไม่พบรายการ')

  await db.execute({
    sql: 'UPDATE users SET points = points + ? WHERE id = ?',
    args: [Math.floor(topup.amount), topup.user_id],
  })
  await db.execute({
    sql: "UPDATE topups SET status = 'approved' WHERE id = ?",
    args: [topupId],
  })

  revalidatePath('/admin/topups')
}

export async function rejectTopup(topupId: string, note: string) {
  const session = await getSession()
  if (!session?.isAdmin) throw new Error('Unauthorized')

  const result = await db.execute({
    sql: 'SELECT user_id, amount FROM topups WHERE id = ?',
    args: [topupId],
  })
  const topup = result.rows[0] as unknown as { user_id: string; amount: number } | undefined

  await db.execute({
    sql: "UPDATE topups SET status = 'rejected', note = ? WHERE id = ?",
    args: [note || 'ถูกปฏิเสธ', topupId],
  })

  revalidatePath('/admin/topups')
}

export async function getTopups() {
  'use cache'
  const result = await db.execute(`
    SELECT t.*, u.username
    FROM topups t
    JOIN users u ON t.user_id = u.id
    ORDER BY t.created_at DESC
  `)
  return result.rows.map((r) => ({
    id: String(r.id),
    user_id: String(r.user_id),
    username: String(r.username),
    amount: Number(r.amount),
    slip_url: String(r.slip_url),
    status: String(r.status),
    note: String(r.note),
    created_at: String(r.created_at),
  }))
}

export async function getUserTopups(userId: string) {
  const result = await db.execute({
    sql: 'SELECT * FROM topups WHERE user_id = ? ORDER BY created_at DESC',
    args: [userId],
  })
  return result.rows.map((r) => ({
    id: String(r.id),
    amount: Number(r.amount),
    status: String(r.status),
    note: String(r.note),
    created_at: String(r.created_at),
  }))
}

export async function getUserPoints(userId: string): Promise<number> {
  const result = await db.execute({
    sql: 'SELECT points FROM users WHERE id = ?',
    args: [userId],
  })
  const row = result.rows[0]
  return row ? Number(row.points) : 0
}
