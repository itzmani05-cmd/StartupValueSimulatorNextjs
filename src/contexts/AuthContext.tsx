import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  company?: string;
  role?: string;
  preferences?: any;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; message: string }>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  setUser: (user: User | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage key for user data
const USER_STORAGE_KEY = 'startup_simulator_user';

// Function to save user data to local storage
const saveUserToLocalStorage = (user: User | null) => {
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
};

// Function to get user data from local storage
const getUserFromLocalStorage = (): User | null => {
  try {
    const userString = localStorage.getItem(USER_STORAGE_KEY);
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Error reading user from local storage:', error);
    return null;
  }
};

// Function to ensure user exists in database
const ensureUserInDatabase = async (userId: string, email: string, name?: string): Promise<User | null> => {
  try {
    // First, try to get the user from the database
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (existingUser) {
      // User exists, return the existing user data
      return existingUser;
    }

    // User doesn't exist, create a new user record
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: email,
        name: name || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating user in database:', insertError);
      return null;
    }

    return newUser;
  } catch (error) {
    console.error('Error ensuring user in database:', error);
    return null;
  }
};

// Function to fetch user data from the database
const fetchUserFromDatabase = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user from database:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user from database:', error);
    return null;
  }
};

// Function to check if user exists in database by email
const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error checking user existence:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking user existence:', error);
    return false;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getUserFromLocalStorage());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Ensure user exists in database
          const userData = await ensureUserInDatabase(
            session.user.id, 
            session.user.email || '',
            session.user.user_metadata?.name || session.user.identities?.[0]?.identity_data?.name || ''
          );
          
          const userObject = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.identities?.[0]?.identity_data?.name || '',
            ...(userData || {})
          };
          
          setUser(userObject);
          saveUserToLocalStorage(userObject);
        } else {
          // Check local storage for user data
          const localUser = getUserFromLocalStorage();
          if (localUser) {
            setUser(localUser);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        // Fallback to local storage
        const localUser = getUserFromLocalStorage();
        if (localUser) {
          setUser(localUser);
        }
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Ensure user exists in database
        ensureUserInDatabase(
          session.user.id, 
          session.user.email || '',
          session.user.user_metadata?.name || session.user.identities?.[0]?.identity_data?.name || ''
        )
          .then(userData => {
            const userObject = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.identities?.[0]?.identity_data?.name || '',
              ...(userData || {})
            };
            
            setUser(userObject);
            saveUserToLocalStorage(userObject);
          });
      } else {
        setUser(null);
        saveUserToLocalStorage(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // First, check if user exists in our database
      const userExists = await checkUserExists(email);
      if (!userExists) {
        return { success: false, message: 'No account found with this email. Please sign up first.' };
      }

      // Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Handle specific error cases
        if (error.message.includes('Email not confirmed')) {
          return { success: false, message: 'Please confirm your email address before logging in. Check your inbox for the confirmation email.' };
        }
        return { success: false, message: error.message || 'Login failed. Please check your credentials and try again.' };
      }
      
      if (data.user) {
        // Check if email is confirmed
        if (!data.user.email_confirmed_at) {
          return { success: false, message: 'Please confirm your email address before logging in. Check your inbox for the confirmation email.' };
        }
        
        // Ensure user exists in database
        const userData = await ensureUserInDatabase(
          data.user.id, 
          data.user.email || '',
          data.user.user_metadata?.name || data.user.identities?.[0]?.identity_data?.name || ''
        );

        // Update last login in the database
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.user.id);

        const userObject = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || data.user.identities?.[0]?.identity_data?.name || '',
          ...(userData || {})
        };
        
        setUser(userObject);
        saveUserToLocalStorage(userObject);
        
        // Redirect to user-specific URL
        window.location.hash = `#/user/${data.user.id}`;
        
        return { success: true, message: 'Login successful!' };
      }
      
      return { success: false, message: 'Login failed. Please try again.' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'An unexpected error occurred during login.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      saveUserToLocalStorage(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${window.location.origin}/#/auth/callback`,
        },
      });
      
      if (error) {
        return { success: false, message: error.message || 'Signup failed. Please try again.' };
      }
      
      if (data.user) {
        // Ensure user exists in database
        const userData = await ensureUserInDatabase(
          data.user.id, 
          data.user.email || '',
          name
        );

        const userObject = {
          id: data.user.id,
          email: data.user.email || '',
          name: name,
          ...(userData || {})
        };
        
        setUser(userObject);
        saveUserToLocalStorage(userObject);
        
        // For signup, we don't automatically redirect to the app
        // Instead, we inform the user to check their email for confirmation
        return { 
          success: true, 
          message: 'Registration successful! Please check your email to confirm your account before logging in.' 
        };
      }
      
      return { success: false, message: 'Signup failed. Please try again.' };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { success: false, message: error.message || 'An unexpected error occurred during signup.' };
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedUser = {
        ...user,
        ...data
      };
      
      setUser(updatedUser);
      saveUserToLocalStorage(updatedUser);
    } catch (error: any) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    signUp,
    updateUserProfile,
    setUser: (newUser: User | null) => setUser(newUser),
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};