import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Card, 
  Input, 
  InputNumber, 
  Select, 
  Row, 
  Col, 
  Space, 
  Alert, 
  message, 
  Divider, 
  Tag, 
  Modal, 
  Form, 
  DatePicker, 
  Typography,
  Statistic,
  List,
  Descriptions
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  FilterOutlined, 
  SortAscendingOutlined, 
  SortDescendingOutlined,
  BankOutlined,
  DollarOutlined,
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import type { DatePickerProps } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

interface FundingRound {
  id: string;
  name: string;
  roundType: 'SAFE' | 'Priced Round';
  capitalRaised: number;
  valuation: number;
  valuationType: 'pre-money' | 'post-money';
  sharesIssued?: number;
  sharePrice?: number;
  valuationCap?: number;
  discountRate?: number;
  conversionTrigger?: 'next-round' | 'exit' | 'ipo';
  investors: string[];
  date: string;
  notes: string;
}

interface FundingRoundsConfigurationProps {
  fundingRounds: FundingRound[];
  onFundingRoundsChange: (rounds: FundingRound[]) => void;
  currentValuation: number;
  onCurrentValuationChange: (valuation: number) => void;
}

const FundingRoundsConfiguration: React.FC<FundingRoundsConfigurationProps> = ({
  fundingRounds,
  onFundingRoundsChange,
  currentValuation,
  onCurrentValuationChange
}) => {
  const [localRounds, setLocalRounds] = useState<FundingRound[]>(fundingRounds);
  const [localCurrentValuation, setLocalCurrentValuation] = useState(currentValuation);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRoundId, setEditingRoundId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [form] = Form.useForm();

  useEffect(() => {
    setLocalRounds(fundingRounds);
  }, [fundingRounds]);

  useEffect(() => {
    setLocalCurrentValuation(currentValuation);
  }, [currentValuation]);

  const validateRound = (values: any): string[] => {
    const errors: string[] = [];
    
    if (!values.name?.trim()) {
      errors.push('Round name is required');
    }
    
    if (!values.capitalRaised || values.capitalRaised <= 0) {
      errors.push('Capital raised must be greater than 0');
    }
    
    if (!values.valuation || values.valuation <= 0) {
      errors.push('Valuation must be greater than 0');
    }
    
    if (values.roundType === 'Priced Round') {
      if (!values.sharesIssued || values.sharesIssued <= 0) {
        errors.push('Shares issued is required for priced rounds');
      }
      if (!values.sharePrice || values.sharePrice <= 0) {
        errors.push('Share price is required for priced rounds');
      }
    }
    
    if (values.roundType === 'SAFE') {
      if (!values.valuationCap || values.valuationCap <= 0) {
        errors.push('Valuation cap is required for SAFE rounds');
      }
      if (values.discountRate === undefined || values.discountRate < 0 || values.discountRate > 100) {
        errors.push('Discount rate must be between 0 and 100');
      }
    }
    
    if (!values.investors?.length || !values.investors[0]?.trim()) {
      errors.push('At least one investor is required');
    }
    
    return errors;
  };

  const handleFinish = (values: any) => {
    const errors = validateRound(values);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    const round: FundingRound = {
      id: editingRoundId || `round-${Date.now()}`,
      name: values.name,
      roundType: values.roundType,
      capitalRaised: values.capitalRaised,
      valuation: values.valuation,
      valuationType: values.valuationType,
      sharesIssued: values.sharesIssued,
      sharePrice: values.sharePrice,
      valuationCap: values.valuationCap,
      discountRate: values.discountRate,
      conversionTrigger: values.conversionTrigger,
      investors: values.investors.filter((inv: string) => inv.trim()),
      date: values.date.format('YYYY-MM-DD'),
      notes: values.notes
    };
    
    let updatedRounds;
    if (editingRoundId) {
      updatedRounds = localRounds.map(r => r.id === editingRoundId ? round : r);
    } else {
      updatedRounds = [...localRounds, round];
    }
    
    setLocalRounds(updatedRounds);
    onFundingRoundsChange(updatedRounds);
    setIsModalVisible(false);
    setEditingRoundId(null);
    setValidationErrors([]);
    form.resetFields();
  };

  const handleEditRound = (round: FundingRound) => {
    setEditingRoundId(round.id);
    form.setFieldsValue({
      ...round,
      date: round.date ? new Date(round.date) : null
    });
    setIsModalVisible(true);
  };

  const handleDeleteRound = (roundId: string) => {
    if (window.confirm('Are you sure you want to delete this funding round?')) {
      const updatedRounds = localRounds.filter(round => round.id !== roundId);
      setLocalRounds(updatedRounds);
      onFundingRoundsChange(updatedRounds);
      message.success('Funding round deleted successfully');
    }
  };

  const handleAddRound = () => {
    setEditingRoundId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const filteredRounds = localRounds
    .filter(round => {
      if (searchTerm && !round.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filterType !== 'all' && round.roundType !== filterType) return false;
      return true;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'capitalRaised':
          aValue = a.capitalRaised;
          bValue = b.capitalRaised;
          break;
        case 'valuation':
          aValue = a.valuation;
          bValue = b.valuation;
          break;
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const totalCapitalRaised = localRounds.reduce((sum, round) => sum + round.capitalRaised, 0);
  const averageValuation = localRounds.length > 0 ? localRounds.reduce((sum, round) => sum + round.valuation, 0) / localRounds.length : 0;

  const handleSave = async () => {
    if (validationErrors.length > 0) return;
    
    setIsSaving(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      onFundingRoundsChange(localRounds);
      onCurrentValuationChange(localCurrentValuation);
      
      setIsSaved(true);
      message.success('Funding rounds saved successfully!');
      setTimeout(() => setIsSaved(false), 3000); // Reset after 3 seconds
    } catch (error) {
      console.error('Save failed:', error);
      message.error('Failed to save funding rounds');
    } finally {
      setIsSaving(false);
    }
  };

  const roundTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'SAFE', label: 'SAFE Only' },
    { value: 'Priced Round', label: 'Priced Rounds Only' }
  ];

  const sortByOptions = [
    { value: 'date', label: 'Sort by Date' },
    { value: 'name', label: 'Sort by Name' },
    { value: 'capitalRaised', label: 'Sort by Capital' },
    { value: 'valuation', label: 'Sort by Valuation' }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <BankOutlined style={{ marginRight: '12px' }} />
          Funding Rounds Configuration
        </Title>
        <Text type="secondary">Manage your startup's funding rounds, SAFEs, and valuations</Text>
      </Card>

      {/* Summary Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Total Capital Raised" 
              value={totalCapitalRaised} 
              prefix="$" 
              formatter={(value) => Number(value).toLocaleString()} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Current Valuation" 
              value={localCurrentValuation} 
              prefix="$" 
              formatter={(value) => Number(value).toLocaleString()} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Average Valuation" 
              value={averageValuation} 
              prefix="$" 
              formatter={(value) => Number(value).toLocaleString()} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Round Distribution" 
              value={`${localRounds.filter(r => r.roundType === 'SAFE').length} SAFE / ${localRounds.filter(r => r.roundType === 'Priced Round').length} Priced`} 
            />
          </Card>
        </Col>
      </Row>

      {/* Current Valuation Input */}
      <Card style={{ marginBottom: '24px' }}>
        <Title level={4}>
          <DollarOutlined style={{ marginRight: '8px' }} />
          Current Company Valuation
        </Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
          Set the current valuation for calculations and future rounds
        </Text>
        <Row gutter={16}>
          <Col span={12}>
            <InputNumber
              value={localCurrentValuation}
              onChange={(value) => setLocalCurrentValuation(value || 0)}
              placeholder="Enter current valuation"
              min={0}
              step={1000}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value: string) => value ? Number(value.replace(/\$\s?|(,*)/g, '')) as any : 0} /* ts-ignore */
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
      </Card>

      {/* Controls and Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAddRound}
            >
              Add Funding Round
            </Button>
          </div>
          
          <Space>
            <Input
              placeholder="Search rounds..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<SearchOutlined />}
              style={{ width: '200px' }}
            />
            
            <Select 
              value={filterType} 
              onChange={(value) => setFilterType(value)}
              style={{ width: '150px' }}
            >
              {roundTypeOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
            
            <Select 
              value={sortBy} 
              onChange={(value) => setSortBy(value)}
              style={{ width: '150px' }}
            >
              {sortByOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
            
            <Button 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              icon={sortOrder === 'asc' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
            >
              {sortOrder === 'asc' ? 'Asc' : 'Desc'}
            </Button>
          </Space>
        </div>

        {/* Funding Rounds List */}
        {filteredRounds.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <BankOutlined style={{ fontSize: '48px', color: '#999', marginBottom: '16px' }} />
            <Title level={4}>No Funding Rounds Yet</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
              Start building your funding history by adding your first round
            </Text>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAddRound}
            >
              Add First Round
            </Button>
          </div>
        ) : (
          <List
            dataSource={filteredRounds}
            renderItem={round => (
              <List.Item
                actions={[
                  <Button 
                    type="primary" 
                    icon={<EditOutlined />} 
                    onClick={() => handleEditRound(round)}
                    size="small"
                  >
                    Edit
                  </Button>,
                  <Button 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={() => handleDeleteRound(round.id)}
                    size="small"
                  >
                    Delete
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{round.name}</span>
                      <Tag color={round.roundType === 'SAFE' ? 'blue' : 'green'}>
                        {round.roundType}
                      </Tag>
                    </div>
                  }
                  description={
                    <div>
                      <Descriptions size="small" column={3}>
                        <Descriptions.Item label="Date">
                          {new Date(round.date).toLocaleDateString()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Capital Raised">
                          ${round.capitalRaised.toLocaleString()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Valuation">
                          ${round.valuation.toLocaleString()}
                        </Descriptions.Item>
                        {round.roundType === 'SAFE' && (
                          <>
                            <Descriptions.Item label="Valuation Cap">
                              ${round.valuationCap?.toLocaleString()}
                            </Descriptions.Item>
                            <Descriptions.Item label="Discount Rate">
                              {round.discountRate}%
                            </Descriptions.Item>
                          </>
                        )}
                        {round.roundType === 'Priced Round' && (
                          <>
                            <Descriptions.Item label="Shares Issued">
                              {round.sharesIssued?.toLocaleString()}
                            </Descriptions.Item>
                            <Descriptions.Item label="Share Price">
                              ${round.sharePrice?.toFixed(4)}
                            </Descriptions.Item>
                          </>
                        )}
                      </Descriptions>
                      <div style={{ marginTop: '8px' }}>
                        <Text strong>Investors: </Text>
                        {round.investors.map((investor, index) => (
                          <Tag key={index} style={{ marginRight: '4px' }}>
                            {investor}
                          </Tag>
                        ))}
                      </div>
                      {round.notes && (
                        <div style={{ marginTop: '8px' }}>
                          <Text strong>Notes: </Text>
                          <Text type="secondary">{round.notes}</Text>
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* Save Button */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <Button 
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSave}
          loading={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </Button>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={() => {
            setLocalRounds(fundingRounds);
            setLocalCurrentValuation(currentValuation);
          }}
        >
          Reset
        </Button>
      </div>

      {/* Add/Edit Round Modal */}
      <Modal
        title={editingRoundId ? "Edit Funding Round" : "Add New Funding Round"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingRoundId(null);
          setValidationErrors([]);
        }}
        footer={null}
        width={800}
      >
        {validationErrors.length > 0 && (
          <Alert 
            message="Validation Errors" 
            description={
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            } 
            type="error" 
            showIcon 
            style={{ marginBottom: '16px' }}
          />
        )}
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            roundType: 'SAFE',
            valuationType: 'pre-money',
            conversionTrigger: 'next-round',
            investors: ['']
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="name"
                label="Round Name"
                rules={[{ required: true, message: 'Please input round name!' }]}
              >
                <Input placeholder="e.g., Seed Round, Series A" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="date"
                label="Round Date"
                rules={[{ required: true, message: 'Please select round date!' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="roundType"
                label="Round Type"
                rules={[{ required: true, message: 'Please select round type!' }]}
              >
                <Select>
                  <Option value="SAFE">SAFE (Simple Agreement for Future Equity)</Option>
                  <Option value="Priced Round">Priced Round (Direct Investment)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="capitalRaised"
                label="Capital Raised ($)"
                rules={[{ required: true, message: 'Please input capital raised!' }]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="Amount raised" 
                  min={0} 
                  step={1000}
                  formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value: string) => value ? Number(value.replace(/\$\s?|(,*)/g, '')) as any : 0} /* ts-ignore */
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="valuation"
                label="Valuation ($)"
                rules={[{ required: true, message: 'Please input valuation!' }]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="Valuation amount" 
                  min={0} 
                  step={1000000}
                  formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value: string) => value ? Number(value.replace(/\$\s?|(,*)/g, '')) as any : 0} /* ts-ignore */
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="valuationType"
                label="Valuation Type"
                rules={[{ required: true, message: 'Please select valuation type!' }]}
              >
                <Select>
                  <Option value="pre-money">Pre-Money Valuation</Option>
                  <Option value="post-money">Post-Money Valuation</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item noStyle dependencies={['roundType']}>
            {({ getFieldValue }) => {
              const roundType = getFieldValue('roundType');
              return (
                <>
                  {roundType === 'Priced Round' && (
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item 
                          name="sharesIssued"
                          label="Shares Issued"
                          rules={[{ required: true, message: 'Please input shares issued!' }]}
                        >
                          <InputNumber 
                            style={{ width: '100%' }} 
                            placeholder="Number of shares" 
                            min={0} 
                            step={1000}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item 
                          name="sharePrice"
                          label="Share Price ($)"
                          rules={[{ required: true, message: 'Please input share price!' }]}
                        >
                          <InputNumber 
                            style={{ width: '100%' }} 
                            placeholder="Price per share" 
                            min={0} 
                            step={0.0001}
                            formatter={(value) => `$ ${value}`}
                            parser={(value: string) => value ? Number(value.replace(/\$\s?/g, '')) as any : 0}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                  
                  {roundType === 'SAFE' && (
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item 
                          name="valuationCap"
                          label="Valuation Cap ($)"
                          rules={[{ required: true, message: 'Please input valuation cap!' }]}
                        >
                          <InputNumber 
                            style={{ width: '100%' }} 
                            placeholder="Valuation cap" 
                            min={0} 
                            step={1000000}
                            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value: string) => value ? Number(value.replace(/\$\s?|(,*)/g, '')) as any : 0} /* ts-ignore */
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item 
                          name="discountRate"
                          label="Discount Rate (%)"
                          rules={[{ required: true, message: 'Please input discount rate!' }]}
                        >
                          <InputNumber 
                            style={{ width: '100%' }} 
                            placeholder="Discount percentage" 
                            min={0} 
                            max={100}
                            step={1}
                            formatter={(value) => `${value}%`}
                            parser={(value: string) => value ? Number(value.replace('%', '')) as any : 0}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item 
                        name="conversionTrigger"
                        label="Conversion Trigger"
                        rules={[{ required: true, message: 'Please select conversion trigger!' }]}
                      >
                        <Select>
                          <Option value="next-round">Next Qualified Financing Round</Option>
                          <Option value="exit">Company Exit/Liquidity Event</Option>
                          <Option value="ipo">Initial Public Offering (IPO)</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              );
            }}
          </Form.Item>
          
          <Form.Item 
            name="investors"
            label="Investors"
            rules={[{ required: true, message: 'Please add at least one investor!' }]}
          >
            <Select 
              mode="tags" 
              placeholder="Add investors (press Enter after each)"
              tokenSeparators={[',']}
            />
          </Form.Item>
          
          <Form.Item 
            name="notes"
            label="Notes"
          >
            <Input.TextArea 
              placeholder="Additional notes about this funding round" 
              rows={3} 
            />
          </Form.Item>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button 
              onClick={() => {
                setIsModalVisible(false);
                setEditingRoundId(null);
                setValidationErrors([]);
              }}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              icon={<SaveOutlined />}
            >
              {editingRoundId ? 'Update Round' : 'Add Round'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default FundingRoundsConfiguration;
