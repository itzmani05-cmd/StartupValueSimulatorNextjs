import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wwbvocmylfvyaocksise.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3YnZvY215bGZ2eWFvY2tpc2UiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNTQ5NzE5MCwiZXhwIjoyMDUxMDczMTkwfQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          description: string | null
          industry: string | null
          founded_date: string | null
          user_id: string | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          industry?: string | null
          founded_date?: string | null
          user_id?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          industry?: string | null
          founded_date?: string | null
          user_id?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      esop_grants: {
        Row: {
          id: string
          company_id: string
          employee_name: string
          grant_date: string
          total_shares: number
          exercise_price: number
          vesting_years: number
          vesting_cliff_months: number
          vesting_frequency: string
          current_vested_shares: number
          exercised_shares: number
          departure_date: string | null
          departure_type: string | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          employee_name: string
          grant_date: string
          total_shares: number
          exercise_price?: number
          vesting_years?: number
          vesting_cliff_months?: number
          vesting_frequency?: string
          current_vested_shares?: number
          exercised_shares?: number
          departure_date?: string | null
          departure_type?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          employee_name?: string
          grant_date?: string
          total_shares?: number
          exercise_price?: number
          vesting_years?: number
          vesting_cliff_months?: number
          vesting_frequency?: string
          current_vested_shares?: number
          exercised_shares?: number
          departure_date?: string | null
          departure_type?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      scenarios: {
        Row: {
          id: string
          company_id: string
          name: string
          data: {
            founders: Array<{
              id: string
              name: string
              shares: number
              ownership: number
              value: number
              initialOwnership: number
              dilutionHistory: number[]
            }>
            fundingRounds: Array<{
              id: string
              name: string
              capitalRaised: number
              valuation: number
              type: 'priced' | 'safe' | 'convertible_note'
              esopAdjustment: number
              preMoneyValuation: number
              postMoneyValuation: number
              investorOwnership: number
              founderDilution: number
            }>
            esopPool: number
            esopGrants: Array<{
              id: string
              employeeName: string
              grantDate: string
              totalShares: number
              exercisePrice: number
              vestingSchedule: {
                type: 'standard' | 'custom'
                years: number
                cliffMonths: number
                vestingFrequency: 'monthly' | 'quarterly' | 'annually'
                customSchedule?: Array<{ month: number; percentage: number }>
              }
              currentVestedShares: number
              exercisedShares: number
              departureDate?: string
              departureType?: 'voluntary' | 'involuntary' | 'retirement' | 'death'
              taxImplications: {
                exerciseCost: number
                estimatedAMT: number
                capitalGainsTax: number
                totalTaxBurden: number
              }
            }>
            exitValuation: number
            totalShares: number
          }
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          data: {
            founders: Array<{
              id: string
              name: string
              shares: number
              ownership: number
              value: number
              initialOwnership: number
              dilutionHistory: number[]
            }>
            fundingRounds: Array<{
              id: string
              name: string
              capitalRaised: number
              valuation: number
              type: 'priced' | 'safe' | 'convertible_note'
              esopAdjustment: number
              preMoneyValuation: number
              postMoneyValuation: number
              investorOwnership: number
              founderDilution: number
            }>
            esopPool: number
            esopGrants: Array<{
              id: string
              employeeName: string
              grantDate: string
              totalShares: number
              exercisePrice: number
              vestingSchedule: {
                type: 'standard' | 'custom'
                years: number
                cliffMonths: number
                vestingFrequency: 'monthly' | 'quarterly' | 'annually'
                customSchedule?: Array<{ month: number; percentage: number }>
              }
              currentVestedShares: number
              exercisedShares: number
              departureDate?: string
              departureType?: 'voluntary' | 'involuntary' | 'retirement' | 'death'
              taxImplications: {
                exerciseCost: number
                estimatedAMT: number
                capitalGainsTax: number
                totalTaxBurden: number
              }
            }>
            exitValuation: number
            totalShares: number
          }
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          data?: {
            founders: Array<{
              id: string
              name: string
              shares: number
              ownership: number
              value: number
              initialOwnership: number
              dilutionHistory: number[]
            }>
            fundingRounds: Array<{
              id: string
              name: string
              capitalRaised: number
              valuation: number
              type: 'priced' | 'safe' | 'convertible_note'
              esopAdjustment: number
              preMoneyValuation: number
              postMoneyValuation: number
              investorOwnership: number
              founderDilution: number
            }>
            esopPool: number
            esopGrants: Array<{
              id: string
              employeeName: string
              grantDate: string
              totalShares: number
              exercisePrice: number
              vestingSchedule: {
                type: 'standard' | 'custom'
                years: number
                cliffMonths: number
                vestingFrequency: 'monthly' | 'quarterly' | 'annually'
                customSchedule?: Array<{ month: number; percentage: number }>
              }
              currentVestedShares: number
              exercisedShares: number
              departureDate?: string
              departureType?: 'voluntary' | 'involuntary' | 'retirement' | 'death'
              taxImplications: {
                exerciseCost: number
                estimatedAMT: number
                capitalGainsTax: number
                totalTaxBurden: number
              }
            }>
            exitValuation: number
            totalShares: number
          }
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Utility function to test connection (call this when needed, not at module load)
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    } else {
      console.log('Supabase connection test successful');
      return true;
    }
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
}

// Function to read companies from the database
export async function getCompanies() {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch companies:', error);
    throw error;
  }
}

// Function to read companies for a specific user
export async function getUserCompanies(userId: string) {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user companies:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch user companies:', error);
    throw error;
  }
}

// Function to read a specific company by ID
export async function getCompanyById(companyId: string) {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();

    if (error) {
      console.error('Error fetching company:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch company:', error);
    throw error;
  }
}
