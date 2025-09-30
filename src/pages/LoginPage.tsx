import React, { useState } from 'react';
import { Card, Typography, Button, Space, Divider, Layout, theme, message, Input, Tabs } from 'antd';
import { GoogleOutlined, UserOutlined, MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;
const { Content } = Layout;
const { useToken } = theme;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { token } = useToken();
  const { login, signUp } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      message.error('Please enter both email and password');
      return;
    }
    
    try {;
      await login(email, password);
      message.success('Login successful!');
    } catch (err: any) {
      console.error('Login error:', err);
      // Show specific error message based on the error type
      if (err.message) {
        message.error(`Login failed: ${err.message}`);
      } else {
        message.error('Login failed. Please check your credentials and try again.');
      }
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !name) {
      message.error('Please fill in all fields');
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      message.error('Please enter a valid email address');
      return;
    }
    
    if (password.length < 6) {
      message.error('Password must be at least 6 characters long');
      return;
    }
    
    try {
      await signUp(email, password, name);
      message.success('Registration successful! Please check your email to confirm your account.');
      // Reset form
      setEmail('');
      setPassword('');
      setName('');
    } catch (err: any) {
      console.error('Registration error:', err);
      // Show specific error message based on the error type
      if (err.message) {
        message.error(`Registration failed: ${err.message}`);
      } else {
        message.error('Registration failed. Please try again.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/#/auth/callback`,
        },
      });
      
      if (error) {
        console.error('Google login error:', error);
        // Provide specific error message for unsupported provider
        if (error.message.includes('Unsupported provider')) {
          message.error('Google authentication is not enabled in the system. Please contact the administrator to enable Google login.');
        } else {
          message.error('Google login failed. Please try again.');
        }
      }
    } catch (err: any) {
      console.error('Google login error:', err);
      message.error('An unexpected error occurred with Google login. Please try again.');
    }
  };

  const handleEmployeeLogin = () => {
    window.location.hash = '#/employee';
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f0f9ff, #e0f2fe)' }}>
      <Header showAuthControls={false} />
      
      <Content style={{ padding: '48px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
          <div style={{ display: 'flex', width: '100%', maxWidth: '1200px', gap: '48px', alignItems: 'center' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  background: 'linear-gradient(to bottom right, #1890ff, #096dd9)',
                  borderRadius: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto',
                  boxShadow: '0 8px 24px rgba(24, 144, 255, 0.3)'
                }}>
                  <span style={{ color: 'white', fontSize: '32px' }}>🚀</span>
                </div>
              </div>
              
              <Title 
                level={1} 
                style={{ 
                  fontSize: '48px', 
                  fontWeight: 800, 
                  color: token.colorText,
                  marginBottom: '16px'
                }}
              >
                Startup Value Simulator
              </Title>
              
              <Text 
                style={{ 
                  fontSize: '20px', 
                  color: token.colorTextSecondary, 
                  marginBottom: '32px',
                  maxWidth: '600px',
                  display: 'block',
                  margin: '0 auto 32px'
                }}
              >
                Model ESOP, funding rounds, dilution, and exits with precision. 
                Understand how equity is distributed and valued at different stages.
              </Text>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '16px', 
                maxWidth: '600px',
                margin: '0 auto 32px'
              }}>
                <Card 
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.8)', 
                    borderRadius: '16px',
                    border: `1px solid ${token.colorBorder}`,
                    textAlign: 'center'
                  }}
                  bodyStyle={{ padding: '24px' }}
                >
                  <div style={{ color: token.colorPrimary, fontSize: '24px', marginBottom: '12px' }}>📈</div>
                  <Title level={5} style={{ marginBottom: '8px' }}>Scenario Planning</Title>
                  <Text type="secondary">Compare multiple growth paths</Text>
                </Card>
                <Card 
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.8)', 
                    borderRadius: '16px',
                    border: `1px solid ${token.colorBorder}`,
                    textAlign: 'center'
                  }}
                  bodyStyle={{ padding: '24px' }}
                >
                  <div style={{ color: '#722ed1', fontSize: '24px', marginBottom: '12px' }}>🧮</div>
                  <Title level={5} style={{ marginBottom: '8px' }}>Cap Table Math</Title>
                  <Text type="secondary">See dilution impacts</Text>
                </Card>
                <Card 
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.8)', 
                    borderRadius: '16px',
                    border: `1px solid ${token.colorBorder}`,
                    textAlign: 'center'
                  }}
                  bodyStyle={{ padding: '24px' }}
                >
                  <div style={{ color: '#eb2f96', fontSize: '24px', marginBottom: '12px' }}>🎲</div>
                  <Title level={5} style={{ marginBottom: '8px' }}>Monte Carlo</Title>
                  <Text type="secondary">Quantify risk</Text>
                </Card>
              </div>
            </div>
            
            <div style={{ flex: 1, width: '100%', maxWidth: '500px' }}>
              <Card 
                style={{
                  borderRadius: '20px',
                  border: 'none',
                  boxShadow: '0 16px 48px rgba(0, 0, 0, 0.1)',
                  padding: '32px'
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <Title level={3} style={{ marginBottom: '8px' }}>
                    {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
                  </Title>
                  <Text type="secondary">
                    {activeTab === 'login' ? 'Sign in to continue to your dashboard' : 'Sign up to get started'}
                  </Text>
                </div>
                
                <Tabs 
                  activeKey={activeTab} 
                  onChange={setActiveTab}
                  items={[
                    {
                      key: 'login',
                      label: 'Login',
                      children: (
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                          <Input
                            size="large"
                            placeholder="Email"
                            prefix={<MailOutlined />}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onPressEnter={handleLogin}
                            style={{
                              height: '56px',
                              borderRadius: '12px',
                              fontSize: '16px'
                            }}
                          />
                          
                          <Input
                            size="large"
                            placeholder="Password"
                            prefix={<LockOutlined />}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onPressEnter={handleLogin}
                            style={{
                              height: '56px',
                              borderRadius: '12px',
                              fontSize: '16px'
                            }}
                            suffix={
                              <span 
                                onClick={() => setPasswordVisible(!passwordVisible)}
                                style={{ cursor: 'pointer' }}
                              >
                                {passwordVisible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                              </span>
                            }
                            type={passwordVisible ? 'text' : 'password'}
                          />
                          
                          <Button 
                            type="primary" 
                            size="large" 
                            onClick={handleLogin}
                            style={{
                              height: '56px',
                              borderRadius: '12px',
                              fontWeight: 600,
                              fontSize: '16px'
                            }}
                            block
                          >
                            Login
                          </Button>
                          
                          <Divider>or</Divider>
                          
                          <div style={{ textAlign: 'center' }}>
                            <Text strong>Are you an employee? </Text>
                            <br />
                            <Button 
                              type="link" 
                              onClick={handleEmployeeLogin}
                              style={{ padding: 0, marginTop: '8px' }}
                            >
                              View your ESOP dashboard
                            </Button>
                          </div>
                        </Space>
                      )
                    },
                    {
                      key: 'register',
                      label: 'Register',
                      children: (
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                          <Input
                            size="large"
                            placeholder="Full Name"
                            prefix={<UserOutlined />}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onPressEnter={handleRegister}
                            style={{
                              height: '56px',
                              borderRadius: '12px',
                              fontSize: '16px'
                            }}
                          />
                          
                          <Input
                            size="large"
                            placeholder="Email"
                            prefix={<MailOutlined />}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onPressEnter={handleRegister}
                            style={{
                              height: '56px',
                              borderRadius: '12px',
                              fontSize: '16px'
                            }}
                          />
                          
                          <Input
                            size="large"
                            placeholder="Password"
                            prefix={<LockOutlined />}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onPressEnter={handleRegister}
                            style={{
                              height: '56px',
                              borderRadius: '12px',
                              fontSize: '16px'
                            }}
                            suffix={
                              <span 
                                onClick={() => setPasswordVisible(!passwordVisible)}
                                style={{ cursor: 'pointer' }}
                              >
                                {passwordVisible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                              </span>
                            }
                            type={passwordVisible ? 'text' : 'password'}
                          />
                          
                          <Button 
                            type="primary" 
                            size="large" 
                            onClick={handleRegister}
                            style={{
                              height: '56px',
                              borderRadius: '12px',
                              fontWeight: 600,
                              fontSize: '16px'
                            }}
                            block
                          >
                            Register
                          </Button>
                          
                          <Divider>or</Divider>
                          
                          <div style={{ textAlign: 'center' }}>
                            <Text strong>Are you an employee? </Text>
                            <br />
                            <Button 
                              type="link" 
                              onClick={handleEmployeeLogin}
                              style={{ padding: 0, marginTop: '8px' }}
                            >
                              View your ESOP dashboard
                            </Button>
                          </div>
                        </Space>
                      )
                    }
                  ]}
                  tabBarStyle={{ 
                    fontSize: '16px',
                    fontWeight: 600
                  }}
                />
                
                <Divider style={{ margin: '24px 0' }}>or</Divider>
                
                <Button 
                  size="large" 
                  icon={<GoogleOutlined />}
                  onClick={handleGoogleLogin}
                  style={{
                    height: '56px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '16px',
                    borderColor: token.colorBorder,
                    color: token.colorText
                  }}
                  block
                >
                  Continue with Google
                </Button>
              </Card>
              
              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <Text type="secondary" style={{ fontSize: '14px' }}>
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </Text>
              </div>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default LoginPage;