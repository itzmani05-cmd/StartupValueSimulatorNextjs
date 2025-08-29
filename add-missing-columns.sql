-- Add Missing Columns to Existing Tables
-- This script adds the missing columns that the application code expects

-- Add missing columns to funding_rounds table
ALTER TABLE funding_rounds 
ADD COLUMN IF NOT EXISTS round_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add missing columns to esop_grants table  
ALTER TABLE esop_grants 
ADD COLUMN IF NOT EXISTS grant_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add missing columns to companies table
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add missing columns to founders table
ALTER TABLE founders 
ADD COLUMN IF NOT EXISTS equity_percentage DECIMAL(5,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add missing columns to scenarios table
ALTER TABLE scenarios 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add missing columns to comments table
ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Create missing indexes
CREATE INDEX IF NOT EXISTS idx_funding_rounds_round_date ON funding_rounds(round_date);
CREATE INDEX IF NOT EXISTS idx_funding_rounds_round_type ON funding_rounds(round_type);
CREATE INDEX IF NOT EXISTS idx_funding_rounds_is_active ON funding_rounds(is_active);

CREATE INDEX IF NOT EXISTS idx_esop_grants_grant_date ON esop_grants(grant_date);
CREATE INDEX IF NOT EXISTS idx_esop_grants_is_active ON esop_grants(is_active);

CREATE INDEX IF NOT EXISTS idx_companies_is_active ON companies(is_active);
CREATE INDEX IF NOT EXISTS idx_founders_is_active ON founders(is_active);
CREATE INDEX IF NOT EXISTS idx_scenarios_is_active ON scenarios(is_active);
CREATE INDEX IF NOT EXISTS idx_comments_is_active ON comments(is_active);

-- Update existing records to have proper dates
UPDATE funding_rounds 
SET round_date = created_at::date 
WHERE round_date IS NULL;

UPDATE esop_grants 
SET grant_date = created_at::date 
WHERE grant_date IS NULL;

-- Update existing founders to have default equity percentage
UPDATE founders 
SET equity_percentage = 0.00 
WHERE equity_percentage IS NULL;

-- Success message
SELECT 'Missing columns added successfully!' as status;
