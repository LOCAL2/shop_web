'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShop } from "@/lib/context";
import { logout } from "@/lib/actions/auth";

const navItems = [
  {
    href: "/admin/dashboard",
    label: "ภาพรวม",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    href: "/admin/categories",
    label: "หมวดหมู่แอป",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    href: "/admin/products",
    label: "สินค้า / แพ็กเกจ",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 3.5A1.5 1.5 0 013.5 2h9A1.5 1.5 0 0114 3.5v9a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012 12.5v-9z" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M5.5 6.5a2.5 2.5 0 005 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/admin/topups",
    label: "เติม Point",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M8 5v6M5.5 7.5L8 5l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/admin/settings",
    label: "ตั้งค่าร้าน",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 10a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M13.3 9.6l.7-.4V6.8l-.7-.4a5.5 5.5 0 00-.6-1.4l.2-.8-1.6-1.6-.8.2a5.5 5.5 0 00-1.4-.6L8.8 2H7.2l-.4.7a5.5 5.5 0 00-1.4.6l-.8-.2L3 4.7l.2.8a5.5 5.5 0 00-.6 1.4L2 7.2v1.6l.7.4c.1.5.3.9.6 1.4l-.2.8 1.6 1.6.8-.2c.4.3.9.5 1.4.6l.4.7h1.6l.4-.7a5.5 5.5 0 001.4-.6l.8.2 1.6-1.6-.2-.8c.3-.5.5-.9.6-1.4z" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
];

export default function AdminSidebar({ onCloseMobile }: { onCloseMobile?: () => void }) {
  const pathname = usePathname();
  const { settings } = useShop();

  return (
    <aside className="w-60 bg-white border-r border-gray-100 flex flex-col min-h-screen lg:min-h-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {settings.storeName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">{settings.storeName}</p>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-3 mb-3">เมนู</p>
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onCloseMobile?.()}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                active
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className={active ? "text-white" : "text-gray-400"}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* View store */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-0.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all cursor-pointer group"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400 group-hover:text-gray-600 transition-colors">
            <path d="M6.5 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V9.5M10 2h4m0 0v4m0-4L7 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          ดูหน้าร้าน
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            ออกจากระบบ
          </button>
        </form>
      </div>
    </aside>
  );
}
