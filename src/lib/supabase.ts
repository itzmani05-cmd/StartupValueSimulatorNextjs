import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wwbvocmylfvyaocksise.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3YnZvY215bGZ2eWFvY2tzaXNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NDQ2NDcsImV4cCI6MjA3MTAyMDY0N30.Sr4Sbh3jq8OeqlnnO4M5BwvU08xg2Hj76LUQsAnG9fg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
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
      founders: {
        Row: {
          id: string
          company_id: string
          name: string
          equity_percentage: number
          shares: number
          role: string | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          equity_percentage: number
          shares: number
          role?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          equity_percentage?: number
          shares?: number
          role?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      funding_rounds: {
        Row: {
          id: string
          company_id: string
          name: string
          round_type: string
          capital_raised: number
          valuation: number
          valuation_type: string
          shares_issued: number | null
          share_price: number | null
          valuation_cap: number | null
          discount_rate: number | null
          conversion_trigger: string | null
          investors: any
          round_date: string
          notes: string | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          round_type: string
          capital_raised: number
          valuation: number
          valuation_type: string
          shares_issued?: number | null
          share_price?: number | null
          valuation_cap?: number | null
          discount_rate?: number | null
          conversion_trigger?: string | null
          investors: any
          round_date: string
          notes?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          round_type?: string
          capital_raised?: number
          valuation?: number
          valuation_type?: string
          shares_issued?: number | null
          share_price?: number | null
          valuation_cap?: number | null
          discount_rate?: number | null
          conversion_trigger?: string | null
          investors?: any
          round_date?: string
          notes?: string | null
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
          employee_id: string | null
          position: string | null
          department: string | null
          grant_date: string
          shares_granted: number
          vesting_schedule: string
          cliff_period: number
          vesting_frequency: string
          exercise_price: number
          status: string
          notes: string | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          employee_name: string
          employee_id?: string | null
          position?: string | null
          department?: string | null
          grant_date: string
          shares_granted: number
          vesting_schedule: string
          cliff_period?: number
          vesting_frequency?: string
          exercise_price?: number
          status?: string
          notes?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          employee_name?: string
          employee_id?: string | null
          position?: string | null
          department?: string | null
          grant_date?: string
          shares_granted?: number
          vesting_schedule?: string
          cliff_period?: number
          vesting_frequency?: string
          exercise_price?: number
          status?: string
          notes?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      company_settings: {
        Row: {
          id: string
          company_id: string
          current_valuation: number
          esop_pool_percentage: number
          total_shares: number
          exit_valuation: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          current_valuation?: number
          esop_pool_percentage?: number
          total_shares?: number
          exit_valuation?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          current_valuation?: number
          esop_pool_percentage?: number
          total_shares?: number
          exit_valuation?: number
          created_at?: string
          updated_at?: string
        }
      }
      scenarios: {
        Row: {
          id: string
          company_id: string
          name: string
          description: string | null
          data: any
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          description?: string | null
          data: any
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          description?: string | null
          data?: any
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          company_id: string
          entity_id: string
          entity_type: string
          user_name: string
          user_role: string | null
          content: string
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          entity_id: string
          entity_type: string
          user_name: string
          user_role?: string | null
          content: string
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          entity_id?: string
          entity_type?: string
          user_name?: string
          user_role?: string | null
          content?: string
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

// Utility function to test connection
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

// ===== COMPANY FUNCTIONS =====

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

export async function createCompany(companyData: Database['public']['Tables']['companies']['Insert']) {
  try {
    const { data, error } = await supabase
      .from('companies')
      .insert(companyData)
      .select()
      .single();

    if (error) {
      console.error('Error creating company:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to create company:', error);
    throw error;
  }
}

export async function updateCompany(companyId: string, updates: Database['public']['Tables']['companies']['Update']) {
  try {
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', companyId)
      .select()
      .single();

    if (error) {
      console.error('Error updating company:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to update company:', error);
    throw error;
  }
}

export async function deleteCompany(companyId: string) {
  try {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', companyId);

    if (error) {
      console.error('Error deleting company:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete company:', error);
    throw error;
  }
}

// ===== FOUNDER FUNCTIONS =====

export async function getFounders(companyId: string) {
  try {
    const { data, error } = await supabase
      .from('founders')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching founders:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch founders:', error);
    throw error;
  }
}

export async function createFounder(founderData: Database['public']['Tables']['founders']['Insert']) {
  try {
    const { data, error } = await supabase
      .from('founders')
      .insert(founderData)
      .select()
      .single();

    if (error) {
      console.error('Error creating founder:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to create founder:', error);
    throw error;
  }
}

export async function updateFounder(founderId: string, updates: Database['public']['Tables']['founders']['Update']) {
  try {
    const { data, error } = await supabase
      .from('founders')
      .update(updates)
      .eq('id', founderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating founder:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to update founder:', error);
    throw error;
  }
}

export async function deleteFounder(founderId: string) {
  try {
    const { error } = await supabase
      .from('founders')
      .delete()
      .eq('id', founderId);

    if (error) {
      console.error('Error deleting founder:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete founder:', error);
    throw error;
  }
}

// ===== FUNDING ROUNDS FUNCTIONS =====

export async function getFundingRounds(companyId: string) {
  try {
    const { data, error } = await supabase
      .from('funding_rounds')
      .select('*')
      .eq('company_id', companyId)
      .eq('is_active', true)
      .order('round_date', { ascending: true });

    if (error) {
      console.error('Error fetching funding rounds:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch funding rounds:', error);
    throw error;
  }
}

export async function createFundingRound(fundingRoundData: Database['public']['Tables']['funding_rounds']['Insert']) {
  try {
    const { data, error } = await supabase
      .from('funding_rounds')
      .insert(fundingRoundData)
      .select()
      .single();

    if (error) {
      console.error('Error creating funding round:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to create funding round:', error);
    throw error;
  }
}

export async function updateFundingRound(fundingRoundId: string, updates: Database['public']['Tables']['funding_rounds']['Update']) {
  try {
    const { data, error } = await supabase
      .from('funding_rounds')
      .update(updates)
      .eq('id', fundingRoundId)
      .select()
      .single();

    if (error) {
      console.error('Error updating funding round:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to update funding round:', error);
    throw error;
  }
}

export async function deleteFundingRound(fundingRoundId: string) {
  try {
    const { error } = await supabase
      .from('funding_rounds')
      .delete()
      .eq('id', fundingRoundId);

    if (error) {
      console.error('Error deleting funding round:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete funding round:', error);
    throw error;
  }
}

// ===== ESOP GRANTS FUNCTIONS =====

export async function getEsopGrants(companyId: string) {
  try {
    const { data, error } = await supabase
      .from('esop_grants')
      .select('*')
      .eq('company_id', companyId)
      .eq('is_active', true)
      .order('grant_date', { ascending: true });

    if (error) {
      console.error('Error fetching ESOP grants:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch ESOP grants:', error);
    throw error;
  }
}

export async function createEsopGrant(esopGrantData: Database['public']['Tables']['esop_grants']['Insert']) {
  try {
    const { data, error } = await supabase
      .from('esop_grants')
      .insert(esopGrantData)
      .select()
      .single();

    if (error) {
      console.error('Error creating ESOP grant:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to create ESOP grant:', error);
    throw error;
  }
}

export async function updateEsopGrant(esopGrantId: string, updates: Database['public']['Tables']['esop_grants']['Update']) {
  try {
    const { data, error } = await supabase
      .from('esop_grants')
      .update(updates)
      .eq('id', esopGrantId)
      .select()
      .single();

    if (error) {
      console.error('Error updating ESOP grant:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to update ESOP grant:', error);
    throw error;
  }
}

export async function deleteEsopGrant(esopGrantId: string) {
  try {
    const { error } = await supabase
      .from('esop_grants')
      .delete()
      .eq('id', esopGrantId);

    if (error) {
      console.error('Error deleting ESOP grant:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete ESOP grant:', error);
    throw error;
  }
}

// ===== COMPANY SETTINGS FUNCTIONS =====

export async function getCompanySettings(companyId: string) {
  try {
    const { data, error } = await supabase
      .from('company_settings')
      .select('*')
      .eq('company_id', companyId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No company settings found, return null instead of throwing error
        console.log('No company settings found for company:', companyId);
        return null;
      }
      console.error('Error fetching company settings:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch company settings:', error);
    throw error;
  }
}

export async function createCompanySettings(settingsData: Database['public']['Tables']['company_settings']['Insert']) {
  try {
    const { data, error } = await supabase
      .from('company_settings')
      .insert(settingsData)
      .select()
      .single();

    if (error) {
      console.error('Error creating company settings:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to create company settings:', error);
    throw error;
  }
}

export async function updateCompanySettings(companyId: string, updates: Database['public']['Tables']['company_settings']['Update']) {
  try {
    const { data, error } = await supabase
      .from('company_settings')
      .update(updates)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No company settings found, throw error to trigger creation
        throw new Error('Company settings not found');
      }
      console.error('Error updating company settings:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to update company settings:', error);
    throw error;
  }
}

// ===== SCENARIOS FUNCTIONS =====

export async function getScenarios(companyId: string) {
  try {
    const { data, error } = await supabase
      .from('scenarios')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching scenarios:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch scenarios:', error);
    throw error;
  }
}

export async function createScenario(scenarioData: Database['public']['Tables']['scenarios']['Insert']) {
  try {
    const { data, error } = await supabase
      .from('scenarios')
      .insert(scenarioData)
      .select()
      .single();

    if (error) {
      console.error('Error creating scenario:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to create scenario:', error);
    throw error;
  }
}

export async function updateScenario(scenarioId: string, updates: Database['public']['Tables']['scenarios']['Update']) {
  try {
    const { data, error } = await supabase
      .from('scenarios')
      .update(updates)
      .eq('id', scenarioId)
      .select()
      .single();

    if (error) {
      console.error('Error updating scenario:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to update scenario:', error);
    throw error;
  }
}

export async function deleteScenario(scenarioId: string) {
  try {
    const { error } = await supabase
      .from('scenarios')
      .delete()
      .eq('id', scenarioId);

    if (error) {
      console.error('Error deleting scenario:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete scenario:', error);
    throw error;
  }
}

// ===== COMMENTS FUNCTIONS =====

export async function getComments(companyId: string, entityId: string, entityType: string) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('company_id', companyId)
      .eq('entity_id', entityId)
      .eq('entity_type', entityType)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    throw error;
  }
}

export async function createComment(commentData: Database['public']['Tables']['comments']['Insert']) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert(commentData)
      .select()
      .single();

    if (error) {
      console.error('Error creating comment:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to create comment:', error);
    throw error;
  }
}

export async function updateComment(commentId: string, updates: Database['public']['Tables']['comments']['Update']) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .update(updates)
      .eq('id', commentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating comment:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to update comment:', error);
    throw error;
  }
}

export async function deleteComment(commentId: string) {
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete comment:', error);
    throw error;
  }
}

// ===== BULK OPERATIONS =====

export async function saveCompanyData(companyId: string, data: {
  founders: any[]
  fundingRounds: any[]
  esopGrants: any[]
  companySettings: any
}) {
  try {
    // Save founders
    if (data.founders && data.founders.length > 0) {
      for (const founder of data.founders) {
        if (founder.id && founder.id.startsWith('founder-')) {
          // New founder, create it
          await createFounder({
            company_id: companyId,
            name: founder.name,
            equity_percentage: founder.equityPercentage,
            shares: founder.shares,
            role: founder.role
          });
        } else {
          // Existing founder, update it
          await updateFounder(founder.id, {
            name: founder.name,
            equity_percentage: founder.equityPercentage,
            shares: founder.shares,
            role: founder.role
          });
        }
      }
    }

    // Save funding rounds
    if (data.fundingRounds && data.fundingRounds.length > 0) {
      for (const round of data.fundingRounds) {
        if (round.id && round.id.startsWith('round-')) {
                      // New round, create it
          await createFundingRound({
            company_id: companyId,
            name: round.name,
            round_type: round.roundType,
            capital_raised: round.capitalRaised,
            valuation: round.valuation,
            valuation_type: round.valuationType,
            shares_issued: round.sharesIssued,
            share_price: round.sharePrice,
            valuation_cap: round.valuationCap,
            discount_rate: round.discountRate,
            conversion_trigger: round.conversionTrigger,
            investors: round.investors,
            round_date: round.date,
            notes: round.notes
          });
        } else {
          // Existing round, update it
          await updateFundingRound(round.id, {
            name: round.name,
            round_type: round.roundType,
            capital_raised: round.capitalRaised,
            valuation: round.valuation,
            valuation_type: round.valuationType,
            shares_issued: round.sharesIssued,
            share_price: round.sharePrice,
            valuation_cap: round.valuationCap,
            discount_rate: round.discountRate,
            conversion_trigger: round.conversionTrigger,
            investors: round.investors,
            round_date: round.date,
            notes: round.notes
          });
        }
      }
    }

    // Save ESOP grants
    if (data.esopGrants && data.esopGrants.length > 0) {
      for (const grant of data.esopGrants) {
        if (grant.id && grant.id.startsWith('grant-')) {
          // New grant, create it
          await createEsopGrant({
            company_id: companyId,
            employee_name: grant.employeeName,
            employee_id: grant.employeeId,
            position: grant.position,
            department: grant.department,
            grant_date: grant.grantDate,
            shares_granted: grant.sharesGranted,
            vesting_schedule: grant.vestingSchedule,
            cliff_period: grant.cliffPeriod,
            vesting_frequency: grant.vestingFrequency,
            exercise_price: grant.exercisePrice,
            status: grant.status,
            notes: grant.notes
          });
        } else {
          // Existing grant, update it
          await updateEsopGrant(grant.id, {
            employee_name: grant.employeeName,
            employee_id: grant.employeeId,
            position: grant.position,
            department: grant.department,
            grant_date: grant.grantDate,
            shares_granted: grant.sharesGranted,
            vesting_schedule: grant.vestingSchedule,
            cliff_period: grant.cliffPeriod,
            vesting_frequency: grant.vestingFrequency,
            exercise_price: grant.exercisePrice,
            status: grant.status,
            notes: grant.notes
          });
        }
      }
    }

    // Save company settings
    if (data.companySettings) {
      try {
        await updateCompanySettings(companyId, {
          current_valuation: data.companySettings.currentValuation,
          esop_pool_percentage: data.companySettings.esopPool,
          total_shares: data.companySettings.totalShares,
          exit_valuation: data.companySettings.exitValuation
        });
        console.log('Company settings updated successfully');
      } catch (error) {
        // Settings don't exist, create them
        console.log('Company settings not found, creating new ones...');
        await createCompanySettings({
          company_id: companyId,
          current_valuation: data.companySettings.currentValuation,
          esop_pool_percentage: data.companySettings.esopPool,
          total_shares: data.companySettings.totalShares,
          exit_valuation: data.companySettings.exitValuation
        });
        console.log('Company settings created successfully');
      }
    }

    return true;
  } catch (error) {
    console.error('Failed to save company data:', error);
    throw error;
  }
}
