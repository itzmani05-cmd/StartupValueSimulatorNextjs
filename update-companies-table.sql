-- Update Companies Table for Enhanced Company Creation
-- This script adds missing columns to support the new company modal features

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
    initial_valuation = COALESCE(cs.initial_valuation, c.initial_valuation, 0),
    legal_structure = COALESCE(cs.legal_structure, c.legal_structure, 'C-Corporation'),
    headquarters = COALESCE(cs.headquarters, c.headquarters),
    website = COALESCE(cs.website, c.website)
FROM companies c
WHERE company_settings.company_id = c.id
  AND (cs.initial_valuation IS NULL OR cs.legal_structure IS NULL);

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

-- ===== ADD INDEXES FOR PERFORMANCE =====

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_companies_legal_structure ON companies(legal_structure);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);
CREATE INDEX IF NOT EXISTS idx_companies_founded_date ON companies(founded_date);
CREATE INDEX IF NOT EXISTS idx_company_settings_legal_structure ON company_settings(legal_structure);

-- ===== VERIFY CHANGES =====

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

-- Show sample company data
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

-- Show sample company settings data
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

-- Success message
SELECT 'Companies table updated successfully with enhanced fields!' as status;

