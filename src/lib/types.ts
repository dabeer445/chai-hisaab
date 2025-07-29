export interface Item {
  id: string
  name: string
  current_price: number
  created_at: string
  updated_at: string
}

export interface Purchase {
  id: string
  item_id: string
  item_name: string // denormalized for quick access
  quantity: number
  unit_price: number
  total: number
  date: string
  created_at: string
}

export interface MonthlyBill {
  id: string
  month: number
  year: number
  amount_paid: number
  date_paid: string
  created_at: string
}

export type PeriodType = 'day' | 'week' | 'month'

export interface DateRange {
  from: Date
  to: Date
}

// Zustand store interfaces
export interface ItemsSlice {
  items: Item[]
  loadItems: () => Promise<void>
  addItem: (item: Omit<Item, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateItem: (id: string, updates: Partial<Pick<Item, 'name' | 'current_price'>>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  getItemById: (id: string) => Item | undefined
}

export interface PurchasesSlice {
  purchases: Purchase[]
  addPurchase: (purchase: Omit<Purchase, 'id' | 'created_at'>) => void
  updatePurchase: (id: string, updates: Partial<Purchase>) => void
  deletePurchase: (id: string) => void
  getPurchasesByDateRange: (from: Date, to: Date) => Purchase[]
  getTotalByDateRange: (from: Date, to: Date) => number
}

export interface UISlice {
  selectedPeriod: PeriodType
  selectedDate: Date
  darkMode: boolean
  isInstallPromptVisible: boolean
  setSelectedPeriod: (period: PeriodType) => void
  setSelectedDate: (date: Date) => void
  toggleDarkMode: () => void
  setInstallPromptVisible: (visible: boolean) => void
}

export interface SyncSlice {
  isOnline: boolean
  isLoading: boolean
  lastSyncAt: string | null
  pendingSyncs: Purchase[]
  error: string | null
  setOnline: (online: boolean) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  addPendingSync: (purchase: Purchase) => void
  removePendingSync: (purchaseId: string) => void
  syncWithSupabase: () => Promise<void>
}

export interface AppStore extends ItemsSlice, PurchasesSlice, UISlice, SyncSlice {}

// Analytics interfaces
export interface ExpenseAnalytics {
  totalSpent: number
  averageDaily: number
  topItems: Array<{
    item: Item
    quantity: number
    total: number
  }>
  dailyTotals: Array<{
    date: string
    total: number
  }>
}

// Notification interfaces
export interface NotificationSettings {
  dailyReminder: boolean
  reminderTime: string // HH:MM format
  weeklyReport: boolean
  monthlyReport: boolean
}