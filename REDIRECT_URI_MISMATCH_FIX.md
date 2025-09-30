# Redirect URI Mismatch Error Fix

This guide will help you resolve the "redirect_uri_mismatch" error you're experiencing with Google OAuth in your Startup Value Simulator application.

## Understanding the Error

The error message:

```
Error 400: redirect_uri_mismatch
```

This means that the redirect URI your application is sending to Google doesn't match what's configured in the Google Cloud Console.

## Current Configuration Analysis

Based on your code, your application is using:

```
redirectTo: window.location.origin + '/#/auth/callback'
```

This resolves to something like:

```
http://localhost:5173/#/auth/callback
```

However, Google is receiving a request with a different redirect URI, causing the mismatch.

## Solution

You need to ensure that ALL required redirect URIs are properly configured in both Google Cloud Console and Supabase.

### Step 1: Update Google Cloud Console

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID
5. Click the edit icon (pencil)
6. In the **Authorized redirect URIs** section, add ALL of these URIs:

   ```
   https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback
   http://localhost:5173/#/auth/callback
   http://localhost:5176/#/auth/callback
   http://127.0.0.1:5173/#/auth/callback
   ```

   Note: Add all variations that might be used in your development environment.

7. Click **Save**

### Step 2: Update Supabase Configuration

1. Log into your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project (`YOUR_SUPABASE_PROJECT_ID`)
3. Navigate to **Authentication** → **Providers**
4. Find the **Google** provider
5. In the **Redirect URLs** field, ensure these URLs are added:
   ```
   https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback
   http://localhost:5173/#/auth/callback
   http://localhost:5176/#/auth/callback
   ```
6. Click **Save**

### Step 3: Verify Your Development Server Port

Check which port your development server is running on:

1. Look at your terminal where you started the development server
2. Check your browser's address bar to see the current URL

Common ports for Vite:

- `5173` (default)
- `5176` (as shown in your error URL)

### Step 4: Test the Configuration

1. Restart your development server:
   ```bash
   npm run dev
   ```
2. Make sure you're accessing the app at the correct URL (matching the port you configured)
3. Try the Google login again

## Debugging Steps

### 1. Check the Exact Redirect URI Being Used

1. Open the OAuth Test component on your home page
2. Look at the "Debug Information" section
3. Note the exact "Redirect URL" being used

### 2. Check Browser Console

1. Open browser developer tools (F12)
2. Go to the Network tab
3. Try to log in with Google
4. Look for the failed request to Google and check the redirect_uri parameter
5. Compare this with what you've configured in Google Cloud Console

### 3. Use the OAuth Diagnostics Component

Run the OAuth Diagnostics component on your home page to verify:

- Current origin URL
- Redirect URL being used
- Supabase configuration

## Common Issues and Solutions

### Issue 1: Port Mismatch

**Symptoms**: Working on one port but configured for another
**Solution**: Make sure all ports (5173, 5176, etc.) you might use are configured

### Issue 2: Protocol Mismatch

**Symptoms**: Configured for `http://` but using `https://` or vice versa
**Solution**: Ensure you're using `http://` for localhost development in all configurations

### Issue 3: Missing Hash Router Path

**Symptoms**: Missing `/#/auth/callback` in the URI
**Solution**: Make sure the redirect URI ends with `/#/auth/callback` (including the hash and slash)

## Advanced Troubleshooting

### Check Your OAuth Implementation

Verify that your OAuth implementation in [LoginModal.tsx](file:///c:/Users/welcome/Desktop/StartupValueSimulator/startup-simulator-next/src/components/LoginModal.tsx) and [LoginPage.tsx](file:///c:/Users/welcome/Desktop/StartupValueSimulator/startup-simulator-next/src/pages/LoginPage.tsx) is using the correct redirect URL:

```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: window.location.origin + '/#/auth/callback',
  },
})
```

### Check Your Callback Handler

Verify that [OAuthCallbackHandler.tsx](file:///c:/Users/welcome/Desktop/StartupValueSimulator/startup-simulator-next/src/components/OAuthCallbackHandler.tsx) exists and is properly configured in your routing.

## Security Considerations

1. Never add wildcard redirect URIs (`http://localhost:*/#/auth/callback`) in production
2. For production, use HTTPS redirect URIs only
3. Regularly audit your redirect URIs and remove any that are no longer needed

## Need More Help?

If you're still experiencing issues:

1. Check the exact redirect URI shown in the OAuth Test component
2. Verify all redirect URIs are configured in both Google Cloud Console and Supabase
3. Make sure you clicked "Save" after making changes
4. Try clearing your browser cache and cookies for the development site
