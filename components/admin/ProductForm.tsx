'use client'

import { useState } from "react";
import { useShop } from "@/lib/context";
import { Product } from "@/lib/types";

interface Props {
  product: Product;
  isNew: boolean;
  onClose: () => void;
}

export default function ProductForm({ product, isNew, onClose }: Props) {
  const { addProduct, updateProduct, categories } = useShop();
  const [form, setForm] = useState<Product>(product);

  function set(key: keyof Product, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setAccountType(value: 'private' | 'shared') {
    setForm((prev) => ({ ...prev, accountType: value, maxUsers: value === 'private' ? 1 : prev.maxUsers }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isNew) addProduct(form);
    else updateProduct(form);
    onClose();
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900 text-sm">
          {isNew ? "เพิ่มสินค้าใหม่" : "แก้ไขสินค้า"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="ชื่อสินค้า" required>
            <input
              required type="text" value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputCls} placeholder="ชื่อสินค้า"
            />
          </Field>
          <Field label="แอป / หมวดหมู่">
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className={inputCls}
            >
              <option value="">— ไม่ระบุ —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="รายละเอียด">
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3} className={`${inputCls} resize-none`}
            placeholder="รายละเอียดสินค้า"
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="ราคา (฿)" required>
            <input
              required type="number" min={0} value={form.price}
              onChange={(e) => set("price", parseFloat(e.target.value) || 0)}
              className={inputCls}
            />
          </Field>
          <Field label="URL รูปภาพ">
            <input
              type="url" value={form.image}
              onChange={(e) => set("image", e.target.value)}
              className={inputCls} placeholder="https://..."
            />
            {form.image && (
              <div className="mt-3 rounded-xl overflow-hidden border border-gray-200" style={{ maxWidth: '200px' }}>
                <img src={form.image} alt="Product preview" className="w-full h-auto object-cover" />
              </div>
            )}
          </Field>
        </div>

        {/* Toggle */}
        <label className="flex items-center gap-3 cursor-pointer group w-fit">
          <div
            onClick={() => set("inStock", !form.inStock)}
            className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer ${
              form.inStock ? "bg-gray-900" : "bg-gray-200"
            }`}
            style={{ height: "22px" }}
          >
            <div
              className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform ${
                form.inStock ? "translate-x-5" : "translate-x-0.5"
              }`}
              style={{ width: "18px", height: "18px" }}
            />
          </div>
          <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
            มีสินค้าในสต็อก
          </span>
        </label>

        {/* Account Type */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
            ประเภทบัญชี
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setAccountType('private')}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                form.accountType === 'private'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ส่วนตัว (1 คน)
            </button>
            <button
              type="button"
              onClick={() => setAccountType('shared')}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                form.accountType === 'shared'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              หารกลุ่ม
            </button>
          </div>
        </div>

        {/* Max Users (only for shared) */}
        {form.accountType === 'shared' && (
          <Field label="จำนวนคนที่หารได้">
            <input
              type="number" min={2} value={form.maxUsers}
              onChange={(e) => set("maxUsers", parseInt(e.target.value) || 2)}
              className={inputCls}
            />
          </Field>
        )}

        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer active:scale-95"
          >
            {isNew ? "เพิ่มสินค้า" : "บันทึก"}
          </button>
          <button
            type="button" onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all bg-white";

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
