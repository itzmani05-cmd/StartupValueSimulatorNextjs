import Footer from '../components/Footer';
import Header from '../components/Header';
import OAuthTest from '../components/OAuthTest';
import OAuthDiagnostics from '../components/OAuthDiagnostics';
import React from 'react';
import { Button, Card, Col, Row, Space, Tag, Typography, Layout, theme } from 'antd';
import { ArrowRightOutlined, ArrowLeftOutlined, BarChartOutlined, CalculatorOutlined, FundOutlined, LineChartOutlined } from '@ant-design/icons';
import FeatureGrid from '../components/FeatureGrid';

const { Title, Paragraph } = Typography;
const { Content } = Layout;
const { useToken } = theme;

const Home: React.FC = () => {
  const { token } = useToken();

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f0f9ff, #e0f2fe)' }}>
      <Header showAuthControls={false} />
      
      <Content style={{ padding: '24px 0' }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Enhanced Hero Section */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <Tag 
              color="blue" 
              style={{ 
                fontSize: '16px', 
                padding: '10px 20px', 
                borderRadius: '999px', 
                marginBottom: '32px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div 
                style={{ 
                  width: 8, 
                  height: 8, 
                  backgroundColor: token.colorPrimary, 
                  borderRadius: '50%', 
                  display: 'inline-block', 
                  marginRight: 8,
                  animation: 'pulse 2s infinite'
                }}
              />
              🚀 Plan. Simulate. Decide.
            </Tag>
            
            <Title 
              level={1} 
              style={{ 
                fontSize: '48px', 
                fontWeight: 800, 
                background: 'linear-gradient(to right, #1a1a1a, #4b4b4b, #1a1a1a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 24,
                lineHeight: 1.2
              }}
            >
              Model dilution, ESOP, and exits with confidence
            </Title>
            
            <Paragraph 
              style={{ 
                fontSize: '24px', 
                color: token.colorTextSecondary, 
                maxWidth: '800px', 
                margin: '0 auto 40px',
                lineHeight: 1.6
              }}
            >
              Build comprehensive scenarios, run Monte Carlo simulations, and visualize ownership changes across funding rounds with our professional startup valuation platform.
            </Paragraph>
            
            <Space size="large">
              <Button
                type="primary"
                size="large"
                icon={<ArrowRightOutlined />}
                onClick={() => (window.location.hash = "#/app")}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '16px 32px',
                  borderRadius: '16px',
                  fontWeight: 600,
                  fontSize: '18px',
                  boxShadow: '0 8px 24px rgba(24, 144, 255, 0.3)',
                }}
              >
                🚀 Get Started
                <ArrowRightOutlined />
              </Button>
              <Button
                size="large"
                icon={<ArrowLeftOutlined />}
                onClick={() => (window.location.hash = "#/features")}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '16px 32px',
                  borderRadius: '16px',
                  border: `1px solid ${token.colorBorder}`,
                  color: token.colorText,
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 600,
                  fontSize: '18px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                }}
              >
                <ArrowLeftOutlined />
                Learn More
              </Button>
            </Space>
          </div>

          {/* OAuth Test Section */}
          <div style={{ marginBottom: 40 }}>
            <OAuthTest />
          </div>
          
          {/* OAuth Diagnostics Section */}
          <div style={{ marginBottom: 40 }}>
            <OAuthDiagnostics />
          </div>

          {/* Value Props */}
          <div className="mb-20">
            <FeatureGrid
              items={[
                { icon: '📈', title: 'Scenario planning', description: 'Compare multiple growth and exit paths.' },
                { icon: '🧮', title: 'Cap table math', description: 'See dilution impacts across rounds.' },
                { icon: '🎲', title: 'Monte Carlo', description: 'Quantify risk with distributions.' },
                { icon: '📊', title: 'Analytics', description: 'Ownership, dilution, and projections.' }
              ]}
              columns={4}
              cardPadding={24}
            />
          </div>

          {/* How it works */}
          <div style={{ marginBottom: 80 }}>
            <Title 
              level={2} 
              style={{ 
                textAlign: 'center', 
                marginBottom: 40,
                fontSize: '36px',
                fontWeight: 700
              }}
            >
              How It Works
            </Title>
            <Row gutter={24}>
              {[
                {
                  step: '1',
                  title: 'Create company',
                  desc: 'Set shares, ESOP pool, and valuation.',
                  icon: <FundOutlined style={{ fontSize: '24px' }} />
                },
                {
                  step: '2',
                  title: 'Add rounds',
                  desc: 'Model SAFEs/priced rounds. Track dilution.',
                  icon: <CalculatorOutlined style={{ fontSize: '24px' }} />
                },
                {
                  step: '3',
                  title: 'Simulate exits',
                  desc: 'Run Monte Carlo and compare scenarios.',
                  icon: <LineChartOutlined style={{ fontSize: '24px' }} />
                }
              ].map((s, i) => (
                <Col span={8} key={i}>
                  <Card 
                    style={{
                      background: 'linear-gradient(to bottom right, #1a1a1a, #2d2d2d)',
                      color: 'white',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                      height: '100%'
                    }}
                    bodyStyle={{ padding: 24 }}
                  >
                    <div style={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      backgroundColor: 'rgba(24, 144, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16
                    }}>
                      {s.icon}
                    </div>
                    <div style={{ color: token.colorTextSecondary, marginBottom: 8 }}>Step {s.step}</div>
                    <Title level={4} style={{ color: 'white', marginBottom: 8, fontSize: '20px' }}>{s.title}</Title>
                    <Paragraph style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: 0 }}>{s.desc}</Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* Closing CTA */}
          <Card 
            style={{
              textAlign: 'center',
              padding: '48px 24px',
              background: 'linear-gradient(to right, rgba(24, 144, 255, 0.05), rgba(24, 144, 255, 0.1))',
              borderRadius: '24px',
              border: `1px solid ${token.colorBorder}`,
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
              <Title 
                level={3} 
                style={{ 
                  fontSize: '32px', 
                  fontWeight: 700, 
                  color: token.colorText,
                  marginBottom: 16
                }}
              >
                Ready to Start Modeling?
              </Title>
              <Paragraph 
                style={{ 
                  fontSize: '20px', 
                  color: token.colorTextSecondary, 
                  marginBottom: 32,
                  lineHeight: 1.6
                }}
              >
                Enter the app to create your company and run your first professional valuation scenario.
              </Paragraph>
              <Button
                type="primary"
                size="large"
                icon={<ArrowRightOutlined />}
                onClick={() => (window.location.hash = "#/app")}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '16px 32px',
                  borderRadius: '16px',
                  fontWeight: 600,
                  fontSize: '18px',
                  boxShadow: '0 8px 24px rgba(24, 144, 255, 0.3)',
                }}
              >
                Enter Professional App
                <ArrowRightOutlined />
              </Button>
            </div>
          </Card>
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default Home;