import type { StateCreator } from 'zustand'
import type { SyncSlice, Purchase } from '@/lib/types'
import { supabase } from '@/lib/supabase'

export const createSyncSlice: StateCreator<
  SyncSlice,
  [],
  [],
  SyncSlice
> = (set, get) => ({
  isOnline: navigator.onLine,
  isLoading: false,
  lastSyncAt: null,
  pendingSyncs: [],
  error: null,

  setOnline: (online: boolean) => {
    set({ isOnline: online })
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading })
  },

  setError: (error: string | null) => {
    set({ error })
  },

  addPendingSync: (purchase: Purchase) => {
    set((state) => ({
      pendingSyncs: [...state.pendingSyncs, purchase],
    }))
  },

  removePendingSync: (purchaseId: string) => {
    set((state) => ({
      pendingSyncs: state.pendingSyncs.filter((p) => p.id !== purchaseId),
    }))
  },

  syncWithSupabase: async () => {
    const state = get()
    if (!state.isOnline || state.isLoading) return

    set({ isLoading: true, error: null })

    try {
      // Sync pending purchases
      for (const purchase of state.pendingSyncs) {
        const { error } = await supabase
          .from('purchases')
          .insert({
            id: purchase.id,
            item_id: purchase.item_id,
            item_name: purchase.item_name,
            quantity: purchase.quantity,
            unit_price: purchase.unit_price,
            total: purchase.total,
            date: purchase.date,
            created_at: purchase.created_at,
          })

        if (error) {
          throw error
        }

        // Remove from pending syncs
        get().removePendingSync(purchase.id)
      }

      set({
        lastSyncAt: new Date().toISOString(),
        isLoading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Sync failed',
        isLoading: false,
      })
    }
  },
})