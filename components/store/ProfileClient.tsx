'use client'

import { logout } from '@/lib/actions/auth'
import Link from 'next/link'
import { useSSE } from '@/lib/sse-context'

interface Props {
  username: string
  isAdmin: boolean
  points: number
}

export default function ProfileClient({ username, isAdmin, points: initialPoints }: Props) {
  const { points: livePoints } = useSSE()
  const points = livePoints ?? initialPoints
  return (
    <div className="max-w-md mx-auto px-6 pt-28 pb-16">
      {/* Avatar + name */}
      <div className="flex flex-col items-center mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4"
          style={{ backgroundColor: '#6366f1', boxShadow: '0 8px 24px rgba(99,102,241,0.25)' }}
        >
          {username.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-1)' }}>
          {username}
        </h1>
        {isAdmin && (
          <span className="mt-2 text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>
            Admin
          </span>
        )}
      </div>

      {/* Points */}
      <div
        className="rounded-2xl p-5 mb-4 flex items-center justify-between"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-3)' }}>
            Point คงเหลือ
          </p>
          <p className="text-3xl font-bold tracking-tight" style={{ color: '#6366f1' }}>
            {points.toLocaleString()}
          </p>
        </div>
        <Link href="/topup"
          className="text-sm font-semibold px-4 py-2 rounded-xl cursor-pointer transition-all hover:opacity-85 active:scale-95 text-white"
          style={{ backgroundColor: '#6366f1', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}>
          เติม Point
        </Link>
      </div>

      {/* Menu */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
        <Link href="/purchases"
          className="flex items-center justify-between px-5 py-4 transition-colors cursor-pointer"
          style={{ borderBottom: '1px solid var(--border)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--text-2)' }}>
                <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-1)' }}>ประวัติการซื้อ</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: 'var(--text-3)' }}>
            <path d="M4 7h6M7 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

        <Link href="/topup/history"
          className="flex items-center justify-between px-5 py-4 transition-colors cursor-pointer"
          style={{ borderBottom: '1px solid var(--border)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--text-2)' }}>
                <path d="M2 8a6 6 0 1112 0A6 6 0 012 8z" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M8 5v3.5l2 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-1)' }}>ประวัติการเติม Point</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: 'var(--text-3)' }}>
            <path d="M4 7h6M7 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

        {isAdmin && (
          <Link href="/admin/dashboard"
            className="flex items-center justify-between px-5 py-4 transition-colors cursor-pointer"
            style={{ borderBottom: '1px solid var(--border)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--text-2)' }}>
                  <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                  <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                  <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                  <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                </svg>
              </div>
              <span className="text-sm font-medium" style={{ color: 'var(--text-1)' }}>จัดการร้านค้า</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: 'var(--text-3)' }}>
              <path d="M4 7h6M7 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        )}

        <form action={logout}>
          <button type="submit"
            className="w-full flex items-center gap-3 px-5 py-4 transition-colors cursor-pointer text-left"
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6"
                  stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-medium" style={{ color: '#ef4444' }}>ออกจากระบบ</span>
          </button>
        </form>
      </div>
    </div>
  )
}
