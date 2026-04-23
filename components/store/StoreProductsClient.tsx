'use client'

import { useState } from "react";
import { useShop } from "@/lib/context";
import ProductCard from "./ProductCard";

export default function StoreProductsClient() {
  const { products, settings } = useShop();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "private" | "shared">("all");
  const primary = settings.primaryColor;

  const filterOptions = [
    { value: "all" as const, label: "ทั้งหมด" },
    { value: "private" as const, label: "ส่วนตัว" },
    { value: "shared" as const, label: "หารกลุ่ม" },
  ];

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || p.accountType === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 pt-28">
      <div className="mb-12">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] mb-2" style={{ color: "var(--text-3)" }}>
          {settings.storeName}
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight" style={{ color: "var(--text-1)" }}>
          สินค้าทั้งหมด
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2" width="14" height="14"
            viewBox="0 0 15 15" fill="none" style={{ color: "var(--text-3)" }}>
            <path d="M10 6.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zM13 13l-3-3"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="search"
            placeholder="ค้นหาสินค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-base rounded-xl focus:outline-none transition-all"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text-1)",
            }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilterType(opt.value)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer active:scale-95"
              style={
                filterType === opt.value
                  ? { backgroundColor: primary, color: "#fff", boxShadow: `0 4px 14px ${primary}35` }
                  : { background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-2)" }
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm mb-8" style={{ color: "var(--text-3)" }}>
        {filtered.length} รายการ{search && <span> สำหรับ &ldquo;{search}&rdquo;</span>}
      </p>

      {filtered.length === 0 ? (
        <div className="py-32 text-center">
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
          >
            <svg width="20" height="20" viewBox="0 0 15 15" fill="none" style={{ color: "var(--text-3)" }}>
              <path d="M10 6.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zM13 13l-3-3"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-sm" style={{ color: "var(--text-3)" }}>ไม่พบสินค้าที่ค้นหา</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-5 gap-y-8">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
