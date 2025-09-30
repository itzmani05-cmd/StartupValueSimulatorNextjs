import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  Button, 
  Row, 
  Col, 
  Typography,
  Divider,
  message
} from 'antd';
import { 
  BankOutlined, 
  HomeOutlined, 
  GlobalOutlined, 
  FileTextOutlined,
  DollarOutlined,
  TeamOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (companyData: CompanyFormData) => void;
  isLoading: boolean;
}

interface CompanyFormData {
  name: string;
  description: string;
  industry: string;
  foundedYear: string;
  totalShares: number;
  initialValuation: number;
  esopPool: number;
  legalStructure: string;
  headquarters: string;
  website: string;
}

const CompanyModal: React.FC<CompanyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}) => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    description: '',
    industry: '',
    foundedYear: new Date().getFullYear().toString(),
    totalShares: 10000000,
    initialValuation: 1000000,
    esopPool: 10,
    legalStructure: 'C-Corporation',
    headquarters: '',
    website: ''
  });

  const industries = [
    'Technology',
    'Healthcare',
    'E-commerce',
    'Fintech',
    'SaaS',
    'Biotech',
    'Clean Energy',
    'AI/ML',
    'Blockchain',
    'EdTech',
    'Real Estate',
    'Manufacturing',
    'Other'
  ];

  const legalStructures = [
    'C-Corporation',
    'S-Corporation',
    'LLC',
    'Partnership',
    'Sole Proprietorship'
  ];

  const currentYear = new Date().getFullYear();
  const foundedYears = Array.from({ length: 30 }, (_, i) => (currentYear - i).toString());

  useEffect(() => {
    if (isOpen) {
      form.resetFields();
      setFormData({
        name: '',
        description: '',
        industry: '',
        foundedYear: new Date().getFullYear().toString(),
        totalShares: 10000000,
        initialValuation: 1000000,
        esopPool: 10,
        legalStructure: 'C-Corporation',
        headquarters: '',
        website: ''
      });
    }
  }, [isOpen, form]);

  const handleSubmit = (values: any) => {
    console.log('Form submitted with values:', values);
    
    // Convert foundedYear to a proper date format (YYYY-01-01)
    const companyDataWithDate = {
      ...values,
      foundedYear: `${values.foundedYear}-01-01`
    };
    
    console.log('Calling onSubmit with data:', companyDataWithDate);
    onSubmit(companyDataWithDate);
  };

  const formatNumber = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const formatShares = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toLocaleString();
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BankOutlined style={{ fontSize: '24px' }} />
          <div>
            <Title level={3} style={{ margin: 0 }}>Create New Company</Title>
            <Text type="secondary">Set up your startup's foundation and initial structure</Text>
          </div>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={formData}
      >
        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '16px' }}>
          {/* Basic Information Section */}
          <div style={{ marginBottom: '24px' }}>
            <Title level={4}>
              <FileTextOutlined style={{ marginRight: '8px' }} />
              Basic Information
            </Title>
            <Divider style={{ margin: '12px 0' }} />
            
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="name"
                  label="Company Name"
                  rules={[{ required: true, message: 'Please input company name!' }]}
                >
                  <Input 
                    placeholder="Enter your company name" 
                    autoFocus
                  />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="industry"
                  label="Industry"
                >
                  <Select placeholder="Select an industry">
                    {industries.map(industry => (
                      <Option key={industry} value={industry}>{industry}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              
              <Col span={12}>
                <Form.Item
                  name="foundedYear"
                  label="Founded Year"
                >
                  <Select>
                    {foundedYears.map(year => (
                      <Option key={year} value={year}>{year}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="legalStructure"
                  label="Legal Structure"
                >
                  <Select>
                    {legalStructures.map(structure => (
                      <Option key={structure} value={structure}>{structure}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="description"
                  label="Company Description"
                >
                  <Input.TextArea 
                    placeholder="Briefly describe your company, mission, and what you do..." 
                    rows={3}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Financial Structure Section */}
          <div style={{ marginBottom: '24px' }}>
            <Title level={4}>
              <DollarOutlined style={{ marginRight: '8px' }} />
              Financial Structure
            </Title>
            <Divider style={{ margin: '12px 0' }} />
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="totalShares"
                  label="Total Shares"
                  rules={[{ required: true, message: 'Please input total shares!' }]}
                >
                  <Input 
                    type="number" 
                    placeholder="10000000"
                    addonAfter={formatShares(formData.totalShares)}
                  />
                </Form.Item>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Standard is 10M shares for most startups
                </Text>
              </Col>
              
              <Col span={12}>
                <Form.Item
                  name="initialValuation"
                  label="Initial Valuation"
                >
                  <Input 
                    type="number" 
                    placeholder="1000000"
                    addonAfter={formatNumber(formData.initialValuation)}
                  />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="esopPool"
                  label="ESOP Pool (%)"
                >
                  <Input 
                    type="number" 
                    placeholder="10"
                    min="0"
                    max="100"
                    step="0.1"
                    addonAfter="%"
                  />
                </Form.Item>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Standard is 10-20% for early-stage startups
                </Text>
              </Col>
            </Row>
          </div>

          {/* Location & Contact Section */}
          <div style={{ marginBottom: '24px' }}>
            <Title level={4}>
              <HomeOutlined style={{ marginRight: '8px' }} />
              Location & Contact
            </Title>
            <Divider style={{ margin: '12px 0' }} />
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="headquarters"
                  label="Headquarters"
                >
                  <Input placeholder="City, State/Country" />
                </Form.Item>
              </Col>
              
              <Col span={12}>
                <Form.Item
                  name="website"
                  label="Website"
                  rules={[{ type: 'url', message: 'Please enter a valid website URL' }]}
                >
                  <Input placeholder="https://example.com" />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={isLoading}
          >
            {isLoading ? 'Creating Company...' : 'Create Company'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CompanyModal;