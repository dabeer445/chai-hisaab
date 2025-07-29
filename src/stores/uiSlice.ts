import type { StateCreator } from 'zustand'
import type { UISlice, PeriodType } from '@/lib/types'

export const createUISlice: StateCreator<
  UISlice,
  [],
  [],
  UISlice
> = (set) => ({
  selectedPeriod: 'month',
  selectedDate: new Date(),
  darkMode: false,
  isInstallPromptVisible: false,

  setSelectedPeriod: (period: PeriodType) => {
    set({ selectedPeriod: period })
  },

  setSelectedDate: (date: Date) => {
    set({ selectedDate: date })
  },

  toggleDarkMode: () => {
    set((state) => {
      const newDarkMode = !state.darkMode
      // Apply dark mode to document
      if (newDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return { darkMode: newDarkMode }
    })
  },

  setInstallPromptVisible: (visible: boolean) => {
    set({ isInstallPromptVisible: visible })
  },
})