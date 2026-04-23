'use server'

import { db } from '@/lib/db'
import { Account, UserAccountUsage } from '@/lib/types'
import { revalidatePath } from 'next/cache'
import { generateId } from '@/lib/store'

export async function getAccounts(): Promise<Account[]> {
  const result = await db.execute({
    sql: 'SELECT id, product_id as productId, email, password, max_users as maxUsers, is_active as isActive, created_at as createdAt FROM accounts ORDER BY created_at DESC',
    args: [],
  })
  return result.rows.map((row: any) => ({
    id: String(row.id),
    productId: String(row.productId),
    email: String(row.email),
    password: String(row.password),
    maxUsers: Number(row.maxUsers),
    isActive: Number(row.isActive) === 1,
    createdAt: String(row.createdAt),
  }))
}

export async function getAccountsByProductId(productId: string): Promise<Account[]> {
  const result = await db.execute({
    sql: 'SELECT id, product_id as productId, email, password, max_users as maxUsers, is_active as isActive, created_at as createdAt FROM accounts WHERE product_id = ? ORDER BY created_at DESC',
    args: [productId],
  })
  return result.rows.map((row: any) => ({
    id: String(row.id),
    productId: String(row.productId),
    email: String(row.email),
    password: String(row.password),
    maxUsers: Number(row.maxUsers),
    isActive: Number(row.isActive) === 1,
    createdAt: String(row.createdAt),
  }))
}

export async function addAccount(account: Omit<Account, 'id' | 'createdAt'>): Promise<void> {
  const id = generateId()
  const createdAt = new Date().toISOString()
  await db.execute({
    sql: 'INSERT INTO accounts (id, product_id, email, password, max_users, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [id, account.productId, account.email, account.password, account.maxUsers, account.isActive ? 1 : 0, createdAt],
  })
  revalidatePath('/', 'layout')
}

export async function updateAccount(account: Account): Promise<void> {
  await db.execute({
    sql: 'UPDATE accounts SET product_id = ?, email = ?, password = ?, max_users = ?, is_active = ? WHERE id = ?',
    args: [account.productId, account.email, account.password, account.maxUsers, account.isActive ? 1 : 0, account.id],
  })
}

export async function deleteAccount(id: string): Promise<void> {
  await db.execute({
    sql: 'DELETE FROM accounts WHERE id = ?',
    args: [id],
  })
}

export async function getUserAccountUsage(userId: string): Promise<UserAccountUsage[]> {
  const result = await db.execute({
    sql: 'SELECT id, user_id as userId, account_id as accountId, created_at as createdAt FROM user_account_usage WHERE user_id = ? ORDER BY created_at DESC',
    args: [userId],
  })
  return result.rows as unknown as UserAccountUsage[]
}

export async function getAccountUsageCount(accountId: string): Promise<number> {
  const result = await db.execute({
    sql: 'SELECT COUNT(*) as count FROM user_account_usage WHERE account_id = ?',
    args: [accountId],
  })
  return Number(result.rows[0].count)
}

export async function addUserAccountUsage(userId: string, accountId: string): Promise<void> {
  const id = generateId()
  const createdAt = new Date().toISOString()
  await db.execute({
    sql: 'INSERT INTO user_account_usage (id, user_id, account_id, created_at) VALUES (?, ?, ?, ?)',
    args: [id, userId, accountId, createdAt],
  })
}

export async function deleteUserAccountUsage(id: string): Promise<void> {
  await db.execute({
    sql: 'DELETE FROM user_account_usage WHERE id = ?',
    args: [id],
  })
}
