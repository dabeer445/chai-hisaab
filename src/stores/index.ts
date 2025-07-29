import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AppStore } from '@/lib/types'
import { createItemsSlice } from './itemsSlice'
import { createPurchasesSlice } from './purchasesSlice'
import { createUISlice } from './uiSlice'
import { createSyncSlice } from './syncSlice'

export const useStore = create<AppStore>()(
  persist(
    (...a) => ({
      ...createItemsSlice(...a),
      ...createPurchasesSlice(...a),
      ...createUISlice(...a),
      ...createSyncSlice(...a),
    }),
    {
      name: 'chai-hissab-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist certain parts of the store
      partialize: (state) => ({
        items: state.items,
        purchases: state.purchases,
        selectedPeriod: state.selectedPeriod,
        selectedDate: state.selectedDate,
        darkMode: state.darkMode,
        pendingSyncs: state.pendingSyncs,
        lastSyncAt: state.lastSyncAt,
      }),
    }
  )
)

// Initialize online status listener and load data
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useStore.getState().setOnline(true)
    useStore.getState().syncWithSupabase()
  })
  
  window.addEventListener('offline', () => {
    useStore.getState().setOnline(false)
  })

  // Initialize dark mode from localStorage
  const isDark = useStore.getState().darkMode
  if (isDark) {
    document.documentElement.classList.add('dark')
  }

  // Load items from Supabase on app start
  useStore.getState().loadItems()
}