-- Fix Founders Table Structure
-- This script updates the founders table to match the application's expected schema

-- First, let's see what we currently have
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'founders' 
ORDER BY ordinal_position;

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

-- Verify the updated structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'founders' 
ORDER BY ordinal_position;

-- Show sample data to verify
SELECT id, name, equity_percentage, role, shares, is_active 
FROM founders 
LIMIT 5;

-- Success message
SELECT 'Founders table structure updated successfully!' as status;


