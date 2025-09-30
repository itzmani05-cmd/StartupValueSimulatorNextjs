import { createClient } from '@supabase/supabase-js'

// Use VITE_ prefix for environment variables in Vite applications
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_SUPABASE_PROJECT_ID.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Fallback mode flag
let useFallbackMode = false;

// Export function to check fallback mode
export const isRunningInFallbackMode = () => useFallbackMode;

// Local storage keys
const STORAGE_KEYS = {
  companies: 'startup_simulator_companies',
  founders: 'startup_simulator_founders',
  fundingRounds: 'startup_simulator_funding_rounds',
  esopGrants: 'startup_simulator_esop_grants',
  companySettings: 'startup_simulator_company_settings',
  scenarios: 'startup_simulator_scenarios',
  comments: 'startup_simulator_comments',
  users: 'startup_simulator_users' // Added users key
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
          phone: string | null
          company: string | null
          role: string | null
          preferences: any | null
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          phone?: string | null
          company?: string | null
          role?: string | null
          preferences?: any | null
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          phone?: string | null
          company?: string | null
          role?: string | null
          preferences?: any | null
          last_login?: string | null
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

// Initialize connection test
testSupabaseConnection();

// ===== USER FUNCTIONS =====

export async function getUserById(userId: string) {
  if (useFallbackMode) {
    // Fallback to localStorage
    const users = LocalStorage.get(STORAGE_KEYS.users);
    const user = users.find((u: any) => u.id === userId);
    console.log('✅ User loaded from fallback mode:', user);
    return user || null;
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await getUserById(userId);
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch user, switching to fallback mode:', error);
    useFallbackMode = true;
    return await getUserById(userId);
  }
}

export async function createUser(userData: Database['public']['Tables']['users']['Insert']) {
  if (useFallbackMode) {
    // Fallback to localStorage
    const users = LocalStorage.get(STORAGE_KEYS.users);
    const newUser = {
      id: userData.id || LocalStorage.generateId(),
      email: userData.email,
      name: userData.name || '',
      phone: userData.phone || null,
      company: userData.company || null,
      role: userData.role || null,
      preferences: userData.preferences || null,
      last_login: userData.last_login || new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    users.push(newUser);
    LocalStorage.set(STORAGE_KEYS.users, users);
    console.log('✅ User created successfully using fallback mode:', newUser);
    return newUser;
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await createUser(userData);
    }

    return data;
  } catch (error) {
    console.error('Failed to create user, switching to fallback mode:', error);
    useFallbackMode = true;
    return await createUser(userData);
  }
}

export async function updateUser(userId: string, updates: Database['public']['Tables']['users']['Update']) {
  if (useFallbackMode) {
    // Fallback to localStorage
    const users = LocalStorage.get(STORAGE_KEYS.users);
    const userIndex = users.findIndex((u: any) => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates, updated_at: new Date().toISOString() };
      LocalStorage.set(STORAGE_KEYS.users, users);
      console.log('✅ User updated successfully using fallback mode:', users[userIndex]);
      return users[userIndex];
    }
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await updateUser(userId, updates);
    }

    return data;
  } catch (error) {
    console.error('Failed to update user, switching to fallback mode:', error);
    useFallbackMode = true;
    return await updateUser(userId, updates);
  }
}

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
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await getCompanies();
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch companies, switching to fallback mode:', error);
    useFallbackMode = true;
    return await getCompanies();
  }
}

export async function getUserCompanies(userId: string) {
  if (useFallbackMode) {
    // Fallback to localStorage
    const companies = LocalStorage.get(STORAGE_KEYS.companies);
    const userCompanies = companies.filter((c: any) => c.user_id === userId);
    console.log('✅ User companies loaded from fallback mode:', userCompanies.length, 'companies');
    return userCompanies;
  }

  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user companies:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await getUserCompanies(userId);
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch user companies, switching to fallback mode:', error);
    useFallbackMode = true;
    return await getUserCompanies(userId);
  }
}

export async function getCompanyById(companyId: string) {
  if (useFallbackMode) {
    // Fallback to localStorage
    const companies = LocalStorage.get(STORAGE_KEYS.companies);
    const company = companies.find((c: any) => c.id === companyId);
    console.log('✅ Company loaded from fallback mode:', company);
    return company || null;
  }

  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();

    if (error) {
      console.error('Error fetching company:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await getCompanyById(companyId);
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch company, switching to fallback mode:', error);
    useFallbackMode = true;
    return await getCompanyById(companyId);
  }
}

export async function createCompany(companyData: Database['public']['Tables']['companies']['Insert']) {
  if (useFallbackMode) {
    // Fallback to localStorage
    const companies = LocalStorage.get(STORAGE_KEYS.companies);
    const newCompany = {
      id: companyData.id || LocalStorage.generateId(),
      name: companyData.name,
      description: companyData.description || '',
      industry: companyData.industry || 'Technology',
      founded_date: companyData.founded_date || new Date().toISOString(),
      user_id: companyData.user_id || null,
      is_active: companyData.is_active !== undefined ? companyData.is_active : true,
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
  if (useFallbackMode) {
    // Fallback to localStorage
    const companies = LocalStorage.get(STORAGE_KEYS.companies);
    const companyIndex = companies.findIndex((c: any) => c.id === companyId);
    if (companyIndex !== -1) {
      companies[companyIndex] = { ...companies[companyIndex], ...updates, updated_at: new Date().toISOString() };
      LocalStorage.set(STORAGE_KEYS.companies, companies);
      console.log('✅ Company updated successfully using fallback mode:', companies[companyIndex]);
      return companies[companyIndex];
    }
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', companyId)
      .select()
      .single();

    if (error) {
      console.error('Error updating company:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await updateCompany(companyId, updates);
    }

    return data;
  } catch (error) {
    console.error('Failed to update company, switching to fallback mode:', error);
    useFallbackMode = true;
    return await updateCompany(companyId, updates);
  }
}

export async function deleteCompany(companyId: string) {
  if (useFallbackMode) {
    // Fallback to localStorage
    const companies = LocalStorage.get(STORAGE_KEYS.companies);
    const filteredCompanies = companies.filter((c: any) => c.id !== companyId);
    LocalStorage.set(STORAGE_KEYS.companies, filteredCompanies);
    console.log('✅ Company deleted successfully using fallback mode');
    return true;
  }

  try {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', companyId);

    if (error) {
      console.error('Error deleting company:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await deleteCompany(companyId);
    }

    return true;
  } catch (error) {
    console.error('Failed to delete company, switching to fallback mode:', error);
    useFallbackMode = true;
    return await deleteCompany(companyId);
  }
}

// ===== COMPANY DATA MANAGEMENT FUNCTIONS =====

export async function saveCompanyData(companyId: string, companyData: any) {
  if (useFallbackMode) {
    // Fallback to localStorage - save all company data in a single object
    const companies = LocalStorage.get(STORAGE_KEYS.companies);
    const companyIndex = companies.findIndex((c: any) => c.id === companyId);
    
    if (companyIndex !== -1) {
      // Update existing company data
      companies[companyIndex] = { 
        ...companies[companyIndex], 
        ...companyData,
        updated_at: new Date().toISOString()
      };
      LocalStorage.set(STORAGE_KEYS.companies, companies);
      
      // Also save related data to their respective storage keys
      if (companyData.founders) {
        const founders = LocalStorage.get(STORAGE_KEYS.founders);
        const filteredFounders = founders.filter((f: any) => f.company_id !== companyId);
        const updatedFounders = [...filteredFounders, ...companyData.founders.map((f: any) => ({ ...f, company_id: companyId }))];
        LocalStorage.set(STORAGE_KEYS.founders, updatedFounders);
      }
      
      if (companyData.fundingRounds) {
        const fundingRounds = LocalStorage.get(STORAGE_KEYS.fundingRounds);
        const filteredFundingRounds = fundingRounds.filter((fr: any) => fr.company_id !== companyId);
        const updatedFundingRounds = [...filteredFundingRounds, ...companyData.fundingRounds.map((fr: any) => ({ ...fr, company_id: companyId }))];
        LocalStorage.set(STORAGE_KEYS.fundingRounds, updatedFundingRounds);
      }
      
      if (companyData.esopGrants) {
        const esopGrants = LocalStorage.get(STORAGE_KEYS.esopGrants);
        const filteredEsopGrants = esopGrants.filter((eg: any) => eg.company_id !== companyId);
        const updatedEsopGrants = [...filteredEsopGrants, ...companyData.esopGrants.map((eg: any) => ({ ...eg, company_id: companyId }))];
        LocalStorage.set(STORAGE_KEYS.esopGrants, updatedEsopGrants);
      }
      
      if (companyData.companySettings) {
        const settings = LocalStorage.get(STORAGE_KEYS.companySettings);
        const settingIndex = settings.findIndex((s: any) => s.company_id === companyId);
        if (settingIndex !== -1) {
          settings[settingIndex] = { 
            ...settings[settingIndex], 
            ...companyData.companySettings,
            updated_at: new Date().toISOString()
          };
        } else {
          settings.push({
            id: LocalStorage.generateId(),
            company_id: companyId,
            ...companyData.companySettings,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
        LocalStorage.set(STORAGE_KEYS.companySettings, settings);
      }
      
      console.log('✅ Company data saved successfully using fallback mode');
      return companies[companyIndex];
    }
    return null;
  }

  try {
    // Save company settings
    if (companyData.companySettings) {
      const settings = await getCompanySettings(companyId);
      if (settings) {
        await updateCompanySettings(companyId, companyData.companySettings);
      } else {
        await createCompanySettings({
          company_id: companyId,
          ...companyData.companySettings
        });
      }
    }
    
    console.log('✅ Company data saved successfully');
    return await getCompanyById(companyId);
  } catch (error) {
    console.error('Failed to save company data, switching to fallback mode:', error);
    useFallbackMode = true;
    return await saveCompanyData(companyId, companyData);
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
      id: founderData.id || LocalStorage.generateId(),
      company_id: founderData.company_id,
      name: founderData.name,
      equity_percentage: founderData.equity_percentage,
      shares: founderData.shares,
      role: founderData.role || null,
      initial_ownership: founderData.initial_ownership,
      current_ownership: founderData.current_ownership,
      is_active: founderData.is_active !== undefined ? founderData.is_active : true,
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
  if (useFallbackMode) {
    // Fallback to localStorage
    const founders = LocalStorage.get(STORAGE_KEYS.founders);
    const founderIndex = founders.findIndex((f: any) => f.id === founderId);
    if (founderIndex !== -1) {
      founders[founderIndex] = { ...founders[founderIndex], ...updates, updated_at: new Date().toISOString() };
      LocalStorage.set(STORAGE_KEYS.founders, founders);
      console.log('✅ Founder updated successfully using fallback mode:', founders[founderIndex]);
      return founders[founderIndex];
    }
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('founders')
      .update(updates)
      .eq('id', founderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating founder:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await updateFounder(founderId, updates);
    }

    return data;
  } catch (error) {
    console.error('Failed to update founder, switching to fallback mode:', error);
    useFallbackMode = true;
    return await updateFounder(founderId, updates);
  }
}

export async function deleteFounder(founderId: string) {
  if (useFallbackMode) {
    // Fallback to localStorage
    const founders = LocalStorage.get(STORAGE_KEYS.founders);
    const filteredFounders = founders.filter((f: any) => f.id !== founderId);
    LocalStorage.set(STORAGE_KEYS.founders, filteredFounders);
    console.log('✅ Founder deleted successfully using fallback mode');
    return true;
  }

  try {
    const { error } = await supabase
      .from('founders')
      .delete()
      .eq('id', founderId);

    if (error) {
      console.error('Error deleting founder:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await deleteFounder(founderId);
    }

    return true;
  } catch (error) {
    console.error('Failed to delete founder, switching to fallback mode:', error);
    useFallbackMode = true;
    return await deleteFounder(founderId);
  }
}

// ===== FUNDING ROUNDS FUNCTIONS =====

export async function getFundingRounds(companyId: string) {
  if (useFallbackMode) {
    // Fallback to localStorage
    const fundingRounds = LocalStorage.get(STORAGE_KEYS.fundingRounds);
    const companyFundingRounds = fundingRounds.filter((fr: any) => fr.company_id === companyId && fr.is_active !== false);
    console.log('✅ Funding rounds loaded from fallback mode:', companyFundingRounds.length, 'rounds');
    return companyFundingRounds;
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
    const newFundingRound = {
      id: fundingRoundData.id || LocalStorage.generateId(),
      company_id: fundingRoundData.company_id,
      name: fundingRoundData.name,
      round_type: fundingRoundData.round_type,
      capital_raised: fundingRoundData.capital_raised,
      investment_amount: fundingRoundData.investment_amount,
      valuation: fundingRoundData.valuation,
      pre_money_valuation: fundingRoundData.pre_money_valuation,
      post_money_valuation: fundingRoundData.post_money_valuation,
      valuation_type: fundingRoundData.valuation_type,
      shares_issued: fundingRoundData.shares_issued || null,
      price_per_share: fundingRoundData.price_per_share || null,
      order_number: fundingRoundData.order_number,
      investors: fundingRoundData.investors,
      round_date: fundingRoundData.round_date,
      notes: fundingRoundData.notes || null,
      is_active: fundingRoundData.is_active !== undefined ? fundingRoundData.is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    fundingRounds.push(newFundingRound);
    LocalStorage.set(STORAGE_KEYS.fundingRounds, fundingRounds);
    console.log('✅ Funding round created successfully using fallback mode:', newFundingRound);
    return newFundingRound;
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
  if (useFallbackMode) {
    // Fallback to localStorage
    const fundingRounds = LocalStorage.get(STORAGE_KEYS.fundingRounds);
    const fundingRoundIndex = fundingRounds.findIndex((fr: any) => fr.id === fundingRoundId);
    if (fundingRoundIndex !== -1) {
      fundingRounds[fundingRoundIndex] = { ...fundingRounds[fundingRoundIndex], ...updates, updated_at: new Date().toISOString() };
      LocalStorage.set(STORAGE_KEYS.fundingRounds, fundingRounds);
      console.log('✅ Funding round updated successfully using fallback mode:', fundingRounds[fundingRoundIndex]);
      return fundingRounds[fundingRoundIndex];
    }
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('funding_rounds')
      .update(updates)
      .eq('id', fundingRoundId)
      .select()
      .single();

    if (error) {
      console.error('Error updating funding round:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await updateFundingRound(fundingRoundId, updates);
    }

    return data;
  } catch (error) {
    console.error('Failed to update funding round, switching to fallback mode:', error);
    useFallbackMode = true;
    return await updateFundingRound(fundingRoundId, updates);
  }
}

export async function deleteFundingRound(fundingRoundId: string) {
  if (useFallbackMode) {
    // Fallback to localStorage
    const fundingRounds = LocalStorage.get(STORAGE_KEYS.fundingRounds);
    const filteredFundingRounds = fundingRounds.filter((fr: any) => fr.id !== fundingRoundId);
    LocalStorage.set(STORAGE_KEYS.fundingRounds, filteredFundingRounds);
    console.log('✅ Funding round deleted successfully using fallback mode');
    return true;
  }

  try {
    const { error } = await supabase
      .from('funding_rounds')
      .delete()
      .eq('id', fundingRoundId);

    if (error) {
      console.error('Error deleting funding round:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await deleteFundingRound(fundingRoundId);
    }

    return true;
  } catch (error) {
    console.error('Failed to delete funding round, switching to fallback mode:', error);
    useFallbackMode = true;
    return await deleteFundingRound(fundingRoundId);
  }
}

// ===== ESOP GRANTS FUNCTIONS =====

export async function getEsopGrants(companyId: string) {
  if (useFallbackMode) {
    // Fallback to localStorage
    const esopGrants = LocalStorage.get(STORAGE_KEYS.esopGrants);
    const companyEsopGrants = esopGrants.filter((eg: any) => eg.company_id === companyId && eg.is_active !== false);
    console.log('✅ ESOP grants loaded from fallback mode:', companyEsopGrants.length, 'grants');
    return companyEsopGrants;
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
    const newEsopGrant = {
      id: esopGrantData.id || LocalStorage.generateId(),
      company_id: esopGrantData.company_id,
      employee_name: esopGrantData.employee_name,
      employee_id: esopGrantData.employee_id || null,
      position: esopGrantData.position || null,
      department: esopGrantData.department || null,
      grant_date: esopGrantData.grant_date,
      shares_granted: esopGrantData.shares_granted,
      vesting_schedule: esopGrantData.vesting_schedule,
      cliff_period: esopGrantData.cliff_period || 0,
      vesting_frequency: esopGrantData.vesting_frequency || 'monthly',
      exercise_price: esopGrantData.exercise_price || 0,
      status: esopGrantData.status || 'active',
      notes: esopGrantData.notes || null,
      is_active: esopGrantData.is_active !== undefined ? esopGrantData.is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    esopGrants.push(newEsopGrant);
    LocalStorage.set(STORAGE_KEYS.esopGrants, esopGrants);
    console.log('✅ ESOP grant created successfully using fallback mode:', newEsopGrant);
    return newEsopGrant;
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
  if (useFallbackMode) {
    // Fallback to localStorage
    const esopGrants = LocalStorage.get(STORAGE_KEYS.esopGrants);
    const esopGrantIndex = esopGrants.findIndex((eg: any) => eg.id === esopGrantId);
    if (esopGrantIndex !== -1) {
      esopGrants[esopGrantIndex] = { ...esopGrants[esopGrantIndex], ...updates, updated_at: new Date().toISOString() };
      LocalStorage.set(STORAGE_KEYS.esopGrants, esopGrants);
      console.log('✅ ESOP grant updated successfully using fallback mode:', esopGrants[esopGrantIndex]);
      return esopGrants[esopGrantIndex];
    }
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('esop_grants')
      .update(updates)
      .eq('id', esopGrantId)
      .select()
      .single();

    if (error) {
      console.error('Error updating ESOP grant:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await updateEsopGrant(esopGrantId, updates);
    }

    return data;
  } catch (error) {
    console.error('Failed to update ESOP grant, switching to fallback mode:', error);
    useFallbackMode = true;
    return await updateEsopGrant(esopGrantId, updates);
  }
}

export async function deleteEsopGrant(esopGrantId: string) {
  if (useFallbackMode) {
    // Fallback to localStorage
    const esopGrants = LocalStorage.get(STORAGE_KEYS.esopGrants);
    const filteredEsopGrants = esopGrants.filter((eg: any) => eg.id !== esopGrantId);
    LocalStorage.set(STORAGE_KEYS.esopGrants, filteredEsopGrants);
    console.log('✅ ESOP grant deleted successfully using fallback mode');
    return true;
  }

  try {
    const { error } = await supabase
      .from('esop_grants')
      .delete()
      .eq('id', esopGrantId);

    if (error) {
      console.error('Error deleting ESOP grant:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await deleteEsopGrant(esopGrantId);
    }

    return true;
  } catch (error) {
    console.error('Failed to delete ESOP grant, switching to fallback mode:', error);
    useFallbackMode = true;
    return await deleteEsopGrant(esopGrantId);
  }
}

// ===== COMPANY SETTINGS FUNCTIONS =====

export async function getCompanySettings(companyId: string) {
  if (useFallbackMode) {
    // Fallback to localStorage
    const settings = LocalStorage.get(STORAGE_KEYS.companySettings);
    const companySettings = settings.find((s: any) => s.company_id === companyId);
    console.log('✅ Company settings loaded from fallback mode:', companySettings);
    return companySettings || null;
  }

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
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await getCompanySettings(companyId);
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch company settings, switching to fallback mode:', error);
    useFallbackMode = true;
    return await getCompanySettings(companyId);
  }
}

export async function createCompanySettings(settingsData: Database['public']['Tables']['company_settings']['Insert']) {
  if (useFallbackMode) {
    // Fallback to localStorage
    const settings = LocalStorage.get(STORAGE_KEYS.companySettings);
    const newSettings = {
      id: settingsData.id || LocalStorage.generateId(),
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
  if (useFallbackMode) {
    // Fallback to localStorage
    const settings = LocalStorage.get(STORAGE_KEYS.companySettings);
    const settingIndex = settings.findIndex((s: any) => s.company_id === companyId);
    if (settingIndex !== -1) {
      settings[settingIndex] = { ...settings[settingIndex], ...updates, updated_at: new Date().toISOString() };
      LocalStorage.set(STORAGE_KEYS.companySettings, settings);
      console.log('✅ Company settings updated successfully using fallback mode:', settings[settingIndex]);
      return settings[settingIndex];
    }
    // If no settings found, create new ones
    const newSettings = {
      id: LocalStorage.generateId(),
      company_id: companyId,
      current_valuation: updates.current_valuation || 1000000,
      esop_pool_percentage: updates.esop_pool_percentage || 10,
      total_shares: updates.total_shares || 10000000,
      exit_valuation: updates.exit_valuation || 10000000,
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
      .update(updates)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No company settings found, create new ones
        const newSettingsData = {
          company_id: companyId,
          current_valuation: updates.current_valuation || 1000000,
          esop_pool_percentage: updates.esop_pool_percentage || 10,
          total_shares: updates.total_shares || 10000000,
          exit_valuation: updates.exit_valuation || 10000000
        };
        return await createCompanySettings(newSettingsData);
      }
      console.error('Error updating company settings:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await updateCompanySettings(companyId, updates);
    }

    return data;
  } catch (error) {
    console.error('Failed to update company settings, switching to fallback mode:', error);
    useFallbackMode = true;
    return await updateCompanySettings(companyId, updates);
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
  if (useFallbackMode) {
    // Fallback to localStorage
    const scenarios = LocalStorage.get(STORAGE_KEYS.scenarios);
    const newScenario = {
      id: scenarioData.id || LocalStorage.generateId(),
      company_id: scenarioData.company_id,
      name: scenarioData.name,
      description: scenarioData.description || null,
      data: scenarioData.data,
      is_active: scenarioData.is_active !== undefined ? scenarioData.is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    scenarios.push(newScenario);
    LocalStorage.set(STORAGE_KEYS.scenarios, scenarios);
    console.log('✅ Scenario created successfully using fallback mode:', newScenario);
    return newScenario;
  }

  try {
    const { data, error } = await supabase
      .from('scenarios')
      .insert(scenarioData)
      .select()
      .single();

    if (error) {
      console.error('Error creating scenario:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await createScenario(scenarioData);
    }

    return data;
  } catch (error) {
    console.error('Failed to create scenario, switching to fallback mode:', error);
    useFallbackMode = true;
    return await createScenario(scenarioData);
  }
}

export async function updateScenario(scenarioId: string, updates: Database['public']['Tables']['scenarios']['Update']) {
  if (useFallbackMode) {
    // Fallback to localStorage
    const scenarios = LocalStorage.get(STORAGE_KEYS.scenarios);
    const scenarioIndex = scenarios.findIndex((s: any) => s.id === scenarioId);
    if (scenarioIndex !== -1) {
      scenarios[scenarioIndex] = { ...scenarios[scenarioIndex], ...updates, updated_at: new Date().toISOString() };
      LocalStorage.set(STORAGE_KEYS.scenarios, scenarios);
      console.log('✅ Scenario updated successfully using fallback mode:', scenarios[scenarioIndex]);
      return scenarios[scenarioIndex];
    }
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('scenarios')
      .update(updates)
      .eq('id', scenarioId)
      .select()
      .single();

    if (error) {
      console.error('Error updating scenario:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await updateScenario(scenarioId, updates);
    }

    return data;
  } catch (error) {
    console.error('Failed to update scenario, switching to fallback mode:', error);
    useFallbackMode = true;
    return await updateScenario(scenarioId, updates);
  }
}

export async function deleteScenario(scenarioId: string) {
  if (useFallbackMode) {
    // Fallback to localStorage
    const scenarios = LocalStorage.get(STORAGE_KEYS.scenarios);
    const filteredScenarios = scenarios.filter((s: any) => s.id !== scenarioId);
    LocalStorage.set(STORAGE_KEYS.scenarios, filteredScenarios);
    console.log('✅ Scenario deleted successfully using fallback mode');
    return true;
  }

  try {
    const { error } = await supabase
      .from('scenarios')
      .delete()
      .eq('id', scenarioId);

    if (error) {
      console.error('Error deleting scenario:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await deleteScenario(scenarioId);
    }

    return true;
  } catch (error) {
    console.error('Failed to delete scenario, switching to fallback mode:', error);
    useFallbackMode = true;
    return await deleteScenario(scenarioId);
  }
}

// ===== COMMENTS FUNCTIONS =====

export async function getComments(companyId: string, entityId: string, entityType: string) {
  if (useFallbackMode) {
    // Fallback to localStorage
    const comments = LocalStorage.get(STORAGE_KEYS.comments);
    const entityComments = comments.filter((c: any) => 
      c.company_id === companyId && 
      c.entity_id === entityId && 
      c.entity_type === entityType &&
      c.is_active !== false
    );
    console.log('✅ Comments loaded from fallback mode:', entityComments.length, 'comments');
    return entityComments;
  }

  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('company_id', companyId)
      .eq('entity_id', entityId)
      .eq('entity_type', entityType)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await getComments(companyId, entityId, entityType);
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch comments, switching to fallback mode:', error);
    useFallbackMode = true;
    return await getComments(companyId, entityId, entityType);
  }
}

export async function createComment(commentData: Database['public']['Tables']['comments']['Insert']) {
  if (useFallbackMode) {
    // Fallback to localStorage
    const comments = LocalStorage.get(STORAGE_KEYS.comments);
    const newComment = {
      id: commentData.id || LocalStorage.generateId(),
      company_id: commentData.company_id,
      entity_id: commentData.entity_id,
      entity_type: commentData.entity_type,
      user_name: commentData.user_name,
      user_role: commentData.user_role || null,
      content: commentData.content,
      is_active: commentData.is_active !== undefined ? commentData.is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    comments.push(newComment);
    LocalStorage.set(STORAGE_KEYS.comments, comments);
    console.log('✅ Comment created successfully using fallback mode:', newComment);
    return newComment;
  }

  try {
    const { data, error } = await supabase
      .from('comments')
      .insert(commentData)
      .select()
      .single();

    if (error) {
      console.error('Error creating comment:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await createComment(commentData);
    }

    return data;
  } catch (error) {
    console.error('Failed to create comment, switching to fallback mode:', error);
    useFallbackMode = true;
    return await createComment(commentData);
  }
}

export async function updateComment(commentId: string, updates: Database['public']['Tables']['comments']['Update']) {
  if (useFallbackMode) {
    // Fallback to localStorage
    const comments = LocalStorage.get(STORAGE_KEYS.comments);
    const commentIndex = comments.findIndex((c: any) => c.id === commentId);
    if (commentIndex !== -1) {
      comments[commentIndex] = { ...comments[commentIndex], ...updates, updated_at: new Date().toISOString() };
      LocalStorage.set(STORAGE_KEYS.comments, comments);
      console.log('✅ Comment updated successfully using fallback mode:', comments[commentIndex]);
      return comments[commentIndex];
    }
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('comments')
      .update(updates)
      .eq('id', commentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating comment:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await updateComment(commentId, updates);
    }

    return data;
  } catch (error) {
    console.error('Failed to update comment, switching to fallback mode:', error);
    useFallbackMode = true;
    return await updateComment(commentId, updates);
  }
}

export async function deleteComment(commentId: string) {
  if (useFallbackMode) {
    // Fallback to localStorage
    const comments = LocalStorage.get(STORAGE_KEYS.comments);
    const filteredComments = comments.filter((c: any) => c.id !== commentId);
    LocalStorage.set(STORAGE_KEYS.comments, filteredComments);
    console.log('✅ Comment deleted successfully using fallback mode');
    return true;
  }

  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('Error deleting comment:', error);
      // Switch to fallback mode on error
      useFallbackMode = true;
      return await deleteComment(commentId);
    }

    return true;
  } catch (error) {
    console.error('Failed to delete comment, switching to fallback mode:', error);
    useFallbackMode = true;
    return await deleteComment(commentId);
  }
}
