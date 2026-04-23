'use client'

import Link from "next/link";
import Image from "next/image";
import { useShop } from "@/lib/context";
import { Product } from "@/lib/types";
import { buyProduct } from "@/lib/actions/purchases";
import { getCurrentUserId } from "@/lib/actions/auth";
import { getAccountUsageCount } from "@/lib/actions/accounts";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/sse-context";
import { useState, useEffect } from "react";

export default function ProductCard({ product }: { product: Product }) {
  const { settings, accounts } = useShop();
  const router = useRouter();
  const primary = settings.primaryColor;
  const accent = settings.accentColor;

  const productAccounts = accounts.filter(a => a.productId === product.id && a.isActive);
  const [availableSlots, setAvailableSlots] = useState<number>(0);

  useEffect(() => {
    if (product.accountType !== 'shared' || productAccounts.length === 0) {
      setAvailableSlots(0);
      return;
    }
    Promise.all(
      productAccounts.map(async (acc) => {
        const used = await getAccountUsageCount(acc.id);
        return Math.max(0, acc.maxUsers - used);
      })
    ).then((slots) => setAvailableSlots(slots.reduce((a, b) => a + b, 0)));
  }, [accounts, product.id]);

  const handleBuy = async (e: React.MouseEvent) => {
    e.preventDefault();
    const userId = await getCurrentUserId();
    if (!userId) { router.push('/login'); return; }

    let accountId: string | null = null;
    if (product.accountType === 'shared' && productAccounts.length > 0) {
      for (const acc of productAccounts) {
        const used = await getAccountUsageCount(acc.id);
        if (used < acc.maxUsers) { accountId = acc.id; break; }
      }
      if (!accountId) { showToast('ไม่มี slot ว่างในขณะนี้'); return; }
    }
    try {
      await buyProduct(userId, product.id, product.price, accountId);
      router.push('/purchases');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <Link href={`/products/${product.id}`} className="group block cursor-pointer">
      <div
        className="relative overflow-hidden transition-all duration-300 group-hover:-translate-y-1"
        style={{
          background: "var(--surface)",
          borderRadius: "20px",
          border: "1px solid var(--border)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 40px rgba(0,0,0,0.10), 0 0 0 1px ${primary}30`
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"
        }}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden" style={{ background: "var(--surface-2)" }}>
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${primary}18, ${accent}12)` }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ color: "var(--text-3)" }}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}

          {/* Out of stock overlay */}
          {!product.inStock && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
            >
              <span
                className="text-xs font-bold px-3 py-1.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.95)", color: "#374151", letterSpacing: "0.04em" }}
              >
                สินค้าหมด
              </span>
            </div>
          )}

          {/* Account type badge */}
          <div className="absolute top-2.5 left-2.5">
            {product.accountType === 'shared' ? (
              <span
                className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg"
                style={{
                  background: "rgba(0,0,0,0.52)",
                  color: "white",
                  backdropFilter: "blur(10px)",
                  letterSpacing: "0.01em",
                }}
              >
                {/* Users icon */}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                หาร {product.maxUsers} คน
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg"
                style={{
                  background: "rgba(0,0,0,0.52)",
                  color: "white",
                  backdropFilter: "blur(10px)",
                  letterSpacing: "0.01em",
                }}
              >
                {/* Lock icon */}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                ส่วนตัว
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-3.5">
          <p
            className="text-sm font-semibold line-clamp-1 leading-snug mb-2.5"
            style={{ color: "var(--text-1)" }}
          >
            {product.name}
          </p>

          <div className="flex items-center justify-between mb-3">
            <p className="text-lg font-bold" style={{ color: primary }}>
              {settings.currencySymbol}{product.price.toLocaleString()}
            </p>
            {product.accountType === 'shared' && product.inStock && availableSlots > 0 && (
              <span
                className="text-xs font-medium px-2 py-1 rounded-lg"
                style={{ background: "var(--surface-2)", color: "var(--text-3)", border: "1px solid var(--border-2)" }}
              >
                เหลือ {availableSlots} slot
              </span>
            )}
          </div>

          {product.inStock ? (
            <button
              className="w-full py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-[0.97]"
              style={{
                background: primary,
                color: "white",
                boxShadow: `0 2px 10px ${primary}35`,
              }}
              onClick={handleBuy}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              ซื้อเลย
            </button>
          ) : (
            <div
              className="w-full py-2 rounded-xl text-sm font-medium text-center"
              style={{ background: "var(--surface-2)", color: "var(--text-3)" }}
            >
              หมดแล้ว
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
