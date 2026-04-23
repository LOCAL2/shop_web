'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import generatePayload from 'promptpay-qr'
import QRCode from 'qrcode'
import { useSSE } from '@/lib/sse-context'

const PROMPTPAY_NUMBER = '0966406893'

interface Props { points: number }

export default function TopupClient({ initialPoints }: { initialPoints: number }) {
  const { points: livePoints, notifs } = useSSE()
  const points = livePoints ?? initialPoints
  const [slip, setSlip] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [amount, setAmount] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // เมื่อ admin อนุมัติ → reset กลับไปหน้า QR
  useEffect(() => {
    if (success && notifs.some(n => n.message.includes('สำเร็จ'))) {
      setSuccess(false)
      setSlip(null)
      setPreview(null)
      setAmount('')
    }
  }, [notifs])

  // Generate QR (no amount — open amount)
  useEffect(() => {
    const payload = generatePayload(PROMPTPAY_NUMBER, {})
    QRCode.toDataURL(payload, { width: 220, margin: 2, color: { dark: '#000', light: '#fff' } })
      .then(setQrDataUrl)
  }, [])

  // SSE — real-time points update (handled by SSEProvider in layout)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setSlip(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!amount || parseFloat(amount) <= 0) return setError('กรุณากรอกจำนวนเงินที่โอน')
    if (!slip) return setError('กรุณาแนบสลิป')

    setLoading(true)
    const fd = new FormData()
    fd.append('amount', amount)
    fd.append('slip', slip)
    const res = await fetch('/api/topup', { method: 'POST', body: fd })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) return setError(data.error || 'เกิดข้อผิดพลาด')
    setSuccess(true)
  }

  return (
    <div className="max-w-lg mx-auto px-5 pt-28 pb-20">

      {/* Points */}
      <div className="rounded-2xl p-5 mb-6 flex items-center justify-between"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-3)' }}>
            Point คงเหลือ
          </p>
          <p className="text-3xl font-bold tracking-tight" style={{ color: '#6366f1' }}>
            {points.toLocaleString()}
          </p>
        </div>
        <Link href="/topup/history"
          className="text-sm font-medium cursor-pointer transition-opacity hover:opacity-60"
          style={{ color: 'var(--text-3)' }}>
          ประวัติ →
        </Link>
      </div>

      {success ? (
        <div className="rounded-2xl p-10 text-center"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-1)' }}>ส่งสลิปแล้ว</h3>
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>รอ admin ตรวจสอบและอนุมัติ</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="rounded-2xl overflow-hidden"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>

            {/* QR Section */}
            <div className="p-6 flex flex-col items-center" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-lg"
                style={{ border: '1px solid #e2e8f0' }}>

                {/* Header — Thai QR Payment */}
                <div className="flex items-center gap-2.5 px-5 py-3.5"
                  style={{ background: '#1a3a5c' }}>
                  <img src="/icon-thaiqr.png" alt="Thai QR" width={36} height={36} className="rounded" />
                  <div>
                    <p className="text-white font-bold text-xs leading-tight tracking-wide">THAI QR</p>
                    <p className="text-white font-bold text-xs leading-tight tracking-wide">PAYMENT</p>
                  </div>
                </div>

                {/* PromptPay logo area */}
                <div className="bg-white px-5 pt-4 pb-2 flex items-center justify-center">
                  <div className="border-2 rounded px-3 py-1" style={{ borderColor: '#1a3a5c' }}>
                    <span className="font-bold text-sm" style={{ color: '#1a3a5c' }}>
                      พร้อมเพย์ / <span style={{ color: '#0066cc' }}>Prompt</span><span style={{ color: '#1a3a5c', fontStyle: 'italic' }}>Pay</span>
                    </span>
                  </div>
                </div>

                {/* QR Code */}
                <div className="bg-white px-5 pb-4 flex items-center justify-center">
                  <div className="relative inline-flex">
                    {qrDataUrl
                      ? <img src={qrDataUrl} alt="PromptPay QR" className="w-full max-w-[240px] aspect-square" />
                      : <div className="w-full max-w-[240px] aspect-square flex items-center justify-center"
                          style={{ color: 'var(--text-3)' }}>กำลังสร้าง...</div>
                    }
                    {qrDataUrl && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <img src="/icon-thaiqr.png" alt="Thai QR" width={44} height={44} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom info */}
                <div className="bg-white px-5 pb-5 text-center">
                  <p className="text-sm font-bold tracking-tight" style={{ color: '#1a3a5c' }}>
                    {PROMPTPAY_NUMBER}
                  </p>
                  <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full"
                    style={{ background: 'rgba(26,58,92,0.08)' }}>
                    <span className="text-xs font-bold" style={{ color: '#1a3a5c' }}>฿1</span>
                    <span className="text-[10px]" style={{ color: 'rgba(26,58,92,0.4)' }}>=</span>
                    <span className="text-xs font-bold" style={{ color: '#1a3a5c' }}>1 Point</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Slip + Amount Section */}
            <div className="p-6 space-y-4">
              {/* Amount input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: 'var(--text-3)' }}>
                  จำนวนเงินที่โอน (บาท)
                </label>
                <input
                  type="number" min="1" step="1" value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="100"
                  className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all border focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-400"
                  style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-1)' }}
                />
              </div>

              {/* Slip upload */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: 'var(--text-3)' }}>
                  แนบสลิป
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-all hover:border-indigo-400"
                  style={{
                    borderColor: preview ? '#6366f1' : 'var(--border)',
                    background: 'var(--surface-2)',
                    minHeight: preview ? 'auto' : '120px',
                  }}
                >
                  {preview ? (
                    <img src={preview} alt="slip" className="max-h-64 object-contain w-full" />
                  ) : (
                    <div className="py-6 flex flex-col items-center gap-2">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--text-3)' }}>
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
                          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <p className="text-sm" style={{ color: 'var(--text-3)' }}>คลิกเพื่ออัพโหลดสลิป</p>
                      <p className="text-xs" style={{ color: 'var(--text-3)' }}>PNG, JPG ไม่เกิน 5MB</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </div>

              {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                  style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                    <circle cx="8" cy="8" r="6.5" stroke="#dc2626" strokeWidth="1.4"/>
                    <path d="M8 5v3M8 10.5v.5" stroke="#dc2626" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl text-white text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                style={{ backgroundColor: '#6366f1', boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}>
                {loading ? 'กำลังส่ง...' : 'ส่งสลิปเพื่อยืนยัน'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
