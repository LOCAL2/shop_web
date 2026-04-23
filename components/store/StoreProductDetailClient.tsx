'use client'

import Link from "next/link";
import Image from "next/image";
import { useShop } from "@/lib/context";
import ProductCard from "./ProductCard";
import { buyProduct } from "@/lib/actions/purchases";
import { getCurrentUserId } from "@/lib/actions/auth";
import { getAccountUsageCount } from "@/lib/actions/accounts";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/sse-context";
import { useState, useEffect } from "react";

export default function StoreProductDetailClient({ id }: { id: string }) {
  const { products, settings, categories, accounts } = useShop();
  const router = useRouter();
  const product = products.find((p) => p.id === id);
  const primary = settings.primaryColor;
  const category = categories.find((c) => c.id === product?.category);

  const productAccounts = accounts.filter(a => a.productId === product?.id && a.isActive);
  const [availableSlots, setAvailableSlots] = useState<number>(0);

  useEffect(() => {
    if (!product || productAccounts.length === 0) {
      setAvailableSlots(0);
      return;
    }
    Promise.all(
      productAccounts.map(async (acc) => {
        const used = await getAccountUsageCount(acc.id);
        return Math.max(0, acc.maxUsers - used);
      })
    ).then((slots) => setAvailableSlots(slots.reduce((a, b) => a + b, 0)));
  }, [accounts, product?.id]);

  const handleBuy = async () => {
    if (!product) return;

    const userId = await getCurrentUserId();
    if (!userId) {
      router.push('/login');
      return;
    }

    // For shared accounts, assign one that still has available slots
    let accountId: string | null = null;
    if (product.accountType === 'shared' && productAccounts.length > 0) {
      for (const acc of productAccounts) {
        const used = await getAccountUsageCount(acc.id);
        if (used < acc.maxUsers) {
          accountId = acc.id;
          break;
        }
      }
      if (!accountId) {
        showToast('ไม่มี slot ว่างในขณะนี้');
        return;
      }
    }

    try {
      await buyProduct(userId, product.id, product.price, accountId);
      router.push('/purchases');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'เกิดข้อผิดพลาด');
    }
  };

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-32 text-center">
        <p className="text-5xl font-bold mb-4" style={{ color: "var(--surface-2)" }}>404</p>
        <p className="text-sm mb-8" style={{ color: "var(--text-3)" }}>ไม่พบสินค้านี้</p>
        <Link href="/products" className="text-sm font-medium cursor-pointer" style={{ color: primary }}>
          ← กลับไปดูสินค้าทั้งหมด
        </Link>
      </div>
    );
  }

  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category && p.inStock)
    .slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 pt-28">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-10" style={{ color: "var(--text-3)" }}>
        <Link href="/" className="transition-opacity hover:opacity-60 cursor-pointer">หน้าแรก</Link>
        <span>/</span>
        <Link href="/products" className="transition-opacity hover:opacity-60 cursor-pointer">สินค้า</Link>
        <span>/</span>
        <span style={{ color: "var(--text-2)" }} className="truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
        {/* Image */}
        <div
          className="relative aspect-square rounded-3xl overflow-hidden"
          style={{
            background: "var(--surface-2)",
            boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
          }}
        >
          {product.image ? (
            <Image src={product.image} alt={product.name} fill className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${primary}0c, ${settings.accentColor}10)` }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ color: "var(--text-3)" }}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight mb-4" style={{ color: "var(--text-1)" }}>
            {product.name}
          </h1>
          <p className="text-2xl sm:text-4xl font-bold mb-6" style={{ color: primary }}>
            {settings.currencySymbol}{product.price.toLocaleString()}
          </p>
          {product.description && (
            <p className="leading-relaxed mb-8 text-base" style={{ color: "var(--text-2)" }}>
              {product.description}
            </p>
          )}

          <div className="mb-8" style={{ height: "1px", background: "var(--border)" }} />

          {category && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm" style={{ color: "var(--text-3)" }}>หมวดหมู่:</span>
              <span className="text-sm font-medium" style={{ color: "var(--text-2)" }}>{category.name}</span>
            </div>
          )}

          {product.accountType === 'shared' && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm" style={{ color: "var(--text-3)" }}>ประเภท:</span>
              <span
                className="text-xs font-medium px-2 py-1 rounded-lg"
                style={{
                  background: `${primary}15`,
                  color: primary,
                  border: `1px solid ${primary}30`
                }}
              >
                หาร {product.maxUsers} คน
              </span>
              <span className="text-sm font-medium" style={{ color: "var(--text-2)" }}>
                (คงเหลือ {availableSlots})
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 mb-8">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: product.inStock ? "#10b981" : "#f87171" }}
            />
            <span className="text-base" style={{ color: "var(--text-2)" }}>
              {product.inStock ? "มีสินค้าพร้อมส่ง" : "สินค้าหมดชั่วคราว"}
            </span>
          </div>

          <button
            disabled={!product.inStock}
            onClick={handleBuy}
            className="w-full py-4 rounded-2xl text-white text-base font-semibold transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            style={{
              backgroundColor: primary,
              boxShadow: product.inStock ? `0 8px 28px ${primary}35` : "none",
            }}
          >
            {product.inStock ? "สั่งซื้อสินค้า" : "สินค้าหมด"}
          </button>
        </div>
      </div>

      {related.length > 0 && (
        <div>
          <div className="mb-10" style={{ height: "1px", background: "var(--border)" }} />
          <h2 className="text-lg font-bold tracking-tight mb-8" style={{ color: "var(--text-1)" }}>
            สินค้าที่เกี่ยวข้อง
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
