import React, { useEffect, useState } from 'react';
import { Card, Typography, Button, Space, Alert } from 'antd';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

const AuthDebug: React.FC = () => {
  const { user, loading } = useAuth();
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessionInfo = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          setError(error.message);
        } else {
          setSessionInfo(data);
        }
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchSessionInfo();
  }, []);

  const handleManualRedirect = () => {
    window.location.hash = '#/app';
  };

  const handleCheckAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', session);
      setSessionInfo({ session });
      
      if (session?.user) {
        console.log('User is authenticated, redirecting to app');
        window.location.hash = '#/app';
      } else {
        console.log('No active session');
      }
    } catch (err) {
      console.error('Error checking auth:', err);
      setError((err as Error).message);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <Title level={3}>Authentication Debug</Title>
        
        <Space direction="vertical" style={{ width: '100%' }}>
          <Card size="small" title="Auth Context State">
            <Text strong>Loading: </Text>
            <Text>{loading ? 'Yes' : 'No'}</Text>
            <br />
            <Text strong>User: </Text>
            <Text>{user ? `Authenticated (${user.email})` : 'Not authenticated'}</Text>
          </Card>
          
          <Card size="small" title="Supabase Session">
            {error ? (
              <Alert message="Error" description={error} type="error" showIcon />
            ) : sessionInfo ? (
              <pre>{JSON.stringify(sessionInfo, null, 2)}</pre>
            ) : (
              <Text>Loading session info...</Text>
            )}
          </Card>
          
          <div>
            <Button 
              type="primary" 
              onClick={handleManualRedirect}
              style={{ marginRight: '12px' }}
            >
              Manual Redirect to App
            </Button>
            <Button 
              onClick={handleCheckAuth}
            >
              Check Auth Status
            </Button>
          </div>
          
          <Alert
            message="Debug Information"
            description={
              <div>
                <p>If OAuth is working but navigation isn't happening:</p>
                <ol>
                  <li>Try clicking "Manual Redirect to App" to force navigation</li>
                  <li>Check browser console for any errors</li>
                  <li>Verify that the AuthProvider is properly wrapping your components</li>
                  <li>Check that the route '#/app' is correctly mapped in main.tsx</li>
                </ol>
              </div>
            }
            type="info"
            showIcon
          />
        </Space>
      </Card>
    </div>
  );
};

export default AuthDebug;