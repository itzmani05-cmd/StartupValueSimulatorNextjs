import React, { useState } from 'react';
import { Card, Typography, Space, Alert, Button, Spin } from 'antd';
import { supabase } from '../lib/supabase';

const { Title, Text } = Typography;

const OAuthDiagnostics: React.FC = () => {
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    setDiagnosticResult(null);
    
    try {
      // Test Supabase connection
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      // Test if Google provider is enabled by attempting to get the URL
      let providerUrl = null;
      let providerError = null;
      
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin + '/#/auth/callback',
            skipBrowserRedirect: true // This prevents actual redirect
          },
        });
        
        providerUrl = data?.url;
        providerError = error;
      } catch (err) {
        providerError = err;
      }
      
      setDiagnosticResult({
        supabaseConnection: {
          success: !sessionError,
          error: sessionError?.message || null,
          session: sessionData?.session || null
        },
        googleProvider: {
          enabled: !providerError || !providerError.message?.includes('Unsupported provider'),
          error: providerError?.message || null,
          providerUrl: providerUrl || null
        },
        environment: {
          supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
          clientIdPresent: !!import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
          clientId: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID
        }
      });
    } catch (error) {
      console.error('Diagnostics error:', error);
      setDiagnosticResult({
        error: 'Failed to run diagnostics: ' + (error as Error).message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <Title level={3}>OAuth Diagnostics</Title>
        <Text>Use this tool to diagnose OAuth configuration issues</Text>
        
        <div style={{ marginTop: '24px' }}>
          <Alert
            message="OAuth Diagnostics"
            description="Click the button below to run diagnostics on your OAuth configuration"
            type="info"
            showIcon
          />
        </div>
        
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Button
            type="primary"
            size="large"
            onClick={runDiagnostics}
            loading={loading}
          >
            Run OAuth Diagnostics
          </Button>
        </div>
        
        {loading && (
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Spin size="large" />
            <p>Running diagnostics...</p>
          </div>
        )}
        
        {diagnosticResult && (
          <div style={{ marginTop: '24px' }}>
            <Title level={4}>Diagnostics Results</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              {diagnosticResult.error ? (
                <Alert
                  message="Diagnostics Error"
                  description={diagnosticResult.error}
                  type="error"
                  showIcon
                />
              ) : (
                <>
                  <Card size="small" title="Supabase Connection">
                    <Text strong>Status: </Text>
                    <Text type={diagnosticResult.supabaseConnection.success ? 'success' : 'danger'}>
                      {diagnosticResult.supabaseConnection.success ? 'Connected' : 'Failed'}
                    </Text>
                    {diagnosticResult.supabaseConnection.error && (
                      <div>
                        <Text strong>Error: </Text>
                        <Text>{diagnosticResult.supabaseConnection.error}</Text>
                      </div>
                    )}
                  </Card>
                  
                  <Card size="small" title="Google Provider">
                    <Text strong>Enabled: </Text>
                    <Text type={diagnosticResult.googleProvider.enabled ? 'success' : 'danger'}>
                      {diagnosticResult.googleProvider.enabled ? 'Yes' : 'No'}
                    </Text>
                    {diagnosticResult.googleProvider.error && (
                      <div>
                        <Text strong>Error: </Text>
                        <Text>{diagnosticResult.googleProvider.error}</Text>
                      </div>
                    )}
                    {diagnosticResult.googleProvider.providerUrl && (
                      <div>
                        <Text strong>Provider URL: </Text>
                        <Text copyable>{diagnosticResult.googleProvider.url}</Text>
                      </div>
                    )}
                  </Card>
                  
                  <Card size="small" title="Environment Variables">
                    <Text strong>Supabase URL: </Text>
                    <Text>{diagnosticResult.environment.supabaseUrl}</Text>
                    <br />
                    <Text strong>Client ID Present: </Text>
                    <Text type={diagnosticResult.environment.clientIdPresent ? 'success' : 'danger'}>
                      {diagnosticResult.environment.clientIdPresent ? 'Yes' : 'No'}
                    </Text>
                    {diagnosticResult.environment.clientId && (
                      <div>
                        <Text strong>Client ID: </Text>
                        <Text copyable>{diagnosticResult.environment.clientId}</Text>
                      </div>
                    )}
                  </Card>
                </>
              )}
              
              {/* Debug Information Section */}
              <Card size="small" title="Debug Information">
                <Text><strong>Current Origin:</strong> {window.location.origin}</Text><br />
                <Text><strong>Redirect URL:</strong> {window.location.origin}/#/auth/callback</Text><br />
                <Text><strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL}</Text><br />
                <Text><strong>Google Client ID Present:</strong> {import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID ? 'Yes' : 'No'}</Text>
                
                <div style={{ marginTop: 12 }}>
                  <Alert 
                    message="Complete OAuth Setup Verification" 
                    description={
                      <div>
                        <p>For a complete verification of your OAuth setup, please refer to the detailed checklist in:</p>
                        <Text code>OAUTH_COMPLETE_SETUP_VERIFICATION.md</Text>
                        <p style={{ marginTop: 8 }}>This document contains all the steps to ensure your Google OAuth integration is properly configured.</p>
                      </div>
                    } 
                    type="info" 
                    showIcon 
                  />
                </div>
                
                <div style={{ marginTop: 12 }}>
                  <Alert 
                    message="Complete OAuth Setup Verification" 
                    description={
                      <div>
                        <p>For a complete verification of your OAuth setup, please refer to the detailed checklist in:</p>
                        <Text code>OAUTH_COMPLETE_SETUP_VERIFICATION.md</Text>
                        <p style={{ marginTop: 8 }}>This document contains all the steps to ensure your Google OAuth integration is properly configured.</p>
                      </div>
                    } 
                    type="info" 
                    showIcon 
                  />
                </div>
                <div style={{ marginTop: 12 }}>
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
                </div>
                
                {(diagnosticResult.googleProvider.error && diagnosticResult.googleProvider.error.includes("comply with Google's OAuth 2.0 policy")) && (
                  <div style={{ marginTop: 12 }}>
                    <Alert 
                      message="Google OAuth 2.0 Policy Compliance Issue" 
                      description={
                        <div>
                          <p>The redirect URI <Text code>https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback</Text> needs to be registered in Google Cloud Console.</p>
                          <p>Please follow the instructions in <Text code>GOOGLE_OAUTH_POLICY_COMPLIANCE_FIX.md</Text> to resolve this issue.</p>
                        </div>
                      } 
                      type="error" 
                      showIcon 
                    />
                  </div>
                )}
                
                {(diagnosticResult.googleProvider.error && diagnosticResult.googleProvider.error.includes("redirect_uri_mismatch")) && (
                  <div style={{ marginTop: 12 }}>
                    <Alert 
                      message="Redirect URI Mismatch Error" 
                      description={
                        <div>
                          <p>The redirect URI your application is sending to Google doesn't match what's configured in Google Cloud Console.</p>
                          <p>Make sure <Text code>{window.location.origin}/#/auth/callback</Text> is registered in both Google Cloud Console and Supabase.</p>
                          <p>Please follow the instructions in <Text code>REDIRECT_URI_MISMATCH_FIX.md</Text> to resolve this issue.</p>
                        </div>
                      } 
                      type="error" 
                      showIcon 
                    />
                  </div>
                )}
                
                {(diagnosticResult.googleProvider.error && diagnosticResult.googleProvider.error.includes("invalid")) && (
                  <div style={{ marginTop: 12 }}>
                    <Alert 
                      message="Invalid Redirect URI Configuration" 
                      description={
                        <div>
                          <p>Google Cloud Console is rejecting the redirect URI format.</p>
                          <p>Try using <Text code>http://127.0.0.1:5173/#/auth/callback</Text> instead of <Text code>http://localhost:5173/#/auth/callback</Text>.</p>
                          <p>Please follow the instructions in <Text code>GOOGLE_OAUTH_REDIRECT_URI_FIX.md</Text> to resolve this issue.</p>
                        </div>
                      } 
                      type="error" 
                      showIcon 
                    />
                  </div>
                )}
                
                {/* Additional diagnostic information */}
                <div style={{ marginTop: 12 }}>
                  <Alert 
                    message="OAuth Configuration Status" 
                    description={
                      <div>
                        <p><Text strong>Supabase Connection:</Text> {diagnosticResult.supabaseConnection.success ? '✅ Connected' : '❌ Failed'}</p>
                        <p><Text strong>Google Provider:</Text> {diagnosticResult.googleProvider.enabled ? '✅ Enabled' : '❌ Disabled'}</p>
                        <p><Text strong>Environment Variables:</Text> {diagnosticResult.environment.clientIdPresent ? '✅ Configured' : '❌ Missing'}</p>
                        <p style={{ marginTop: 8 }}><Text type="warning">Note:</Text> If any of the above show ❌, please check the corresponding configuration files and environment variables.</p>
                      </div>
                    } 
                    type="info" 
                    showIcon 
                  />
                </div>
              </Card>
            </Space>
          </div>
        )}
      </Card>
    </div>
  );
};

export default OAuthDiagnostics;