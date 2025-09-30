# Google OAuth Redirect URI Mismatch Fix

This guide will help you resolve the "redirect_uri_mismatch" error you're encountering with Google OAuth in your Startup Value Simulator application.

## Understanding the Error

The error "Access blocked: Startup Value Simulator's request is invalid" with "Error 400: redirect_uri_mismatch" means that the redirect URI your application is sending to Google doesn't match what's configured in the Google Cloud Console.

## Current Configuration Analysis

Based on your code, your application is using:

```
redirectTo: window.location.origin + '/#/auth/callback'
```

This resolves to something like:

```
http://localhost:5173/#/auth/callback
```

## Solution

You need to ensure that all redirect URIs are properly configured in both Google Cloud Console and Supabase.

### Step 1: Update Google Cloud Console

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID
5. Click the edit icon (pencil)
6. In the **Authorized redirect URIs** section, add these URIs:
   - `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback` (Supabase callback)
   - `http://localhost:5173/#/auth/callback` (Local development)
   - `http://localhost:5176/#/auth/callback` (If you're using port 5176)
   - `http://127.0.0.1:5173/#/auth/callback` (Alternative localhost format)

   Note: Add the exact URI that matches your development environment. If you're unsure which port you're using, check your Vite configuration or the URL in your browser's address bar.

7. Click **Save**

### Step 2: Update Supabase Configuration

1. Log into your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project (`YOUR_SUPABASE_PROJECT_ID`)
3. Navigate to **Authentication** → **Providers**
4. Find the **Google** provider
5. In the **Redirect URLs** field, ensure these URLs are added:
   - `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback`
   - `http://localhost:5173/#/auth/callback` (Adjust port as needed)
   - `http://localhost:5176/#/auth/callback` (If you're using port 5176)

6. Click **Save**

### Step 3: Verify Your Development Server Port

Check which port your development server is running on:

1. Look at your terminal where you started the development server
2. Check your `vite.config.ts` file for port configuration
3. Look at your browser's address bar to see the current URL

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

## Additional Troubleshooting

### Check Your Environment

Run the OAuth Diagnostics component on your home page to verify:

- Current origin URL
- Redirect URL being used
- Supabase configuration

### Common Issues

1. **Port Mismatch**: Make sure the port in your Google Cloud Console matches your development server port
2. **Protocol Mismatch**: Ensure you're using `http://` for localhost development in all configurations
3. **Missing Slash**: Make sure the redirect URI ends with `/#/auth/callback` (including the hash and slash)

### Debugging Steps

1. Open browser developer tools (F12)
2. Go to the Network tab
3. Try to log in with Google
4. Look for the failed request to Google and check the redirect_uri parameter
5. Compare this with what you've configured in Google Cloud Console

## Example Configuration

If your app is running on `http://localhost:5173`, your configurations should be:

### Google Cloud Console:

```
Authorized redirect URIs:
- https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback
- http://localhost:5173/#/auth/callback
```

### Supabase Google Provider Redirect URLs:

```
Redirect URLs:
- https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback
- http://localhost:5173/#/auth/callback
```

## Security Considerations

1. Never add wildcard redirect URIs (`http://localhost:*/#/auth/callback`) in production
2. For production, use HTTPS redirect URIs only
3. Regularly audit your redirect URIs and remove any that are no longer needed

## Need More Help?

If you're still experiencing issues:

1. Check the exact URL in your browser's address bar
2. Verify all redirect URIs match exactly (including protocol, port, and path)
3. Take screenshots of your Google Cloud Console and Supabase configurations
4. Check the browser console for any additional error messages
