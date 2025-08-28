import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wwbvocmylfvyaocksise.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3YnZvY215bGZ2eWFvY2tzaXNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NDQ2NDcsImV4cCI6MjA3MTAyMDY0N30.Sr4Sbh3jq8OeqlnnO4M5BwvU08xg2Hj76LUQsAnG9fg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id?: string
          name: string
          description?: string
          industry?: string
          founded_date?: string
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          name: string
          description?: string
          industry?: string
          founded_date?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          name?: string
          description?: string
          industry?: string
          founded_date?: string
          is_active?: boolean
        }
      }
      scenarios: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          company_id: string
          name: string
          company_name: string
          total_shares: number
          current_valuation: number
          esop_pool: number
          exit_value: number
          founders: any
          funding_rounds: any
          stakeholders: any
          description?: string
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          company_id: string
          name: string
          company_name: string
          total_shares: number
          current_valuation: number
          esop_pool: number
          exit_value: number
          founders: any
          funding_rounds: any
          stakeholders: any
          description?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          company_id?: string
          name?: string
          company_name?: string
          total_shares?: number
          current_valuation?: number
          esop_pool?: number
          exit_value?: number
          founders?: any
          funding_rounds?: any
          stakeholders?: any
          description?: string
          is_active?: boolean
        }
      }
    }
  }
}
