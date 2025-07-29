import type { StateCreator } from 'zustand'
import type { ItemsSlice, Item } from '@/lib/types'
import { itemsService } from '@/lib/supabaseService'

export const createItemsSlice: StateCreator<
  ItemsSlice,
  [],
  [],
  ItemsSlice
> = (set, get) => ({
  items: [],

  loadItems: async () => {
    try {
      const items = await itemsService.getAll()
      set({ items })
    } catch (error) {
      console.error('Failed to load items from Supabase:', error)
      // Fallback to default items if Supabase fails
      set({
        items: [
          {
            id: '1',
            name: 'Chai',
            current_price: 15,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '2', 
            name: 'Cigarettes',
            current_price: 20,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '3',
            name: 'Water',
            current_price: 10,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '4',
            name: 'Pratha',
            current_price: 25,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]
      })
    }
  },

  addItem: async (item) => {
    try {
      const newItem = await itemsService.create(item)
      set((state) => ({
        items: [...state.items, newItem],
      }))
    } catch (error) {
      console.error('Failed to add item to Supabase:', error)
      // Add locally if Supabase fails
      const fallbackItem: Item = {
        ...item,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      set((state) => ({
        items: [...state.items, fallbackItem],
      }))
    }
  },

  updateItem: async (id, updates) => {
    try {
      const updatedItem = await itemsService.update(id, updates)
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? updatedItem : item
        ),
      }))
    } catch (error) {
      console.error('Failed to update item in Supabase:', error)
      // Update locally if Supabase fails
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id
            ? { ...item, ...updates, updated_at: new Date().toISOString() }
            : item
        ),
      }))
    }
  },

  deleteItem: async (id) => {
    try {
      await itemsService.delete(id)
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      }))
    } catch (error) {
      console.error('Failed to delete item from Supabase:', error)
      // Delete locally if Supabase fails
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      }))
    }
  },

  getItemById: (id) => {
    return get().items.find((item) => item.id === id)
  },
})