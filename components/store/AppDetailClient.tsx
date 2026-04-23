'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useShop } from '@/lib/context'
import ProductCard from './ProductCard'

export default function AppDetailClient({ id }: { id: string }) {
  const { categories, products, settings, isLoading } = useShop()
  const category = categories.find((c) => c.id === id)

  if (isLoading) {
    return <div className="min-h-screen" style={{ background: 'var(--bg)' }} />
  }

  if (!category) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-32 text-center">
        <p className="text-5xl font-bold mb-4" style={{ color: 'var(--surface-2)' }}>404</p>
        <p className="text-sm mb-8" style={{ color: 'var(--text-3)' }}>ไม่พบแอปนี้</p>
        <Link href="/" className="text-sm font-medium cursor-pointer" style={{ color: settings.primaryColor }}>
          ← กลับหน้าแรก
        </Link>
      </div>
    )
  }

  const appProducts = products.filter((p) => p.category === id)

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* App Banner */}
      <div className="mx-3 sm:mx-4 mt-[4.75rem] sm:mt-[5rem]">
        <div className="max-w-6xl mx-auto">
          <div
            className="relative w-full overflow-hidden rounded-2xl"
            style={{ aspectRatio: '21/7', minHeight: '160px', maxHeight: '340px' }}
          >
        {category.banner ? (
          <Image
            src={category.banner}
            alt={category.name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${settings.primaryColor}22, ${settings.accentColor}14)`,
            }}
          />
        )}
        {/* Overlay with app info */}
        <div
          className="absolute inset-0 flex items-end px-6 pb-6 sm:px-10 sm:pb-8"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)' }}
        >
          <div className="flex items-center gap-4">
            {category.logo && (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}>
                <Image src={category.logo} alt={category.name} width={64} height={64} className="object-contain w-full h-full" />
              </div>
            )}
            <div>
              <p className="text-white font-bold text-xl sm:text-2xl drop-shadow">{category.name}</p>
              <p className="text-white/70 text-sm mt-0.5">{appProducts.length} แพ็กเกจ</p>
            </div>
          </div>
        </div>
        </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <nav className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-3)' }}>
          <Link href="/" className="transition-opacity hover:opacity-60 cursor-pointer">หน้าแรก</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-2)' }}>{category.name}</span>
        </nav>
      </div>

      {/* Products */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {appProducts.length === 0 ? (
          <div className="text-center py-20">
            <div
              className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--text-3)' }}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="font-semibold mb-1" style={{ color: 'var(--text-1)' }}>ยังไม่มีแพ็กเกจ</p>
            <p className="text-sm" style={{ color: 'var(--text-3)' }}>ยังไม่มีแพ็กเกจที่พร้อมจำหน่าย</p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-bold mb-5 tracking-tight" style={{ color: 'var(--text-1)' }}>
              เลือกแพ็กเกจ
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
              {appProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
