'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { approveTopup, rejectTopup } from '@/lib/actions/topup'

interface Topup {
  id: string; user_id: string; username: string
  amount: number; slip_url: string; status: string
  note: string; created_at: string
}

const statusStyle: Record<string, { label: string; color: string }> = {
  pending:  { label: 'รอตรวจสอบ', color: '#f59e0b' },
  approved: { label: 'อนุมัติแล้ว', color: '#10b981' },
  rejected: { label: 'ถูกปฏิเสธ',  color: '#ef4444' },
}

export default function AdminTopupsClient({ topups: initialTopups }: { topups: Topup[] }) {
  const [topups, setTopups] = useState<Topup[]>(initialTopups)
  const [selected, setSelected] = useState<Topup | null>(null)
  const [rejectNote, setRejectNote] = useState('')
  const [isPending, startTransition] = useTransition()
  const esRef = useRef<EventSource | null>(null)

  // SSE — real-time topup updates (watch for changes only)
  useEffect(() => {
    function connect() {
      const es = new EventSource('/api/admin-topups-stream')
      esRef.current = es
      es.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data)
          if (data.refresh) {
            // Fetch fresh data from server action
            import('@/lib/actions/topup').then(({ getTopups }) =>
              getTopups().then(setTopups)
            )
          }
        } catch {}
      }
      es.onerror = () => {
        es.close()
        setTimeout(connect, 3000)
      }
    }
    connect()
    return () => esRef.current?.close()
  }, [])

  function handleApprove(id: string) {
    startTransition(async () => {
      await approveTopup(id)
      setSelected(null)
    })
  }

  function handleReject(id: string) {
    startTransition(async () => {
      await rejectTopup(id, rejectNote)
      setSelected(null)
      setRejectNote('')
    })
  }

  const pending = topups.filter((t) => t.status === 'pending')
  const others  = topups.filter((t) => t.status !== 'pending')

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">เติม Point</h1>
        <p className="text-sm text-gray-400 mt-1">{pending.length} รายการรอตรวจสอบ</p>
      </div>

      {/* Slip modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold text-gray-800">{selected.username}</p>
                <p className="text-sm text-gray-400">฿{selected.amount.toLocaleString()} → {Math.floor(selected.amount).toLocaleString()} point</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Slip image */}
            <div className="rounded-xl overflow-hidden mb-4 bg-gray-50 flex items-center justify-center" style={{ minHeight: 200 }}>
              <img src={selected.slip_url} alt="slip" className="max-h-64 object-contain w-full" />
            </div>

            {selected.status === 'pending' && (
              <>
                <input
                  type="text" placeholder="หมายเหตุ (กรณีปฏิเสธ)"
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm border border-gray-200 bg-gray-50 mb-3 outline-none focus:border-gray-400"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(selected.id)}
                    disabled={isPending}
                    className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    อนุมัติ
                  </button>
                  <button
                    onClick={() => handleReject(selected.id)}
                    disabled={isPending}
                    className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold bg-red-500 hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    ปฏิเสธ
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Pending */}
      {pending.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="px-5 py-3.5 border-b border-gray-100 bg-amber-50">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">รอตรวจสอบ</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">ผู้ใช้</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">จำนวน</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">วันที่</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pending.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-800">{t.username}</td>
                  <td className="px-5 py-3.5 text-right font-bold text-indigo-600">฿{t.amount.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">{new Date(t.created_at).toLocaleString('th-TH')}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => setSelected(t)}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      ดูสลิป
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* History */}
      {others.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">ประวัติ</p>
          </div>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-50">
              {others.map((t) => {
                const s = statusStyle[t.status] ?? { label: t.status, color: '#888' }
                return (
                  <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-800">{t.username}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-gray-700">฿{t.amount.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: `${s.color}18`, color: s.color }}>
                        {s.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{new Date(t.created_at).toLocaleString('th-TH')}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => setSelected(t)} className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">
                        ดูสลิป
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {topups.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-400 text-sm">ยังไม่มีรายการเติม Point</p>
        </div>
      )}
    </div>
  )
}
