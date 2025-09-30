import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Alert, Tabs, Divider, Space, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, GoogleOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const { Text } = Typography;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
  defaultActiveTab?: 'login' | 'signup'; // Added defaultActiveTab prop
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess, defaultActiveTab = 'login' }) => {
  const { login, signUp, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(defaultActiveTab);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loginForm] = Form.useForm();
  const [signupForm] = Form.useForm();

  // Update active tab when defaultActiveTab changes
  useEffect(() => {
    setActiveTab(defaultActiveTab);
    // Clear messages when tab changes
    setError(null);
    setSuccessMessage(null);
  }, [defaultActiveTab]);

  // Clear messages when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessMessage(null);
    }
  }, [isOpen]);

  const handleLogin = async (values: { email: string; password: string }) => {
    setError(null);
    setSuccessMessage(null);
    
    try {
      await login(values.email, values.password);
      message.success('Login successful!');
      onLoginSuccess({ email: values.email });
      onClose();
      loginForm.resetFields();
    } catch (err: any) {
      console.error('Login error:', err);
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (err.message) {
        if (err.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (err.message.includes('Email not confirmed')) {
          errorMessage = 'Please confirm your email address before logging in.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    }
  };

  const handleSignup = async (values: { email: string; password: string; name: string }) => {
    setError(null);
    setSuccessMessage(null);
    
    try {
      await signUp(values.email, values.password, values.name);
      message.success('Account created successfully! Please check your email to confirm your account.');
      setSuccessMessage('Account created successfully! Please check your email to confirm your account.');
      onLoginSuccess({ email: values.email, name: values.name });
      // Keep the modal open to show success message
      setTimeout(() => {
        onClose();
        signupForm.resetFields();
      }, 3000);
    } catch (err: any) {
      console.error('Signup error:', err);
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (err.message) {
        if (err.message.includes('already been registered')) {
          errorMessage = 'This email is already registered. Please login instead.';
        } else if (err.message.includes('Password should be at least')) {
          errorMessage = 'Password should be at least 6 characters.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Get the Google OAuth client ID from environment variables
      const googleClientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;
      
      if (!googleClientId) {
        setError('Google login is not properly configured. Please contact the administrator.');
        return;
      }
      
      // Google login is handled through Supabase Auth
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/#/auth/callback',
        },
      });
      
      if (error) {
        console.error('Google login error:', error);
        // Provide specific error message for unsupported provider
        if (error.message.includes('Unsupported provider')) {
          setError('Google authentication is not enabled in the system. Please contact the administrator to enable Google login.');
        } else {
          setError(error.message || 'Failed to initiate Google login. Please try email login instead.');
        }
      }
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(err.message || 'An unexpected error occurred with Google login. Please try email login instead.');
    }
  };

  return (
    <Modal
      title="🔐 Startup Value Simulator"
      open={isOpen}
      onCancel={() => {
        onClose();
        // Clear forms and messages when closing
        loginForm.resetFields();
        signupForm.resetFields();
        setError(null);
        setSuccessMessage(null);
      }}
      footer={null}
      width={450}
    >
      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key as 'login' | 'signup');
          // Clear messages when tab changes
          setError(null);
          setSuccessMessage(null);
        }}
        items={[
          {
            key: 'login',
            label: 'Login',
            children: (
              <div style={{ paddingTop: '16px' }}>
                {error && (
                  <Alert
                    message={error}
                    type="error"
                    showIcon
                    style={{ marginBottom: '16px' }}
                  />
                )}
                
                {successMessage && (
                  <Alert
                    message={successMessage}
                    type="success"
                    showIcon
                    style={{ marginBottom: '16px' }}
                  />
                )}
                
                <Form
                  form={loginForm}
                  name="login"
                  onFinish={handleLogin}
                  layout="vertical"
                >
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: 'Please input your email!' },
                      { type: 'email', message: 'Please enter a valid email!' },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined />}
                      placeholder="Email"
                      size="large"
                      autoFocus
                    />
                  </Form.Item>
                  
                  <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Password"
                      size="large"
                    />
                  </Form.Item>
                  
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      size="large"
                      block
                    >
                      Login
                    </Button>
                  </Form.Item>
                </Form>
                
                <Divider>or</Divider>
                
                <Button
                  onClick={handleGoogleLogin}
                  loading={loading}
                  size="large"
                  block
                  style={{ marginBottom: '16px' }}
                >
                  <Space>
                    <GoogleOutlined />
                    Continue with Google
                  </Space>
                </Button>
                
                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary">Don't have an account? </Text>
                  <Button 
                    type="link" 
                    onClick={() => setActiveTab('signup')}
                    style={{ padding: 0 }}
                  >
                    Sign up
                  </Button>
                </div>
              </div>
            ),
          },
          {
            key: 'signup',
            label: 'Sign Up',
            children: (
              <div style={{ paddingTop: '16px' }}>
                {error && (
                  <Alert
                    message={error}
                    type="error"
                    showIcon
                    style={{ marginBottom: '16px' }}
                  />
                )}
                
                {successMessage && (
                  <Alert
                    message={successMessage}
                    type="success"
                    showIcon
                    style={{ marginBottom: '16px' }}
                  />
                )}
                
                <Form
                  form={signupForm}
                  name="signup"
                  onFinish={handleSignup}
                  layout="vertical"
                >
                  <Form.Item
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Full Name"
                      size="large"
                      autoFocus
                    />
                  </Form.Item>
                  
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: 'Please input your email!' },
                      { type: 'email', message: 'Please enter a valid email!' },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined />}
                      placeholder="Email"
                      size="large"
                    />
                  </Form.Item>
                  
                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: 'Please input your password!' },
                      { min: 6, message: 'Password must be at least 6 characters!' },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Password"
                      size="large"
                    />
                  </Form.Item>
                  
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      size="large"
                      block
                    >
                      Sign Up
                    </Button>
                  </Form.Item>
                </Form>
                
                <Divider>or</Divider>
                
                <Button
                  onClick={handleGoogleLogin}
                  loading={loading}
                  size="large"
                  block
                  style={{ marginBottom: '16px' }}
                >
                  <Space>
                    <GoogleOutlined />
                    Continue with Google
                  </Space>
                </Button>
                
                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary">Already have an account? </Text>
                  <Button 
                    type="link" 
                    onClick={() => setActiveTab('login')}
                    style={{ padding: 0 }}
                  >
                    Login
                  </Button>
                </div>
              </div>
            ),
          },
        ]}
      />
    </Modal>
  );
};

export default LoginModal;