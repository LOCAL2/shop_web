'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useShop } from "@/lib/context";
import NotificationBell from "./NotificationBell";

interface Props {
  children: React.ReactNode;
  username?: string | null;
  points?: number | null;
}

export default function StoreLayoutClient({ children, username, points }: Props) {
  const { settings } = useShop();
  const pathname = usePathname();
  const primary = settings.primaryColor;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-3 sm:mx-4 mt-3 sm:mt-4">
          <div
            className="max-w-6xl mx-auto rounded-2xl backdrop-blur-xl"
            style={{
              background: "rgba(255,255,255,0.88)",
              border: "1px solid var(--border)",
              boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
            }}
          >
            <div className="px-4 sm:px-5 flex items-center justify-between" style={{ height: "52px" }}>
              {/* Logo */}
              <Link href="/" className="font-semibold text-base tracking-tight transition-opacity hover:opacity-60 cursor-pointer flex-shrink-0"
                style={{ color: "var(--text-1)" }}>
                {settings.logoText}
              </Link>

              {/* Desktop nav */}
              <nav className="hidden sm:flex items-center gap-0.5">
                <NavLink href="/" active={pathname === "/"}>หน้าแรก</NavLink>
                <NavLink href="/products" active={pathname.startsWith("/products")}>สินค้า</NavLink>
                {username ? (
                  <div className="flex items-center gap-2 ml-3">
                    <NotificationBell />
                    <Link href="/profile"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all hover:opacity-75 active:scale-95 cursor-pointer"
                      style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: primary }}>
                        {username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium max-w-[80px] truncate" style={{ color: "var(--text-1)" }}>
                        {username}
                      </span>
                    </Link>
                  </div>
                ) : (
                  <Link href="/login"
                    className="ml-3 text-sm px-4 py-2 rounded-xl font-semibold transition-all hover:opacity-85 active:scale-95 cursor-pointer"
                    style={{ border: "1px solid var(--border)", color: "var(--text-1)", background: "var(--surface)" }}>
                    เข้าสู่ระบบ
                  </Link>
                )}
              </nav>

              {/* Mobile right */}
              <div className="flex sm:hidden items-center gap-2">
                {username && <NotificationBell />}
                <button
                  onClick={() => setMenuOpen(v => !v)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl cursor-pointer transition-colors"
                  style={{ background: menuOpen ? "var(--surface-2)" : "transparent", border: "1px solid var(--border)" }}
                >
                  {menuOpen ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "var(--text-1)" }}>
                      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "var(--text-1)" }}>
                      <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
              <div className="sm:hidden px-4 pb-4 space-y-1" style={{ borderTop: "1px solid var(--border)" }}>
                <MobileNavLink href="/" active={pathname === "/"} onClick={() => setMenuOpen(false)}>หน้าแรก</MobileNavLink>
                <MobileNavLink href="/products" active={pathname.startsWith("/products")} onClick={() => setMenuOpen(false)}>สินค้า</MobileNavLink>
                {username ? (
                  <MobileNavLink href="/profile" active={pathname === "/profile"} onClick={() => setMenuOpen(false)}>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: primary }}>
                        {username.charAt(0).toUpperCase()}
                      </div>
                      {username}
                    </div>
                  </MobileNavLink>
                ) : (
                  <MobileNavLink href="/login" active={false} onClick={() => setMenuOpen(false)}>เข้าสู่ระบบ</MobileNavLink>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 sm:mt-20" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="font-semibold text-sm mb-1" style={{ color: "var(--text-1)" }}>{settings.logoText}</p>
              {settings.tagline && <p className="text-xs" style={{ color: "var(--text-3)" }}>{settings.tagline}</p>}
            </div>
            <div className="flex items-center gap-5 flex-wrap">
              {settings.socialLinks.facebook && (
                <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                  className="text-xs transition-colors cursor-pointer hover:opacity-80" style={{ color: "var(--text-3)" }}>Facebook</a>
              )}
              {settings.socialLinks.instagram && (
                <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                  className="text-xs transition-colors cursor-pointer hover:opacity-80" style={{ color: "var(--text-3)" }}>Instagram</a>
              )}
              {settings.socialLinks.line && (
                <a href={settings.socialLinks.line} target="_blank" rel="noopener noreferrer"
                  className="text-xs transition-colors cursor-pointer hover:opacity-80" style={{ color: "var(--text-3)" }}>Line</a>
              )}
            </div>
          </div>
          <div className="mt-6 pt-6" style={{ borderTop: "1px solid var(--border-2)" }}>
            <p className="text-xs" style={{ color: "var(--text-3)" }}>{settings.footerText}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href}
      className="text-sm px-3 py-2 rounded-lg font-medium transition-all cursor-pointer"
      style={{ color: active ? "var(--text-1)" : "var(--text-3)", background: active ? "var(--surface-2)" : "transparent" }}>
      {children}
    </Link>
  );
}

function MobileNavLink({ href, active, children, onClick }: { href: string; active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick}
      className="flex items-center w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
      style={{ color: active ? "var(--text-1)" : "var(--text-2)", background: active ? "var(--surface-2)" : "transparent" }}>
      {children}
    </Link>
  );
}
