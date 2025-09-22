#!/usr/bin/env node

/**
 * Fix Orphaned Company Settings Script
 * 
 * This script adds missing company settings for the orphaned company
 * that has founders and funding rounds but no company settings.
 */

const { createClient } = require('@supabase/supabase-js');

// Database connection details
const SUPABASE_URL = 'https://wwbvocmylfvyaocksise.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3YnZvY215bGZ2eWFvY2tzaXNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NDQ2NDcsImV4cCI6MjA3MTAyMDY0N30.Sr4Sbh3jq8OeqlnnO4M5BwvU08xg2Hj76LUQsAnG9fg';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fixOrphanedCompanySettings() {
  console.log('🔧 Fixing Orphaned Company Settings...\n');

  const orphanedCompanyId = '05ad0036-c79f-41cb-a5ba-80b54179fad6';

  try {
    // Check if company settings already exist
    const { data: existingSettings, error: checkError } = await supabase
      .from('company_settings')
      .select('*')
      .eq('company_id', orphanedCompanyId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Error checking company settings:', checkError.message);
      return;
    }

    if (existingSettings) {
      console.log('✅ Company settings already exist for orphaned company');
      console.log('Current settings:', existingSettings);
      return;
    }

    // Create company settings for the orphaned company
    const newSettings = {
      company_id: orphanedCompanyId,
      current_valuation: 5000000,
      esop_pool_percentage: 15.0,
      total_shares: 10000000,
      exit_valuation: 50000000,
      initial_valuation: 1000000,
      legal_structure: 'C-Corporation'
    };

    const { data: createdSettings, error: createError } = await supabase
      .from('company_settings')
      .insert(newSettings)
      .select()
      .single();

    if (createError) {
      console.error('❌ Error creating company settings:', createError.message);
      return;
    }

    console.log('✅ Successfully created company settings for orphaned company:');
    console.log('   - Current Valuation: $5,000,000');
    console.log('   - ESOP Pool: 15%');
    console.log('   - Total Shares: 10,000,000');
    console.log('   - Exit Valuation: $50,000,000');

  } catch (error) {
    console.error('❌ Failed to fix orphaned company settings:', error);
  }
}

// Run the script
if (require.main === module) {
  fixOrphanedCompanySettings();
}

module.exports = { fixOrphanedCompanySettings };





