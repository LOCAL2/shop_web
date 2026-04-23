import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { generateId } from '@/lib/store'

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const amount = parseFloat(String(formData.get('amount') ?? '0'))
  const slip = formData.get('slip') as File | null

  if (!amount || amount <= 0) return Response.json({ error: 'จำนวนเงินไม่ถูกต้อง' }, { status: 400 })
  if (!slip) return Response.json({ error: 'กรุณาแนบสลิป' }, { status: 400 })
  if (slip.size > 5 * 1024 * 1024) return Response.json({ error: 'ไฟล์ใหญ่เกิน 5MB' }, { status: 400 })

  // Convert to base64 data URL
  const buffer = await slip.arrayBuffer()
  const base64 = Buffer.from(buffer).toString('base64')
  const slipUrl = `data:${slip.type};base64,${base64}`

  const id = generateId()
  await db.execute({
    sql: 'INSERT INTO topups (id, user_id, amount, slip_url) VALUES (?, ?, ?, ?)',
    args: [id, session.userId, amount, slipUrl],
  })

  return Response.json({ success: true })
}
