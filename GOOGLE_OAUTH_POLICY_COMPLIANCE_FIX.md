# Google OAuth 2.0 Policy Compliance Fix

This guide will help you resolve the policy compliance issue with Google's OAuth 2.0 that's preventing users from signing in to your app.

## Understanding the Error

The error message:

```
You can't sign in to this app because it doesn't comply with Google's OAuth 2.0 policy.
Request details: redirect_uri=https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback
```

This means that the redirect URI `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback` is not properly registered in your Google OAuth 2.0 client configuration in the Google Cloud Console.

## Solution

You need to register the Supabase callback URI in your Google Cloud Console OAuth 2.0 client settings.

### Step 1: Access Google Cloud Console

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (the one associated with your OAuth 2.0 credentials)
3. Navigate to **APIs & Services** → **Credentials**

### Step 2: Edit Your OAuth 2.0 Client ID

1. Find your OAuth 2.0 Client ID in the credentials list
2. Click the edit icon (pencil) next to your client ID
3. In the **Authorized redirect URIs** section, add the following URI:
   ```
   https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback
   ```

### Step 3: Save Your Changes

1. Click **Save** at the bottom of the form
2. You may see a warning about the redirect URI being non-standard - this is expected for Supabase integration
3. Confirm if prompted

### Step 4: Verify Supabase Configuration

1. Log into your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project (`YOUR_SUPABASE_PROJECT_ID`)
3. Navigate to **Authentication** → **Providers**
4. Find the **Google** provider
5. Ensure the **Redirect URLs** field includes:
   ```
   https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback
   ```

### Step 5: Test the Configuration

1. Restart your development server:
   ```bash
   npm run dev
   ```
2. Try to log in with Google again

## Additional Considerations

### Application Verification Status

If your OAuth 2.0 client is not verified, Google may restrict which redirect URIs you can use. For development purposes, the Supabase callback URI should work even with an unverified app.

### Production Considerations

For production applications:

1. Ensure your OAuth 2.0 client is verified by Google
2. Add all necessary redirect URIs for your production domain
3. Follow Google's OAuth 2.0 branding requirements

### Common Issues

1. **URI Not Saving**: Make sure you're clicking the **Save** button after adding the URI
2. **Typo in URI**: Ensure the URI is exactly `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback`
3. **Wrong Client ID**: Make sure you're editing the correct OAuth 2.0 client ID

## Troubleshooting Steps

### Check Browser Console

1. Open browser developer tools (F12)
2. Go to the Network tab
3. Try to log in with Google
4. Look for any failed requests and check their details

### Verify Environment Variables

Ensure your [.env.local](file:///c:/Users/welcome/Desktop/StartupValueSimulator/startup-simulator-next/.env.local) file contains the correct Google OAuth client ID:

```env
VITE_GOOGLE_OAUTH_CLIENT_ID=YOUR_GOOGLE_OAUTH_CLIENT_ID
```

### Test with OAuth Diagnostics

Use the OAuth diagnostics component on your home page to verify:

- Current Supabase configuration
- Google provider status
- Environment variables

## Security Best Practices

1. Never commit sensitive information like client secrets to version control
2. Use environment variables for all sensitive configuration
3. Regularly audit your redirect URIs and remove any that are no longer needed
4. Monitor authentication logs for suspicious activity

## Need More Help?

If you're still experiencing issues:

1. Check that you've added the exact URI `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback` to your Google Cloud Console
2. Verify that your Google OAuth 2.0 client is properly configured
3. Ensure the Google provider is enabled in your Supabase dashboard
4. Contact Google Cloud support if you believe there's an issue with your OAuth configuration
