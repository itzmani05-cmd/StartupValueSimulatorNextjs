#!/usr/bin/env node

/**
 * Add Sample Data Script (Final)
 * 
 * This script adds sample founders, funding rounds, and ESOP grants to companies
 * that don't have any data, matching the actual database schema.
 */

const { createClient } = require('@supabase/supabase-js');

// Database connection details
const SUPABASE_URL = 'https://wwbvocmylfvyaocksise.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3YnZvY215bGZ2eWFvY2tzaXNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NDQ2NDcsImV4cCI6MjA3MTAyMDY0N30.Sr4Sbh3jq8OeqlnnO4M5BwvU08xg2Hj76LUQsAnG9fg';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function addSampleDataFinal() {
  console.log('🎯 Adding Sample Data to Companies (Final)...\n');

  try {
    // Get all companies
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (companiesError) {
      console.error('❌ Error fetching companies:', companiesError.message);
      return;
    }

    console.log(`📊 Found ${companies.length} companies`);

    // Skip the first few companies and add data to companies that don't have founders
    const companiesToUpdate = companies.slice(3, 6); // Update companies 4, 5, 6

    for (let i = 0; i < companiesToUpdate.length; i++) {
      const company = companiesToUpdate[i];
      console.log(`\n🏢 Adding data to: ${company.name} (${company.id})`);
      
      await addCompanyDataFinal(company, i + 1);
    }

    console.log('\n🎉 Sample data added successfully!');
    console.log('Now you can test the application with multiple companies that have data.');

  } catch (error) {
    console.error('❌ Failed to add sample data:', error);
  }
}

async function addCompanyDataFinal(company, companyIndex) {
  try {
    // Add founders (with correct schema)
    console.log('👥 Adding founders...');
    const founders = [
      {
        company_id: company.id,
        name: `Founder ${companyIndex}A`,
        equity_percentage: 60.0,
        shares: 6000000,
        role: 'CEO',
        initial_ownership: 60.0,
        is_active: true
      },
      {
        company_id: company.id,
        name: `Founder ${companyIndex}B`,
        equity_percentage: 30.0,
        shares: 3000000,
        role: 'CTO',
        initial_ownership: 30.0,
        is_active: true
      }
    ];

    for (const founder of founders) {
      const { error: founderError } = await supabase
        .from('founders')
        .insert(founder);

      if (founderError) {
        console.error('❌ Error adding founder:', founderError.message);
      } else {
        console.log(`   ✅ Added ${founder.name} (${founder.equity_percentage}%)`);
      }
    }

    // Add funding round (with correct schema)
    console.log('💰 Adding funding round...');
    const fundingRound = {
      company_id: company.id,
      name: `Seed Round ${companyIndex}`,
      round_type: 'SAFE',
      capital_raised: 500000 + (companyIndex * 100000),
      valuation: 2000000 + (companyIndex * 500000),
      valuation_type: 'pre-money',
      investment_amount: 500000 + (companyIndex * 100000),
      pre_money_valuation: 2000000 + (companyIndex * 500000),
      post_money_valuation: 2500000 + (companyIndex * 600000),
      shares_issued: 1000000 + (companyIndex * 100000),
      price_per_share: 0.5 + (companyIndex * 0.1),
      order_number: companyIndex,
      investors: [`Angel Investor ${companyIndex}`, `VC Fund ${companyIndex}`],
      round_date: '2024-06-01',
      is_active: true,
      notes: `Initial seed funding for ${company.name}`
    };

    const { error: fundingError } = await supabase
      .from('funding_rounds')
      .insert(fundingRound);

    if (fundingError) {
      console.error('❌ Error adding funding round:', fundingError.message);
    } else {
      console.log(`   ✅ Added ${fundingRound.name} ($${fundingRound.capital_raised.toLocaleString()})`);
    }

    // Add ESOP grants
    console.log('📈 Adding ESOP grants...');
    const esopGrants = [
      {
        company_id: company.id,
        employee_name: `Employee ${companyIndex}A`,
        employee_id: `EMP${companyIndex}01`,
        position: 'Senior Software Engineer',
        department: 'Engineering',
        grant_date: '2024-01-15',
        shares_granted: 25000 + (companyIndex * 5000),
        vesting_schedule: '4-year',
        cliff_period: 12,
        vesting_frequency: 'monthly',
        exercise_price: 0.01,
        status: 'active',
        notes: `Key engineering hire for ${company.name}`,
        is_active: true
      },
      {
        company_id: company.id,
        employee_name: `Employee ${companyIndex}B`,
        employee_id: `EMP${companyIndex}02`,
        position: 'Product Manager',
        department: 'Product',
        grant_date: '2024-03-20',
        shares_granted: 35000 + (companyIndex * 5000),
        vesting_schedule: '4-year',
        cliff_period: 12,
        vesting_frequency: 'monthly',
        exercise_price: 0.01,
        status: 'active',
        notes: `Product strategy lead for ${company.name}`,
        is_active: true
      }
    ];

    for (const grant of esopGrants) {
      const { error: grantError } = await supabase
        .from('esop_grants')
        .insert(grant);

      if (grantError) {
        console.error('❌ Error adding ESOP grant:', grantError.message);
      } else {
        console.log(`   ✅ Added ${grant.employee_name} (${grant.shares_granted} shares)`);
      }
    }

    // Update company settings if they exist
    console.log('⚙️ Updating company settings...');
    const { data: existingSettings, error: settingsCheckError } = await supabase
      .from('company_settings')
      .select('*')
      .eq('company_id', company.id)
      .single();

    if (settingsCheckError && settingsCheckError.code !== 'PGRST116') {
      console.error('❌ Error checking company settings:', settingsCheckError.message);
    } else if (!existingSettings) {
      // Create new company settings
      const newSettings = {
        company_id: company.id,
        current_valuation: 3000000 + (companyIndex * 1000000),
        esop_pool_percentage: 10.0 + (companyIndex * 2),
        total_shares: 10000000,
        exit_valuation: 50000000 + (companyIndex * 10000000),
        initial_valuation: 1000000 + (companyIndex * 500000),
        legal_structure: 'C-Corporation'
      };

      const { error: createSettingsError } = await supabase
        .from('company_settings')
        .insert(newSettings);

      if (createSettingsError) {
        console.error('❌ Error creating company settings:', createSettingsError.message);
      } else {
        console.log(`   ✅ Created company settings (Valuation: $${newSettings.current_valuation.toLocaleString()})`);
      }
    } else {
      // Update existing settings
      const updatedSettings = {
        current_valuation: 3000000 + (companyIndex * 1000000),
        esop_pool_percentage: 10.0 + (companyIndex * 2),
        exit_valuation: 50000000 + (companyIndex * 10000000),
        initial_valuation: 1000000 + (companyIndex * 500000)
      };

      const { error: updateSettingsError } = await supabase
        .from('company_settings')
        .update(updatedSettings)
        .eq('company_id', company.id);

      if (updateSettingsError) {
        console.error('❌ Error updating company settings:', updateSettingsError.message);
      } else {
        console.log(`   ✅ Updated company settings (Valuation: $${updatedSettings.current_valuation.toLocaleString()})`);
      }
    }

    console.log(`✅ Completed adding data to ${company.name}`);

  } catch (error) {
    console.error(`❌ Error adding data to ${company.name}:`, error);
  }
}

// Run the script
if (require.main === module) {
  addSampleDataFinal();
}

module.exports = { addSampleDataFinal };





