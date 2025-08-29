const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://wwbvocmylfvyaocksise.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3YnZvY215bGZ2eWFvY2tzaXNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NDQ2NDcsImV4cCI6MjA3MTAyMDY0N30.Sr4Sbh3jq8OeqlnnO4M5BwvU08xg2Hj76LUQsAnG9fg'
);

async function checkDataStorage() {
  try {
    console.log('🔍 DETAILED DATA STORAGE CHECK\n');

    // Check Companies
    console.log('=== COMPANIES ===');
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .limit(3);
    
    if (companiesError) {
      console.log('❌ Companies Error:', companiesError.message);
    } else {
      console.log(`Companies: ${companies.length} records`);
      companies.forEach(c => {
        console.log(`- ${c.name} (${c.industry || 'No industry'}) - Created: ${c.created_at}`);
      });
    }

    // Check Founders
    console.log('\n=== FOUNDERS ===');
    const { data: founders, error: foundersError } = await supabase
      .from('founders')
      .select('*')
      .limit(3);
    
    if (foundersError) {
      console.log('❌ Founders Error:', foundersError.message);
    } else {
      console.log(`Founders: ${founders.length} records`);
      founders.forEach(f => {
        console.log(`- ${f.name} (${f.shares} shares) - Company: ${f.company_id}`);
      });
    }

    // Check Funding Rounds
    console.log('\n=== FUNDING ROUNDS ===');
    const { data: rounds, error: roundsError } = await supabase
      .from('funding_rounds')
      .select('*')
      .limit(3);
    
    if (roundsError) {
      console.log('❌ Funding Rounds Error:', roundsError.message);
    } else {
      console.log(`Funding Rounds: ${rounds.length} records`);
      rounds.forEach(r => {
        const amount = r.investment_amount || r.capital_raised || 'No amount';
        console.log(`- ${r.name} (${amount} USD) - Type: ${r.round_type}`);
      });
    }

    // Check ESOP Grants
    console.log('\n=== ESOP GRANTS ===');
    const { data: grants, error: grantsError } = await supabase
      .from('esop_grants')
      .select('*')
      .limit(3);
    
    if (grantsError) {
      console.log('❌ ESOP Grants Error:', grantsError.message);
    } else {
      console.log(`ESOP Grants: ${grants.length} records`);
      grants.forEach(g => {
        console.log(`- ${g.employee_name} (${g.shares_granted} shares) - Vesting: ${g.vesting_schedule}`);
      });
    }

    // Check Company Settings
    console.log('\n=== COMPANY SETTINGS ===');
    const { data: settings, error: settingsError } = await supabase
      .from('company_settings')
      .select('*')
      .limit(3);
    
    if (settingsError) {
      console.log('❌ Company Settings Error:', settingsError.message);
    } else {
      console.log(`Company Settings: ${settings.length} records`);
      settings.forEach(s => {
        console.log(`- Company: ${s.company_id} - Valuation: ${s.current_valuation || 'Not set'}`);
      });
    }

    console.log('\n✅ Data storage check complete!');

  } catch (err) {
    console.log('❌ Main Error:', err.message);
  }
}

checkDataStorage();
