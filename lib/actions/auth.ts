'use server'

import { db } from '@/lib/db'
import { createSession, deleteSession, getSession } from '@/lib/session'
import { generateId } from '@/lib/store'
import { redirect } from 'next/navigation'
import { createHash } from 'crypto'
import { cookies } from 'next/headers'

function hash(s: string) {
  return createHash('sha256').update(s).digest('hex')
}

type AuthState = { error?: string } | undefined

export async function register(state: AuthState, formData: FormData): Promise<AuthState> {
  const username = String(formData.get('username') ?? '').trim()
  const email    = String(formData.get('email')    ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const confirm  = String(formData.get('confirm')  ?? '')

  if (!username || !email || !password) return { error: 'กรุณากรอกข้อมูลให้ครบ' }
  if (username.length < 3) return { error: 'Username ต้องมีอย่างน้อย 3 ตัวอักษร' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'รูปแบบ Email ไม่ถูกต้อง' }
  if (password.length < 6) return { error: 'Password ต้องมีอย่างน้อย 6 ตัวอักษร' }
  if (password !== confirm) return { error: 'Password ไม่ตรงกัน' }

  const existing = await db.execute({
    sql: 'SELECT id FROM users WHERE username = ? OR email = ?',
    args: [username, email],
  })
  if (existing.rows.length > 0) return { error: 'Username หรือ Email นี้ถูกใช้งานแล้ว' }

  const id = generateId()
  await db.execute({
    sql: 'INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)',
    args: [id, username, email, hash(password)],
  })

  await createSession(id, username, false)
  redirect('/')
}

export async function login(state: AuthState, formData: FormData): Promise<AuthState> {
  const username = String(formData.get('username') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!username || !password) return { error: 'กรุณากรอกข้อมูลให้ครบ' }

  const result = await db.execute({
    sql: 'SELECT id, username, password_hash, is_admin FROM users WHERE username = ? OR email = ?',
    args: [username, username],
  })

  const user = result.rows[0] as unknown as { id: string; username: string; password_hash: string; is_admin: number } | undefined
  if (!user || user.password_hash !== hash(password))
    return { error: 'Username หรือ Password ไม่ถูกต้อง' }

  await createSession(user.id, user.username, user.is_admin === 1)
  redirect('/')
}

export async function logout() {
  await deleteSession()
  // clear pin session too
  const store = await cookies()
  store.delete('admin_verified')
  redirect('/login')
}

// ── Admin PIN ──────────────────────────────────────────────

export async function verifyAdminPin(state: AuthState, formData: FormData): Promise<AuthState> {
  const pin = String(formData.get('pin') ?? '').trim()
  if (!pin) return { error: 'กรุณากรอก PIN' }

  const session = await getSession()
  if (!session?.isAdmin) return { error: 'ไม่มีสิทธิ์เข้าถึง' }

  const result = await db.execute({
    sql: 'SELECT admin_pin FROM users WHERE id = ?',
    args: [session.userId],
  })
  const user = result.rows[0] as unknown as { admin_pin: string } | undefined
  if (!user || user.admin_pin !== pin)
    return { error: 'PIN ไม่ถูกต้อง' }

  // Set pin-verified cookie อายุเท่ากับ session (7 วัน)
  const store = await cookies()
  store.set('admin_verified', '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60,
    sameSite: 'lax',
    path: '/',
  })

  redirect('/admin/dashboard')
}

export async function getCurrentUserId(): Promise<string | null> {
  const session = await getSession()
  return session?.userId || null
}
