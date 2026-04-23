'use client'

import Link from 'next/link'

interface HistoryItem { id: string; amount: number; status: string; note: string; created_at: string }

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  pending:  { label: 'รอตรวจสอบ', color: '#d97706', bg: '#fffbeb' },
  approved: { label: 'อนุมัติแล้ว', color: '#059669', bg: '#f0fdf4' },
  rejected: { label: 'ถูกปฏิเสธ',  color: '#dc2626', bg: '#fef2f2' },
}

export default function TopupHistoryClient({ history }: { history: HistoryItem[] }) {
  return (
    <div className="max-w-md mx-auto px-5 pt-28 pb-20">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-1)' }}>
          ประวัติการเติม
        </h1>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>ยังไม่มีประวัติการเติม Point</p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((t) => {
            const s = STATUS[t.status] ?? { label: t.status, color: '#888', bg: '#f4f4f5' }
            return (
              <div key={t.id} className="rounded-2xl overflow-hidden"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: s.bg }}>
                      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="6.5" stroke={s.color} strokeWidth="1.4"/>
                        {t.status === 'approved'
                          ? <path d="M5 8l2.5 2.5L11 5.5" stroke={s.color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                          : t.status === 'rejected'
                          ? <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke={s.color} strokeWidth="1.4" strokeLinecap="round"/>
                          : <path d="M8 5v3.5l2 1.5" stroke={s.color} strokeWidth="1.4" strokeLinecap="round"/>
                        }
                      </svg>
                    </div>
                    <div>
                      <p className="text-base font-semibold" style={{ color: 'var(--text-1)' }}>
                        +{Math.floor(t.amount).toLocaleString()} point
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
                        ฿{t.amount.toLocaleString()} ·{' '}
                        {new Date(t.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ background: s.bg, color: s.color }}>
                    {s.label}
                  </span>
                </div>
                {t.status === 'rejected' && t.note && (
                  <div className="px-4 py-2.5 border-t flex items-start gap-2"
                    style={{ borderColor: '#fecaca', background: '#fef2f2' }}>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
                      <circle cx="8" cy="8" r="6.5" stroke="#dc2626" strokeWidth="1.4"/>
                      <path d="M8 5v3M8 10.5v.5" stroke="#dc2626" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                    <p className="text-xs" style={{ color: '#dc2626' }}>สาเหตุ: {t.note}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
