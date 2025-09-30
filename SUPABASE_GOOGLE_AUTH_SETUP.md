# Supabase Google OAuth Configuration

This guide explains how to configure Google OAuth authentication in your Supabase project for the Startup Value Simulator application.

## Error Explanation

The error you're seeing:

```
{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
```

This means that while you've added the Google OAuth client ID to your application, the Google provider has not been enabled in your Supabase authentication settings.

## Step-by-Step Configuration

### 1. Access Supabase Dashboard

1. Go to [supabase.com](https://supabase.com) and log in to your account
2. Select your project (or create one if you haven't already)
3. In the left sidebar, click on **Authentication**

### 2. Enable Google Provider

1. In the Authentication section, click on **Providers**
2. Find **Google** in the list of providers
3. Toggle the switch to enable the Google provider

### 3. Configure Google OAuth Credentials

You'll need to provide two pieces of information:

1. **Client ID**: `YOUR_GOOGLE_OAUTH_CLIENT_ID`
2. **Client Secret**: `YOUR_GOOGLE_OAUTH_SECRET`

### 4. Complete Supabase Configuration

1. Go back to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Click on the **Google** provider
4. Enter the **Client ID** and **Client Secret** provided above
5. Make sure the provider is toggled **on**
6. Click **Save**

### 5. Configure Redirect URLs

In the same Google provider settings in Supabase, make sure to add these redirect URLs:

- `http://localhost:5173/#/app` (for local development)
- `https://your-production-domain.com/#/app` (for production, if applicable)

## Testing the Configuration

After completing the above steps:

1. Restart your development server:
   ```bash
   npm run dev
   ```
2. Navigate to the login page
3. Click on "Continue with Google"
4. You should now be redirected to Google's OAuth screen

## Troubleshooting

### Common Issues

1. **"Unsupported provider" error persists**:
   - Double-check that the Google provider is enabled in Supabase
   - Verify that both Client ID and Client Secret are correctly entered
   - Make sure you clicked "Save" after entering the credentials

2. **Redirect URI mismatch**:
   - Ensure all redirect URIs are properly configured in both Google Cloud Console and Supabase
   - The URIs must match exactly, including the protocol (http/https) and path

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
