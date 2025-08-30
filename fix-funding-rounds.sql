-- Fix Funding Rounds Table Structure
-- This script ensures the funding_rounds table has all required fields and proper structure

-- ===== CHECK CURRENT STRUCTURE =====
SELECT '=== CURRENT FUNDING ROUNDS TABLE STRUCTURE ===' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'funding_rounds' 
ORDER BY ordinal_position;

-- ===== ADD MISSING COLUMNS =====
-- Add any missing columns that the application expects
ALTER TABLE funding_rounds 
ADD COLUMN IF NOT EXISTS capital_raised DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS valuation DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS investment_amount DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS pre_money_valuation DECIMAL(15,2);

-- ===== UPDATE EXISTING DATA =====
-- Map existing data to new structure
UPDATE funding_rounds 
SET 
    capital_raised = COALESCE(capital_raised, investment_amount, 0.00),
    valuation = COALESCE(valuation, pre_money_valuation, 0.00)
WHERE capital_raised IS NULL OR valuation IS NULL;

-- Set default values for any remaining NULL values
UPDATE funding_rounds 
SET 
    capital_raised = COALESCE(capital_raised, 0.00),
    valuation = COALESCE(valuation, 0.00)
WHERE capital_raised IS NULL OR valuation IS NULL;

-- ===== ENSURE REQUIRED COLUMNS ARE NOT NULL =====
-- Make required columns NOT NULL after setting values
ALTER TABLE funding_rounds 
ALTER COLUMN capital_raised SET NOT NULL,
ALTER COLUMN valuation SET NOT NULL;

-- ===== SET DEFAULT VALUES =====
-- Add default values for future records
ALTER TABLE funding_rounds 
ALTER COLUMN capital_raised SET DEFAULT 0.00,
ALTER COLUMN valuation SET DEFAULT 0.00;

-- ===== VERIFY CHANGES =====
SELECT '=== UPDATED FUNDING ROUNDS TABLE STRUCTURE ===' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'funding_rounds' 
ORDER BY ordinal_position;

-- ===== SHOW SAMPLE DATA =====
SELECT '=== SAMPLE FUNDING ROUNDS DATA ===' as info;
SELECT 
    id, 
    name, 
    round_type,
    capital_raised,
    valuation,
    round_date,
    is_active
FROM funding_rounds 
LIMIT 5;

-- ===== SUCCESS MESSAGE =====
SELECT 'Funding rounds table structure fixed successfully!' as status;

