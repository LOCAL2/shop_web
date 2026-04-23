'use client'

import { useState } from "react";
import { useShop } from "@/lib/context";
import { Product, Account } from "@/lib/types";
import { generateId } from "@/lib/store";
import ProductForm from "./ProductForm";
import AccountForm from "./AccountForm";
import { getAccountsByProductId } from "@/lib/actions/accounts";

export default function ProductsClient() {
  const { products, deleteProduct, categories, accounts } = useShop();
  const [editing, setEditing] = useState<Product | null>(null);
  const [adding, setAdding] = useState(false);
  const [managingAccounts, setManagingAccounts] = useState<Product | null>(null);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [addingAccount, setAddingAccount] = useState(false);

  const emptyProduct: Product = { id: "", name: "", description: "", price: 0, image: "", category: "", inStock: true, accountType: 'private', maxUsers: 1 };

  function handleAdd() { setEditing({ ...emptyProduct, id: generateId() }); setAdding(true); }
  function handleEdit(p: Product) { setEditing(p); setAdding(false); }
  function handleClose() { setEditing(null); setAdding(false); }

  function handleManageAccounts(p: Product) { setManagingAccounts(p); }
  function handleCloseAccounts() { setManagingAccounts(null); setEditingAccount(null); setAddingAccount(false); }

  function handleAddAccount() {
    setEditingAccount(null);
    setAddingAccount(true);
  }

  function handleEditAccount(a: Account) {
    setEditingAccount(a);
    setAddingAccount(false);
  }

  function handleCloseAccountForm() {
    setEditingAccount(null);
    setAddingAccount(false);
  }

  const productAccounts = managingAccounts
    ? accounts.filter(a => a.productId === managingAccounts.id)
    : [];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">สินค้า</h1>
          <p className="text-sm text-gray-400 mt-1">{products.length} รายการ</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer active:scale-95"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          เพิ่มสินค้า
        </button>
      </div>

      {editing && (
        <div className="mb-6">
          <ProductForm product={editing} isNew={adding} onClose={handleClose} />
        </div>
      )}

      {managingAccounts && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden max-w-lg w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <div>
                <h2 className="font-semibold text-gray-900 text-sm">จัดการบัญชี</h2>
                <p className="text-xs text-gray-400 mt-0.5">{managingAccounts.name}</p>
              </div>
              <button
                type="button"
                onClick={handleCloseAccounts}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {editingAccount || addingAccount ? (
              <div className="p-6 overflow-auto flex-1">
                <AccountForm
                  product={managingAccounts}
                  account={editingAccount}
                  onClose={handleCloseAccountForm}
                />
              </div>
            ) : (
              <div className="p-6 overflow-auto flex-1">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-gray-500">บัญชีทั้งหมด ({productAccounts.length})</p>
                  <button
                    onClick={handleAddAccount}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                    เพิ่มบัญชี
                  </button>
                </div>

                {productAccounts.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-400">ยังไม่มีบัญชี</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {productAccounts.map((account) => (
                      <div
                        key={account.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{account.email}</p>
                          <p className="text-xs text-gray-400">หาร {account.maxUsers} คน</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditAccount(account)}
                            className="text-xs font-medium text-gray-600 hover:text-gray-900 cursor-pointer transition-colors"
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('ลบบัญชีนี้?')) {
                                // Delete account logic will be added
                              }
                            }}
                            className="text-xs font-medium text-red-400 hover:text-red-600 cursor-pointer transition-colors"
                          >
                            ลบ
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 mx-auto mb-4 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" className="text-gray-400">
              <path d="M2 3.5A1.5 1.5 0 013.5 2h9A1.5 1.5 0 0114 3.5v9a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012 12.5v-9z" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M5.5 6.5a2.5 2.5 0 005 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-gray-400 text-sm mb-3">ยังไม่มีสินค้า</p>
          <button onClick={handleAdd} className="text-sm font-medium text-gray-900 hover:underline cursor-pointer">
            เพิ่มสินค้าแรก
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Mobile card layout */}
          <div className="lg:hidden space-y-3 p-4">
            {products.map((p) => (
              <div key={p.id} className="border border-gray-100 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400">
                          <path d="M2 3.5A1.5 1.5 0 013.5 2h9A1.5 1.5 0 0114 3.5v9a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012 12.5v-9z" stroke="currentColor" strokeWidth="1.4"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm">{p.name}</p>
                    <p className="text-gray-400 text-xs truncate">{p.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {categories.find((c) => c.id === p.category)?.name || p.category || "—"}
                  </span>
                  <span className="font-semibold text-gray-800">฿{p.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    p.inStock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${p.inStock ? "bg-emerald-500" : "bg-red-400"}`} />
                    {p.inStock ? "มีสินค้า" : "หมด"}
                  </span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleManageAccounts(p)}
                      className="text-xs font-medium text-gray-600 hover:text-gray-900 cursor-pointer transition-colors">
                      จัดการบัญชี
                    </button>
                    <button onClick={() => handleEdit(p)}
                      className="text-xs font-medium text-gray-600 hover:text-gray-900 cursor-pointer transition-colors">
                      แก้ไข
                    </button>
                    <button onClick={() => deleteProduct(p.id)}
                      className="text-xs font-medium text-red-400 hover:text-red-600 cursor-pointer transition-colors">
                      ลบ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table layout */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">สินค้า</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">หมวดหมู่</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">ราคา</th>
                  <th className="text-center px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">สถานะ</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-gray-400">
                                <path d="M2 3.5A1.5 1.5 0 013.5 2h9A1.5 1.5 0 0114 3.5v9a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012 12.5v-9z" stroke="currentColor" strokeWidth="1.4"/>
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{p.name}</p>
                          <p className="text-gray-400 text-xs truncate max-w-[180px]">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-sm">
                      {categories.find((c) => c.id === p.category)?.name || p.category || "—"}
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-gray-800">
                      ฿{p.price.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        p.inStock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.inStock ? "bg-emerald-500" : "bg-red-400"}`} />
                        {p.inStock ? "มีสินค้า" : "หมด"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 justify-end">
                        <button onClick={() => handleManageAccounts(p)}
                          className="text-xs font-medium text-gray-600 hover:text-gray-900 cursor-pointer transition-colors whitespace-nowrap">
                          จัดการบัญชี
                        </button>
                        <button onClick={() => handleEdit(p)}
                          className="text-xs font-medium text-gray-600 hover:text-gray-900 cursor-pointer transition-colors">
                          แก้ไข
                        </button>
                        <button onClick={() => deleteProduct(p.id)}
                          className="text-xs font-medium text-red-400 hover:text-red-600 cursor-pointer transition-colors">
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
