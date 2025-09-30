import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Card, 
  Typography, 
  Table, 
  Space, 
  Button, 
  Tag, 
  Divider, 
  Statistic, 
  Row, 
  Col,
  message,
  Spin,
  Alert,
  Input,
  Form
} from 'antd';
import { 
  UserOutlined, 
  DollarCircleOutlined, 
  CalendarOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  LogoutOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
  MailOutlined
} from '@ant-design/icons';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';

const { Title, Text } = Typography;
const { Content } = Layout;

interface EsopGrant {
  id: string;
  company_id: string;
  employee_name: string;
  employee_id: string | null;
  position: string | null;
  department: string | null;
  grant_date: string;
  shares_granted: number;
  vesting_schedule: string;
  cliff_period: number;
  vesting_frequency: string;
  exercise_price: number;
  status: string;
  notes: string | null;
  company_name?: string;
}

interface Company {
  id: string;
  name: string;
  description: string | null;
  industry: string | null;
}

const EmployerDashboard: React.FC = () => {
  const [esopGrants, setEsopGrants] = useState<EsopGrant[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);

  const fetchEmployeeEsopData = async (employeeEmail: string) => {
    try {
      setLoading(true);
      
      // Fetch ESOP grants for this employee (using their email)
      const { data: grants, error: grantsError } = await supabase
        .from('esop_grants')
        .select(`
          *,
          companies (name)
        `)
        .eq('employee_name', employeeEmail)
        .order('grant_date', { ascending: false });

      if (grantsError) {
        throw new Error(grantsError.message);
      }

      // Format the data to include company names
      const formattedGrants = grants.map(grant => ({
        ...grant,
        company_name: grant.companies?.name || 'Unknown Company'
      }));

      setEsopGrants(formattedGrants);
      
      // Get unique company IDs
      const companyIds = [...new Set(grants.map(grant => grant.company_id))];
      
      // Fetch company details
      if (companyIds.length > 0) {
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .in('id', companyIds);

        if (!companyError) {
          setCompanies(companyData || []);
        }
      }
      
      setError(null);
    } catch (err: any) {
      console.error('Error fetching employee ESOP data:', err);
      setError('Failed to load ESOP data. Please try again later.');
      message.error('Failed to load ESOP data');
    } finally {
      setLoading(false);
    }
  };

  const handleViewGrants = async () => {
    if (!email) {
      message.error('Please enter your email address');
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      message.error('Please enter a valid email address');
      return;
    }
    
    await fetchEmployeeEsopData(email);
    setShowDashboard(true);
  };

  const handleLogout = () => {
    setShowDashboard(false);
    setEmail('');
    setEsopGrants([]);
    setCompanies([]);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'green';
      case 'vested': return 'blue';
      case 'terminated': return 'red';
      case 'exercised': return 'purple';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const columns = [
    {
      title: 'Company',
      dataIndex: 'company_name',
      key: 'company_name',
      render: (text: string) => <strong>{text}</strong>
    },
    {
      title: 'Grant Date',
      dataIndex: 'grant_date',
      key: 'grant_date',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Shares Granted',
      dataIndex: 'shares_granted',
      key: 'shares_granted',
      render: (shares: number) => shares.toLocaleString()
    },
    {
      title: 'Exercise Price',
      dataIndex: 'exercise_price',
      key: 'exercise_price',
      render: (price: number) => formatCurrency(price)
    },
    {
      title: 'Vesting Schedule',
      dataIndex: 'vesting_schedule',
      key: 'vesting_schedule'
    },
    {
      title: 'Cliff Period',
      dataIndex: 'cliff_period',
      key: 'cliff_period',
      render: (period: number) => `${period} months`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      )
    }
  ];

  // Calculate summary statistics
  const totalShares = esopGrants.reduce((sum, grant) => sum + grant.shares_granted, 0);
  const totalValue = esopGrants.reduce((sum, grant) => 
    sum + (grant.shares_granted * grant.exercise_price), 0
  );

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header 
        showAuthControls={false}
        onNavigate={(path) => {
          if (path === '/login') {
            handleLogout();
          } else {
            window.location.hash = path;
          }
        }}
      />
      
      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <div>
              <Title level={2} style={{ margin: 0 }}>
                <UserOutlined /> Employee ESOP Dashboard
              </Title>
              <Text type="secondary">
                View your ESOP grants across all companies
              </Text>
            </div>
            {showDashboard && (
              <Button 
                icon={<LogoutOutlined />} 
                onClick={handleLogout}
                size="large"
              >
                Back to Login
              </Button>
            )}
          </div>

          {!showDashboard ? (
            // Employee Email Input Form
            <Card title="View Your ESOP Grants" style={{ maxWidth: '500px', margin: '0 auto' }}>
              <Text style={{ marginBottom: '24px', display: 'block' }}>
                Enter your email address to view all ESOP grants assigned to you by your employers.
              </Text>
              
              <Form onFinish={handleViewGrants}>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: 'Please enter a valid email!' }
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="your.email@company.com"
                    prefix={<MailOutlined />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      height: '56px',
                      borderRadius: '12px',
                      fontSize: '16px'
                    }}
                  />
                </Form.Item>
                
                <Form.Item>
                  <Button 
                    type="primary" 
                    size="large" 
                    htmlType="submit"
                    style={{
                      height: '56px',
                      borderRadius: '12px',
                      fontWeight: 600,
                      fontSize: '16px'
                    }}
                    block
                  >
                    View My ESOP Grants
                  </Button>
                </Form.Item>
              </Form>
              
              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <Text type="secondary">Are you a company admin? </Text>
                <Button 
                  type="link" 
                  onClick={() => window.location.hash = '#/login'}
                  style={{ padding: 0 }}
                >
                  Login to admin dashboard
                </Button>
              </div>
            </Card>
          ) : (
            // Employee Dashboard
            <>
              {error && (
                <Alert 
                  message="Error" 
                  description={error} 
                  type="error" 
                  showIcon 
                  style={{ marginBottom: '24px' }}
                />
              )}

              {/* Summary Cards */}
              <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={8}>
                  <Card>
                    <Statistic
                      title="Total Companies"
                      value={companies.length}
                      prefix={<FileTextOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Card>
                    <Statistic
                      title="Total Shares"
                      value={totalShares.toLocaleString()}
                      prefix={<DollarCircleOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Card>
                    <Statistic
                      title="Total Value"
                      value={formatCurrency(totalValue)}
                      prefix={<DollarCircleOutlined />}
                    />
                  </Card>
                </Col>
              </Row>

              {/* Companies Section */}
              <Card 
                title={<Space><FileTextOutlined /> Companies</Space>} 
                style={{ marginBottom: '24px' }}
              >
                {companies.length > 0 ? (
                  <Space wrap>
                    {companies.map(company => (
                      <Tag 
                        key={company.id} 
                        icon={<CheckCircleOutlined />} 
                        color="processing"
                      >
                        {company.name}
                      </Tag>
                    ))}
                  </Space>
                ) : (
                  <Text type="secondary">No companies found</Text>
                )}
              </Card>

              {/* ESOP Grants Table */}
              <Card 
                title={<Space><DollarCircleOutlined /> Your ESOP Grants</Space>}
                extra={
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={() => fetchEmployeeEsopData(email)}
                  >
                    Refresh
                  </Button>
                }
              >
                {esopGrants.length > 0 ? (
                  <Table 
                    dataSource={esopGrants} 
                    columns={columns} 
                    rowKey="id" 
                    pagination={{ pageSize: 10 }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', padding: '48px' }}>
                    <FileTextOutlined style={{ fontSize: '48px', color: '#ccc' }} />
                    <Title level={4} style={{ marginTop: '16px' }}>
                      No ESOP Grants Found
                    </Title>
                    <Text type="secondary">
                      You don't have any ESOP grants assigned to you yet.
                    </Text>
                  </div>
                )}
              </Card>

              {/* Information Section */}
              <Card title={<Space><InfoCircleOutlined /> About Your ESOP</Space>}>
                <Text>
                  As an employee, you can view all ESOP grants assigned to you by your employers. 
                  Each grant shows the number of shares, vesting schedule, and exercise price. 
                  Contact your HR department for more information about exercising your options.
                </Text>
                <Divider />
                <Text strong>How to Access Your ESOP Dashboard:</Text>
                <ol>
                  <li>Your employer assigns ESOP grants using your email address</li>
                  <li>Use the same email address to view your grants here</li>
                  <li>All your ESOP grants across different companies are shown in one place</li>
                </ol>
                <Text type="secondary">
                  Note: If you don't see your grants, please confirm with your employer that they've been assigned to your email address.
                </Text>
              </Card>
            </>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default EmployerDashboard;