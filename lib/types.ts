export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string   // app category id
  inStock: boolean
  accountType: 'private' | 'shared'
  maxUsers: number
}

export interface Account {
  id: string
  productId: string
  email: string
  password: string
  maxUsers: number
  isActive: boolean
  createdAt: string
}

export interface UserAccountUsage {
  id: string
  userId: string
  accountId: string
  createdAt: string
}

export interface Purchase {
  id: string
  userId: string
  productId: string
  accountId: string | null
  price: number
  createdAt: string
}

export interface AppCategory {
  id: string
  name: string
  logo: string
  banner: string
  sortOrder: number
}

export interface StoreSettings {
  storeName: string
  tagline: string
  logoText: string
  primaryColor: string
  accentColor: string
  heroTitle: string
  heroSubtitle: string
  heroImage: string
  currency: string
  currencySymbol: string
  showHero: boolean
  footerText: string
  partnerApps: Array<{ name: string; logo: string }>
  socialLinks: {
    facebook: string
    instagram: string
    line: string
  }
}

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "My Shop",
  tagline: "สินค้าคุณภาพดี ราคาเป็นมิตร",
  logoText: "MY SHOP",
  primaryColor: "#6366f1",
  accentColor: "#f59e0b",
  heroTitle: "ยินดีต้อนรับสู่ร้านของเรา",
  heroSubtitle: "เลือกซื้อสินค้าคุณภาพดีในราคาที่คุณพอใจ",
  heroImage: "",
  currency: "THB",
  currencySymbol: "฿",
  showHero: true,
  footerText: "© 2025 My Shop. All rights reserved.",
  partnerApps: [],
  socialLinks: {
    facebook: "",
    instagram: "",
    line: "",
  },
}

