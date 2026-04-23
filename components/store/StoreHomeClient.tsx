'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useShop } from '@/lib/context'
import HeroSection from './HeroSection'

export default function StoreHomeClient() {
  const { settings, categories, products, isLoading } = useShop()

  if (isLoading) {
    return <div className="min-h-screen" style={{ background: 'var(--bg)' }} />
  }

  if (categories.length === 0) {
    return (
      <div>
        {settings.showHero && (
          <HeroSection settings={settings} productCount={products.length} />
        )}
        <div className="max-w-2xl mx-auto px-6 py-40 text-center">
          <div
            className="w-20 h-20 rounded-3xl mx-auto mb-8 flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, var(--surface-2), var(--surface))",
              border: "1px solid var(--border)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ color: "var(--text-3)" }}>
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-3 tracking-tight" style={{ color: "var(--text-1)" }}>
            ยังไม่มีสินค้าในร้าน
          </h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {settings.showHero && (
        <HeroSection settings={settings} productCount={products.length} />
      )}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <h2 className="text-xl font-bold mb-6 tracking-tight" style={{ color: 'var(--text-1)' }}>
          เลือกแอปที่ต้องการ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/apps/${cat.id}`}
              className="group flex flex-col items-center justify-center gap-3 p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--surface-2)' }}
              >
                {cat.logo ? (
                  <Image src={cat.logo} alt={cat.name} width={64} height={64} className="object-contain w-full h-full" />
                ) : (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--text-3)' }}>
                    <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                )}
              </div>
              <span
                className="text-sm font-semibold leading-tight transition-colors group-hover:opacity-70"
                style={{ color: 'var(--text-1)' }}
              >
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
