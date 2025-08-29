-- Comprehensive Database Schema for Startup Value Simulator
-- This schema supports all data types used in the application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for future authentication)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    industry TEXT,
    founded_date DATE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Founders table
CREATE TABLE IF NOT EXISTS founders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    equity_percentage DECIMAL(5,2) NOT NULL,
    shares INTEGER NOT NULL,
    role TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Funding Rounds table
CREATE TABLE IF NOT EXISTS funding_rounds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    round_type TEXT NOT NULL CHECK (round_type IN ('SAFE', 'Priced Round')),
    capital_raised DECIMAL(15,2) NOT NULL,
    valuation DECIMAL(15,2) NOT NULL,
    valuation_type TEXT NOT NULL CHECK (valuation_type IN ('pre-money', 'post-money')),
    shares_issued INTEGER,
    share_price DECIMAL(10,4),
    valuation_cap DECIMAL(15,2),
    discount_rate DECIMAL(5,2),
    conversion_trigger TEXT CHECK (conversion_trigger IN ('next-round', 'exit', 'ipo')),
    investors JSONB NOT NULL, -- Array of investor names
    round_date DATE NOT NULL,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Scenarios table
CREATE TABLE IF NOT EXISTS scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    data JSONB NOT NULL, -- Comprehensive scenario data
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
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);
CREATE INDEX IF NOT EXISTS idx_companies_is_active ON companies(is_active);
CREATE INDEX IF NOT EXISTS idx_companies_created_at ON companies(created_at);

CREATE INDEX IF NOT EXISTS idx_founders_company_id ON founders(company_id);
CREATE INDEX IF NOT EXISTS idx_founders_is_active ON founders(is_active);

CREATE INDEX IF NOT EXISTS idx_funding_rounds_company_id ON funding_rounds(company_id);
CREATE INDEX IF NOT EXISTS idx_funding_rounds_is_active ON funding_rounds(is_active);
CREATE INDEX IF NOT EXISTS idx_funding_rounds_round_date ON funding_rounds(round_date);
CREATE INDEX IF NOT EXISTS idx_funding_rounds_round_type ON funding_rounds(round_type);

CREATE INDEX IF NOT EXISTS idx_esop_grants_company_id ON esop_grants(company_id);
CREATE INDEX IF NOT EXISTS idx_esop_grants_is_active ON esop_grants(is_active);
CREATE INDEX IF NOT EXISTS idx_esop_grants_employee_name ON esop_grants(employee_name);
CREATE INDEX IF NOT EXISTS idx_esop_grants_grant_date ON esop_grants(grant_date);
CREATE INDEX IF NOT EXISTS idx_esop_grants_status ON esop_grants(status);

CREATE INDEX IF NOT EXISTS idx_scenarios_company_id ON scenarios(company_id);
CREATE INDEX IF NOT EXISTS idx_scenarios_is_active ON scenarios(is_active);
CREATE INDEX IF NOT EXISTS idx_scenarios_created_at ON scenarios(created_at);
CREATE INDEX IF NOT EXISTS idx_scenarios_updated_at ON scenarios(updated_at);

CREATE INDEX IF NOT EXISTS idx_company_settings_company_id ON company_settings(company_id);

CREATE INDEX IF NOT EXISTS idx_comments_company_id ON comments(company_id);
CREATE INDEX IF NOT EXISTS idx_comments_entity_id ON comments(entity_id);
CREATE INDEX IF NOT EXISTS idx_comments_entity_type ON comments(entity_type);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE funding_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE esop_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic policies - adjust based on your auth system)
CREATE POLICY "Companies are viewable by everyone" ON companies
    FOR SELECT USING (is_active = true);

CREATE POLICY "Companies are insertable by everyone" ON companies
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Companies are updatable by owner" ON companies
    FOR UPDATE USING (is_active = true);

CREATE POLICY "Founders are viewable by company members" ON founders
    FOR SELECT USING (is_active = true);

CREATE POLICY "Founders are insertable by company members" ON founders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Founders are updatable by company members" ON founders
    FOR UPDATE USING (is_active = true);

CREATE POLICY "Funding rounds are viewable by company members" ON funding_rounds
    FOR SELECT USING (is_active = true);

CREATE POLICY "Funding rounds are insertable by company members" ON funding_rounds
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Funding rounds are updatable by company members" ON funding_rounds
    FOR UPDATE USING (is_active = true);

CREATE POLICY "ESOP grants are viewable by company members" ON esop_grants
    FOR SELECT USING (is_active = true);

CREATE POLICY "ESOP grants are insertable by company members" ON esop_grants
    FOR INSERT WITH CHECK (true);

CREATE POLICY "ESOP grants are updatable by company members" ON esop_grants
    FOR UPDATE USING (is_active = true);

CREATE POLICY "Scenarios are viewable by company members" ON scenarios
    FOR SELECT USING (is_active = true);

CREATE POLICY "Scenarios are insertable by company members" ON scenarios
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Scenarios are updatable by company members" ON scenarios
    FOR UPDATE USING (is_active = true);

CREATE POLICY "Company settings are viewable by company members" ON company_settings
    FOR SELECT USING (true);

CREATE POLICY "Company settings are insertable by company members" ON company_settings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Company settings are updatable by company members" ON company_settings
    FOR UPDATE USING (true);

CREATE POLICY "Comments are viewable by company members" ON comments
    FOR SELECT USING (is_active = true);

CREATE POLICY "Comments are insertable by company members" ON comments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Comments are updatable by company members" ON comments
    FOR UPDATE USING (is_active = true);

-- Function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_companies_updated_at 
    BEFORE UPDATE ON companies 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_founders_updated_at 
    BEFORE UPDATE ON founders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_funding_rounds_updated_at 
    BEFORE UPDATE ON funding_rounds 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_esop_grants_updated_at 
    BEFORE UPDATE ON esop_grants 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scenarios_updated_at 
    BEFORE UPDATE ON scenarios 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_settings_updated_at 
    BEFORE UPDATE ON company_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at 
    BEFORE UPDATE ON comments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO companies (name, description, industry, founded_date) VALUES
('Demo Startup', 'A sample startup company for demonstration purposes', 'Technology', '2023-01-01')
ON CONFLICT DO NOTHING;

-- Insert sample founders
INSERT INTO founders (company_id, name, equity_percentage, shares, role) 
SELECT 
    c.id,
    'Founder 1',
    60.0,
    6000000,
    'CEO'
FROM companies c 
WHERE c.name = 'Demo Startup'
ON CONFLICT DO NOTHING;

INSERT INTO founders (company_id, name, equity_percentage, shares, role) 
SELECT 
    c.id,
    'Founder 2',
    30.0,
    3000000,
    'CTO'
FROM companies c 
WHERE c.name = 'Demo Startup'
ON CONFLICT DO NOTHING;

-- Insert sample funding round
INSERT INTO funding_rounds (company_id, name, round_type, capital_raised, valuation, valuation_type, valuation_cap, discount_rate, conversion_trigger, investors, round_date, notes) 
SELECT 
    c.id,
    'Seed Round',
    'SAFE',
    1000000,
    5000000,
    'pre-money',
    5000000,
    20.0,
    'next-round',
    '["Angel Investor 1"]',
    '2023-06-01',
    'Initial seed funding'
FROM companies c 
WHERE c.name = 'Demo Startup'
ON CONFLICT DO NOTHING;

-- Insert sample ESOP grants
INSERT INTO esop_grants (company_id, employee_name, employee_id, position, department, grant_date, shares_granted, vesting_schedule, cliff_period, vesting_frequency, exercise_price, notes) 
SELECT 
    c.id,
    'Sarah Johnson',
    'EMP001',
    'Senior Software Engineer',
    'Engineering',
    '2023-01-15',
    50000,
    '4-year',
    12,
    'monthly',
    0.01,
    'Key engineering hire, leading backend development'
FROM companies c 
WHERE c.name = 'Demo Startup'
ON CONFLICT DO NOTHING;

INSERT INTO esop_grants (company_id, employee_name, employee_id, position, department, grant_date, shares_granted, vesting_schedule, cliff_period, vesting_frequency, exercise_price, notes) 
SELECT 
    c.id,
    'Michael Chen',
    'EMP002',
    'Product Manager',
    'Product',
    '2023-03-20',
    75000,
    '4-year',
    12,
    'monthly',
    0.01,
    'Product strategy and roadmap development'
FROM companies c 
WHERE c.name = 'Demo Startup'
ON CONFLICT DO NOTHING;

-- Insert sample company settings
INSERT INTO company_settings (company_id, current_valuation, esop_pool_percentage, total_shares, exit_valuation) 
SELECT 
    c.id,
    5000000,
    10.0,
    10000000,
    10000000
FROM companies c 
WHERE c.name = 'Demo Startup'
ON CONFLICT DO NOTHING;

-- Insert sample scenario
INSERT INTO scenarios (company_id, name, description, data) 
SELECT 
    c.id,
    'Default Scenario',
    'Initial company setup scenario',
    '{
        "founders": [
            {"id": "1", "name": "Founder 1", "equityPercentage": 60, "shares": 6000000, "role": "CEO"},
            {"id": "2", "name": "Founder 2", "equityPercentage": 30, "shares": 3000000, "role": "CTO"}
        ],
        "fundingRounds": [
            {
                "id": "round-1",
                "name": "Seed Round",
                "roundType": "SAFE",
                "capitalRaised": 1000000,
                "valuation": 5000000,
                "valuationType": "pre-money",
                "valuationCap": 5000000,
                "discountRate": 20,
                "conversionTrigger": "next-round",
                "investors": ["Angel Investor 1"],
                "date": "2023-06-01",
                "notes": "Initial seed funding"
            }
        ],
        "esopPool": 10,
        "esopGrants": [
            {
                "id": "grant-1",
                "employeeName": "Sarah Johnson",
                "employeeId": "EMP001",
                "position": "Senior Software Engineer",
                "department": "Engineering",
                "grantDate": "2023-01-15",
                "sharesGranted": 50000,
                "vestingSchedule": "4-year",
                "cliffPeriod": 12,
                "vestingFrequency": "monthly",
                "exercisePrice": 0.01,
                "status": "active",
                "notes": "Key engineering hire, leading backend development"
            }
        ],
        "exitValuation": 10000000,
        "totalShares": 10000000
    }'::jsonb
FROM companies c 
WHERE c.name = 'Demo Startup'
ON CONFLICT DO NOTHING;
