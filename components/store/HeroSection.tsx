'use client'

import Link from "next/link";
import Image from "next/image";
import { StoreSettings } from "@/lib/types";

interface Props {
  settings: StoreSettings;
  productCount: number;
}

export default function HeroSection({ settings, productCount }: Props) {
  const p = settings.primaryColor;
  const a = settings.accentColor;

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--surface)", minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* ── Background ───────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Orb 1 */}
        <div
          className="hero-orb-1 absolute rounded-full"
          style={{
            width: "700px", height: "700px",
            top: "-20%", left: "-10%",
            background: `radial-gradient(circle, ${p}18, transparent 65%)`,
            filter: "blur(80px)",
          }}
        />
        {/* Orb 2 */}
        <div
          className="hero-orb-2 absolute rounded-full"
          style={{
            width: "550px", height: "550px",
            bottom: "-10%", right: "-8%",
            background: `radial-gradient(circle, ${a}14, transparent 65%)`,
            filter: "blur(90px)",
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
            opacity: 1,
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{ background: "linear-gradient(to top, var(--bg), transparent)" }}
        />
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      <div className="relative flex-1 flex items-center">
        <div className="w-full max-w-6xl mx-auto px-6 pt-32 pb-24 lg:pt-40 lg:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-16 items-center">

            {/* Left */}
            <div>
              {/* Eyebrow */}
              <div className="hero-eyebrow inline-flex items-center gap-2.5 mb-8">
                <div
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
                  style={{
                    border: `1px solid ${p}30`,
                    background: `${p}0e`,
                    color: p,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: p }} />
                  {settings.storeName}
                </div>
              </div>

              {/* Headline */}
              <h1
                className="hero-title font-bold tracking-tight mb-6"
                style={{
                  fontSize: "clamp(2.6rem, 5.5vw, 4.5rem)",
                  lineHeight: 1.06,
                  letterSpacing: "-0.03em",
                  color: "var(--text-1)",
                }}
              >
                {settings.heroTitle}
              </h1>



              {/* CTA */}
              <div className="hero-cta flex flex-wrap items-center gap-4">
                <Link
                  href="/products"
                  className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-semibold text-white overflow-hidden transition-all active:scale-[0.97] cursor-pointer"
                  style={{
                    background: p,
                    boxShadow: `0 8px 28px ${p}35`,
                  }}
                >
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)" }}
                  />
                  <span className="relative">ดูสินค้าทั้งหมด</span>
                  <svg className="relative transition-transform group-hover:translate-x-0.5" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>

              </div>


            </div>

            {/* Right — visual */}
            <div className="hero-image hero-float hidden lg:block">
              {settings.heroImage ? (
                <div
                  className="relative rounded-[2rem] overflow-hidden"
                  style={{
                    aspectRatio: "4/5",
                    boxShadow: "0 32px 80px rgba(0,0,0,0.12), 0 0 0 1px var(--border)",
                  }}
                >
                  <Image
                    src={settings.heroImage}
                    alt={settings.heroTitle}
                    fill
                    className="object-cover"
                    sizes="460px"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
                  <div
                    className="absolute bottom-5 left-5 right-5 flex items-center justify-between px-4 py-3 rounded-xl backdrop-blur-md"
                    style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.6)" }}
                  >
                    <span className="text-xs font-medium" style={{ color: "var(--text-2)" }}>เริ่มต้นที่</span>
                    <span className="text-sm font-bold" style={{ color: p }}>{settings.currencySymbol}xxx</span>
                  </div>
                </div>
              ) : (
                /* Placeholder grid */
                <div
                  className="relative rounded-[2rem] overflow-hidden"
                  style={{
                    aspectRatio: "4/5",
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    boxShadow: "0 32px 80px rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-[2rem]"
                    style={{ background: `radial-gradient(ellipse at 30% 20%, ${p}10, transparent 60%)` }}
                  />
                  <div className="absolute inset-0 p-6 grid grid-cols-2 gap-3">
                    {[
                      { delay: "0s", h: "55%" },
                      { delay: "0.15s", h: "40%" },
                      { delay: "0.3s", h: "40%" },
                      { delay: "0.45s", h: "55%" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="rounded-2xl flex flex-col justify-end p-3"
                        style={{
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          height: item.h,
                          alignSelf: i % 2 === 0 ? "flex-start" : "flex-end",
                          animation: `fade-up 0.7s cubic-bezier(0.22,1,0.36,1) ${item.delay} both`,
                          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                        }}
                      >
                        <div className="h-1.5 w-12 rounded-full mb-1.5" style={{ background: "var(--border)" }} />
                        <div className="h-1 w-8 rounded-full" style={{ background: "var(--border-2)" }} />
                      </div>
                    ))}
                  </div>


                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Ticker — partner app logos ────────────────── */}
      {/* ── Ticker — partner app logos ────────────────── */}
      {settings.partnerApps.length > 0 && (
        <div className="relative overflow-hidden" style={{ borderTop: "1px solid var(--border)" }}>
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, var(--surface-2) 20%, transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, var(--surface-2) 20%, transparent)" }} />

          <div className="py-5" style={{ background: "var(--surface-2)" }}>
            <div className="ticker-track">
              {[0, 1].map((set) => (
                <div key={set} className="flex items-center flex-shrink-0"
                  style={{ minWidth: '100vw', justifyContent: 'space-around' }}>
                  {settings.partnerApps.map((app, i) => (
                    <div key={i} className="flex items-center gap-2.5 px-6 flex-shrink-0 group cursor-default">
                      {app.logo && (
                        <img src={app.logo} alt={app.name}
                          className="h-5 w-auto object-contain flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                          style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.12))' }} />
                      )}
                      {app.name && (
                        <span
                          className="text-xs font-bold tracking-[0.18em] uppercase whitespace-nowrap transition-colors duration-300"
                          style={{ color: 'var(--text-2)', letterSpacing: '0.18em' }}
                        >
                          {app.name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
