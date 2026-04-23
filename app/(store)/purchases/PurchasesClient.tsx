'use client'

import { useEffect, useState } from 'react'
import { useShop } from '@/lib/context'
import { Purchase } from '@/lib/types'
import { getPurchases } from '@/lib/actions/purchases'
import { getCurrentUserId } from '@/lib/actions/auth'
import { showToast } from '@/lib/sse-context'
import Link from 'next/link'

function CopyButton({ value, label, onCopy, primary }: { value: string; label: string; onCopy: () => void; primary: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer active:scale-95"
      style={copied
        ? { background: '#10b98118', color: '#10b981', border: '1px solid #10b98130' }
        : { background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-2)' }
      }
    >
      {copied ? (
        <>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          คัดลอกแล้ว
        </>
      ) : (
        <>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path d="M8 4v12a2 2 0 002 2h8a2 2 0 002-2V7.242a2 2 0 00-.602-1.43L16.083 2.57A2 2 0 0014.685 2H10a2 2 0 00-2 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 18v2a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {label}
        </>
      )}
    </button>
  )
}

export default function PurchasesClient() {
  const { settings, products, accounts } = useShop()
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const primary = settings.primaryColor

  useEffect(() => {
    async function loadPurchases() {
      try {
        const userId = await getCurrentUserId()
        if (userId) {
          const data = await getPurchases(userId)
          setPurchases(data)
        }
      } catch (error) {
        console.error('Failed to load purchases:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPurchases()
  }, [])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        <p className="text-center" style={{ color: 'var(--text-3)' }}>กำลังโหลด...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
      <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-1)' }}>
        ประวัติการซื้อ
      </h1>

      {purchases.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg mb-4" style={{ color: 'var(--text-3)' }}>
            ยังไม่มีประวัติการซื้อ
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 rounded-xl font-medium transition-all cursor-pointer"
            style={{ background: primary, color: 'white' }}
          >
            ดูสินค้าทั้งหมด
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    สินค้า
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    ราคา
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    เลขที่ทำรายการ
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    วันที่ซื้อ
                  </th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {purchases.map((purchase) => {
                  const product = products.find((p) => p.id === purchase.productId)
                  
                  return (
                    <tr key={purchase.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product?.image && (
                            <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-800">{product?.name || 'Unknown'}</p>
                            <p className="text-gray-400 text-xs truncate max-w-[200px]">
                              {product?.description || ''}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        ฿{purchase.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                        {purchase.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(purchase.createdAt).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          className="px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1.5"
                          style={{
                            background: primary,
                            color: 'white',
                            boxShadow: `0 2px 8px ${primary}30`
                          }}
                          onClick={() => setSelectedPurchase(purchase)}
                        >
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM8 3a5 5 0 110 10A5 5 0 018 3zM8 5a3 3 0 100 6A3 3 0 008 5z" fill="currentColor" opacity="0.3"/>
                            <path d="M8 4.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM8 6a2 2 0 110 4 2 2 0 010-4z" fill="currentColor"/>
                          </svg>
                          ดูข้อมูล
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="sm:hidden space-y-3 p-4">
            {purchases.map((purchase) => {
              const product = products.find((p) => p.id === purchase.productId)
              
              return (
                <div key={purchase.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-start gap-3 mb-3">
                    {product?.image && (
                      <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm">{product?.name || 'Unknown'}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{new Date(purchase.createdAt).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-800 text-sm">฿{purchase.price.toLocaleString()}</p>
                    <p className="text-gray-400 text-xs font-mono">{purchase.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <button
                    className="w-full px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5"
                    style={{
                      background: primary,
                      color: 'white',
                      boxShadow: `0 2px 8px ${primary}30`
                    }}
                    onClick={() => setSelectedPurchase(purchase)}
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM8 3a5 5 0 110 10A5 5 0 018 3zM8 5a3 3 0 100 6A3 3 0 008 5z" fill="currentColor" opacity="0.3"/>
                      <path d="M8 4.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM8 6a2 2 0 110 4 2 2 0 010-4z" fill="currentColor"/>
                    </svg>
                    ดูข้อมูล
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Account Details Modal */}
      {selectedPurchase && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
          onClick={(e) => e.target === e.currentTarget && setSelectedPurchase(null)}
        >
          <div
            className="w-full max-w-sm overflow-hidden"
            style={{
              background: 'var(--surface)',
              borderRadius: '24px',
              border: '1px solid var(--border)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.08)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid var(--border-2)' }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: `${primary}18` }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: primary }}>
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>ข้อมูลบัญชี</span>
              </div>
              <button
                onClick={() => setSelectedPurchase(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                style={{ color: 'var(--text-3)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-2)'
                  ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-1)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                  ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-3)'
                }}
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {(() => {
                const product = products.find((p) => p.id === selectedPurchase.productId)
                const account = accounts.find((a) => a.id === selectedPurchase.accountId)

                return (
                  <>
                    {/* Product row */}
                    <div
                      className="flex items-center gap-3 p-3 rounded-2xl"
                      style={{ background: 'var(--surface-2)' }}
                    >
                      {product?.image ? (
                        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ background: 'var(--border)' }}>
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div
                          className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
                          style={{ background: `${primary}15` }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: primary }}>
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"
                              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs mb-0.5" style={{ color: 'var(--text-3)' }}>สินค้า</p>
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-1)' }}>
                          {product?.name || 'Unknown'}
                        </p>
                      </div>
                    </div>

                    {/* Credentials */}
                    {account ? (
                      <div
                        className="rounded-2xl overflow-hidden"
                        style={{ border: '1px solid var(--border)' }}
                      >
                        {/* Email row */}
                        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-2)' }}>
                          <p className="text-xs mb-1.5 font-medium" style={{ color: 'var(--text-3)' }}>Email</p>
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-1)' }}>
                              {account.email}
                            </p>
                            <CopyButton
                              value={account.email}
                              label="คัดลอก"
                              onCopy={() => showToast('คัดลอก Email แล้ว')}
                              primary={primary}
                            />
                          </div>
                        </div>

                        {/* Password row */}
                        <div className="px-4 py-3">
                          <p className="text-xs mb-1.5 font-medium" style={{ color: 'var(--text-3)' }}>รหัสผ่าน</p>
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-mono font-medium tracking-wider" style={{ color: 'var(--text-1)' }}>
                              {account.password}
                            </p>
                            <CopyButton
                              value={account.password}
                              label="คัดลอก"
                              onCopy={() => showToast('คัดลอกรหัสผ่านแล้ว')}
                              primary={primary}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="flex items-center justify-center py-8 rounded-2xl"
                        style={{ background: 'var(--surface-2)', border: '1px dashed var(--border)' }}
                      >
                        <p className="text-sm" style={{ color: 'var(--text-3)' }}>ไม่มีข้อมูลบัญชี</p>
                      </div>
                    )}

                    {/* Copy all button */}
                    {account && (
                      <button
                        onClick={() => {
                          const productName = product?.name || 'Unknown'
                          navigator.clipboard.writeText(`${productName}\nEmail: ${account.email}\nPassword: ${account.password}`)
                          showToast('คัดลอกข้อมูลบัญชีแล้ว')
                        }}
                        className="w-full py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2"
                        style={{
                          background: primary,
                          color: 'white',
                          boxShadow: `0 4px 16px ${primary}40`,
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M8 4v12a2 2 0 002 2h8a2 2 0 002-2V7.242a2 2 0 00-.602-1.43L16.083 2.57A2 2 0 0014.685 2H10a2 2 0 00-2 2z"
                            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 18v2a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2"
                            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        คัดลอกข้อมูลบัญชี
                      </button>
                    )}
                  </>
                )
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
