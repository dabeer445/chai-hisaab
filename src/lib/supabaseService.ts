import { supabase } from './supabase'
import type { Item, Purchase, MonthlyBill } from './types'

// Items service
export const itemsService = {
  async getAll(): Promise<Item[]> {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  },

  async create(item: Omit<Item, 'id' | 'created_at' | 'updated_at'>): Promise<Item> {
    const { data, error } = await supabase
      .from('items')
      .insert(item)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Pick<Item, 'name' | 'current_price'>>): Promise<Item> {
    const { data, error } = await supabase
      .from('items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}

// Purchases service
export const purchasesService = {
  async getAll(): Promise<Purchase[]> {
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .order('date', { ascending: false })

    if (error) throw error
    return data || []
  },

  async create(purchase: Omit<Purchase, 'id' | 'created_at'>): Promise<Purchase> {
    const { data, error } = await supabase
      .from('purchases')
      .insert(purchase)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Purchase>): Promise<Purchase> {
    const { data, error } = await supabase
      .from('purchases')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('purchases')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async getByDateRange(from: Date, to: Date): Promise<Purchase[]> {
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .gte('date', from.toISOString().split('T')[0])
      .lte('date', to.toISOString().split('T')[0])
      .order('date', { ascending: false })

    if (error) throw error
    return data || []
  },
}

// Monthly bills service
export const monthlyBillsService = {
  async getAll(): Promise<MonthlyBill[]> {
    const { data, error } = await supabase
      .from('monthly_bills')
      .select('*')
      .order('year', { ascending: false })
      .order('month', { ascending: false })

    if (error) throw error
    return data || []
  },

  async create(bill: Omit<MonthlyBill, 'id' | 'created_at'>): Promise<MonthlyBill> {
    const { data, error } = await supabase
      .from('monthly_bills')
      .insert(bill)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<MonthlyBill>): Promise<MonthlyBill> {
    const { data, error } = await supabase
      .from('monthly_bills')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('monthly_bills')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}