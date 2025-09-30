import React from "react";
import { Layout, Typography, Card, Button } from 'antd';
import Header from "../components/Header";
import Footer from "../components/Footer";

const { Title, Text } = Typography;
const { Content } = Layout;

const SimpleFeatures: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header showAuthControls={false} />
      
      <Content style={{ padding: '24px' }}>
        <Card>
          <Title level={2}>Features Page</Title>
          <Text>This is a simplified features page to test routing.</Text>
          <div style={{ marginTop: '20px' }}>
            <Button type="primary" onClick={() => window.location.hash = '#/home'}>
              Go Home
            </Button>
          </div>
        </Card>
      </Content>
      
      <Footer />
    </Layout>
  );
};

export default SimpleFeatures;