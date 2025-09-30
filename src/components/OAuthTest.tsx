import React from 'react';
import { Button, Card, Typography, Space, Alert } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { supabase } from '../lib/supabase';

const { Title, Text } = Typography;

const OAuthTest: React.FC = () => {
  const handleGoogleLogin = async () => {
    try {
      console.log('Initiating Google OAuth flow...');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/#/auth/callback',
        },
      });
      
      if (error) {
        console.error('Google login error:', error);
        alert(`Google login error: ${error.message}`);
      } else {
        console.log('Google OAuth flow initiated successfully');
      }
    } catch (err) {
      console.error('Unexpected error during Google login:', err);
      alert(`Unexpected error: ${err}`);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <Card>
        <Title level={3}>OAuth Test Component</Title>
        <Text>Use this component to test Google OAuth functionality</Text>
        
        <div style={{ marginTop: '24px' }}>
          <Alert
            message="OAuth Test"
            description="Click the button below to test Google OAuth flow"
            type="info"
            showIcon
          />
        </div>
        
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Button
            type="primary"
            size="large"
            icon={<GoogleOutlined />}
            onClick={handleGoogleLogin}
          >
            Test Google Login
          </Button>
        </div>
        
        <div style={{ marginTop: '24px' }}>
          <Title level={4}>Debug Information</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text><strong>Current Origin:</strong> {window.location.origin}</Text>
            <Text><strong>Redirect URL:</strong> {window.location.origin}/#/auth/callback</Text>
            <Text><strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL}</Text>
            <Text><strong>Google Client ID Present:</strong> {import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID ? 'Yes' : 'No'}</Text>
            <Alert 
              message="Redirect URI Configuration" 
              description={
                <div>
                  <p>Make sure these exact URIs are configured in both Google Cloud Console and Supabase:</p>
                  <Text copyable>{window.location.origin}/#/auth/callback</Text>
                  <Text copyable>https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback</Text>
                  <p style={{ marginTop: 8 }}><Text type="warning">Note:</Text> Common development ports are 5173 (default) and 5176</p>
                </div>
              } 
              type="info" 
              showIcon 
            />
            <Alert 
              message="Google OAuth 2.0 Policy Compliance" 
              description={
                <div>
                  <p>If you see an error about policy compliance, make sure the Supabase callback URI is registered in Google Cloud Console:</p>
                  <Text code>https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback</Text>
                  <p style={{ marginTop: 8 }}>See <Text code>GOOGLE_OAUTH_POLICY_COMPLIANCE_FIX.md</Text> for detailed instructions.</p>
                </div>
              } 
              type="warning" 
              showIcon 
            />
            <Alert 
              message="Redirect URI Mismatch Help" 
              description={
                <div>
                  <p>If you see a "redirect_uri_mismatch" error:</p>
                  <ol>
                    <li>Make sure <Text code>{window.location.origin}/#/auth/callback</Text> is registered in Google Cloud Console</li>
                    <li>Verify the URI is also in Supabase Redirect URLs</li>
                    <li>Check for port mismatches (5173 vs 5176)</li>
                    <li>See <Text code>REDIRECT_URI_MISMATCH_FIX.md</Text> for detailed instructions</li>
                  </ol>
                </div>
              } 
              type="info" 
              showIcon 
            />
            <Alert 
              message="Invalid Redirect URI Help" 
              description={
                <div>
                  <p>If you see an "invalid redirect URI" error when saving in Google Cloud Console:</p>
                  <ol>
                    <li>Try using <Text code>http://127.0.0.1:5173/#/auth/callback</Text> instead of localhost</li>
                    <li>Consider removing the hash fragment: <Text code>http://localhost:5173/auth/callback</Text></li>
                    <li>See <Text code>GOOGLE_OAUTH_REDIRECT_URI_FIX.md</Text> for detailed instructions</li>
                  </ol>
                </div>
              } 
              type="warning" 
              showIcon 
            />
            
            <Alert 
              message="Complete OAuth Setup Verification" 
              description={
                <div>
                  <p>For a comprehensive checklist of all OAuth configuration steps, please refer to:</p>
                  <Text code>OAUTH_COMPLETE_SETUP_VERIFICATION.md</Text>
                  <p style={{ marginTop: 8 }}>This document contains all the steps to ensure your Google OAuth integration is properly configured.</p>
                </div>
              } 
              type="info" 
              showIcon 
            />
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default OAuthTest;