-- Create Missing Tables for Startup Value Simulator
-- This script adds the tables that are missing from your current database

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ESOP Grants table
CREATE TABLE IF NOT EXISTS esop_grants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    employee_name TEXT NOT NULL,
    employee_id TEXT,
    position TEXT,
    department TEXT,
    grant_date DATE NOT NULL,
    shares_granted INTEGER NOT NULL,
    vesting_schedule TEXT NOT NULL CHECK (vesting_schedule IN ('3-year', '4-year', '5-year')),
    cliff_period INTEGER NOT NULL DEFAULT 12, -- in months
    vesting_frequency TEXT NOT NULL DEFAULT 'monthly' CHECK (vesting_frequency IN ('monthly', 'quarterly', 'annually')),
    exercise_price DECIMAL(10,4) NOT NULL DEFAULT 0.01,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'vested', 'exercised', 'forfeited', 'expired')),
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company Settings table (for current valuation, ESOP pool, etc.)
CREATE TABLE IF NOT EXISTS company_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    current_valuation DECIMAL(15,2) NOT NULL DEFAULT 0,
    esop_pool_percentage DECIMAL(5,2) NOT NULL DEFAULT 10,
    total_shares INTEGER NOT NULL DEFAULT 10000000,
    exit_valuation DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id)
);

-- Comments table for collaboration
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    entity_id TEXT NOT NULL, -- ID of the entity being commented on
    entity_type TEXT NOT NULL, -- Type of entity (founder, funding_round, esop_grant, etc.)
    user_name TEXT NOT NULL,
    user_role TEXT,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_esop_grants_company_id ON esop_grants(company_id);
CREATE INDEX IF NOT EXISTS idx_esop_grants_is_active ON esop_grants(is_active);
CREATE INDEX IF NOT EXISTS idx_esop_grants_employee_name ON esop_grants(employee_name);
CREATE INDEX IF NOT EXISTS idx_esop_grants_grant_date ON esop_grants(grant_date);
CREATE INDEX IF NOT EXISTS idx_esop_grants_status ON esop_grants(status);

CREATE INDEX IF NOT EXISTS idx_company_settings_company_id ON company_settings(company_id);

CREATE INDEX IF NOT EXISTS idx_comments_company_id ON comments(company_id);
CREATE INDEX IF NOT EXISTS idx_comments_entity_id ON comments(entity_id);
CREATE INDEX IF NOT EXISTS idx_comments_entity_type ON comments(entity_type);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE esop_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the new tables
CREATE POLICY "ESOP grants are viewable by everyone" ON esop_grants
    FOR SELECT USING (is_active = true);

CREATE POLICY "ESOP grants are insertable by everyone" ON esop_grants
    FOR INSERT WITH CHECK (true);

CREATE POLICY "ESOP grants are updatable by everyone" ON esop_grants
    FOR UPDATE USING (is_active = true);

CREATE POLICY "Company settings are viewable by everyone" ON company_settings
    FOR SELECT USING (true);

CREATE POLICY "Company settings are insertable by everyone" ON company_settings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Company settings are updatable by everyone" ON company_settings
    FOR UPDATE USING (true);

CREATE POLICY "Comments are viewable by everyone" ON comments
    FOR SELECT USING (is_active = true);

CREATE POLICY "Comments are insertable by everyone" ON comments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Comments are updatable by everyone" ON comments
    FOR UPDATE USING (is_active = true);

-- Insert sample company settings for existing companies
INSERT INTO company_settings (company_id, current_valuation, esop_pool_percentage, total_shares, exit_valuation)
SELECT 
    id,
    1000000, -- Default current valuation
    15,      -- Default ESOP pool
    10000000, -- Default total shares
    100000000 -- Default exit valuation
FROM companies 
WHERE id NOT IN (SELECT company_id FROM company_settings);

-- Success message
SELECT 'Missing tables created successfully!' as status;
