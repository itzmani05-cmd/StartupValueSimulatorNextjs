// Fixed Supabase functions for proper data mapping
// This file contains corrected functions to fix funding rounds functionality

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// ===== FIXED FUNDING ROUNDS FUNCTIONS =====

export async function createFundingRoundFixed(fundingRoundData: {
  company_id: string;
  name: string;
  round_type: string;
  capital_raised: number;
  valuation: number;
  valuation_type: string;
  shares_issued?: number;
  share_price?: number;
  valuation_cap?: number;
  discount_rate?: number;
  conversion_trigger?: string;
  investors: string[];
  round_date: string;
  notes?: string;
}) {
  try {
    console.log('Creating funding round with data:', fundingRoundData);
    
    const { data, error } = await supabase
      .from('funding_rounds')
      .insert({
        company_id: fundingRoundData.company_id,
        name: fundingRoundData.name,
        round_type: fundingRoundData.round_type,
        capital_raised: fundingRoundData.capital_raised,
        valuation: fundingRoundData.valuation,
        valuation_type: fundingRoundData.valuation_type,
        shares_issued: fundingRoundData.shares_issued || 0,
        share_price: fundingRoundData.share_price || 0,
        valuation_cap: fundingRoundData.valuation_cap || 0,
        discount_rate: fundingRoundData.discount_rate || 0,
        conversion_trigger: fundingRoundData.conversion_trigger || 'next-round',
        investors: fundingRoundData.investors || [],
        round_date: fundingRoundData.round_date,
        notes: fundingRoundData.notes || ''
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating funding round:', error);
      throw error;
    }

    console.log('Funding round created successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to create funding round:', error);
    throw error;
  }
}

export async function getFundingRoundsFixed(companyId: string) {
  try {
    console.log('Fetching funding rounds for company:', companyId);
    
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

    console.log('Funding rounds fetched successfully:', data);
    return data || [];
  } catch (error) {
    console.error('Failed to fetch funding rounds:', error);
    throw error;
  }
}

export async function updateFundingRoundFixed(fundingRoundId: string, updates: {
  name?: string;
  round_type?: string;
  capital_raised?: number;
  valuation?: number;
  valuation_type?: string;
  shares_issued?: number;
  share_price?: number;
  valuation_cap?: number;
  discount_rate?: number;
  conversion_trigger?: string;
  investors?: string[];
  round_date?: string;
  notes?: string;
}) {
  try {
    console.log('Updating funding round:', fundingRoundId, 'with updates:', updates);
    
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

    console.log('Funding round updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to update funding round:', error);
    throw error;
  }
}

export async function deleteFundingRoundFixed(fundingRoundId: string) {
  try {
    console.log('Deleting funding round:', fundingRoundId);
    
    const { error } = await supabase
      .from('funding_rounds')
      .delete()
      .eq('id', fundingRoundId);

    if (error) {
      console.error('Error deleting funding round:', error);
      throw error;
    }

    console.log('Funding round deleted successfully');
    return true;
  } catch (error) {
    console.error('Failed to delete funding round:', error);
    throw error;
  }
}

// ===== DATA MAPPING FUNCTIONS =====

// Convert application funding round format to database format
export function mapFundingRoundToDatabase(appRound: any, companyId: string) {
  return {
    company_id: companyId,
    name: appRound.name,
    round_type: appRound.roundType,
    capital_raised: appRound.capitalRaised,
    valuation: appRound.valuation,
    valuation_type: appRound.valuationType,
    shares_issued: appRound.sharesIssued || 0,
    share_price: appRound.sharePrice || 0,
    valuation_cap: appRound.valuationCap || 0,
    discount_rate: appRound.discountRate || 0,
    conversion_trigger: appRound.conversionTrigger || 'next-round',
    investors: appRound.investors || [],
    round_date: appRound.date,
    notes: appRound.notes || ''
  };
}

// Convert database funding round format to application format
export function mapFundingRoundFromDatabase(dbRound: any) {
  return {
    id: dbRound.id,
    name: dbRound.name,
    roundType: dbRound.round_type,
    capitalRaised: dbRound.capital_raised,
    valuation: dbRound.valuation,
    valuationType: dbRound.valuation_type,
    sharesIssued: dbRound.shares_issued,
    sharePrice: dbRound.share_price,
    valuationCap: dbRound.valuation_cap,
    discountRate: dbRound.discount_rate,
    conversionTrigger: dbRound.conversion_trigger,
    investors: Array.isArray(dbRound.investors) ? dbRound.investors : [],
    date: dbRound.round_date,
    notes: dbRound.notes || ''
  };
}

// ===== COMPREHENSIVE SAVE FUNCTION =====

export async function saveFundingRoundsFixed(companyId: string, fundingRounds: any[]) {
  try {
    console.log('Saving funding rounds for company:', companyId);
    console.log('Funding rounds to save:', fundingRounds);
    
    const results = [];
    
    for (const round of fundingRounds) {
      if (round.id && round.id.startsWith('round-')) {
        // New round, create it
        console.log('Creating new funding round:', round.name);
        const dbData = mapFundingRoundToDatabase(round, companyId);
        const created = await createFundingRoundFixed(dbData);
        results.push(created);
      } else {
        // Existing round, update it
        console.log('Updating existing funding round:', round.name);
        const dbData = mapFundingRoundToDatabase(round, companyId);
        delete dbData.company_id; // Remove company_id for updates
        const updated = await updateFundingRoundFixed(round.id, dbData);
        results.push(updated);
      }
    }
    
    console.log('All funding rounds saved successfully:', results);
    return results;
  } catch (error) {
    console.error('Failed to save funding rounds:', error);
    throw error;
  }
}







