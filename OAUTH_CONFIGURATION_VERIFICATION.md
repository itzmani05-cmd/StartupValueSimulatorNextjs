# OAuth Configuration Verification Guide

This guide will help you verify that all components of your Google OAuth implementation are correctly configured for the Startup Value Simulator application.

## Verification Checklist

### 1. Supabase Callback URL Registration

✅ You've confirmed using the correct Supabase callback URL:

```
https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback
```

This URL must be registered in two places:

#### Google Cloud Console

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID
5. Click the edit icon (pencil)
6. In the **Authorized redirect URIs** section, ensure this URL is added:
   ```
   https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback
   ```
7. Click **Save**

#### Supabase Dashboard

1. Log into your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project (`YOUR_SUPABASE_PROJECT_ID`)
3. Navigate to **Authentication** → **Providers**
4. Find the **Google** provider
5. In the **Redirect URLs** field, ensure this URL is included:
   ```
   https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback
   ```
6. Click **Save**

### 2. Application Redirect Configuration

Your application needs to specify where users should be redirected after authentication. In your code, this is handled by:

```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: window.location.origin + '/#/auth/callback',
  },
})
```

This means after Google authenticates the user, they will be redirected back to your application at:

- Local development: `http://localhost:[port]/#/auth/callback`
- Production: `https://[your-domain]/#/auth/callback`

#### Verification Steps:

1. Check that [LoginModal.tsx](file:///c:/Users/welcome/Desktop/StartupValueSimulator/startup-simulator-next/src/components/LoginModal.tsx) uses the correct redirect URL
2. Check that [LoginPage.tsx](file:///c:/Users/welcome/Desktop/StartupValueSimulator/startup-simulator-next/src/pages/LoginPage.tsx) uses the correct redirect URL
3. Check that [OAuthTest.tsx](file:///c:/Users/welcome/Desktop/StartupValueSimulator/startup-simulator-next/src/components/OAuthTest.tsx) uses the correct redirect URL

### 3. Routing Configuration

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

### 4. Environment Variables

Check that your [.env.local](file:///c:/Users/welcome/Desktop/StartupValueSimulator/startup-simulator-next/.env.local) file contains the correct Google OAuth credentials:

```env
VITE_SUPABASE_URL=https://YOUR_SUPABASE_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_GOOGLE_OAUTH_CLIENT_ID=YOUR_GOOGLE_OAUTH_CLIENT_ID
```

### 5. Google Provider Enabled

1. Log into your Supabase dashboard
2. Go to **Authentication** → **Providers**
3. Find the **Google** provider and ensure it's enabled (toggled ON)
4. Verify the credentials:
   - **Client ID**: `YOUR_GOOGLE_OAUTH_CLIENT_ID`
   - **Secret**: `YOUR_GOOGLE_OAUTH_SECRET`

## Testing the Implementation

### Manual Testing

1. Start your development server:
   ```bash
   npm run dev
   ```
2. Navigate to the home page where the OAuthTest component is located
3. Click the "Test Google Login" button
4. Observe the browser console for any errors
5. Check that you're redirected to Google's OAuth screen

### Automated Testing with Diagnostics

1. Use the OAuth Diagnostics component on your home page
2. Click "Run OAuth Diagnostics"
3. Check the results for any errors

## Troubleshooting Common Issues

### Issue 1: Provider Not Enabled

**Symptoms**: 400 Bad Request with "Unsupported provider" message
**Solution**: Enable the Google provider in Supabase Authentication → Providers

### Issue 2: Redirect
