# OAuth Complete Setup Verification

This document provides a comprehensive checklist to verify that your Google OAuth integration with Supabase is properly configured.

## 1. Environment Variables Verification

Based on your `.env.local` file, the following environment variables are set:

- `VITE_SUPABASE_URL`: https://YOUR_SUPABASE_PROJECT_ID.supabase.co
- `VITE_SUPABASE_ANON_KEY`: [REDACTED]
- `VITE_GOOGLE_OAUTH_CLIENT_ID`: YOUR_GOOGLE_OAUTH_CLIENT_ID

✅ These are properly configured.

## 2. Supabase OAuth Configuration

### Google Provider Settings

In your Supabase dashboard, ensure the following settings are configured:

1. Go to **Authentication > Providers**
2. Enable **Google** provider
3. In the **Redirect URLs** field, add:
   ```
   http://localhost:5173/#/auth/callback
   https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback
   ```

## 3. Google Cloud Console Configuration

### OAuth 2.0 Client IDs Configuration

In Google Cloud Console, ensure your OAuth 2.0 Client ID is configured with the correct redirect URIs:

1. Go to **APIs & Services > Credentials**
2. Select your OAuth 2.0 Client ID
3. In the **Authorized redirect URIs** section, add:
   ```
   http://localhost:5173/#/auth/callback
   https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback
   ```

⚠️ **Important Notes:**

- Make sure there are no trailing slashes at the end of URLs
- Ensure the hash fragment `/#/auth/callback` is preserved for your SPA routing
- Both HTTP and HTTPS versions should be added if you're testing locally

## 4. Application Code Verification

### Redirect URL in Code

Your application correctly uses the following redirect URL pattern:

```javascript
window.location.origin + '/#/auth/callback'
```

This resolves to `http://localhost:5173/#/auth/callback` in development.

### OAuth Implementation

Your OAuth implementation in `LoginModal.tsx` and `OAuthTest.tsx` is correct:

```javascript
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: window.location.origin + '/#/auth/callback',
  },
})
```

## 5. OAuth Callback Handler

Your `OAuthCallbackHandler.tsx` correctly handles the OAuth callback:

```javascript
const { data, error } = await supabase.auth.getSession()
```

This retrieves the OAuth session after Google redirects back to your application.

## 6. Common Issues and Solutions

### Redirect URI Mismatch

If you're still experiencing "redirect_uri_mismatch" errors:

1. Double-check that the exact URLs are added to both:
   - Google Cloud Console > OAuth 2.0 Client ID > Authorized redirect URIs
   - Supabase > Authentication > Providers > Google > Redirect URLs

2. Try using `http://127.0.0.1:5173/#/auth/callback` instead of `localhost` if localhost is causing issues.

### Google OAuth 2.0 Policy Compliance

If you see policy compliance errors:

1. Ensure `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback` is added to Google Cloud Console as an authorized redirect URI.
2. This is required by Google's OAuth 2.0 policy for cross-domain redirects.

### Invalid Redirect URI

If Google Cloud Console rejects your redirect URI:

1. Try removing the hash fragment: `http://localhost:5173/auth/callback`
2. Use `127.0.0.1` instead of `localhost`: `http://127.0.0.1:5173/#/auth/callback`

## 7. Testing OAuth Flow

To test your OAuth configuration:

1. Run the OAuth diagnostics component to check your configuration
2. Use the OAuth test component to initiate the Google login flow
3. Check browser console for any error messages
4. Verify network requests in browser developer tools

## 8. Troubleshooting Steps

If OAuth is still not working:

1. Clear browser cache and cookies
2. Check browser console for JavaScript errors
3. Verify Supabase client initialization in `supabase.ts`
4. Confirm environment variables are loaded correctly
5. Check Supabase authentication logs in the dashboard
6. Ensure your Google OAuth client is properly configured and published

## 9. Verification Checklist

Before testing OAuth:

- [ ] Environment variables are correctly set in `.env.local`
- [ ] Google OAuth client ID is correctly configured in Supabase
- [ ] Redirect URLs are added to Supabase Google provider settings
- [ ] Authorized redirect URIs are added to Google Cloud Console
- [ ] OAuth callback handler is properly implemented
- [ ] Application is running on the expected port (5173)
- [ ] No typos in URLs (check for trailing slashes, correct protocol)

If all these items are checked, your OAuth should work correctly.
