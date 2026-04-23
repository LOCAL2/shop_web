'use client'

import { useState } from "react";
import { useShop } from "@/lib/context";
import { StoreSettings } from "@/lib/types";

export default function SettingsClient() {
  const { settings, updateSettings } = useShop();
  const [form, setForm] = useState<StoreSettings>(settings);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setSocial(key: keyof StoreSettings["socialLinks"], value: string) {
    setForm((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, [key]: value } }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">ตั้งค่าร้านค้า</h1>
        <p className="text-sm text-gray-400 mt-1">ปรับแต่งรูปลักษณ์และข้อมูลร้านของคุณ</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card title="ข้อมูลร้านค้า">
          <Field label="ชื่อร้าน" required>
            <input required type="text" value={form.storeName}
              onChange={(e) => set("storeName", e.target.value)} className={inputCls} />
          </Field>
          <Field label="คำโปรย">
            <input type="text" value={form.tagline}
              onChange={(e) => set("tagline", e.target.value)}
              className={inputCls} placeholder="สินค้าคุณภาพดี ราคาเป็นมิตร" />
          </Field>
          <Field label="ข้อความโลโก้">
            <input type="text" value={form.logoText}
              onChange={(e) => set("logoText", e.target.value)} className={inputCls} />
          </Field>
          <Field label="ข้อความ Footer">
            <input type="text" value={form.footerText}
              onChange={(e) => set("footerText", e.target.value)} className={inputCls} />
          </Field>
        </Card>

        <Card title="Hero Section">
          <label className="flex items-center gap-3 cursor-pointer w-fit mb-1">
            <Toggle
              checked={form.showHero}
              onChange={(v) => set("showHero", v)}
            />
            <span className="text-sm text-gray-700">แสดง Hero Section</span>
          </label>
          <Field label="หัวข้อ">
            <input type="text" value={form.heroTitle}
              onChange={(e) => set("heroTitle", e.target.value)} className={inputCls} />
          </Field>
          <Field label="คำอธิบาย">
            <input type="text" value={form.heroSubtitle}
              onChange={(e) => set("heroSubtitle", e.target.value)} className={inputCls} />
          </Field>
          <Field label="URL รูปภาพ">
            <input type="url" value={form.heroImage}
              onChange={(e) => set("heroImage", e.target.value)}
              className={inputCls} placeholder="https://..." />
            {form.heroImage && (
              <div className="mt-3 rounded-xl overflow-hidden border border-gray-200" style={{ maxWidth: '300px' }}>
                <img src={form.heroImage} alt="Hero preview" className="w-full h-auto object-cover" />
              </div>
            )}
          </Field>
        </Card>

        <Card title="สีและธีม">
          <div className="grid grid-cols-2 gap-4">
            <Field label="สีหลัก">
              <div className="flex items-center gap-2.5">
                <label className="relative cursor-pointer">
                  <input type="color" value={form.primaryColor}
                    onChange={(e) => set("primaryColor", e.target.value)}
                    className="sr-only" />
                  <div className="w-9 h-9 rounded-xl border-2 border-white shadow-md cursor-pointer transition-transform hover:scale-105"
                    style={{ backgroundColor: form.primaryColor }} />
                </label>
                <input type="text" value={form.primaryColor}
                  onChange={(e) => set("primaryColor", e.target.value)}
                  className={`${inputCls} flex-1 font-mono text-xs`} />
              </div>
            </Field>
            <Field label="สีเสริม">
              <div className="flex items-center gap-2.5">
                <label className="relative cursor-pointer">
                  <input type="color" value={form.accentColor}
                    onChange={(e) => set("accentColor", e.target.value)}
                    className="sr-only" />
                  <div className="w-9 h-9 rounded-xl border-2 border-white shadow-md cursor-pointer transition-transform hover:scale-105"
                    style={{ backgroundColor: form.accentColor }} />
                </label>
                <input type="text" value={form.accentColor}
                  onChange={(e) => set("accentColor", e.target.value)}
                  className={`${inputCls} flex-1 font-mono text-xs`} />
              </div>
            </Field>
          </div>
        </Card>

        <Card title="สกุลเงิน">
          <div className="grid grid-cols-2 gap-4">
            <Field label="สกุลเงิน">
              <input type="text" value={form.currency}
                onChange={(e) => set("currency", e.target.value)}
                className={inputCls} placeholder="THB" />
            </Field>
            <Field label="สัญลักษณ์">
              <input type="text" value={form.currencySymbol}
                onChange={(e) => set("currencySymbol", e.target.value)}
                className={inputCls} placeholder="฿" />
            </Field>
          </div>
        </Card>

        <Card title="App / Brand">
          <div className="space-y-3">
            {form.partnerApps.map((app, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input type="text" value={app.name} placeholder="ชื่อ App"
                    onChange={(e) => {
                      const next = [...form.partnerApps]
                      next[i] = { ...next[i], name: e.target.value }
                      set('partnerApps', next)
                    }}
                    className={inputCls} />
                  <input type="url" value={app.logo} placeholder="URL โลโก้"
                    onChange={(e) => {
                      const next = [...form.partnerApps]
                      next[i] = { ...next[i], logo: e.target.value }
                      set('partnerApps', next)
                    }}
                    className={inputCls} />
                </div>
                {app.logo && (
                  <img src={app.logo} alt={app.name} className="h-8 w-auto object-contain flex-shrink-0 rounded" />
                )}
                <button type="button" onClick={() => set('partnerApps', form.partnerApps.filter((_, j) => j !== i))}
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors hover:bg-red-50"
                  style={{ border: '1px solid var(--border)', color: '#ef4444' }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))}
            <button type="button"
              onClick={() => set('partnerApps', [...form.partnerApps, { name: '', logo: '' }])}
              className="w-full py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors"
              style={{ border: '1px dashed var(--border)', color: 'var(--text-3)', background: 'transparent' }}>
              + เพิ่ม App
            </button>
          </div>
        </Card>

        <Card title="Social Media">          <Field label="Facebook">
            <input type="url" value={form.socialLinks.facebook}
              onChange={(e) => setSocial("facebook", e.target.value)}
              className={inputCls} placeholder="https://facebook.com/..." />
          </Field>
          <Field label="Instagram">
            <input type="url" value={form.socialLinks.instagram}
              onChange={(e) => setSocial("instagram", e.target.value)}
              className={inputCls} placeholder="https://instagram.com/..." />
          </Field>
          <Field label="Line">
            <input type="url" value={form.socialLinks.line}
              onChange={(e) => setSocial("line", e.target.value)}
              className={inputCls} placeholder="https://line.me/..." />
          </Field>
        </Card>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer active:scale-95"
          >
            บันทึกการตั้งค่า
          </button>
          {saved && (
            <span className="text-sm text-emerald-600 font-medium flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              บันทึกแล้ว
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

const inputCls = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all bg-white";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-5">{title}</p>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`relative w-10 rounded-full transition-colors cursor-pointer flex-shrink-0 ${checked ? "bg-gray-900" : "bg-gray-200"}`}
      style={{ width: "40px", height: "22px" }}
    >
      <div
        className="absolute top-0.5 bg-white rounded-full shadow-sm transition-transform"
        style={{ width: "18px", height: "18px" }}
      />
    </div>
  );
}
