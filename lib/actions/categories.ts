'use server'

import { db } from '@/lib/db'
import { AppCategory } from '@/lib/types'
import { revalidatePath } from 'next/cache'

function rowToCategory(row: Record<string, unknown>): AppCategory {
  return {
    id:        String(row.id),
    name:      String(row.name),
    logo:      String(row.logo ?? ''),
    banner:    String(row.banner ?? ''),
    sortOrder: Number(row.sort_order ?? 0),
  }
}

export async function getCategories(): Promise<AppCategory[]> {
  'use cache'
  const result = await db.execute('SELECT * FROM app_categories ORDER BY sort_order ASC, rowid ASC')
  return result.rows.map((r) => rowToCategory(r as Record<string, unknown>))
}

export async function addCategory(c: AppCategory): Promise<void> {
  await db.execute({
    sql: `INSERT INTO app_categories (id, name, logo, banner, sort_order) VALUES (?, ?, ?, ?, ?)`,
    args: [c.id, c.name, c.logo, c.banner, c.sortOrder],
  })
  revalidatePath('/', 'layout')
}

export async function updateCategory(c: AppCategory): Promise<void> {
  await db.execute({
    sql: `UPDATE app_categories SET name = ?, logo = ?, banner = ?, sort_order = ? WHERE id = ?`,
    args: [c.name, c.logo, c.banner, c.sortOrder, c.id],
  })
  revalidatePath('/', 'layout')
}

export async function deleteCategory(id: string): Promise<void> {
  await db.execute({ sql: 'DELETE FROM app_categories WHERE id = ?', args: [id] })
  revalidatePath('/', 'layout')
}
