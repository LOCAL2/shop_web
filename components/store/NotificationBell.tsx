'use client'

import { useState } from 'react'
import { useSSE } from '@/lib/sse-context'

function getStyle(message: string) {
  if (message.includes('สำเร็จ') || message.includes('อนุมัติ'))
    return { gradient: 'linear-gradient(135deg,#16a34a,#15803d)', icon: '✓', tint: 'rgba(22,163,74,0.08)' }
  if (message.includes('ปฏิเสธ'))
    return { gradient: 'linear-gradient(135deg,#dc2626,#b91c1c)', icon: '✕', tint: 'rgba(220,38,38,0.08)' }
  return { gradient: 'linear-gradient(135deg,#6366f1,#4f46e5)', icon: '·', tint: 'rgba(99,102,241,0.08)' }
}

function formatTime(date: Date): string {
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 60) return 'เมื่อกี้'
  if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`
  if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`
  return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }) +
    ' · ' + date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
}

export default function NotificationBell() {
  const { notifs, clearNotifs } = useSSE()
  const [open, setOpen] = useState(false)
  const unread = notifs.length

  return (
    <div className="relative">
      <button
        onClick={() => {
          const next = !open
          setOpen(next)
          // mark read เมื่อเปิด bell
          if (next && unread > 0) {
            fetch('/api/notifications/mark-read', { method: 'POST' })
          }
        }}
        className="relative flex items-center justify-center w-9 h-9 rounded-xl transition-all cursor-pointer active:scale-95"
        style={{ background: open ? 'var(--surface-2)' : 'transparent', border: '1px solid var(--border)' }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
          style={{ color: unread > 0 ? '#6366f1' : 'var(--text-2)', marginTop: '1px' }}>
          <path d="M8 1.5a4.5 4.5 0 00-4.5 4.5v2.25L2 10h12l-1.5-1.75V6A4.5 4.5 0 008 1.5z"
            stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
          <path d="M6.5 10.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)', boxShadow: '0 2px 6px rgba(239,68,68,0.45)' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 w-80 rounded-2xl z-50 overflow-hidden"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)',
            }}>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold tracking-tight" style={{ color: 'var(--text-1)' }}>
                  การแจ้งเตือน
                </p>
                {unread > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: '#eef2ff', color: '#6366f1' }}>
                    {unread} ใหม่
                  </span>
                )}
              </div>
              {unread > 0 && (
                <button onClick={() => {
                  clearNotifs()
                  fetch('/api/notifications/mark-read', { method: 'POST' })
                }}
                  className="text-xs font-medium cursor-pointer transition-opacity hover:opacity-60"
                  style={{ color: 'var(--text-3)' }}>
                  ล้างทั้งหมด
                </button>
              )}
            </div>

            {/* Empty */}
            {notifs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--text-3)' }}>
                    <path d="M8 1.5a4.5 4.5 0 00-4.5 4.5v2.25L2 10h12l-1.5-1.75V6A4.5 4.5 0 008 1.5z"
                      stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                    <path d="M6.5 10.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-2)' }}>ไม่มีการแจ้งเตือน</p>
                <p className="text-xs" style={{ color: 'var(--text-3)' }}>การแจ้งเตือนจะปรากฏที่นี่</p>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {notifs.map((n, i) => {
                  const s = getStyle(n.message)
                  return (
                    <div key={n.id}
                      className="flex items-start gap-3.5 px-5 py-4"
                      style={{
                        borderBottom: i < notifs.length - 1 ? '1px solid var(--border-2)' : 'none',
                        background: i === 0 ? s.tint : 'transparent',
                      }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-sm"
                        style={{ background: s.gradient }}>
                        {s.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--text-1)' }}>
                          {n.message}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ color: 'var(--text-3)', flexShrink: 0 }}>
                            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
                            <path d="M6 3.5v2.5l1.5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                          </svg>
                          <p className="text-[11px]" style={{ color: 'var(--text-3)' }}>
                            {formatTime(n.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
