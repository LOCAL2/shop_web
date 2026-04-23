'use client'

import {
  createContext, useContext, useState, useEffect,
  useTransition, ReactNode,
} from 'react'
import { Product, StoreSettings, DEFAULT_SETTINGS, AppCategory, Account } from './types'
import { generateId } from './store'
import { getSettings, saveSettings as saveSettingsAction } from './actions/settings'
import {
  getProducts,
  addProduct as addProductAction,
  updateProduct as updateProductAction,
  deleteProduct as deleteProductAction,
} from './actions/products'
import {
  getCategories,
  addCategory as addCategoryAction,
  updateCategory as updateCategoryAction,
  deleteCategory as deleteCategoryAction,
} from './actions/categories'
import {
  getAccounts,
  addAccount as addAccountAction,
  updateAccount as updateAccountAction,
  deleteAccount as deleteAccountAction,
} from './actions/accounts'

interface ShopContextType {
  settings: StoreSettings
  products: Product[]
  categories: AppCategory[]
  accounts: Account[]
  isLoading: boolean
  updateSettings: (s: StoreSettings) => Promise<void>
  addProduct: (p: Product) => Promise<void>
  updateProduct: (p: Product) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  addCategory: (c: AppCategory) => Promise<void>
  updateCategory: (c: AppCategory) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  addAccount: (a: Omit<Account, 'id' | 'createdAt'>) => Promise<void>
  updateAccount: (a: Account) => Promise<void>
  deleteAccount: (id: string) => Promise<void>
  isPending: boolean
}

const ShopContext = createContext<ShopContextType | null>(null)

export function ShopProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<AppCategory[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    Promise.all([
      getSettings().then(setSettings),
      getProducts().then(setProducts),
      getCategories().then(setCategories),
      getAccounts().then(setAccounts),
    ]).finally(() => setIsLoading(false))
  }, [])

  async function updateSettings(s: StoreSettings) {
    setSettings(s)
    startTransition(async () => { await saveSettingsAction(s) })
  }

  async function addProduct(p: Product) {
    setProducts((prev) => [...prev, p])
    startTransition(async () => {
      await addProductAction(p)
      setProducts(await getProducts())
    })
  }

  async function updateProduct(p: Product) {
    setProducts((prev) => prev.map((x) => (x.id === p.id ? p : x)))
    startTransition(async () => { await updateProductAction(p) })
  }

  async function deleteProduct(id: string) {
    setProducts((prev) => prev.filter((x) => x.id !== id))
    startTransition(async () => { await deleteProductAction(id) })
  }

  async function addCategory(c: AppCategory) {
    setCategories((prev) => [...prev, c])
    startTransition(async () => {
      await addCategoryAction(c)
      setCategories(await getCategories())
    })
  }

  async function updateCategory(c: AppCategory) {
    setCategories((prev) => prev.map((x) => (x.id === c.id ? c : x)))
    startTransition(async () => {
      await updateCategoryAction(c)
      setCategories(await getCategories())
    })
  }

  async function deleteCategory(id: string) {
    setCategories((prev) => prev.filter((x) => x.id !== id))
    startTransition(async () => { await deleteCategoryAction(id) })
  }

  async function addAccount(a: Omit<Account, 'id' | 'createdAt'>) {
    setAccounts((prev) => [...prev, { ...a, id: generateId(), createdAt: new Date().toISOString() }])
    startTransition(async () => {
      await addAccountAction(a)
      setAccounts(await getAccounts())
    })
  }

  async function updateAccount(a: Account) {
    setAccounts((prev) => prev.map((x) => (x.id === a.id ? a : x)))
    startTransition(async () => { await updateAccountAction(a) })
  }

  async function deleteAccount(id: string) {
    setAccounts((prev) => prev.filter((x) => x.id !== id))
    startTransition(async () => { await deleteAccountAction(id) })
  }

  return (
    <ShopContext.Provider value={{
      settings, products, categories, accounts, isLoading,
      updateSettings, addProduct, updateProduct, deleteProduct,
      addCategory, updateCategory, deleteCategory,
      addAccount, updateAccount, deleteAccount,
      isPending,
    }}>
      {children}
    </ShopContext.Provider>
  )
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) {
    // Return default values for SSR
    return {
      settings: DEFAULT_SETTINGS,
      products: [],
      categories: [],
      accounts: [],
      updateSettings: async () => {},
      addProduct: async () => {},
      updateProduct: async () => {},
      deleteProduct: async () => {},
      addCategory: async () => {},
      updateCategory: async () => {},
      deleteCategory: async () => {},
      addAccount: async () => {},
      updateAccount: async () => {},
      deleteAccount: async () => {},
      isPending: false,
      isLoading: false,
    } as ShopContextType
  }
  return ctx
}
