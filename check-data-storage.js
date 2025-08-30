#!/usr/bin/env node

/**
 * Database Data Check Script for Startup Value Simulator
 * 
 * This script provides a detailed view of all data stored in the database.
 * 
 * Usage: node check-data-storage.js
 */

const { createClient } = require('@supabase/supabase-js');

// Database connection details
const SUPABASE_URL = 'https://wwbvocmylfvyaocksise.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3YnZvY215bGZ2eWFvY2tzaXNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NDQ2NDcsImV4cCI6MjA3MTAyMDY0N30.Sr4Sbh3jq8OeqlnnO4M5BwvU08xg2Hj76LUQsAnG9fg';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkDataStorage() {
  console.log('🔍 Checking Database Data Storage...\n');

  try {
    // Check Companies
    console.log('🏢 COMPANIES TABLE:');
    console.log('==================');
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (companiesError) {
      console.error('❌ Error fetching companies:', companiesError.message);
    } else {
      console.log(`📊 Total Companies: ${companies.length}`);
      companies.forEach((company, index) => {
        console.log(`${index + 1}. ${company.name} (ID: ${company.id})`);
        console.log(`   Industry: ${company.industry || 'N/A'}`);
        console.log(`   Founded: ${company.founded_date || 'N/A'}`);
        console.log(`   Active: ${company.is_active ? 'Yes' : 'No'}`);
        console.log(`   Created: ${new Date(company.created_at).toLocaleDateString()}`);
        console.log('');
      });
    }

    // Check Founders
    console.log('👥 FOUNDERS TABLE:');
    console.log('==================');
    const { data: founders, error: foundersError } = await supabase
      .from('founders')
      .select('*')
      .order('created_at', { ascending: false });

    if (foundersError) {
      console.error('❌ Error fetching founders:', foundersError.message);
    } else {
      console.log(`📊 Total Founders: ${founders.length}`);
      founders.forEach((founder, index) => {
        console.log(`${index + 1}. ${founder.name} (ID: ${founder.id})`);
        console.log(`   Company ID: ${founder.company_id}`);
        console.log(`   Role: ${founder.role || 'N/A'}`);
        console.log(`   Equity: ${founder.equity_percentage}%`);
        console.log(`   Shares: ${founder.shares.toLocaleString()}`);
        console.log(`   Active: ${founder.is_active ? 'Yes' : 'No'}`);
        console.log('');
      });
    }

    // Check Funding Rounds
    console.log('💰 FUNDING ROUNDS TABLE:');
    console.log('========================');
    const { data: fundingRounds, error: fundingRoundsError } = await supabase
      .from('funding_rounds')
      .select('*')
      .order('round_date', { ascending: false });

    if (fundingRoundsError) {
      console.error('❌ Error fetching funding rounds:', fundingRoundsError.message);
    } else {
      console.log(`📊 Total Funding Rounds: ${fundingRounds.length}`);
      fundingRounds.forEach((round, index) => {
        console.log(`${index + 1}. ${round.name} (ID: ${round.id})`);
        console.log(`   Company ID: ${round.company_id}`);
        console.log(`   Type: ${round.round_type}`);
        console.log(`   Capital Raised: $${round.capital_raised?.toLocaleString() || 'N/A'}`);
        console.log(`   Valuation: $${round.valuation?.toLocaleString() || 'N/A'}`);
        console.log(`   Date: ${round.round_date}`);
        console.log(`   Active: ${round.is_active ? 'Yes' : 'No'}`);
        console.log('');
      });
    }

    // Check ESOP Grants
    console.log('📈 ESOP GRANTS TABLE:');
    console.log('=====================');
    const { data: esopGrants, error: esopGrantsError } = await supabase
      .from('esop_grants')
      .select('*')
      .order('grant_date', { ascending: false })
      .limit(10); // Limit to first 10 for readability

    if (esopGrantsError) {
      console.error('❌ Error fetching ESOP grants:', esopGrantsError.message);
    } else {
      console.log(`📊 Total ESOP Grants: ${esopGrants.length} (showing first 10)`);
      esopGrants.forEach((grant, index) => {
        console.log(`${index + 1}. ${grant.employee_name} (ID: ${grant.id})`);
        console.log(`   Company ID: ${grant.company_id}`);
        console.log(`   Position: ${grant.position || 'N/A'}`);
        console.log(`   Department: ${grant.department || 'N/A'}`);
        console.log(`   Shares Granted: ${grant.shares_granted.toLocaleString()}`);
        console.log(`   Vesting: ${grant.vesting_schedule}`);
        console.log(`   Status: ${grant.status}`);
        console.log(`   Grant Date: ${grant.grant_date}`);
        console.log('');
      });
    }

    // Check Company Settings
    console.log('⚙️ COMPANY SETTINGS TABLE:');
    console.log('===========================');
    const { data: companySettings, error: companySettingsError } = await supabase
      .from('company_settings')
      .select('*')
      .order('created_at', { ascending: false });

    if (companySettingsError) {
      console.error('❌ Error fetching company settings:', companySettingsError.message);
    } else {
      console.log(`📊 Total Company Settings: ${companySettings.length}`);
      companySettings.forEach((setting, index) => {
        console.log(`${index + 1}. Company ID: ${setting.company_id}`);
        console.log(`   Current Valuation: $${setting.current_valuation?.toLocaleString() || 'N/A'}`);
        console.log(`   ESOP Pool: ${setting.esop_pool_percentage}%`);
        console.log(`   Total Shares: ${setting.total_shares?.toLocaleString() || 'N/A'}`);
        console.log(`   Exit Valuation: $${setting.exit_valuation?.toLocaleString() || 'N/A'}`);
        console.log('');
      });
    }

    // Check Scenarios
    console.log('📋 SCENARIOS TABLE:');
    console.log('===================');
    const { data: scenarios, error: scenariosError } = await supabase
      .from('scenarios')
      .select('*')
      .order('created_at', { ascending: false });

    if (scenariosError) {
      console.error('❌ Error fetching scenarios:', scenariosError.message);
    } else {
      console.log(`📊 Total Scenarios: ${scenarios.length}`);
      scenarios.forEach((scenario, index) => {
        console.log(`${index + 1}. ${scenario.name} (ID: ${scenario.id})`);
        console.log(`   Company ID: ${scenario.company_id}`);
        console.log(`   Description: ${scenario.description || 'N/A'}`);
        console.log(`   Active: ${scenario.is_active ? 'Yes' : 'No'}`);
        console.log(`   Created: ${new Date(scenario.created_at).toLocaleDateString()}`);
        console.log('');
      });
    }

    // Check Comments
    console.log('💬 COMMENTS TABLE:');
    console.log('==================');
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5); // Limit to first 5 for readability

    if (commentsError) {
      console.error('❌ Error fetching comments:', commentsError.message);
    } else {
      console.log(`📊 Total Comments: ${comments.length} (showing first 5)`);
      comments.forEach((comment, index) => {
        console.log(`${index + 1}. ${comment.user_name} (ID: ${comment.id})`);
        console.log(`   Company ID: ${comment.company_id}`);
        console.log(`   Entity Type: ${comment.entity_type}`);
        console.log(`   Content: ${comment.content.substring(0, 100)}${comment.content.length > 100 ? '...' : ''}`);
        console.log(`   Created: ${new Date(comment.created_at).toLocaleDateString()}`);
        console.log('');
      });
    }

    console.log('✅ Database data check complete!');
    console.log('\n📊 SUMMARY:');
    console.log(`🏢 Companies: ${companies?.length || 0}`);
    console.log(`👥 Founders: ${founders?.length || 0}`);
    console.log(`💰 Funding Rounds: ${fundingRounds?.length || 0}`);
    console.log(`📈 ESOP Grants: ${esopGrants?.length || 0}`);
    console.log(`⚙️ Company Settings: ${companySettings?.length || 0}`);
    console.log(`📋 Scenarios: ${scenarios?.length || 0}`);
    console.log(`💬 Comments: ${comments?.length || 0}`);

  } catch (error) {
    console.error('❌ Database data check failed:', error);
  }
}

// Run the check
if (require.main === module) {
  checkDataStorage();
}

module.exports = { checkDataStorage };



