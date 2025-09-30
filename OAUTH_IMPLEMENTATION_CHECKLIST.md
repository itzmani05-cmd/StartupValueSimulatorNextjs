# OAuth Implementation Checklist

This checklist will help you verify that all components of the Google OAuth implementation are correctly configured.

## 1. Environment Variables

Check that your [.env.local](file:///c:/Users/welcome/Desktop/StartupValueSimulator/startup-simulator-next/.env.local) file contains the correct Google OAuth credentials:

```env
VITE_SUPABASE_URL=https://YOUR_SUPABASE_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_GOOGLE_OAUTH_CLIENT_ID=YOUR_GOOGLE_OAUTH_CLIENT_ID
```

## 2. Supabase Configuration

### Enable Google Provider

1. Log into your Supabase dashboard
2. Go to **Authentication** → **Providers**
3. Find the **Google** provider and ensure it's enabled (toggled ON)
4. Verify the credentials:
   - **Client ID**: `YOUR_GOOGLE_OAUTH_CLIENT_ID`
   - **Secret**: `YOUR_GOOGLE_OAUTH_SECRET`

### Configure Redirect URLs

In the same Google provider settings, ensure these redirect URLs are added:

- `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback`
- `http://localhost:5176/#/auth/callback` (or whatever port your dev server is running on)

## 3. Google Cloud Console Configuration

### OAuth Client Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID
5. Ensure these URIs are in **Authorized redirect URIs**:
   - `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback`
   - `http://localhost:5176/#/auth/callback` (adjust port as needed)

## 4. Code Implementation Verification

### OAuth Callback Handler

Verify that [OAuthCallbackHandler.tsx](file:///c:/Users/welcome/Desktop/StartupValueSimulator/startup-simulator-next/src/components/OAuthCallbackHandler.tsx) exists and is properly implemented:

```typescript
import React, { useEffect } from 'react';
import { Spin } from 'antd';
import { supabase } from '../lib/supabase';

const OAuthCallbackHandler: React.FC = () => {
  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get the OAuth session
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('OAuth callback error:', error);
          window.location.hash = '#/login?error=oauth_failed';
          return;
        }

        if (data?.session?.user) {
          // Successfully authenticated, redirect to app
          window.location.hash = '#/app';
        } else {
          // No session, redirect to login
          window.location.hash = '#/login';
        }
      } catch (err) {
        console.error('Error handling OAuth callback:', err);
        window.location.hash = '#/login?error=oauth_failed';
      }
    };

    handleOAuthCallback();
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column'
    }}>
      <Spin size="large" />
      <p style={{ marginTop: '16px' }}>Processing Google authentication...</p>
    </div>
  );
};

export default OAuthCallbackHandler;
```

### Routing Configuration

Verify that [main.tsx](file:///c:/Users/welcome/Desktop/StartupValueSimulator/startup-simulator-next/src/main.tsx) includes the OAuth callback route:

```typescript
const ROUTES = {
  '/': 'login',
  '/home': 'home',
  '/features': 'features-no-animation',
  '/learn-more': 'learn-more',
  '/documentation': 'learn-more',
  '/app': 'app',
  '/dashboard': 'app',
  '/simulator': 'app',
  '/login': 'login',
  '/auth/callback': 'oauth-callback', // This line is critical
  '/test': 'test',
  '/simple-features': 'simple-features',
  '/features-no-animation': 'features-no-animation',
} as const
```

### Login Components

Verify that both [LoginPage.tsx](file:///c:/Users/welcome/Desktop/StartupValueSimulator/startup-simulator-next/src/pages/LoginPage.tsx) and [LoginModal.tsx](file:///c:/Users/welcome/Desktop/StartupValueSimulator/startup-simulator-next/src/components/LoginModal.tsx) use the correct redirect URL:

```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: window.location.origin + '/#/auth/callback', // This URL must match
  },
})
```

## 5. Testing the Implementation

### Manual Testing

1. Start your development server:
   ```bash
   npm run dev
   ```
2. Navigate to the home page where the OAuthTest component is located
3. Click the "Test Google Login" button
4. Observe the browser console for any errors
5. Check that you're redirected to Google's OAuth screen

### Debug Information

Check the debug information displayed in the OAuthTest component:

- Current Origin: Should match your development server URL
- Redirect URL: Should match what's configured in Supabase and Google Cloud Console
- Supabase URL: Should match your Supabase project URL
- Google Client ID Present: Should show "Yes"

## 6. Common Issues and Solutions

### "Unsupported provider" Error

- **Cause**: Google provider not enabled in Supabase
- **Solution**: Enable the Google provider in Supabase Authentication → Providers

### Redirect URI Mismatch

- **Cause**: URLs don't match between Supabase, Google Cloud Console, and application code
- **Solution**: Ensure all URLs are identical, including the protocol, domain, port, and path

### Environment Variables Not Loading

- **Cause**: Variables not prefixed with VITE\_ or file not loaded
- **Solution**: Ensure variables are prefixed with VITE\_ and restart the development server

### Port Conflicts

- **Cause**: Development server running on a different port than expected
- **Solution**: Check the console output for the actual port and update redirect URLs accordingly

## 7. Verification Steps

After making all the above configurations:

1. Restart your development server
2. Clear browser cache and cookies for your development domain
3. Try the OAuth flow again
4. Check browser console for any errors
5. Verify network requests in developer tools
6. Confirm successful authentication in Supabase dashboard under Authentication → Users

If you're still experiencing issues after following this checklist, please provide:

1. Screenshots of error messages
2. Browser console output
3. Network request details
4. Your Supabase project configuration
