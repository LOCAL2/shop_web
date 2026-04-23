import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { createClient } from '@libsql/client'

async function getSession(token: string, secret: string) {
  try {
    const key = new TextEncoder().encode(secret)
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] })
    return payload as { userId: string; username: string; isAdmin?: boolean }
  } catch {
    return null
  }
}

function getDb() {
  return createClient({
    url: process.env.TURSO_URL!,
    authToken: process.env.TURSO_TOKEN!,
  })
}

async function getUserFromDb(userId: string) {
  try {
    const result = await getDb().execute({
      sql: 'SELECT id, is_admin FROM users WHERE id = ?',
      args: [userId],
    })
    return result.rows[0] as unknown as { id: string; is_admin: number } | undefined
  } catch {
    return undefined
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin/pin')) return NextResponse.next()
  if (!pathname.startsWith('/admin')) return NextResponse.next()

  const secret = process.env.SESSION_SECRET
  if (!secret) return NextResponse.redirect(new URL('/', request.url))

  const sessionToken = request.cookies.get('session')?.value
  if (!sessionToken) return NextResponse.redirect(new URL('/', request.url))

  const session = await getSession(sessionToken, secret)
  if (!session) return NextResponse.redirect(new URL('/', request.url))

  // ตรวจว่า user ยังมีอยู่ใน DB ไหม (ถ้าถูกลบ → เด้งออก)
  const user = await getUserFromDb(session.userId)
  if (!user) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('session')
    response.cookies.delete('admin_verified')
    return response
  }

  // ตรวจ is_admin จาก DB เสมอ (ไม่เชื่อ JWT เพียงอย่างเดียว)
  if (user.is_admin !== 1) return NextResponse.redirect(new URL('/', request.url))

  const pinVerified = request.cookies.get('admin_verified')?.value
  if (!pinVerified) return NextResponse.redirect(new URL('/admin/pin', request.url))

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
