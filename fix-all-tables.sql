-- Fix All Table Structures
-- This script updates all tables to match the application's expected schema

-- ===== FOUNDERS TABLE =====
-- Add missing columns that the application expects
ALTER TABLE founders 
ADD COLUMN IF NOT EXISTS equity_percentage DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS role TEXT;

-- Update existing records to map current data to new structure
UPDATE founders 
SET 
    equity_percentage = COALESCE(initial_ownership, current_ownership, 0.00),
    role = 'Founder'
WHERE equity_percentage IS NULL;

-- Set default values for any remaining NULL values
UPDATE founders 
SET 
    equity_percentage = COALESCE(equity_percentage, 0.00),
    role = COALESCE(role, 'Founder')
WHERE equity_percentage IS NULL OR role IS NULL;

-- Make equity_percentage NOT NULL after setting values
ALTER TABLE founders 
ALTER COLUMN equity_percentage SET NOT NULL,
ALTER COLUMN role SET NOT NULL;

-- Add default values for future records
ALTER TABLE founders 
ALTER COLUMN equity_percentage SET DEFAULT 0.00,
ALTER COLUMN role SET DEFAULT 'Founder';

-- ===== FUNDING ROUNDS TABLE =====
-- Add missing columns that the application expects
ALTER TABLE funding_rounds 
ADD COLUMN IF NOT EXISTS capital_raised DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS valuation DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS investors JSONB,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Map existing data to new structure
UPDATE funding_rounds 
SET 
    capital_raised = COALESCE(investment_amount, 0.00),
    valuation = COALESCE(pre_money_valuation, 0.00),
    investors = COALESCE(investors, '[]'::jsonb),
    notes = COALESCE(notes, '')
WHERE capital_raised IS NULL OR valuation IS NULL OR investors IS NULL OR notes IS NULL;

-- Set default values
UPDATE funding_rounds 
SET 
    capital_raised = COALESCE(capital_raised, 0.00),
    valuation = COALESCE(valuation, 0.00),
    investors = COALESCE(investors, '[]'::jsonb),
    notes = COALESCE(notes, '')
WHERE capital_raised IS NULL OR valuation IS NULL OR investors IS NULL OR notes IS NULL;

-- Make required columns NOT NULL
ALTER TABLE funding_rounds 
ALTER COLUMN capital_raised SET NOT NULL,
ALTER COLUMN valuation SET NOT NULL,
ALTER COLUMN investors SET NOT NULL;

-- Add default values
ALTER TABLE funding_rounds 
ALTER COLUMN capital_raised SET DEFAULT 0.00,
ALTER COLUMN valuation SET DEFAULT 0.00,
ALTER COLUMN investors SET DEFAULT '[]'::jsonb,
ALTER COLUMN notes SET DEFAULT '';

-- ===== ESOP GRANTS TABLE =====
-- Add missing columns that the application expects
ALTER TABLE esop_grants 
ADD COLUMN IF NOT EXISTS employee_id TEXT,
ADD COLUMN IF NOT EXISTS position TEXT,
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS cliff_period INTEGER,
ADD COLUMN IF NOT EXISTS vesting_frequency TEXT,
ADD COLUMN IF NOT EXISTS status TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Set default values for existing records
UPDATE esop_grants 
SET 
    employee_id = COALESCE(employee_id, ''),
    position = COALESCE(position, 'Employee'),
    department = COALESCE(department, 'General'),
    cliff_period = COALESCE(cliff_period, 12),
    vesting_frequency = COALESCE(vesting_frequency, 'monthly'),
    status = COALESCE(status, 'active'),
    notes = COALESCE(notes, '')
WHERE employee_id IS NULL OR position IS NULL OR department IS NULL OR cliff_period IS NULL OR vesting_frequency IS NULL OR status IS NULL OR notes IS NULL;

-- Make required columns NOT NULL
ALTER TABLE esop_grants 
ALTER COLUMN position SET NOT NULL,
ALTER COLUMN department SET NOT NULL,
ALTER COLUMN cliff_period SET NOT NULL,
ALTER COLUMN vesting_frequency SET NOT NULL,
ALTER COLUMN status SET NOT NULL;

-- Add default values
ALTER TABLE esop_grants 
ALTER COLUMN employee_id SET DEFAULT '',
ALTER COLUMN position SET DEFAULT 'Employee',
ALTER COLUMN department SET DEFAULT 'General',
ALTER COLUMN cliff_period SET DEFAULT 12,
ALTER COLUMN vesting_frequency SET DEFAULT 'monthly',
ALTER COLUMN status SET DEFAULT 'active',
ALTER COLUMN notes SET DEFAULT '';

-- ===== VERIFY ALL CHANGES =====
-- Show updated founders structure
SELECT '=== FOUNDERS TABLE ===' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'founders' 
ORDER BY ordinal_position;

-- Show updated funding_rounds structure
SELECT '=== FUNDING ROUNDS TABLE ===' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'funding_rounds' 
ORDER BY ordinal_position;

-- Show updated esop_grants structure
SELECT '=== ESOP GRANTS TABLE ===' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'esop_grants' 
ORDER BY ordinal_position;

-- Show sample data to verify
SELECT '=== SAMPLE FOUNDERS DATA ===' as info;
SELECT id, name, equity_percentage, role, shares, is_active 
FROM founders 
LIMIT 3;

SELECT '=== SAMPLE FUNDING ROUNDS DATA ===' as info;
SELECT id, name, capital_raised, valuation, round_type, round_date, is_active 
FROM funding_rounds 
LIMIT 3;

SELECT '=== SAMPLE ESOP GRANTS DATA ===' as info;
SELECT id, employee_name, shares_granted, vesting_schedule, grant_date, is_active 
FROM esop_grants 
LIMIT 3;

-- Success message
SELECT 'All table structures updated successfully!' as status;


