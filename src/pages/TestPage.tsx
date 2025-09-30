import React from "react";
import { Card, Button, Layout, theme, Typography } from 'antd';
import Header from "../components/Header";
import Footer from "../components/Footer";

const { Title, Text } = Typography;
const { Content } = Layout;
const { useToken } = theme;

const TestPage: React.FC = () => {
  const { token } = useToken();
  
  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f0f9ff, #e0f2fe)' }}>
      <Header showAuthControls={false} />
      
      <Content style={{ padding: '24px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <Card>
            <Title level={2}>Test Page</Title>
            <Text>This is a test page to verify routing is working correctly.</Text>
            <div style={{ marginTop: '20px' }}>
              <Button type="primary" onClick={() => window.location.hash = '#/features'}>
                Go to Features Page
              </Button>
            </div>
          </Card>
        </div>
      </Content>
      
      <Footer />
    </Layout>
  );
};

export default TestPage;