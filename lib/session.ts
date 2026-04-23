import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const key = new TextEncoder().encode(process.env.SESSION_SECRET!)

export async function encrypt(payload: { userId: string; username: string; isAdmin: boolean }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key)
}

export async function decrypt(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] })
    return payload as { userId: string; username: string; isAdmin: boolean }
  } catch {
    return null
  }
}

export async function createSession(userId: string, username: string, isAdmin: boolean) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const token = await encrypt({ userId, username, isAdmin })
  const store = await cookies()
  store.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires,
    sameSite: 'lax',
    path: '/',
  })
}

export async function getSession() {
  const store = await cookies()
  const token = store.get('session')?.value
  if (!token) return null
  return decrypt(token)
}

export async function deleteSession() {
  const store = await cookies()
  store.delete('session')
}
