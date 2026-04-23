'use server'

import { db } from '@/lib/db'
import { Product } from '@/lib/types'
import { revalidatePath } from 'next/cache'

function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id:          String(row.id),
    name:        String(row.name),
    description: String(row.description ?? ''),
    price:       Number(row.price ?? 0),
    image:       String(row.image ?? ''),
    category:    String(row.category ?? ''),
    inStock:     Number(row.in_stock ?? 1) === 1,
    accountType: (row.account_type as 'private' | 'shared') ?? 'private',
    maxUsers:    Number(row.max_users ?? 1),
  }
}

export async function getProducts(): Promise<Product[]> {
  'use cache'
  const result = await db.execute('SELECT * FROM products ORDER BY rowid ASC')
  return result.rows.map((r) => rowToProduct(r as Record<string, unknown>))
}

export async function addProduct(p: Product): Promise<void> {
  await db.execute({
    sql: `INSERT INTO products (id, name, description, price, image, category, in_stock, account_type, max_users)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [p.id, p.name, p.description, p.price, p.image, p.category, p.inStock ? 1 : 0, p.accountType, p.maxUsers],
  })
  revalidatePath('/', 'layout')
}

export async function updateProduct(p: Product): Promise<void> {
  await db.execute({
    sql: `UPDATE products SET
            name = ?, description = ?, price = ?, image = ?, category = ?, in_stock = ?, account_type = ?, max_users = ?
          WHERE id = ?`,
    args: [p.name, p.description, p.price, p.image, p.category, p.inStock ? 1 : 0, p.accountType, p.maxUsers, p.id],
  })
  revalidatePath('/', 'layout')
}

export async function deleteProduct(id: string): Promise<void> {
  await db.execute({ sql: 'DELETE FROM products WHERE id = ?', args: [id] })
  revalidatePath('/', 'layout')
}
