-- Comprehensive Database Update Script
-- This script updates all tables to support the enhanced company creation system
-- Run this script in your Supabase SQL editor to update your database

-- ===== COMPANIES TABLE ENHANCEMENTS =====

-- Add new columns for enhanced company information
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS legal_structure TEXT DEFAULT 'C-Corporation',
ADD COLUMN IF NOT EXISTS headquarters TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS total_shares INTEGER DEFAULT 10000000,
ADD COLUMN IF NOT EXISTS initial_valuation DECIMAL(15,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS esop_pool_percentage DECIMAL(5,2) DEFAULT 10;

-- Update existing records with default values
UPDATE companies 
SET 
    legal_structure = COALESCE(legal_structure, 'C-Corporation'),
    total_shares = COALESCE(total_shares, 10000000),
    initial_valuation = COALESCE(initial_valuation, 0),
    esop_pool_percentage = COALESCE(esop_pool_percentage, 10)
WHERE legal_structure IS NULL 
   OR total_shares IS NULL 
   OR initial_valuation IS NULL 
   OR esop_pool_percentage IS NULL;

-- Add constraints for data integrity
ALTER TABLE companies 
ADD CONSTRAINT check_legal_structure 
CHECK (legal_structure IN ('C-Corporation', 'S-Corporation', 'LLC', 'Partnership', 'Sole Proprietorship'));

ALTER TABLE companies 
ADD CONSTRAINT check_total_shares 
CHECK (total_shares > 0);

ALTER TABLE companies 
ADD CONSTRAINT check_esop_pool 
CHECK (esop_pool_percentage >= 0 AND esop_pool_percentage <= 100);

-- ===== COMPANY SETTINGS TABLE ENHANCEMENTS =====

-- Ensure company_settings table has all required fields
ALTER TABLE company_settings 
ADD COLUMN IF NOT EXISTS initial_valuation DECIMAL(15,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS legal_structure TEXT DEFAULT 'C-Corporation',
ADD COLUMN IF NOT EXISTS headquarters TEXT,
ADD COLUMN IF NOT EXISTS website TEXT;

-- Update existing company settings with company data
UPDATE company_settings 
SET 
    initial_valuation = COALESCE(company_settings.initial_valuation, c.initial_valuation, 0),
    legal_structure = COALESCE(company_settings.legal_structure, c.legal_structure, 'C-Corporation'),
    headquarters = COALESCE(company_settings.headquarters, c.headquarters),
    website = COALESCE(company_settings.website, c.website)
FROM companies c
WHERE company_settings.company_id = c.id
  AND (company_settings.initial_valuation IS NULL OR company_settings.legal_structure IS NULL);

-- ===== CREATE MISSING COMPANY SETTINGS =====

-- Insert company settings for companies that don't have them
INSERT INTO company_settings (company_id, current_valuation, esop_pool_percentage, total_shares, initial_valuation, legal_structure, headquarters, website)
SELECT 
    c.id,
    COALESCE(c.initial_valuation, 0),
    COALESCE(c.esop_pool_percentage, 10),
    COALESCE(c.total_shares, 10000000),
    COALESCE(c.initial_valuation, 0),
    COALESCE(c.legal_structure, 'C-Corporation'),
    c.headquarters,
    c.website
FROM companies c
LEFT JOIN company_settings cs ON c.id = cs.company_id
WHERE cs.company_id IS NULL;

-- ===== FOUNDERS TABLE ENHANCEMENTS =====

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

-- ===== FUNDING ROUNDS TABLE ENHANCEMENTS =====

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

-- ===== ESOP GRANTS TABLE ENHANCEMENTS =====

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

-- ===== ADD INDEXES FOR PERFORMANCE =====

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_companies_legal_structure ON companies(legal_structure);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);
CREATE INDEX IF NOT EXISTS idx_companies_founded_date ON companies(founded_date);
CREATE INDEX IF NOT EXISTS idx_company_settings_legal_structure ON company_settings(legal_structure);

-- ===== VERIFY ALL CHANGES =====

-- Show updated companies table structure
SELECT '=== COMPANIES TABLE STRUCTURE ===' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'companies' 
ORDER BY ordinal_position;

-- Show updated company_settings table structure
SELECT '=== COMPANY SETTINGS TABLE STRUCTURE ===' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'company_settings' 
ORDER BY ordinal_position;

-- Show updated founders table structure
SELECT '=== FOUNDERS TABLE STRUCTURE ===' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'founders' 
ORDER BY ordinal_position;

-- Show updated funding_rounds table structure
SELECT '=== FUNDING ROUNDS TABLE STRUCTURE ===' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'funding_rounds' 
ORDER BY ordinal_position;

-- Show updated esop_grants table structure
SELECT '=== ESOP GRANTS TABLE STRUCTURE ===' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'esop_grants' 
ORDER BY ordinal_position;

-- Show sample data to verify
SELECT '=== SAMPLE COMPANIES DATA ===' as info;
SELECT 
    id, 
    name, 
    industry, 
    founded_date, 
    legal_structure, 
    total_shares, 
    initial_valuation, 
    esop_pool_percentage,
    headquarters,
    website
FROM companies 
LIMIT 3;

SELECT '=== SAMPLE COMPANY SETTINGS DATA ===' as info;
SELECT 
    company_id, 
    current_valuation, 
    esop_pool_percentage, 
    total_shares, 
    initial_valuation,
    legal_structure,
    headquarters,
    website
FROM company_settings 
LIMIT 3;

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
SELECT 'All database tables updated successfully with enhanced fields!' as status;
