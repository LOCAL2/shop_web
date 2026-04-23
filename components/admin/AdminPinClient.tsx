'use client'

import { useActionState } from 'react'
import { verifyAdminPin } from '@/lib/actions/auth'

export default function AdminPinClient() {
  const [state, formAction, pending] = useActionState(verifyAdminPin, undefined)

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--bg)' }}
    >
      <div className="w-full max-w-[340px]">
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
          }}
        >
          {/* Icon */}
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="#6366f1" strokeWidth="1.6"/>
              <path d="M7 11V7a5 5 0 0110 0v4" stroke="#6366f1" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>

          <h1 className="text-xl font-bold tracking-tight mb-1" style={{ color: 'var(--text-1)' }}>
            ยืนยัน PIN
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-3)' }}>
            กรอก PIN เพื่อเข้าสู่หน้าจัดการร้าน
          </p>

          <form action={formAction} className="space-y-4">
            <input
              name="pin"
              type="password"
              inputMode="numeric"
              placeholder="••••••"
              required
              autoFocus
              className="w-full px-4 py-3 rounded-xl text-base text-center tracking-[0.4em] outline-none transition-all border focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-400"
              style={{
                background: 'var(--surface-2)',
                borderColor: 'var(--border)',
                color: 'var(--text-1)',
              }}
            />

            {state?.error && (
              <p
                className="text-sm px-4 py-3 rounded-xl flex items-center gap-2"
                style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                  <circle cx="8" cy="8" r="6.5" stroke="#dc2626" strokeWidth="1.4"/>
                  <path d="M8 5v3M8 10.5v.5" stroke="#dc2626" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full py-3.5 rounded-xl text-white text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              style={{ backgroundColor: '#6366f1', boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}
            >
              {pending ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ Admin'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
