import React from "react";
import { Layout, Typography, Card, Button, Tag, Row, Col, Statistic } from 'antd';
import Header from "../components/Header";
import Footer from "../components/Footer";

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

const FeaturesNoAnimation: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header showAuthControls={false} />
      
      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Hero Section */}
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', marginBottom: '60px' }}>
            <Tag 
              color="blue" 
              style={{ 
                fontSize: '16px', 
                padding: '10px 24px', 
                borderRadius: '999px', 
                marginBottom: '36px'
              }}
            >
              <div 
                style={{ 
                  width: '10px', 
                  height: '10px', 
                  backgroundColor: '#1890ff', 
                  borderRadius: '50%', 
                  display: 'inline-block'
                }}
              />
              <span style={{ marginLeft: '8px' }}>📚 Platform Overview</span>
            </Tag>
            
            <Title level={1} style={{ 
              fontSize: '48px', 
              fontWeight: 800, 
              margin: '0 0 28px 0'
            }}>
              Professional Valuation Platform
            </Title>
            
            <Paragraph style={{ 
              fontSize: '24px', 
              color: '#666',
              maxWidth: '600px',
              margin: '0 auto 48px',
              lineHeight: 1.6
            }}>
              Comprehensive tools for startup valuation, cap table management, and financial modeling with enterprise-grade precision.
            </Paragraph>
            
            {/* Stats */}
            <Row gutter={28} style={{ maxWidth: '600px', margin: '56px auto 0' }}>
              {[
                { value: '10+', label: 'Key Features' },
                { value: '∞', label: 'Scenarios' },
                { value: '100%', label: 'Accuracy' }
              ].map((stat, index) => (
                <Col span={8} key={index}>
                  <Card 
                    style={{ 
                      background: '#f5f5f5',
                      borderRadius: '16px',
                      textAlign: 'center'
                    }}
                    bodyStyle={{ padding: '24px' }}
                  >
                    <Statistic 
                      value={stat.value} 
                      suffix=""
                      style={{ 
                        fontSize: '32px', 
                        fontWeight: 800,
                        margin: '0 0 12px 0'
                      }}
                    />
                    <Text style={{ 
                      color: '#333', 
                      fontWeight: 600, 
                      fontSize: '16px'
                    }}>
                      {stat.label}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </Content>
      
      <Footer />
    </Layout>
  );
};

export default FeaturesNoAnimation;