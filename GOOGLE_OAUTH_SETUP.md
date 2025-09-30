# Google OAuth Setup Guide

This guide explains how to set up Google OAuth for the Startup Value Simulator application.

## Prerequisites

1. You've already created a Google OAuth client ID: `YOUR_GOOGLE_OAUTH_CLIENT_ID`
2. You have a Supabase project set up
3. You have access to your Supabase project dashboard

## Setup Instructions

### 1. Configure Environment Variables

The Google OAuth client ID has already been added to your `.env.local` file:

```
VITE_GOOGLE_OAUTH_CLIENT_ID=YOUR_GOOGLE_OAUTH_CLIENT_ID
```

### 2. Configure Supabase Authentication

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Find the **Google** provider and click on it
4. Toggle the switch to enable the Google provider
5. Enter the following information:
   - **Client ID**: `YOUR_GOOGLE_OAUTH_CLIENT_ID`
   - **Secret**: `YOUR_GOOGLE_OAUTH_SECRET`
6. Set the **Redirect URLs** to:
   - `https://your-supabase-project-url.auth.supabase.co/callback`
   - `http://localhost:5173` (for local development)
   - `http://localhost:5173/#/app` (for local development with hash routing)

### 3. Configure Google Cloud Console

If you need to make changes in the Google Cloud Console:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to **APIs & Services** → **Credentials**
4. Find your OAuth client ID credentials
5. Update the **Authorized redirect URIs** if needed:
   - `https://your-supabase-project-url.auth.supabase.co/callback`
   - `http://localhost:5173` (for local development)

### 4. Save Supabase Configuration

1. Go back to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Find the **Google** provider and click on it
4. Ensure the **Client Secret** is entered: `YOUR_GOOGLE_OAUTH_SECRET`
5. Save the configuration

## Testing Google OAuth

1. Start your application locally:
   ```bash
   npm run dev
   ```
2. Navigate to the login page
3. Click on "Continue with Google"
4. You should be redirected to Google's OAuth screen
5. After successful authentication, you should be redirected back to your application

## Troubleshooting

### Common Issues

1. **"Unsupported provider" error**:
   - Make sure the Google provider is enabled in Supabase
   - Verify that the client ID and secret are correct
   - This error occurs when the provider is not enabled in the Supabase dashboard

2. **Redirect URI mismatch**:
   - Ensure all redirect URIs are properly configured in Google Cloud Console
   - Make sure they match exactly what's configured in Supabase

3. **CORS errors**:
   - Check that your Supabase project URL is correctly configured
   - Ensure you're using HTTPS in production

### Debugging Steps

1. Check the browser console for any error messages
2. Verify environment variables are loaded correctly
3. Check Supabase authentication logs in the dashboard
4. Ensure the user exists in the `users` table after successful login

## Security Considerations

1. Never commit sensitive information like client secrets to version control
2. Use environment variables for all sensitive configuration
3. Regularly rotate your OAuth credentials
4. Monitor authentication logs for suspicious activity

## Additional Resources

- [Supabase Authentication Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
