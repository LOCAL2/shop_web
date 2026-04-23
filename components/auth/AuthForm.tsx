'use client'

import React, { useActionState } from 'react'
import Link from 'next/link'
import { login, register } from '@/lib/actions/auth'

interface Props {
  mode: 'login' | 'register'
}

export default function AuthForm({ mode }: Props) {
  const action = mode === 'login' ? login : register
  const [state, formAction, pending] = useActionState(action, undefined)
  const isLogin = mode === 'login'

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: 'var(--bg)' }}
    >
      {/* Subtle background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full blur-[120px] opacity-[0.08]"
          style={{ width: 600, height: 600, top: '-15%', left: '-10%',
            background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} />
        <div className="absolute rounded-full blur-[140px] opacity-[0.06]"
          style={{ width: 500, height: 500, bottom: '-10%', right: '-8%',
            background: 'radial-gradient(circle, #f59e0b, transparent 70%)' }} />
      </div>

      <div className="relative w-full max-w-[400px]">
        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
          }}
        >
          <div className="mb-7">
            <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: 'var(--text-1)' }}>
              {isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-3)' }}>
              {isLogin ? 'กรอกข้อมูลเพื่อเข้าสู่ระบบ' : 'กรอกข้อมูลเพื่อสร้างบัญชีใหม่'}
            </p>
          </div>

          <form action={formAction} className="space-y-4">
            <Field label="Username">
              <input
                name="username"
                type="text"
                placeholder={isLogin ? 'Username หรือ Email' : 'Username'}
                required
                autoComplete="username"
              />
            </Field>

            {!isLogin && (
              <Field label="Email">
                <input name="email" type="email" placeholder="your@email.com" required autoComplete="email" />
              </Field>
            )}

            <Field label="Password">
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
            </Field>

            {!isLogin && (
              <Field label="ยืนยัน Password">
                <input name="confirm" type="password" placeholder="••••••••" required autoComplete="new-password" />
              </Field>
            )}

            {state?.error && (
              <div
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm"
                style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                  <circle cx="8" cy="8" r="6.5" stroke="#dc2626" strokeWidth="1.4"/>
                  <path d="M8 5v3M8 10.5v.5" stroke="#dc2626" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full py-3.5 rounded-xl text-white text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              style={{
                backgroundColor: '#6366f1',
                boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
                marginTop: '4px',
              }}
            >
              {pending ? 'กำลังดำเนินการ...' : isLogin ? 'เข้าสู่ระบบ' : 'สร้างบัญชี'}
            </button>
          </form>
        </div>

        {/* Switch */}
        <p className="text-center text-sm mt-6" style={{ color: 'var(--text-3)' }}>
          {isLogin ? 'ยังไม่มีบัญชี?' : 'มีบัญชีแล้ว?'}{' '}
          <Link
            href={isLogin ? '/register' : '/login'}
            className="font-semibold transition-opacity hover:opacity-70"
            style={{ color: 'var(--text-1)' }}
          >
            {isLogin ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
          </Link>
        </p>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement>> }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-3)' }}>
        {label}
      </label>
      {React.cloneElement(children, {
        className: `w-full px-4 py-3 rounded-xl text-base outline-none transition-all
          border focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-400`,
        style: { color: 'var(--text-1)', background: 'var(--surface-2)', borderColor: 'var(--border)' },
      })}
    </div>
  )
}
