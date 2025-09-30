import React from 'react';
import { Card, Typography, Space, Button, message } from 'antd';
import { HomeOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  createdAt: string;
  updatedAt: string;
}

interface CompanyDashboardProps {
  companies: Company[];
  selectedCompanyId: string;
  onCompanySelect: (companyId: string) => void;
  onCompanyDelete: (companyId: string) => void;
}

const CompanyDashboard: React.FC<CompanyDashboardProps> = ({
  companies,
  selectedCompanyId,
  onCompanySelect,
  onCompanyDelete
}) => {
  // Function to generate company-specific URL
  const getCompanyUrl = (companyId: string) => {
    // Since we're now using user-specific URLs, we don't need company-specific URLs
    // The user-specific URL is handled at the app level
    return `${window.location.origin}/#/user/${companyId}`;
  };

  // Function to copy company URL to clipboard
  const copyCompanyUrl = (companyId: string) => {
    const url = getCompanyUrl(companyId);
    navigator.clipboard.writeText(url);
    message.success('Company URL copied to clipboard!');
  };

  // Handle delete with confirmation
  const handleDelete = (companyId: string, companyName: string) => {
    if (window.confirm(`Are you sure you want to delete the company "${companyName}"? This action cannot be undone.`)) {
      onCompanyDelete(companyId);
    }
  };

  if (!companies || companies.length === 0) {
    return (
      <Card>
        <Space direction="vertical" style={{ width: '100%', textAlign: 'center', padding: '30px 0' }}>
          <HomeOutlined style={{ fontSize: '36px', color: '#1890ff' }} />
          <Title level={4}>No Companies Yet</Title>
          <Text type="secondary">Create your first company to get started with the simulator.</Text>
        </Space>
      </Card>
    );
  }

  return (
    <div style={{ padding: '16px' }}>
      <Card style={{ marginBottom: '16px' }}>
        <Title level={3} style={{ fontSize: '20px' }}>
          <HomeOutlined style={{ marginRight: '8px' }} />
          Company Dashboard
        </Title>
        <Text type="secondary" style={{ fontSize: '14px' }}>Manage and switch between your startup companies</Text>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {companies.map((company) => (
          <Card
            key={company.id}
            hoverable
            style={{
              border: selectedCompanyId === company.id ? '2px solid #1890ff' : '1px solid #f0f0f0',
              borderRadius: '8px',
              transition: 'all 0.3s',
            }}
            onClick={() => onCompanySelect(company.id)}
          >
            <div style={{ marginBottom: '12px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                background: 'linear-gradient(to bottom right, #1890ff, #096dd9)',
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <span style={{ color: 'white', fontSize: '18px' }}>🏢</span>
              </div>
              
              <Title level={4} style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
                {company.name}
              </Title>
              
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                {company.industry || 'No industry specified'}
              </Text>
              
              <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                Created: {new Date(company.createdAt).toLocaleDateString()}
              </Text>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button 
                type="text" 
                icon={<CopyOutlined />} 
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  copyCompanyUrl(company.id);
                }}
              >
                Share
              </Button>
              
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(company.id, company.name);
                }}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompanyDashboard;