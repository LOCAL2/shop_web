'use client'

import Link from "next/link";
import { useShop } from "@/lib/context";

export default function DashboardClient() {
  const { settings, products } = useShop();
  const inStock = products.filter((p) => p.inStock).length;
  const outOfStock = products.length - inStock;

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm text-gray-400 mb-1">ยินดีต้อนรับกลับมา</p>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{settings.storeName}</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <StatCard label="สินค้าทั้งหมด" value={products.length} />
        <StatCard label="มีสินค้า" value={inStock} accent="emerald" />
        <StatCard label="สินค้าหมด" value={outOfStock} accent="red" />
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">การดำเนินการ</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <QuickLink href="/admin/products" title="จัดการสินค้า" desc="เพิ่ม แก้ไข หรือลบสินค้าในร้าน"
            icon={<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M2 3.5A1.5 1.5 0 013.5 2h9A1.5 1.5 0 0114 3.5v9a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012 12.5v-9z" stroke="currentColor" strokeWidth="1.4"/><path d="M5.5 6.5a2.5 2.5 0 005 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>}
          />
          <QuickLink href="/admin/settings" title="ตั้งค่าร้าน" desc="ปรับแต่งชื่อร้าน สี และรูปลักษณ์"
            icon={<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M8 10a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.4"/><path d="M13.3 9.6l.7-.4V6.8l-.7-.4a5.5 5.5 0 00-.6-1.4l.2-.8-1.6-1.6-.8.2a5.5 5.5 0 00-1.4-.6L8.8 2H7.2l-.4.7a5.5 5.5 0 00-1.4.6l-.8-.2L3 4.7l.2.8a5.5 5.5 0 00-.6 1.4L2 7.2v1.6l.7.4c.1.5.3.9.6 1.4l-.2.8 1.6 1.6.8-.2c.4.3.9.5 1.4.6l.4.7h1.6l.4-.7a5.5 5.5 0 001.4-.6l.8.2 1.6-1.6-.2-.8c.3-.5.5-.9.6-1.4z" stroke="currentColor" strokeWidth="1.4"/></svg>}
          />
          <QuickLink href="/" title="ดูหน้าร้าน" desc="ดูว่าลูกค้าเห็นร้านของคุณอย่างไร" external
            icon={<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M6.5 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V9.5M10 2h4m0 0v4m0-4L7 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          />
          <QuickLink href="/products" title="หน้ารายการสินค้า" desc="ดูหน้าแสดงสินค้าทั้งหมด" external
            icon={<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: string }) {
  const styles: Record<string, string> = {
    emerald: "text-emerald-600",
    red: "text-red-500",
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <p className={`text-3xl font-bold tracking-tight mb-1 ${accent ? styles[accent] : "text-gray-900"}`}>
        {value}
      </p>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}

function QuickLink({ href, icon, title, desc, external }: {
  href: string; icon: React.ReactNode; title: string; desc: string; external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer block group"
    >
      <div className="flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 flex-shrink-0 group-hover:bg-gray-100 transition-colors">
          {icon}
        </div>
        <div>
          <p className="font-semibold text-gray-800 text-sm mb-0.5">{title}</p>
          <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
        </div>
      </div>
    </Link>
  );
}
