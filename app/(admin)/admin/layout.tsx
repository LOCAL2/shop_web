'use client'

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:static lg:transform-none ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <AdminSidebar onCloseMobile={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-4 mb-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
          <span className="font-semibold text-gray-900">Admin Panel</span>
        </div>

        {children}
      </main>
    </div>
  );
}
