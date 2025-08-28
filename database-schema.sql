-- Database Schema for Startup Value Simulator
-- This schema supports companies, scenarios, and ESOP grants

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    industry TEXT,
    founded_date DATE,
    user_id UUID,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ESOP Grants table for employee stock options
CREATE TABLE IF NOT EXISTS esop_grants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    employee_name TEXT NOT NULL,
    grant_date DATE NOT NULL,
    total_shares INTEGER NOT NULL,
    exercise_price DECIMAL(10,4) NOT NULL DEFAULT 0.01,
    vesting_years INTEGER NOT NULL DEFAULT 4,
    vesting_cliff_months INTEGER NOT NULL DEFAULT 12,
    vesting_frequency TEXT NOT NULL DEFAULT 'monthly' CHECK (vesting_frequency IN ('monthly', 'quarterly', 'annually')),
    current_vested_shares INTEGER NOT NULL DEFAULT 0,
    exercised_shares INTEGER NOT NULL DEFAULT 0,
    departure_date DATE,
    departure_type TEXT CHECK (departure_type IN ('voluntary', 'involuntary', 'retirement', 'death')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scenarios table
CREATE TABLE IF NOT EXISTS scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    data JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);
CREATE INDEX IF NOT EXISTS idx_companies_is_active ON companies(is_active);
CREATE INDEX IF NOT EXISTS idx_companies_created_at ON companies(created_at);

CREATE INDEX IF NOT EXISTS idx_esop_grants_company_id ON esop_grants(company_id);
CREATE INDEX IF NOT EXISTS idx_esop_grants_is_active ON esop_grants(is_active);
CREATE INDEX IF NOT EXISTS idx_esop_grants_employee_name ON esop_grants(employee_name);
CREATE INDEX IF NOT EXISTS idx_esop_grants_grant_date ON esop_grants(grant_date);

CREATE INDEX IF NOT EXISTS idx_scenarios_company_id ON scenarios(company_id);
CREATE INDEX IF NOT EXISTS idx_scenarios_is_active ON scenarios(is_active);
CREATE INDEX IF NOT EXISTS idx_scenarios_created_at ON scenarios(created_at);
CREATE INDEX IF NOT EXISTS idx_scenarios_updated_at ON scenarios(updated_at);

-- Enable Row Level Security (RLS)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE esop_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic policies - adjust based on your auth system)
CREATE POLICY "Companies are viewable by everyone" ON companies
    FOR SELECT USING (is_active = true);

CREATE POLICY "Companies are insertable by everyone" ON companies
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Companies are updatable by owner" ON companies
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

CREATE TRIGGER update_esop_grants_updated_at 
    BEFORE UPDATE ON esop_grants 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scenarios_updated_at 
    BEFORE UPDATE ON scenarios 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO companies (name, description, industry, founded_date) VALUES
('Demo Startup', 'A sample startup company for demonstration purposes', 'Technology', '2023-01-01')
ON CONFLICT DO NOTHING;

-- Insert sample ESOP grants
INSERT INTO esop_grants (company_id, employee_name, grant_date, total_shares, exercise_price, vesting_years, vesting_cliff_months, current_vested_shares) 
SELECT 
    c.id,
    'John Doe',
    '2023-01-15',
    10000,
    0.01,
    4,
    12,
    2500
FROM companies c 
WHERE c.name = 'Demo Startup'
ON CONFLICT DO NOTHING;

INSERT INTO esop_grants (company_id, employee_name, grant_date, total_shares, exercise_price, vesting_years, vesting_cliff_months, current_vested_shares) 
SELECT 
    c.id,
    'Jane Smith',
    '2023-02-01',
    15000,
    0.01,
    4,
    12,
    3750
FROM companies c 
WHERE c.name = 'Demo Startup'
ON CONFLICT DO NOTHING;

-- Insert sample scenario
INSERT INTO scenarios (company_id, name, data) 
SELECT 
    c.id,
    'Sample Scenario',
    '{
        "founders": [
            {"id": "1", "name": "Founder 1", "shares": 1000000, "ownership": 45, "value": 0, "initialOwnership": 45, "dilutionHistory": [45]},
            {"id": "2", "name": "Founder 2", "shares": 1000000, "ownership": 45, "value": 0, "initialOwnership": 45, "dilutionHistory": [45]}
        ],
        "fundingRounds": [],
        "esopPool": 10,
        "esopGrants": [],
        "exitValuation": 10000000,
        "totalShares": 2000000
    }'::jsonb
FROM companies c 
WHERE c.name = 'Demo Startup'
ON CONFLICT DO NOTHING;
