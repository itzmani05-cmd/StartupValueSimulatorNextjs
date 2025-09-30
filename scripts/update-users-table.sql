-- Migration script to update users table with additional fields
-- This script adds new columns to the existing users table

-- Add new columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS role TEXT,
ADD COLUMN IF NOT EXISTS preferences JSONB,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_company ON users(company);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login);

-- Update the function to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP FUNCTION IF EXISTS update_users_updated_at_column;

CREATE OR REPLACE FUNCTION update_users_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at on users table
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_users_updated_at_column();

-- Create function to sync auth.users to public.users
CREATE OR REPLACE FUNCTION sync_auth_users_to_public()
RETURNS TRIGGER AS $$
BEGIN
    -- For INSERT (new user signup)
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.users (id, email, name, created_at, updated_at)
        VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name', NOW(), NOW())
        ON CONFLICT (id) DO NOTHING;
        RETURN NEW;
    -- For UPDATE (user update)
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE public.users 
        SET 
            email = NEW.email,
            name = NEW.raw_user_meta_data->>'name',
            updated_at = NOW()
        WHERE id = NEW.id;
        RETURN NEW;
    -- For DELETE (user deletion)
    ELSIF TG_OP = 'DELETE' THEN
        DELETE FROM public.users WHERE id = OLD.id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to sync auth.users to public.users
DROP TRIGGER IF EXISTS sync_auth_users_trigger ON auth.users;
CREATE TRIGGER sync_auth_users_trigger
    AFTER INSERT OR UPDATE OR DELETE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION sync_auth_users_to_public();