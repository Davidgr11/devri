/**
 * Database Types
 *
 * TODO: Generate these types automatically from Supabase using:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.types.ts
 *
 * For now, using a placeholder Database type
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          full_name: string
          phone: string | null
          business_type: string | null
          business_subsector: string | null
          business_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          phone?: string | null
          business_type?: string | null
          business_subsector?: string | null
          business_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          phone?: string | null
          business_type?: string | null
          business_subsector?: string | null
          business_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Add more tables as needed
      [key: string]: any
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
