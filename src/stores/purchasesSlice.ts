import type { StateCreator } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type { PurchasesSlice, Purchase } from '@/lib/types'

export const createPurchasesSlice: StateCreator<
  PurchasesSlice,
  [],
  [],
  PurchasesSlice
> = (set, get) => ({
  purchases: [],

  addPurchase: (purchase) => {
    const newPurchase: Purchase = {
      ...purchase,
      id: uuidv4(),
      created_at: new Date().toISOString(),
    }
    set((state) => ({
      purchases: [...state.purchases, newPurchase],
    }))
  },

  updatePurchase: (id, updates) => {
    set((state) => ({
      purchases: state.purchases.map((purchase) =>
        purchase.id === id ? { ...purchase, ...updates } : purchase
      ),
    }))
  },

  deletePurchase: (id) => {
    set((state) => ({
      purchases: state.purchases.filter((purchase) => purchase.id !== id),
    }))
  },

  getPurchasesByDateRange: (from, to) => {
    const purchases = get().purchases
    return purchases.filter((purchase) => {
      const purchaseDate = new Date(purchase.date)
      return purchaseDate >= from && purchaseDate <= to
    })
  },

  getTotalByDateRange: (from, to) => {
    const purchases = get().getPurchasesByDateRange(from, to)
    return purchases.reduce((total, purchase) => total + purchase.total, 0)
  },
})