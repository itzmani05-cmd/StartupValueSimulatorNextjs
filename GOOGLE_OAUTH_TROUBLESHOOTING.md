# Google OAuth Troubleshooting Guide

This guide will help you diagnose and resolve issues with Google OAuth in the Startup Value Simulator application.

## Common Issues and Solutions

### 1. "Unsupported provider: provider is not enabled" Error

**Cause**: The Google provider is not enabled in your Supabase project.

**Solution**:

1. Go to your Supabase dashboard
2. Navigate to **Authentication** → **Providers**
3. Find the **Google** provider and toggle it **ON**
4. Ensure both **Client ID** and **Secret** are correctly entered
5. Click **Save**

### 2. Redirect URI Mismatch

**Cause**: The redirect URIs configured in Google Cloud Console don't match what Supabase expects.

**Solution**:

1. In Google Cloud Console, go to **APIs & Services** → **Credentials**
2. Find your OAuth 2.0 Client ID
3. Add these URIs to **Authorized redirect URIs**:
   - `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback`
   - `http://localhost:5173/#/auth/callback` (for local development)
4. Save the changes

### 3. Incorrect Client Credentials

**Cause**: The Client ID or Secret provided to Supabase is incorrect.

**Solution**:

1. Verify the credentials in your [.env.local](file:///c:/Users/welcome/Desktop/StartupValueSimulator/startup-simulator-next/.env.local) file:
   ```
   VITE_GOOGLE_OAUTH_CLIENT_ID=YOUR_GOOGLE_OAUTH_CLIENT_ID
   ```
2. Ensure these match exactly with what you have in Google Cloud Console
3. Update the credentials in Supabase Authentication → Providers → Google

## Debugging Steps

### Step 1: Check Environment Variables

Verify that your environment variables are correctly set in [.env.local](file:///c:/Users/welcome/Desktop/StartupValueSimulator/startup-simulator-next/.env.local):

```bash
VITE_SUPABASE_URL=https://YOUR_SUPABASE_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_GOOGLE_OAUTH_CLIENT_ID=YOUR_GOOGLE_OAUTH_CLIENT_ID
```

### Step 2: Verify Supabase Configuration

1. Log into your Supabase dashboard
2. Go to **Settings** → **API** and verify your project URL and anon key match what's in your env file
3. Go to **Authentication** → **Providers** and verify:
   - Google provider is enabled
   - Client ID: `YOUR_GOOGLE_OAUTH_CLIENT_ID`
   - Secret: `YOUR_GOOGLE_OAUTH_SECRET`

### Step 3: Check Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID and verify:
   - Application type is "Web application"
   - Authorized redirect URIs include:
     - `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback`
     - `http://localhost:5173/#/auth/callback`

### Step 4: Test the Flow

1. Restart your development server:
   ```bash
   npm run dev
   ```
2. Open the browser's developer tools (F12)
3. Go to the Network tab
4. Navigate to your app and click "Continue with Google"
5. Observe the network requests and check for any errors

## Advanced Debugging

### Enable Supabase Auth Debug Logs

Add this to your Supabase client configuration in [supabase.ts](file:///c:/Users/welcome/Desktop/StartupValueSimulator/startup-simulator-next/src/lib/supabase.ts):

```typescript
import { createClient } from '@supabase/supabase-js'

// Enable debug mode
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    debug: true,
  },
})
```

### Check Browser Console

Look for any JavaScript errors in the browser console that might indicate issues with:

- Environment variable loading
- Supabase client initialization
- OAuth flow initiation

### Verify Database Schema

Ensure the `users` table exists in your Supabase database:

```sql
-- Check if users table exists
SELECT * FROM users LIMIT 1;

-- If it doesn't exist, create it:
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    phone TEXT,
    company TEXT,
    role TEXT,
    preferences JSONB,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase OAuth Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)

## Support

If you're still experiencing issues after following this guide:

1. Check the browser console for specific error messages
2. Verify all credentials match exactly between your files and provider dashboards
3. Ensure all redirect URIs are correctly configured
4. Contact support with:
   - Screenshots of error messages
   - Browser console output
   - Your Supabase project configuration
