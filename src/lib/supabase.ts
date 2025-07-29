import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      items: {
        Row: {
          id: string
          name: string
          current_price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          current_price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          current_price?: number
          updated_at?: string
        }
      }
      purchases: {
        Row: {
          id: string
          item_id: string
          item_name: string
          quantity: number
          unit_price: number
          total: number
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          item_id: string
          item_name: string
          quantity: number
          unit_price: number
          total: number
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          item_name?: string
          quantity?: number
          unit_price?: number
          total?: number
          date?: string
        }
      }
      monthly_bills: {
        Row: {
          id: string
          month: number
          year: number
          amount_paid: number
          date_paid: string
          created_at: string
        }
        Insert: {
          id?: string
          month: number
          year: number
          amount_paid: number
          date_paid: string
          created_at?: string
        }
        Update: {
          id?: string
          month?: number
          year?: number
          amount_paid?: number
          date_paid?: string
        }
      }
    }
  }
}