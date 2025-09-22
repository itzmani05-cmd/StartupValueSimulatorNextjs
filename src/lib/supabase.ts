import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wwbvocmylfvyaocksise.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3YnZvY215bGZ2eWFvY2tzaXNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NDQ2NDcsImV4cCI6MjA3MTAyMDY0N30.Sr4Sbh3jq8OeqlnnO4M5BwvU08xg2Hj76LUQsAnG9fg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Fallback mode flag - Start with database-first approach
let useFallbackMode = false; // Try database first, fallback only on errors

// Local storage keys
const STORAGE_KEYS = {
  companies: 'startup_simulator_companies',
  founders: 'startup_simulator_founders',
  fundingRounds: 'startup_simulator_funding_rounds',
  esopGrants: 'startup_simulator_esop_grants',
  companySettings: 'startup_simulator_company_settings',
  scenarios: 'startup_simulator_scenarios',
  comments: 'startup_simulator_comments'
};

// Local storage utilities
const LocalStorage = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  },
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  generateId: () => {
    return 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
};

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
          initial_ownership: number
          current_ownership: number
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
          initial_ownership: number
          current_ownership: number
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
          initial_ownership?: number
          current_ownership?: number
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
          investment_amount: number
          valuation: number
          pre_money_valuation: number
          post_money_valuation: number
          valuation_type: string
          shares_issued: number | null
          price_per_share: number | null
          order_number: number
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
          investment_amount: number
          valuation: number
          pre_money_valuation: number
          post_money_valuation: number
          valuation_type: string
          shares_issued?: number | null
          price_per_share?: number | null
          order_number: number
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
          investment_amount?: number
          valuation?: number
          pre_money_valuation?: number
          post_money_valuation?: number
          valuation_type?: string
          shares_issued?: number | null
          price_per_share?: number | null
          order_number?: number
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
      console.warn('Supabase connection test failed, switching to fallback mode:', error);
      useFallbackMode = true;
      return false;
    } else {
      console.log('Supabase connection test successful');
      useFallbackMode = false;
      return true;
    }
  } catch (error) {
    console.warn('Supabase connection test error, switching to fallback mode:', error);
    useFallbackMode = true;
    return false;
  }
}

// Initialize with sample data if localStorage is empty AND in fallback mode
const initializeSampleData = () => {
  if (useFallbackMode) {
    const companies = LocalStorage.get(STORAGE_KEYS.companies);
    if (companies.length === 0) {
      const sampleCompanies = [
        {
          id: 'local_sample_1',
          name: 'TechStart Inc.',
          description: 'AI-powered SaaS platform for business automation',
          industry: 'Technology',
          founded_date: '2023-01-01',
          user_id: null,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'local_sample_2',
          name: 'GreenTech Solutions',
          description: 'Renewable energy solutions for modern businesses',
          industry: 'Clean Energy',
          founded_date: '2022-06-15',
          user_id: null,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      LocalStorage.set(STORAGE_KEYS.companies, sampleCompanies);
      console.log('✅ Initialized sample companies in localStorage');
    }
  }
};

// Initialize connection test
testSupabaseConnection();
initializeSampleData();

// ===== COMPANY FUNCTIONS =====

export async function getCompanies() {
  if (useFallbackMode) {
    // Fallback to localStorage
    const companies = LocalStorage.get(STORAGE_KEYS.companies);
    console.log('✅ Companies loaded from fallback mode:', companies.length, 'companies');
    return companies;
  }

  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching companies:', error);
      // Check if it's a network error
      if (error.message.includes('Failed to fetch') || error.message.includes('ERR_NAME_NOT_RESOLVED')) {
        console.warn('Network error detected, switching to fallback mode');
        useFallbackMode = true;
        return await getCompanies();
      }
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch companies, switching to fallback mode:', error);
    useFallbackMode = true;
    return await getCompanies();
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
  if (useFallbackMode) {
    // Fallback to localStorage
    const companies = LocalStorage.get(STORAGE_KEYS.companies);
    const newCompany = {
      id: LocalStorage.generateId(),
      name: companyData.name,
      description: companyData.description || '',
      industry: companyData.industry || 'Technology',
      founded_date: companyData.founded_date || new Date().toISOString(),
      user_id: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    companies.push(newCompany);
    LocalStorage.set(STORAGE_KEYS.companies, companies);
    console.log('✅ Company created successfully using fallback mode:', newCompany);
    return newCompany;
  }

  try {
    const { data, error } = await supabase
      .from('companies')
      .insert(companyData)
      .select()
      .single();

    if (error) {
      console.error('Error creating company:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await createCompany(companyData);
    }

    return data;
  } catch (error) {
    console.error('Failed to create company, switching to fallback mode:', error);
    useFallbackMode = true;
    return await createCompany(companyData);
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
  if (useFallbackMode) {
    // Fallback to localStorage
    const founders = LocalStorage.get(STORAGE_KEYS.founders);
    const companyFounders = founders.filter((f: any) => f.company_id === companyId);
    console.log('✅ Founders loaded from fallback mode:', companyFounders.length, 'founders');
    return companyFounders;
  }

  try {
    const { data, error } = await supabase
      .from('founders')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching founders:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await getFounders(companyId);
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch founders, switching to fallback mode:', error);
    useFallbackMode = true;
    return await getFounders(companyId);
  }
}

export async function createFounder(founderData: Database['public']['Tables']['founders']['Insert']) {
  if (useFallbackMode) {
    // Fallback to localStorage
    const founders = LocalStorage.get(STORAGE_KEYS.founders);
    const newFounder = {
      id: LocalStorage.generateId(),
      company_id: founderData.company_id,
      name: founderData.name,
      equity_percentage: founderData.equity_percentage,
      shares: founderData.shares,
      role: founderData.role || '',
      initial_ownership: founderData.initial_ownership,
      current_ownership: founderData.current_ownership,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    founders.push(newFounder);
    LocalStorage.set(STORAGE_KEYS.founders, founders);
    console.log('✅ Founder created successfully using fallback mode:', newFounder);
    return newFounder;
  }

  try {
    const { data, error } = await supabase
      .from('founders')
      .insert(founderData)
      .select()
      .single();

    if (error) {
      console.error('Error creating founder:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await createFounder(founderData);
    }

    return data;
  } catch (error) {
    console.error('Failed to create founder, switching to fallback mode:', error);
    useFallbackMode = true;
    return await createFounder(founderData);
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
  if (useFallbackMode) {
    // Fallback to localStorage
    const fundingRounds = LocalStorage.get(STORAGE_KEYS.fundingRounds);
    const companyRounds = fundingRounds.filter((r: any) => r.company_id === companyId);
    console.log('✅ Funding rounds loaded from fallback mode:', companyRounds.length, 'rounds');
    return companyRounds;
  }

  try {
    const { data, error } = await supabase
      .from('funding_rounds')
      .select('*')
      .eq('company_id', companyId)
      .eq('is_active', true)
      .order('round_date', { ascending: true });

    if (error) {
      console.error('Error fetching funding rounds:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await getFundingRounds(companyId);
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch funding rounds, switching to fallback mode:', error);
    useFallbackMode = true;
    return await getFundingRounds(companyId);
  }
}

export async function createFundingRound(fundingRoundData: Database['public']['Tables']['funding_rounds']['Insert']) {
  if (useFallbackMode) {
    // Fallback to localStorage
    const fundingRounds = LocalStorage.get(STORAGE_KEYS.fundingRounds);
    const newRound = {
      id: LocalStorage.generateId(),
      company_id: fundingRoundData.company_id,
      name: fundingRoundData.name,
      round_type: fundingRoundData.round_type,
      capital_raised: fundingRoundData.capital_raised,
      investment_amount: fundingRoundData.investment_amount,
      valuation: fundingRoundData.valuation,
      pre_money_valuation: fundingRoundData.pre_money_valuation,
      post_money_valuation: fundingRoundData.post_money_valuation,
      valuation_type: fundingRoundData.valuation_type,
      shares_issued: fundingRoundData.shares_issued,
      price_per_share: fundingRoundData.price_per_share,
      order_number: fundingRoundData.order_number,
      investors: fundingRoundData.investors,
      round_date: fundingRoundData.round_date,
      notes: fundingRoundData.notes,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    fundingRounds.push(newRound);
    LocalStorage.set(STORAGE_KEYS.fundingRounds, fundingRounds);
    console.log('✅ Funding round created successfully using fallback mode:', newRound);
    return newRound;
  }

  try {
    const { data, error } = await supabase
      .from('funding_rounds')
      .insert(fundingRoundData)
      .select()
      .single();

    if (error) {
      console.error('Error creating funding round:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await createFundingRound(fundingRoundData);
    }

    return data;
  } catch (error) {
    console.error('Failed to create funding round, switching to fallback mode:', error);
    useFallbackMode = true;
    return await createFundingRound(fundingRoundData);
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
  if (useFallbackMode) {
    // Fallback to localStorage
    const esopGrants = LocalStorage.get(STORAGE_KEYS.esopGrants);
    const companyGrants = esopGrants.filter((g: any) => g.company_id === companyId);
    console.log('✅ ESOP grants loaded from fallback mode:', companyGrants.length, 'grants');
    return companyGrants;
  }

  try {
    const { data, error } = await supabase
      .from('esop_grants')
      .select('*')
      .eq('company_id', companyId)
      .eq('is_active', true)
      .order('grant_date', { ascending: true });

    if (error) {
      console.error('Error fetching ESOP grants:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await getEsopGrants(companyId);
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch ESOP grants, switching to fallback mode:', error);
    useFallbackMode = true;
    return await getEsopGrants(companyId);
  }
}

export async function createEsopGrant(esopGrantData: Database['public']['Tables']['esop_grants']['Insert']) {
  if (useFallbackMode) {
    // Fallback to localStorage
    const esopGrants = LocalStorage.get(STORAGE_KEYS.esopGrants);
    const newGrant = {
      id: LocalStorage.generateId(),
      company_id: esopGrantData.company_id,
      employee_name: esopGrantData.employee_name,
      employee_id: esopGrantData.employee_id,
      position: esopGrantData.position,
      department: esopGrantData.department,
      grant_date: esopGrantData.grant_date,
      shares_granted: esopGrantData.shares_granted,
      vesting_schedule: esopGrantData.vesting_schedule,
      cliff_period: esopGrantData.cliff_period || 12,
      vesting_frequency: esopGrantData.vesting_frequency || 'monthly',
      exercise_price: esopGrantData.exercise_price || 0,
      status: esopGrantData.status || 'active',
      notes: esopGrantData.notes,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    esopGrants.push(newGrant);
    LocalStorage.set(STORAGE_KEYS.esopGrants, esopGrants);
    console.log('✅ ESOP grant created successfully using fallback mode:', newGrant);
    return newGrant;
  }

  try {
    const { data, error } = await supabase
      .from('esop_grants')
      .insert(esopGrantData)
      .select()
      .single();

    if (error) {
      console.error('Error creating ESOP grant:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await createEsopGrant(esopGrantData);
    }

    return data;
  } catch (error) {
    console.error('Failed to create ESOP grant, switching to fallback mode:', error);
    useFallbackMode = true;
    return await createEsopGrant(esopGrantData);
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
  if (useFallbackMode) {
    // Fallback to localStorage
    const settings = LocalStorage.get(STORAGE_KEYS.companySettings);
    const newSettings = {
      id: LocalStorage.generateId(),
      company_id: settingsData.company_id,
      current_valuation: settingsData.current_valuation || 1000000,
      esop_pool_percentage: settingsData.esop_pool_percentage || 10,
      total_shares: settingsData.total_shares || 10000000,
      exit_valuation: settingsData.exit_valuation || 10000000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    settings.push(newSettings);
    LocalStorage.set(STORAGE_KEYS.companySettings, settings);
    console.log('✅ Company settings created successfully using fallback mode:', newSettings);
    return newSettings;
  }

  try {
    const { data, error } = await supabase
      .from('company_settings')
      .insert(settingsData)
      .select()
      .single();

    if (error) {
      console.error('Error creating company settings:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await createCompanySettings(settingsData);
    }

    return data;
  } catch (error) {
    console.error('Failed to create company settings, switching to fallback mode:', error);
    useFallbackMode = true;
    return await createCompanySettings(settingsData);
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
  if (useFallbackMode) {
    // Fallback to localStorage
    const scenarios = LocalStorage.get(STORAGE_KEYS.scenarios);
    const companyScenarios = scenarios.filter((s: any) => s.company_id === companyId);
    console.log('✅ Scenarios loaded from fallback mode:', companyScenarios.length, 'scenarios');
    return companyScenarios;
  }

  try {
    const { data, error } = await supabase
      .from('scenarios')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching scenarios:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await getScenarios(companyId);
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch scenarios, switching to fallback mode:', error);
    useFallbackMode = true;
    return await getScenarios(companyId);
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
            role: founder.role,
            initial_ownership: founder.equityPercentage,
            current_ownership: founder.equityPercentage
          });
        } else {
          // Existing founder, update it
          await updateFounder(founder.id, {
            name: founder.name,
            equity_percentage: founder.equityPercentage,
            shares: founder.shares,
            role: founder.role,
            initial_ownership: founder.equityPercentage,
            current_ownership: founder.equityPercentage
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
            investment_amount: round.capitalRaised,
            valuation: round.valuation,
            pre_money_valuation: round.valuation,
            post_money_valuation: round.valuation + round.capitalRaised,
            valuation_type: round.valuationType,
            shares_issued: round.sharesIssued,
            price_per_share: round.sharePrice,
            order_number: 1,
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
            investment_amount: round.capitalRaised,
            valuation: round.valuation,
            pre_money_valuation: round.valuation,
            post_money_valuation: round.valuation + round.capitalRaised,
            valuation_type: round.valuationType,
            shares_issued: round.sharesIssued,
            price_per_share: round.sharePrice,
            order_number: 1,
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
