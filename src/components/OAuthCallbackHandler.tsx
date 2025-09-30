import React, { useEffect, useState } from 'react';
import { Spin, message } from 'antd';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const OAuthCallbackHandler: React.FC = () => {
  const { setUser } = useAuth();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log('Starting OAuth callback handling...');
        
        // Get the OAuth session
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('OAuth callback error:', sessionError);
          setError('Failed to get OAuth session');
          // Redirect to login page with error after a delay
          setTimeout(() => {
            window.location.hash = '#/login?error=oauth_failed';
            setProcessing(false);
          }, 1000);
          return;
        }
        
        console.log('OAuth session data:', data);
        
        if (data?.session?.user) {
          // Extract user information from Google OAuth
          const userId = data.session.user.id;
          const userEmail = data.session.user.email || '';
          const userName = data.session.user.user_metadata?.name || 
                          data.session.user.identities?.[0]?.identity_data?.name || 
                          userEmail.split('@')[0];
          
          // Log the user data we're about to store
          console.log('Storing user data in Supabase:', { userId, userEmail, userName });
          
          // Ensure user exists in database
          try {
            // First, try to get the user from the database
            const { data: existingUser, error: fetchError } = await supabase
              .from('users')
              .select('*')
              .eq('id', userId)
              .single();

            let userData = null;
            
            if (existingUser) {
              // User exists, update last login
              console.log('User exists in database, updating last login');
              const { data: updatedUser, error: updateError } = await supabase
                .from('users')
                .update({ 
                  last_login: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                })
                .eq('id', userId)
                .select()
                .single();
              
              if (updateError) {
                console.error('Error updating user last login:', updateError);
                message.error('Failed to update user login information');
              } else {
                userData = updatedUser;
                console.log('User login information updated successfully:', updatedUser);
              }
            } else {
              // User doesn't exist, create a new user record
              console.log('Creating new user in database');
              const { data: newUser, error: insertError } = await supabase
                .from('users')
                .insert({
                  id: userId,
                  email: userEmail,
                  name: userName,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  last_login: new Date().toISOString()
                })
                .select()
                .single();

              if (insertError) {
                console.error('Error creating user in database:', insertError);
                message.error('Failed to create user account');
              } else {
                userData = newUser;
                console.log('New user created successfully:', newUser);
                message.success('Welcome! Your account has been created.');
              }
            }

            // Create user object for context
            const userObject = {
              id: userId,
              email: userEmail,
              name: userName,
              ...(userData || {})
            };
            
            console.log('Setting user in context:', userObject);
            
            // Set user in context
            setUser(userObject);
            
            // Redirect to home page after a short delay to ensure context is updated
            setTimeout(() => {
              console.log('Redirecting to home page');
              // Redirect to home page after successful authentication
              window.location.hash = '#/home';
              setProcessing(false);
            }, 1500); // Increased delay to ensure context is properly set
          } catch (dbError) {
            console.error('Database error:', dbError);
            setError('Failed to store user data');
            message.error('Failed to store user data. Please try again.');
            // Redirect to home page even if database update fails
            setTimeout(() => {
              window.location.hash = '#/home'; // Redirect to home page
              setProcessing(false);
            }, 1500); // Increased delay
          }
        } else {
          console.log('No session found, redirecting to login');
          message.error('Authentication failed. Please try again.');
          // No session, redirect to login
          setTimeout(() => {
            window.location.hash = '#/login';
            setProcessing(false);
          }, 1500); // Increased delay
        }
      } catch (err) {
        console.error('Error handling OAuth callback:', err);
        setError('An unexpected error occurred');
        message.error('An unexpected error occurred during authentication.');
        // Redirect to login page with error after a delay
        setTimeout(() => {
          window.location.hash = '#/login?error=oauth_failed';
          setProcessing(false);
        }, 1500);
      }
    };
    
    handleOAuthCallback();
  }, [setUser]);
  
  // Fallback useEffect in case the timeout doesn't work
  useEffect(() => {
    // This is a safety mechanism - if we're still processing after 10 seconds, redirect to login
    const timeout = setTimeout(() => {
      if (processing) {
        console.warn('OAuth callback taking too long, redirecting to login');
        message.info('Authentication is taking longer than expected. Please try again.');
        window.location.hash = '#/login?error=timeout';
        setProcessing(false);
      }
    }, 10000);
    
    return () => clearTimeout(timeout);
  }, [processing]);
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <Spin size="large" />
      <p style={{ marginTop: '16px' }}>
        {error ? `Error: ${error}` : 'Processing Google authentication...'}
      </p>
      {processing && (
        <p style={{ marginTop: '8px', fontSize: '14px', color: '#888' }}>
          Please wait while we redirect you to your dashboard...
        </p>
      )}
    </div>
  );
};

export default OAuthCallbackHandler;