'use server'

import { db } from '@/lib/db'
import { Purchase } from '@/lib/types'
import { revalidatePath } from 'next/cache'
import { generateId } from '@/lib/store'
import { addUserAccountUsage } from '@/lib/actions/accounts'

export async function getPurchases(userId: string): Promise<Purchase[]> {
  const result = await db.execute({
    sql: 'SELECT id, user_id as userId, product_id as productId, account_id as accountId, price, created_at as createdAt FROM purchases WHERE user_id = ? ORDER BY created_at DESC',
    args: [userId],
  })
  return result.rows.map((row: any) => ({
    id: String(row.id),
    userId: String(row.userId),
    productId: String(row.productId),
    accountId: row.accountId ? String(row.accountId) : null,
    price: Number(row.price),
    createdAt: String(row.createdAt),
  }))
}

export async function buyProduct(userId: string, productId: string, price: number, accountId: string | null = null): Promise<void> {
  // Check user points
  const userResult = await db.execute({
    sql: 'SELECT points FROM users WHERE id = ?',
    args: [userId],
  })
  const user = userResult.rows[0] as unknown as { points: number } | undefined
  
  if (!user) {
    throw new Error('User not found')
  }
  
  if (user.points < price) {
    throw new Error('Point ไม่เพียงพอ')
  }
  
  // Deduct points
  await db.execute({
    sql: 'UPDATE users SET points = points - ? WHERE id = ?',
    args: [price, userId],
  })
  
  // Create purchase record
  const id = generateId()
  const createdAt = new Date().toISOString()
  await db.execute({
    sql: 'INSERT INTO purchases (id, user_id, product_id, account_id, price, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    args: [id, userId, productId, accountId, price, createdAt],
  })

  // Track account slot usage
  if (accountId) {
    await addUserAccountUsage(userId, accountId)
  }

  // Notification to trigger SSE points update
  await db.execute({
    sql: 'INSERT INTO notifications (id, user_id, message) VALUES (?, ?, ?)',
    args: [generateId(), userId, `ซื้อสินค้าสำเร็จ -${price} Point`],
  })

  revalidatePath('/', 'layout')
  revalidatePath('/profile', 'page')
  revalidatePath('/purchases', 'page')
}
