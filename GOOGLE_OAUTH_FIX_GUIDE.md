# Google OAuth Fix Guide

This guide will help you resolve the "Unsupported provider: provider is not enabled" error you're encountering with Google OAuth in your Startup Value Simulator application.

## Current Error Analysis

The error you're seeing:

```
GET https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/authorize?provider=google&redirect_to=http%3A%2F%2Flocalhost%3A5176%2F%23%2Fauth%2Fcallback 400 (Bad Request)
```

This indicates that while your frontend code is correctly configured, the Google provider is not enabled in your Supabase backend.

## Step-by-Step Fix

### 1. Verify Supabase Google Provider Configuration

1. Log into your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project (`YOUR_SUPABASE_PROJECT_ID`)
3. Navigate to **Authentication** → **Providers**
4. Find the **Google** provider in the list
5. Make sure the toggle switch is set to **ON/Enabled**
6. Verify the following credentials are entered:
   - **Client ID**: `YOUR_GOOGLE_OAUTH_CLIENT_ID`
   - **Secret**: `YOUR_GOOGLE_OAUTH_SECRET`
7. Click **Save** if you made any changes

### 2. Verify Redirect URLs in Supabase

In the same Google provider settings in Supabase, make sure these redirect URLs are added:

- `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback`
- `http://localhost:5176/#/auth/callback` (adjust port if needed)

### 3. Check Google Cloud Console Configuration

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID
5. Ensure these URIs are in **Authorized redirect URIs**:
   - `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback`
   - `http://localhost:5176/#/auth/callback` (adjust port if needed)

### 4. Verify Environment Variables

Your [.env.local](file:///c:/Users/welcome/Desktop/StartupValueSimulator/startup-simulator-next/.env.local) file looks correct:

```env
VITE_SUPABASE_URL=https://YOUR_SUPABASE_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_GOOGLE_OAUTH_CLIENT_ID=YOUR_GOOGLE_OAUTH_CLIENT_ID
```

### 5. Test the OAuth Flow

1. Restart your development server:
   ```bash
   npm run dev
   ```
2. Open the browser's developer tools (F12)
3. Go to the Network tab
4. Navigate to your app and click "Continue with Google"
5. Observe the network requests and check for any errors

## Common Issues and Solutions

### Issue 1: Provider Not Enabled

**Symptoms**: 400 Bad Request with "Unsupported provider" message
**Solution**: Enable the Google provider in Supabase Authentication → Providers

### Issue 2: Incorrect Credentials

**Symptoms**: Redirect to Google but immediate error or redirect back to login
**Solution**: Double-check Client ID and Secret in Supabase provider settings

### Issue 3: Redirect URL Mismatch

**Symptoms**: Successful Google authentication but stuck on Google page or error about redirect URI
**Solution**: Ensure all redirect URLs match exactly in both Google Cloud Console and Supabase

## Debugging Steps

### 1. Enable Supabase Auth Debug Logs

Add debug mode to your Supabase client configuration in [supabase.ts](file:///c:/Users/welcome/Desktop/StartupValueSimulator/startup-simulator-next/src/lib/supabase.ts):

```typescript
import { createClient } from '@supabase/supabase-js'

// Enable debug mode
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    debug: true,
  },
})
```

### 2. Check Browser Console

Look for any JavaScript errors in the browser console that might indicate issues with:

- Environment variable loading
- Supabase client initialization
- OAuth flow initiation

### 3. Check Supabase Authentication Logs

1. In your Supabase dashboard
2. Go to **Authentication** → **Logs**
3. Look for any error messages related to Google OAuth

## Testing with OAuthTest Component

You have an [OAuthTest.tsx](file:///c:/Users/welcome/Desktop/StartupValueSimulator/startup-simulator-next/src/components/OAuthTest.tsx) component that can help with debugging. Make sure it's included in your [Home.tsx](file:///c:/Users/welcome/Desktop/StartupValueSimulator/startup-simulator-next/src/pages/Home.tsx) page for easy testing.

## Security Considerations

1. Never commit sensitive information like client secrets to version control
2. Use environment variables for all sensitive configuration
3. Regularly rotate your OAuth credentials
4. Monitor authentication logs for suspicious activity

## Additional Resources

- [Supabase Authentication Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [OAuth Implementation Checklist](file:///c:/Users/welcome/Desktop/StartupValueSimulator/startup-simulator-next/OAUTH_IMPLEMENTATION_CHECKLIST.md)
- [Google OAuth Setup Guide](file:///c:/Users/welcome/Desktop/StartupValueSimulator/startup-simulator-next/GOOGLE_OAUTH_SETUP.md)
- [Supabase Google Auth Setup](file:///c:/Users/welcome/Desktop/StartupValueSimulator/startup-simulator-next/SUPABASE_GOOGLE_AUTH_SETUP.md)
- [Google OAuth Troubleshooting](file:///c:/Users/welcome/Desktop/StartupValueSimulator/startup-simulator-next/GOOGLE_OAUTH_TROUBLESHOOTING.md)
