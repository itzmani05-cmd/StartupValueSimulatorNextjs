#!/usr/bin/env node

/**
 * Database Initialization Script for Startup Value Simulator
 * 
 * This script helps you set up the database schema for the application.
 * Run this script after setting up your Supabase project.
 * 
 * Usage:
 * 1. Make sure you have Node.js installed
 * 2. Update the database connection details below
 * 3. Run: node scripts/init-database.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Database connection details - UPDATE THESE WITH YOUR VALUES
const SUPABASE_URL = 'https://YOUR_SUPABASE_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function initDatabase() {
  console.log('🚀 Initializing Startup Value Simulator Database...\n');

  try {
    // Test database connection
    console.log('📡 Testing database connection...');
    const { data: testData, error: testError } = await supabase
      .from('companies')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Database connection failed:', testError.message);
      console.log('\nPlease check:');
      console.log('1. Your Supabase URL and API key are correct');
      console.log('2. Your database is running and accessible');
      console.log('3. Row Level Security (RLS) policies are properly configured');
      return;
    }

    console.log('✅ Database connection successful!\n');

    // Check if tables exist
    console.log('🔍 Checking database schema...');
    
    const tables = ['companies', 'founders', 'funding_rounds', 'esop_grants', 'company_settings', 'scenarios', 'comments'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ Table '${table}' not found or not accessible`);
        } else {
          console.log(`✅ Table '${table}' is accessible`);
        }
      } catch (err) {
        console.log(`❌ Table '${table}' error:`, err.message);
      }
    }

    console.log('\n📋 Database Schema Status:');
    console.log('=====================================');
    
    // Check companies table
    try {
      const { count: companiesCount } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true });
      
      console.log(`🏢 Companies: ${companiesCount || 0} records`);
    } catch (err) {
      console.log('🏢 Companies: ❌ Error accessing table');
    }

    // Check founders table
    try {
      const { count: foundersCount } = await supabase
        .from('founders')
        .select('*', { count: 'exact', head: true });
      
      console.log(`👥 Founders: ${foundersCount || 0} records`);
    } catch (err) {
      console.log('👥 Founders: ❌ Error accessing table');
    }

    // Check funding rounds table
    try {
      const { count: fundingRoundsCount } = await supabase
        .from('funding_rounds')
        .select('*', { count: 'exact', head: true });
      
      console.log(`💰 Funding Rounds: ${fundingRoundsCount || 0} records`);
    } catch (err) {
      console.log('💰 Funding Rounds: ❌ Error accessing table');
    }

    // Check ESOP grants table
    try {
      const { count: esopGrantsCount } = await supabase
        .from('esop_grants')
        .select('*', { count: 'exact', head: true });
      
      console.log(`📈 ESOP Grants: ${esopGrantsCount || 0} records`);
    } catch (err) {
      console.log('📈 ESOP Grants: ❌ Error accessing table');
    }

    // Check scenarios table
    try {
      const { count: scenariosCount } = await supabase
        .from('scenarios')
        .select('*', { count: 'exact', head: true });
      
      console.log(`📋 Scenarios: ${scenariosCount || 0} records`);
    } catch (err) {
      console.log('📋 Scenarios: ❌ Error accessing table');
    }

    console.log('\n🎯 Next Steps:');
    console.log('1. If any tables show errors, run the SQL schema from database-schema.sql');
    console.log('2. Make sure RLS policies are properly configured');
    console.log('3. Test the application by creating a new company');
    console.log('4. Check the browser console for any database errors');

    console.log('\n✅ Database initialization check complete!');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    console.log('\nTroubleshooting tips:');
    console.log('1. Check your Supabase project settings');
    console.log('2. Verify your API keys and URL');
    console.log('3. Ensure your database is not paused');
    console.log('4. Check the Supabase dashboard for any error messages');
  }
}

// Run the initialization
if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };

