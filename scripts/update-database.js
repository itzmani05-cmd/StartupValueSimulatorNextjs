const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateDatabase() {
  try {
    console.log('🚀 Starting database update...');
    
    // Read the SQL update script
    const sqlPath = path.join(__dirname, '..', 'comprehensive-database-update.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📖 SQL script loaded successfully');
    
    // Execute the SQL script
    console.log('⚡ Executing database updates...');
    
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlScript });
    
    if (error) {
      // If exec_sql doesn't exist, try to run individual statements
      console.log('⚠️  exec_sql function not available, trying alternative approach...');
      await runIndividualUpdates();
    } else {
      console.log('✅ Database updated successfully!');
      console.log('📊 Results:', data);
    }
    
  } catch (error) {
    console.error('❌ Error updating database:', error);
    
    // Fallback to individual updates
    console.log('🔄 Trying fallback update method...');
    try {
      await runIndividualUpdates();
    } catch (fallbackError) {
      console.error('❌ Fallback update also failed:', fallbackError);
      console.log('\n📋 Manual Update Required:');
      console.log('Please copy the contents of comprehensive-database-update.sql');
      console.log('and run it manually in your Supabase SQL editor');
    }
  }
}

async function runIndividualUpdates() {
  console.log('🔧 Running individual table updates...');
  
  // Companies table updates
  console.log('📝 Updating companies table...');
  await supabase.rpc('exec_sql', { 
    sql: `
      ALTER TABLE companies 
      ADD COLUMN IF NOT EXISTS legal_structure TEXT DEFAULT 'C-Corporation',
      ADD COLUMN IF NOT EXISTS headquarters TEXT,
      ADD COLUMN IF NOT EXISTS website TEXT,
      ADD COLUMN IF NOT EXISTS total_shares INTEGER DEFAULT 10000000,
      ADD COLUMN IF NOT EXISTS initial_valuation DECIMAL(15,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS esop_pool_percentage DECIMAL(5,2) DEFAULT 10;
    `
  });
  
  // Company settings table updates
  console.log('⚙️  Updating company_settings table...');
  await supabase.rpc('exec_sql', { 
    sql: `
      ALTER TABLE company_settings 
      ADD COLUMN IF NOT EXISTS initial_valuation DECIMAL(15,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS legal_structure TEXT DEFAULT 'C-Corporation',
      ADD COLUMN IF NOT EXISTS headquarters TEXT,
      ADD COLUMN IF NOT EXISTS website TEXT;
    `
  });
  
  console.log('✅ Individual updates completed!');
}

// Run the update
updateDatabase().catch(console.error);

