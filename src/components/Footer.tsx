import React, { useState } from 'react';
import { Row, Col, Divider, Typography, Space, Button, Input, Layout, theme, message } from 'antd';
import { 
  GithubOutlined, 
  TwitterOutlined, 
  LinkedinOutlined, 
  MailOutlined, 
  GlobalOutlined,
  RocketOutlined,
  TeamOutlined,
  FileTextOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  YoutubeOutlined,
  InstagramOutlined,
  FacebookOutlined,
  SendOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  BankOutlined,
  BookOutlined,
  CalculatorOutlined,
  LineChartOutlined,
  BulbOutlined,
  RightOutlined
} from '@ant-design/icons';

const { Text, Link, Title } = Typography;
const { Footer: AntFooter } = Layout;
const { useToken } = theme;

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const { token } = useToken();
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      message.success(`Thank you for subscribing with ${email}!`);
      setEmail('');
    }
  };
  
  return (
    <AntFooter 
      style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#e2e8f0', // Lighter text color for better visibility
        paddingTop: 48,
        paddingBottom: 24,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Elements */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        background: `radial-gradient(circle at 10% 20%, rgba(24, 144, 255, 0.1) 0%, transparent 20%),
                     radial-gradient(circle at 90% 80%, rgba(114, 46, 209, 0.1) 0%, transparent 20%)`,
        pointerEvents: 'none'
      }} />
      
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 16px', position: 'relative', zIndex: 1 }}>
        {/* Main Footer Content */}
        <Row gutter={[32, 32]} style={{ marginBottom: 32 }}>
          {/* Company Info */}
          <Col xs={24} sm={24} md={8}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ 
                  width: 40, 
                  height: 40, 
                  background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
                  borderRadius: 10, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(24, 144, 255, 0.3)'
                }}>
                  <RocketOutlined style={{ color: 'white', fontSize: 20 }} />
                </div>
                <span style={{ 
                  fontSize: 20, 
                  fontWeight: 800,
                  background: 'linear-gradient(to right, #ffffff, #d1d5db)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Startup Value Simulator
                </span>
              </div>
              <Text style={{ color: '#cbd5e1', marginBottom: 24, display: 'block', fontSize: 14, lineHeight: 1.6 }}>
                Professional startup valuation platform with advanced cap table modeling, 
                ESOP management, Monte Carlo simulations, and scenario planning for founders and investors.
              </Text>
              
              <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                <Button 
                  type="text" 
                  icon={<GithubOutlined />} 
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: 'white',
                    border: 0,
                    borderRadius: 10,
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(24, 144, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  href="https://github.com"
                  target="_blank"
                />
                <Button 
                  type="text" 
                  icon={<TwitterOutlined />} 
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: 'white',
                    border: 0,
                    borderRadius: 10,
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(29, 161, 242, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  href="https://twitter.com"
                  target="_blank"
                />
                <Button 
                  type="text" 
                  icon={<LinkedinOutlined />} 
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: 'white',
                    border: 0,
                    borderRadius: 10,
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 119, 181, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  href="https://linkedin.com"
                  target="_blank"
                />
                <Button 
                  type="text" 
                  icon={<YoutubeOutlined />} 
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: 'white',
                    border: 0,
                    borderRadius: 10,
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  href="https://youtube.com"
                  target="_blank"
                />
              </div>
              
              <div>
                <Title level={5} style={{ color: '#f1f5f9', marginBottom: 12, fontWeight: 700 }}>Stay Updated</Title>
                <Text style={{ color: '#cbd5e1', marginBottom: 16, display: 'block', fontSize: 14 }}>
                  Subscribe to our newsletter for the latest insights on startup valuation and equity management.
                </Text>
                <form onSubmit={handleSubscribe}>
                  <Space.Compact style={{ width: '100%' }}>
                    <Input 
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ 
                        borderRadius: '10px 0 0 10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: 'white',
                        padding: '8px 12px',
                        fontSize: 14
                      }}
                    />
                    <Button 
                      type="primary" 
                      icon={<SendOutlined />} 
                      htmlType="submit"
                      style={{ 
                        borderRadius: '0 10px 10px 0',
                        background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                        border: 0,
                        color: 'white',
                        padding: '0 16px',
                        fontSize: 14,
                        fontWeight: 600
                      }}
                    >
                      <span style={{ display: 'none' }}>Subscribe</span>
                    </Button>
                  </Space.Compact>
                </form>
              </div>
            </div>
          </Col>
          
          {/* Product Links */}
          <Col xs={12} sm={12} md={4}>
            <div>
              <Title level={5} style={{ color: '#f1f5f9', marginBottom: 16, fontWeight: 700 }}>Product</Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Link href="#/home" style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                  <RightOutlined style={{ fontSize: 10 }} /> Home
                </Link>
                <Link href="#/features" style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                  <RightOutlined style={{ fontSize: 10 }} /> Features
                </Link>
                <Link href="#/app" style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                  <RightOutlined style={{ fontSize: 10 }} /> Dashboard
                </Link>
                <Link href="#/learn-more" style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                  <RightOutlined style={{ fontSize: 10 }} /> Documentation
                </Link>
                <Link href="#/pricing" style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                  <RightOutlined style={{ fontSize: 10 }} /> Pricing
                </Link>
                <Link href="#/roadmap" style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                  <RightOutlined style={{ fontSize: 10 }} /> Roadmap
                </Link>
              </div>
            </div>
          </Col>
          
          {/* Resources */}
          <Col xs={12} sm={12} md={4}>
            <div>
              <Title level={5} style={{ color: '#f1f5f9', marginBottom: 16, fontWeight: 700 }}>Resources</Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Link href="#" style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                  <BookOutlined style={{ marginRight: 6, fontSize: 14 }} /> Blog
                </Link>
                <Link href="#" style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                  <CalculatorOutlined style={{ marginRight: 6, fontSize: 14 }} /> Valuation Calculator
                </Link>
                <Link href="#" style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                  <LineChartOutlined style={{ marginRight: 6, fontSize: 14 }} /> Financial Models
                </Link>
                <Link href="#" style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                  <BulbOutlined style={{ marginRight: 6, fontSize: 14 }} /> Tutorials
                </Link>
                <Link href="#" style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                  <TeamOutlined style={{ marginRight: 6, fontSize: 14 }} /> Support Center
                </Link>
                <Link href="#" style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                  <GlobalOutlined style={{ marginRight: 6, fontSize: 14 }} /> API Documentation
                </Link>
              </div>
            </div>
          </Col>
          
          {/* Legal & Company */}
          <Col xs={12} sm={12} md={4}>
            <div>
              <Title level={5} style={{ color: '#f1f5f9', marginBottom: 16, fontWeight: 700 }}>Legal</Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                <Link href="#" style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                  <LockOutlined style={{ marginRight: 6, fontSize: 14 }} /> Privacy Policy
                </Link>
                <Link href="#" style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                  <FileTextOutlined style={{ marginRight: 6, fontSize: 14 }} /> Terms of Service
                </Link>
                <Link href="#" style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                  <SafetyCertificateOutlined style={{ marginRight: 6, fontSize: 14 }} /> Security
                </Link>
                <Link href="#" style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                  <TeamOutlined style={{ marginRight: 6, fontSize: 14 }} /> Compliance
                </Link>
              </div>
              
              <div>
                <Title level={5} style={{ color: '#f1f5f9', marginBottom: 12, fontWeight: 700 }}>Company</Title>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <Link href="#" style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                    <TeamOutlined style={{ marginRight: 6, fontSize: 14 }} /> About Us
                  </Link>
                  <Link href="#" style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                    <BankOutlined style={{ marginRight: 6, fontSize: 14 }} /> Careers
                  </Link>
                  <Link href="#" style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                    <GlobalOutlined style={{ marginRight: 6, fontSize: 14 }} /> Partners
                  </Link>
                  <Link href="#" style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                    <FileTextOutlined style={{ marginRight: 6, fontSize: 14 }} /> Press
                  </Link>
                </div>
              </div>
            </div>
          </Col>
          
          {/* Contact */}
          <Col xs={12} sm={12} md={4}>
            <div>
              <Title level={5} style={{ color: '#f1f5f9', marginBottom: 16, fontWeight: 700 }}>Contact</Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <Text strong style={{ color: '#f1f5f9', display: 'block', marginBottom: 6, fontSize: 14 }}>Support</Text>
                  <Link href="mailto:support@startupvalue.com" style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                    <MailOutlined style={{ marginRight: 6, fontSize: 14 }} /> support@startupvalue.com
                  </Link>
                </div>
                
                <div>
                  <Text strong style={{ color: '#f1f5f9', display: 'block', marginBottom: 6, fontSize: 14 }}>Sales</Text>
                  <Link href="mailto:sales@startupvalue.com" style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                    <MailOutlined style={{ marginRight: 6, fontSize: 14 }} /> sales@startupvalue.com
                  </Link>
                  <Text style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 14 }}>
                    <PhoneOutlined style={{ marginRight: 6, fontSize: 14 }} /> +1 (555) 123-4567
                  </Text>
                </div>
                
                <div>
                  <Text strong style={{ color: '#f1f5f9', display: 'block', marginBottom: 6, fontSize: 14 }}>Office</Text>
                  <Text style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                    <EnvironmentOutlined style={{ marginRight: 6, fontSize: 14 }} /> San Francisco, CA
                  </Text>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        
        <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)', margin: '24px 0' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
          <Text style={{ color: '#cbd5e1', fontSize: 14 }}>
            © {year} Startup Value Simulator. All rights reserved.
          </Text>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link href="#" style={{ color: '#cbd5e1', fontSize: 14 }}>Status</Link>
            <Link href="#" style={{ color: '#cbd5e1', fontSize: 14 }}>Sitemap</Link>
            <Link href="#" style={{ color: '#cbd5e1', fontSize: 14 }}>Preferences</Link>
          </div>
        </div>
      </div>
      
      {/* Add responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .ant-row {
            flex-direction: column;
          }
          
          .ant-col {
            width: 100% !important;
            max-width: 100% !important;
          }
          
          .ant-col-12 {
            width: 50% !important;
            max-width: 50% !important;
          }
          
          .ant-divider {
            margin: 16px 0 !important;
          }
        }
        
        @media (max-width: 480px) {
          .ant-col-12 {
            width: 100% !important;
            max-width: 100% !important;
          }
          
          .ant-typography {
            font-size: 13px !important;
          }
        }
      `}</style>
    </AntFooter>
  );
};

export default Footer;