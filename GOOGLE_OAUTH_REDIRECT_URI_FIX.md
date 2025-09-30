# Google OAuth Redirect URI Configuration Fix

This guide will help you resolve the "Save failed: Redirect URIs" error you're experiencing when configuring Google OAuth for your Startup Value Simulator application.

## Understanding the Error

The error message:

```
Save failed
The request failed because one of the fields is invalid:
Redirect URIs: http://localhost:5173/#/auth/callback
Learn more
```

This indicates that Google Cloud Console is rejecting the redirect URI format you're trying to save.

## Root Cause Analysis

Based on our previous work and the error message, the issue is likely related to one of these factors:

1. **URI Format**: Google may have specific requirements for localhost URIs
2. **Missing Protocol**: The URI might be missing the protocol (http:// or https://)
3. **Special Characters**: The hash (#) in the URI might be causing issues
4. **Port Restrictions**: Google may have restrictions on certain ports

## Solution

### Step 1: Correct Redirect URI Format

Instead of using:

```
http://localhost:5173/#/auth/callback
```

Try using one of these formats that are more likely to be accepted:

1. **Without the hash fragment**:

   ```
   http://localhost:5173/auth/callback
   ```

2. **With a trailing slash**:

   ```
   http://localhost:5173/#/auth/callback/
   ```

3. **Using 127.0.0.1 instead of localhost**:
   ```
   http://127.0.0.1:5173/#/auth/callback
   ```

### Step 2: Update Your Application Code

If you change the redirect URI format, you'll also need to update your application code to match. In your OAuth implementation files ([LoginModal.tsx](file:///c:/Users/welcome/Desktop/StartupValueSimulator/startup-simulator-next/src/components/LoginModal.tsx), [LoginPage.tsx](file:///c:/Users/welcome/Desktop/StartupValueSimulator/startup-simulator-next/src/pages/LoginPage.tsx), [OAuthTest.tsx](file:///c:/Users/welcome/Desktop/StartupValueSimulator/startup-simulator-next/src/components/OAuthTest.tsx)), change:

```typescript
redirectTo: window.location.origin + '/#/auth/callback',
```

To match your new redirect URI format.

### Step 3: Update Google Cloud Console

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID
5. Click the edit icon (pencil)
6. In the **Authorized redirect URIs** section, add your corrected URI:
   ```
   http://localhost:5173/auth/callback
   ```
   or
   ```
   http://127.0.0.1:5173/#/auth/callback
   ```
7. Click **Save**

### Step 4: Update Supabase Configuration

1. Log into your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project (`YOUR_SUPABASE_PROJECT_ID`)
3. Navigate to **Authentication** → **Providers**
4. Find the **Google** provider
5. In the **Redirect URLs** field, add your corrected URI:
   ```
   http://localhost:5173/auth/callback
   ```
   or
   ```
   http://127.0.0.1:5173/#/auth/callback
   ```
6. Click **Save**

## Alternative Solution: Use a Different Approach

If the above solutions don't work, you can try using query parameters instead of hash fragments:

### 1. Update Your Application Code

Change your OAuth implementation to use query parameters:

```typescript
redirectTo: window.location.origin + '/auth/callback',
```

And update your routing to handle `/auth/callback` as a regular path instead of a hash route.

### 2. Update Google Cloud Console and Supabase

Add the query parameter version to both Google Cloud Console and Supabase:

```
http://localhost:5173/auth/callback
```

## Testing Your Configuration

1. Restart your development server:
   ```bash
   npm run dev
   ```
2. Try to log in with Google
3. Check the browser console for any errors
4. Verify that you're redirected correctly after authentication

## Common Issues and Solutions

### Issue 1: URI Still Invalid

**Symptoms**: Same error after trying the above solutions
**Solution**: Try using `http://127.0.0.1` instead of `localhost`

### Issue 2: Redirect After Login Not Working

**Symptoms**: Authentication works but you're not redirected to the right page
**Solution**: Make sure your routing configuration matches your redirect URI

### Issue 3: CORS Errors

**Symptoms**: Browser shows CORS-related errors
**Solution**: Ensure your Supabase project URL is correctly configured

## Security Considerations

1. Never use localhost redirect URIs in production
2. For production, always use HTTPS redirect URIs
3. Regularly audit your redirect URIs and remove any that are no longer needed

## Need More Help?

If you're still experiencing issues:

1. Check the browser console for specific error messages
2. Verify that both Google Cloud Console and Supabase configurations match exactly
3. Try using a different port (5174, 5175, etc.)
4. Contact Google Cloud support if you believe there's an issue with your OAuth configuration
