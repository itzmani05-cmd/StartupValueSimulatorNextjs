# User Profile Management

This document explains how to use the user profile management features in the Startup Value Simulator.

## Overview

The application now includes enhanced user profile management capabilities that allow users to store additional information beyond the basic authentication details. The system leverages Supabase's secure authentication for password handling while storing additional user information in a separate `users` table.

## Security Considerations

**Important**: Passwords are NEVER stored directly in the database. Supabase handles all password hashing and storage securely through its authentication system.

## User Data Structure

The `users` table now includes the following fields:

- `id` (UUID) - Primary key, automatically generated
- `email` (TEXT) - User's email address (unique)
- `name` (TEXT) - User's full name
- `phone` (TEXT) - User's phone number (optional)
- `company` (TEXT) - User's company name (optional)
- `role` (TEXT) - User's role in their company (optional)
- `preferences` (JSONB) - User preferences stored as JSON (optional)
- `last_login` (TIMESTAMP) - Timestamp of the user's last login
- `created_at` (TIMESTAMP) - When the user record was created
- `updated_at` (TIMESTAMP) - When the user record was last updated

## How It Works

1. **Authentication**: Users authenticate through Supabase's secure authentication system
2. **User Record Creation**: When a user signs up, a record is automatically created in the `users` table
3. **Profile Management**: Users can update their profile information through the profile management interface
4. **Data Synchronization**: User data is automatically synchronized between the authentication system and the users table

## Implementation Details

### AuthContext Updates

The `AuthProvider` component has been enhanced to:

1. Automatically create user records in the database during signup
2. Fetch additional user data from the database during login
3. Provide an `updateUserProfile` function for profile updates
4. Handle user session management

### Key Functions

- `login(email, password)`: Authenticates user and fetches profile data
- `signUp(email, password, name)`: Creates new user account and database record
- `updateUserProfile(updates)`: Updates user profile information
- `logout()`: Ends user session

## Usage Examples

### Updating User Profile

```typescript
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { updateUserProfile } = useAuth();

  const handleUpdateProfile = async () => {
    try {
      await updateUserProfile({
        phone: '+1234567890',
        company: 'Acme Corp',
        role: 'CTO'
      });
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };

  return (
    <button onClick={handleUpdateProfile}>
      Update Profile
    </button>
  );
};
```

## Database Migration

To update your existing database schema, run:

```bash
npm run db:update
```

This will apply the necessary changes to add the new fields to the users table.

## Security Best Practices

1. **Never store passwords in plain text** - Always use Supabase's built-in authentication
2. **Use Row Level Security (RLS)** - Ensure users can only access their own data
3. **Validate input data** - Always validate user input on both client and server
4. **Use HTTPS** - Ensure all communications are encrypted
5. **Regular security audits** - Periodically review security settings

## Troubleshooting

### Common Issues

1. **Profile not updating**: Ensure the user is authenticated and has proper permissions
2. **Database connection errors**: Check Supabase credentials in environment variables
3. **Missing fields**: Verify the database schema has been updated with the migration script

### Error Handling

The system includes comprehensive error handling for:

- Authentication failures
- Database connection issues
- Invalid input data
- Network errors

All errors are properly logged and user-friendly messages are displayed.
