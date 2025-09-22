import React, { useState } from 'react';
import { Row, Col, Divider, Typography, Space, Button, Input } from 'antd';
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
  BulbOutlined
} from '@ant-design/icons';

const { Text, Link, Title } = Typography;
const { Search } = Input;

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing with ${email}!`);
      setEmail('');
    }
  };
  
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Main Footer Content */}
        <Row gutter={[32, 32]} className="footer-main">
          {/* Company Info */}
          <Col xs={24} md={8}>
            <div className="footer-section">
              <div className="footer-logo">
                <RocketOutlined className="footer-logo-icon" />
                <span className="footer-logo-text">Startup Value Simulator</span>
              </div>
              <Text className="footer-description">
                Professional startup valuation platform with advanced cap table modeling, 
                ESOP management, Monte Carlo simulations, and scenario planning.
              </Text>
              
              <div className="footer-social">
                <Button 
                  type="text" 
                  icon={<GithubOutlined />} 
                  className="social-button"
                  href="https://github.com"
                  target="_blank"
                />
                <Button 
                  type="text" 
                  icon={<TwitterOutlined />} 
                  className="social-button"
                  href="https://twitter.com"
                  target="_blank"
                />
                <Button 
                  type="text" 
                  icon={<LinkedinOutlined />} 
                  className="social-button"
                  href="https://linkedin.com"
                  target="_blank"
                />
                <Button 
                  type="text" 
                  icon={<YoutubeOutlined />} 
                  className="social-button"
                  href="https://youtube.com"
                  target="_blank"
                />
                <Button 
                  type="text" 
                  icon={<InstagramOutlined />} 
                  className="social-button"
                  href="https://instagram.com"
                  target="_blank"
                />
                <Button 
                  type="text" 
                  icon={<FacebookOutlined />} 
                  className="social-button"
                  href="https://facebook.com"
                  target="_blank"
                />
              </div>
              
              <div className="footer-newsletter">
                <Title level={5} className="footer-section-title">Stay Updated</Title>
                <Text className="footer-description">
                  Subscribe to our newsletter for the latest updates and insights.
                </Text>
                <form onSubmit={handleSubscribe} className="newsletter-form">
                  <Space.Compact style={{ width: '100%' }}>
                    <Input 
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="newsletter-input"
                    />
                    <Button 
                      type="primary" 
                      icon={<SendOutlined />} 
                      htmlType="submit"
                      className="newsletter-button"
                    />
                  </Space.Compact>
                </form>
              </div>
            </div>
          </Col>
          
          {/* Product Links */}
          <Col xs={12} sm={12} md={4}>
            <div className="footer-section">
              <Text strong className="footer-section-title">Product</Text>
              <div className="footer-links">
                <Link href="#/home" className="footer-link">Home</Link>
                <Link href="#/features" className="footer-link">Features</Link>
                <Link href="#/app" className="footer-link">Dashboard</Link>
                <Link href="#/learn-more" className="footer-link">Documentation</Link>
                <Link href="#/pricing" className="footer-link">Pricing</Link>
                <Link href="#/roadmap" className="footer-link">Roadmap</Link>
              </div>
            </div>
          </Col>
          
          {/* Resources */}
          <Col xs={12} sm={12} md={4}>
            <div className="footer-section">
              <Text strong className="footer-section-title">Resources</Text>
              <div className="footer-links">
                <Link href="#" className="footer-link">
                  <BookOutlined /> Blog
                </Link>
                <Link href="#" className="footer-link">
                  <CalculatorOutlined /> Valuation Calculator
                </Link>
                <Link href="#" className="footer-link">
                  <LineChartOutlined /> Financial Models
                </Link>
                <Link href="#" className="footer-link">Tutorials</Link>
                <Link href="#" className="footer-link">Support</Link>
                <Link href="#" className="footer-link">API Docs</Link>
              </div>
            </div>
          </Col>
          
          {/* Legal */}
          <Col xs={12} sm={12} md={4}>
            <div className="footer-section">
              <Text strong className="footer-section-title">Legal</Text>
              <div className="footer-links">
                <Link href="#" className="footer-link">
                  <LockOutlined /> Privacy Policy
                </Link>
                <Link href="#" className="footer-link">
                  <FileTextOutlined /> Terms of Service
                </Link>
                <Link href="#" className="footer-link">
                  <SafetyCertificateOutlined /> Security
                </Link>
                <Link href="#" className="footer-link">
                  <TeamOutlined /> Compliance
                </Link>
                <Link href="#" className="footer-link">Cookie Policy</Link>
                <Link href="#" className="footer-link">GDPR</Link>
              </div>
            </div>
          </Col>
          
          {/* Contact & Company */}
          <Col xs={12} sm={12} md={4}>
            <div className="footer-section">
              <Text strong className="footer-section-title">Company</Text>
              <div className="footer-links">
                <Link href="#" className="footer-link">About Us</Link>
                <Link href="#" className="footer-link">Careers</Link>
                <Link href="#" className="footer-link">Partners</Link>
                <Link href="#" className="footer-link">Press</Link>
                <Link href="#" className="footer-link">Contact</Link>
              </div>
              
              <Text strong className="footer-section-title" style={{ marginTop: '20px' }}>Contact</Text>
              <div className="footer-links">
                <Link href="mailto:support@startupvaluesimulator.com" className="footer-link">
                  <MailOutlined /> support@startupvaluesimulator.com
                </Link>
                <Link href="mailto:sales@startupvaluesimulator.com" className="footer-link">
                  <GlobalOutlined /> sales@startupvaluesimulator.com
                </Link>
                <Text className="footer-link">
                  <PhoneOutlined /> +1 (555) 123-4567
                </Text>
                <Text className="footer-link">
                  <EnvironmentOutlined /> San Francisco, CA
                </Text>
                <Text className="footer-link">
                  <BankOutlined /> London, UK
                </Text>
              </div>
            </div>
          </Col>
        </Row>
        
        <Divider className="footer-divider" />
        
        {/* Bottom Bar */}
        <div className="footer-bottom">
          <Row justify="space-between" align="middle" className="footer-bottom-content">
            <Col xs={24} md={12}>
              <Text className="footer-copyright">
                © {year} Startup Value Simulator. All rights reserved.
              </Text>
            </Col>
            <Col xs={24} md={12}>
              <Space size="large" className="footer-bottom-links">
                <Link href="#" className="footer-bottom-link">Status</Link>
                <Link href="#" className="footer-bottom-link">Cookies</Link>
                <Link href="#" className="footer-bottom-link">Preferences</Link>
                <Link href="#" className="footer-bottom-link">Accessibility</Link>
                <Link href="#" className="footer-bottom-link">Sitemap</Link>
              </Space>
            </Col>
          </Row>
        </div>
      </div>
    </footer>
  );
};

export default Footer;