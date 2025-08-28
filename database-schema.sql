-- Create companies table for multiple companies per user
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT,
  founded_date DATE,
  is_active BOOLEAN DEFAULT true
);

-- Create scenarios table for Startup Scenario Builder (linked to companies)
CREATE TABLE IF NOT EXISTS scenarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  total_shares BIGINT NOT NULL,
  current_valuation BIGINT NOT NULL,
  esop_pool NUMERIC(5,2) NOT NULL,
  exit_value BIGINT NOT NULL,
  founders JSONB NOT NULL,
  funding_rounds JSONB NOT NULL,
  stakeholders JSONB,
  description TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);
CREATE INDEX IF NOT EXISTS idx_companies_created_at ON companies(created_at);
CREATE INDEX IF NOT EXISTS idx_scenarios_company_id ON scenarios(company_id);
CREATE INDEX IF NOT EXISTS idx_scenarios_created_at ON scenarios(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;

-- Create policies for companies table
CREATE POLICY "Allow public read access to companies" ON companies
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to companies" ON companies
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to companies" ON companies
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access to companies" ON companies
  FOR DELETE USING (true);

-- Create policies for scenarios table
CREATE POLICY "Allow public read access to scenarios" ON scenarios
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to scenarios" ON scenarios
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to scenarios" ON scenarios
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access to scenarios" ON scenarios
  FOR DELETE USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scenarios_updated_at
  BEFORE UPDATE ON scenarios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample company for testing
INSERT INTO companies (name, description, industry) VALUES
(
  'Demo Startup',
  'A sample startup company for demonstration',
  'Technology'
);

-- Insert sample scenario for testing
INSERT INTO scenarios (company_id, name, company_name, total_shares, current_valuation, esop_pool, exit_value, founders, funding_rounds, stakeholders, description) 
SELECT 
  c.id,
  'Sample Scenario',
  c.name,
  10000000,
  5000000,
  10.00,
  50000000,
  '[
    {"id": "1", "name": "Founder 1", "shares": 3000000, "ownership": 30, "postRoundOwnership": 30, "exitPayout": 0},
    {"id": "2", "name": "Founder 2", "shares": 3000000, "ownership": 30, "postRoundOwnership": 30, "exitPayout": 0}
  ]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  'Sample scenario for demonstration'
FROM companies c
WHERE c.name = 'Demo Startup'
LIMIT 1;
