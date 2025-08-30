// Test script to verify funding rounds functionality
// Run this in your browser console to test

console.log('🧪 Testing Funding Rounds Functionality...');

// Test data for a new funding round
const testFundingRound = {
  id: `round-${Date.now()}`,
  name: 'Test Seed Round',
  roundType: 'SAFE',
  capitalRaised: 500000,
  valuation: 2000000,
  valuationType: 'pre-money',
  sharesIssued: 0,
  sharePrice: 0,
  valuationCap: 2000000,
  discountRate: 20,
  conversionTrigger: 'next-round',
  investors: ['Test Investor 1', 'Test Investor 2'],
  date: new Date().toISOString().split('T')[0],
  notes: 'Test funding round for debugging'
};

console.log('📊 Test Funding Round Data:', testFundingRound);

// Test validation
function validateFundingRound(round) {
  const errors = [];
  
  if (!round.name?.trim()) {
    errors.push('Round name is required');
  }
  
  if (!round.capitalRaised || round.capitalRaised <= 0) {
    errors.push('Capital raised must be greater than 0');
  }
  
  if (!round.valuation || round.valuation <= 0) {
    errors.push('Valuation must be greater than 0');
  }
  
  if (round.roundType === 'Priced Round') {
    if (!round.sharesIssued || round.sharesIssued <= 0) {
      errors.push('Shares issued is required for priced rounds');
    }
    if (!round.sharePrice || round.sharePrice <= 0) {
      errors.push('Share price is required for priced rounds');
    }
  }
  
  if (round.roundType === 'SAFE') {
    if (!round.valuationCap || round.valuationCap <= 0) {
      errors.push('Valuation cap is required for SAFEs');
    }
  }
  
  return errors;
}

// Test validation
const validationErrors = validateFundingRound(testFundingRound);
if (validationErrors.length > 0) {
  console.error('❌ Validation Errors:', validationErrors);
} else {
  console.log('✅ Validation passed');
}

// Test data mapping (simulate what the app does)
function mapToDatabaseFormat(appRound, companyId) {
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

// Test mapping
const testCompanyId = 'test-company-123';
const dbFormat = mapToDatabaseFormat(testFundingRound, testCompanyId);
console.log('🗄️ Database Format:', dbFormat);

// Test the complete flow
function testFundingRoundFlow() {
  console.log('\n🚀 Testing Complete Funding Round Flow...');
  
  // 1. Create round object
  const round = { ...testFundingRound };
  console.log('1. Created round object:', round);
  
  // 2. Validate
  const errors = validateFundingRound(round);
  if (errors.length > 0) {
    console.error('2. Validation failed:', errors);
    return false;
  }
  console.log('2. Validation passed');
  
  // 3. Map to database format
  const dbData = mapToDatabaseFormat(round, testCompanyId);
  console.log('3. Mapped to database format:', dbData);
  
  // 4. Simulate database save
  console.log('4. Would save to database with:', {
    table: 'funding_rounds',
    data: dbData
  });
  
  console.log('✅ Funding round flow test completed successfully!');
  return true;
}

// Run the test
testFundingRoundFlow();

console.log('\n📋 To test in your app:');
console.log('1. Run the SQL fix script: fix-funding-rounds.sql');
console.log('2. Try adding a funding round in the Funding Rounds tab');
console.log('3. Check the browser console for any errors');
console.log('4. Verify the round appears in the list');

