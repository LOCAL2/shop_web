import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ShopProvider } from "@/lib/context";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopBuilder",
  description: "สร้างร้านค้าออนไลน์ของคุณเอง",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${geistSans.variable} h-full antialiased`} style={{ colorScheme: "light" }}>
      <Suspense fallback={null}>
        <body className="min-h-full flex flex-col" style={{ background: "var(--bg)", color: "var(--text-1)" }}>
          <ShopProvider>{children}</ShopProvider>
        </body>
      </Suspense>
    </html>
  );
}
