'use client'

import { useState } from "react";
import { useShop } from "@/lib/context";
import { Account } from "@/lib/types";
import { generateId } from "@/lib/store";

interface Props {
  product: { id: string; name: string };
  account: Account | null;
  onClose: () => void;
}

const emptyAccount = (): Omit<Account, 'id' | 'createdAt'> => ({
  productId: '',
  email: '',
  password: '',
  maxUsers: 1,
  isActive: true,
})

export default function AccountForm({ product, account, onClose }: Props) {
  const { addAccount, updateAccount, products } = useShop();
  const productData = products.find(p => p.id === product.id);
  const [form, setForm] = useState<Omit<Account, 'id' | 'createdAt'>>(
    account ? { ...account } : { ...emptyAccount(), productId: product.id, maxUsers: productData?.maxUsers || 1 }
  );
  const [isNew, setIsNew] = useState(!account);

  function set<K extends keyof Omit<Account, 'id' | 'createdAt'>>(key: K, value: Omit<Account, 'id' | 'createdAt'>[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.password) return;

    if (isNew) {
      addAccount(form);
    } else {
      updateAccount({ ...form, id: account!.id, createdAt: account!.createdAt });
    }
    onClose();
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900 text-sm">
          {isNew ? "เพิ่มบัญชีใหม่" : "แก้ไขบัญชี"}
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
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">สินค้า</p>
          <p className="text-sm font-medium text-gray-900">{product.name}</p>
        </div>

        <Field label="Email" required>
          <input
            required type="email" value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className={inputCls} placeholder="email@example.com"
          />
        </Field>

        <Field label="Password" required>
          <input
            required type="text" value={form.password}
            onChange={(e) => set("password", e.target.value)}
            className={inputCls} placeholder="รหัสผ่านบัญชี"
          />
        </Field>

        {/* Toggle */}
        <label className="flex items-center gap-3 cursor-pointer group w-fit">
          <div
            onClick={() => set("isActive", !form.isActive)}
            className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer ${
              form.isActive ? "bg-gray-900" : "bg-gray-200"
            }`}
            style={{ height: "22px" }}
          >
            <div className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform ${
              form.isActive ? "translate-x-5" : "translate-x-0.5"
            }`}
              style={{ width: "18px", height: "18px" }}
            />
          </div>
          <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
            บัญชีใช้งานได้
          </span>
        </label>

        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer active:scale-95"
          >
            {isNew ? "เพิ่มบัญชี" : "บันทึก"}
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
