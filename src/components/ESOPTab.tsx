import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Input, 
  Select, 
  Table, 
  Card, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Row, 
  Col,
  Typography,
  Progress,
  Divider,
  message
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  FilterOutlined, 
  SortAscendingOutlined, 
  SortDescendingOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  BarChartOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface ESOPGrant {
  id: string;
  employeeName: string;
  employeeId: string;
  position: string;
  department: string;
  grantDate: string;
  sharesGranted: number;
  vestingSchedule: '4-year' | '3-year' | '2-year' | 'custom';
  cliffPeriod: number; // in months
  vestingFrequency: 'monthly' | 'quarterly' | 'annually';
  exercisePrice: number;
  status: 'active' | 'terminated' | 'fully-vested';
  notes: string;
  performanceMetrics?: {
    kpi1?: string;
    kpi2?: string;
    kpi3?: string;
  };
}

interface ESOPTabProps {
  esopPool: number;
  esopGrants: ESOPGrant[];
  onUpdateGrant: (index: number, field: string, value: any) => void;
  onRemoveGrant: (index: number) => void;
  onAddGrant: (grant: ESOPGrant) => void;
  currentValuation: number;
  isEditable: boolean;
}

const ESOPTab: React.FC<ESOPTabProps> = ({
  esopPool,
  esopGrants,
  onUpdateGrant,
  onRemoveGrant,
  onAddGrant,
  currentValuation,
  isEditable
}) => {
  const [localGrants, setLocalGrants] = useState<ESOPGrant[]>(esopGrants);
  const [isAddingGrant, setIsAddingGrant] = useState(false);
  const [newGrant, setNewGrant] = useState<Partial<ESOPGrant>>({
    employeeName: '',
    employeeId: '',
    position: '',
    department: '',
    grantDate: new Date().toISOString().split('T')[0],
    sharesGranted: 0,
    vestingSchedule: '4-year',
    cliffPeriod: 12,
    vestingFrequency: 'monthly',
    exercisePrice: 0.01,
    status: 'active',
    notes: ''
  });
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('grantDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    setLocalGrants(esopGrants);
  }, [esopGrants]);

  const handleAddGrant = () => {
    console.log('handleAddGrant called with newGrant:', newGrant);
    
    if (!newGrant.employeeName || !newGrant.sharesGranted) {
      message.error('Employee name and shares granted are required');
      console.log('Validation failed:', { 
        employeeName: newGrant.employeeName, 
        sharesGranted: newGrant.sharesGranted 
      });
      return;
    }
    
    const grant: ESOPGrant = {
      id: `grant-${Date.now()}`,
      employeeName: newGrant.employeeName!,
      employeeId: newGrant.employeeId!,
      position: newGrant.position!,
      department: newGrant.department!,
      grantDate: newGrant.grantDate!,
      sharesGranted: newGrant.sharesGranted!,
      vestingSchedule: newGrant.vestingSchedule!,
      cliffPeriod: newGrant.cliffPeriod!,
      vestingFrequency: newGrant.vestingFrequency!,
      exercisePrice: newGrant.exercisePrice!,
      status: newGrant.status!,
      notes: newGrant.notes!,
      performanceMetrics: newGrant.performanceMetrics
    };
    
    console.log('Created grant object:', grant);
    onAddGrant(grant);
    setLocalGrants([...localGrants, grant]);
    setIsAddingGrant(false);
    setNewGrant({
      employeeName: '',
      employeeId: '',
      position: '',
      department: '',
      grantDate: new Date().toISOString().split('T')[0],
      sharesGranted: 0,
      vestingSchedule: '4-year',
      cliffPeriod: 12,
      vestingFrequency: 'monthly',
      exercisePrice: 0.01,
      status: 'active',
      notes: ''
    });
    message.success('Grant added successfully');
  };

  const calculateVestingProgress = (grant: ESOPGrant) => {
    const grantDate = new Date(grant.grantDate);
    const now = new Date();
    const monthsSinceGrant = (now.getFullYear() - grantDate.getFullYear()) * 12 + 
                            (now.getMonth() - grantDate.getMonth());
    
    let totalVestingMonths = 0;
    switch (grant.vestingSchedule) {
      case '2-year': totalVestingMonths = 24; break;
      case '3-year': totalVestingMonths = 36; break;
      case '4-year': totalVestingMonths = 48; break;
      default: totalVestingMonths = 48;
    }
    
    if (monthsSinceGrant < grant.cliffPeriod) {
      return 0; // Still in cliff period
    }
    
    const vestedMonths = Math.min(monthsSinceGrant - grant.cliffPeriod, totalVestingMonths - grant.cliffPeriod);
    const progress = (vestedMonths / (totalVestingMonths - grant.cliffPeriod)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const calculateVestedShares = (grant: ESOPGrant) => {
    const progress = calculateVestingProgress(grant);
    return Math.round((progress / 100) * grant.sharesGranted);
  };

  const calculateGrantValue = (grant: ESOPGrant) => {
    const vestedShares = calculateVestedShares(grant);
    const sharePrice = currentValuation / 10000000; // Assuming 10M total shares
    return vestedShares * sharePrice;
  };

  const filteredGrants = localGrants
    .filter(grant => {
      if (filterStatus !== 'all' && grant.status !== filterStatus) return false;
      if (searchTerm && !grant.employeeName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'employeeName':
          aValue = a.employeeName;
          bValue = b.employeeName;
          break;
        case 'sharesGranted':
          aValue = a.sharesGranted;
          bValue = b.sharesGranted;
          break;
        case 'grantDate':
          aValue = new Date(a.grantDate);
          bValue = new Date(b.grantDate);
          break;
        case 'vestingProgress':
          aValue = calculateVestingProgress(a);
          bValue = calculateVestingProgress(b);
          break;
        default:
          aValue = a.employeeName;
          bValue = b.employeeName;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const totalSharesGranted = localGrants.reduce((sum, grant) => sum + grant.sharesGranted, 0);
  const totalSharesVested = localGrants.reduce((sum, grant) => sum + calculateVestedShares(grant), 0);
  const totalGrantValue = localGrants.reduce((sum, grant) => sum + calculateGrantValue(grant), 0);
  const poolUtilization = (totalSharesGranted / 1000000) * 100; // Assuming 1M shares = 100%

  // Status tag color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'blue';
      case 'terminated': return 'red';
      case 'fully-vested': return 'green';
      default: return 'default';
    }
  };

  // Table columns for Ant Design Table
  const columns = [
    {
      title: 'Employee',
      dataIndex: 'employeeName',
      key: 'employeeName',
      render: (_: any, record: ESOPGrant) => (
        <div>
          <div><Text strong>{record.employeeName}</Text></div>
          <div><Text type="secondary">{record.employeeId}</Text></div>
        </div>
      ),
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      render: (_: any, record: ESOPGrant) => (
        <div>
          <div>{record.position}</div>
          <div><Text type="secondary">{record.department}</Text></div>
        </div>
      ),
    },
    {
      title: 'Grant Date',
      dataIndex: 'grantDate',
      key: 'grantDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Shares',
      dataIndex: 'sharesGranted',
      key: 'sharesGranted',
      render: (shares: number) => shares.toLocaleString(),
    },
    {
      title: 'Vesting Progress',
      key: 'vestingProgress',
      render: (_: any, record: ESOPGrant) => {
        const progress = calculateVestingProgress(record);
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Progress percent={Math.round(progress)} size="small" />
            <span>{progress.toFixed(1)}%</span>
          </div>
        );
      },
    },
    {
      title: 'Vested Shares',
      key: 'vestedShares',
      render: (_: any, record: ESOPGrant) => {
        const vested = calculateVestedShares(record);
        return vested.toLocaleString();
      },
    },
    {
      title: 'Value',
      key: 'value',
      render: (_: any, record: ESOPGrant) => {
        const value = calculateGrantValue(record);
        return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: ESOPGrant, index: number) => (
        <Space>
          <Button 
            type="primary" 
            danger={record.status === 'active'}
            onClick={() => onUpdateGrant(index, 'status', record.status === 'active' ? 'terminated' : 'active')}
            disabled={!isEditable}
            size="small"
          >
            {record.status === 'active' ? 'Terminate' : 'Activate'}
          </Button>
          <Button 
            danger
            onClick={() => {
              if (window.confirm('Are you sure you want to remove this grant?')) {
                onRemoveGrant(index);
                message.success('Grant removed successfully');
              }
            }}
            disabled={!isEditable}
            size="small"
          >
            Remove
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', width: '100%' }}>
      <Card style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <BarChartOutlined style={{ marginRight: '8px' }} />
          ESOP Management Dashboard
        </Title>
        <Text type="secondary">Comprehensive Employee Stock Option Plan management and analytics</Text>
      </Card>

      {/* ESOP Pool Overview */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={12}>
          <Card title="🏦 ESOP Pool Status" style={{ height: '100%' }}>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ backgroundColor: '#e6f7ff', padding: '16px', borderRadius: '8px' }}>
                  <Text type="secondary">Total Pool Size</Text>
                  <Title level={4} style={{ margin: '8px 0 0' }}>{esopPool.toFixed(1)}%</Title>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ backgroundColor: '#f6ffed', padding: '16px', borderRadius: '8px' }}>
                  <Text type="secondary">Shares Granted</Text>
                  <Title level={4} style={{ margin: '8px 0 0' }}>{totalSharesGranted.toLocaleString()}</Title>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ backgroundColor: '#fffbe6', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
                  <Text type="secondary">Pool Utilization</Text>
                  <Title level={4} style={{ margin: '8px 0 0' }}>{poolUtilization.toFixed(1)}%</Title>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ backgroundColor: '#f9f0ff', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
                  <Text type="secondary">Available Pool</Text>
                  <Title level={4} style={{ margin: '8px 0 0' }}>{Math.max(0, esopPool - poolUtilization).toFixed(1)}%</Title>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="📊 Grant Analytics" style={{ height: '100%' }}>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ backgroundColor: '#f0f5ff', padding: '16px', borderRadius: '8px' }}>
                  <Text type="secondary">Total Grants</Text>
                  <Title level={4} style={{ margin: '8px 0 0' }}>{localGrants.length}</Title>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ backgroundColor: '#e6fffb', padding: '16px', borderRadius: '8px' }}>
                  <Text type="secondary">Shares Vested</Text>
                  <Title level={4} style={{ margin: '8px 0 0' }}>{totalSharesVested.toLocaleString()}</Title>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ backgroundColor: '#fff0f6', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
                  <Text type="secondary">Total Value</Text>
                  <Title level={4} style={{ margin: '8px 0 0' }}>${totalGrantValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Title>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ backgroundColor: '#fff7e6', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
                  <Text type="secondary">Avg Grant Size</Text>
                  <Title level={4} style={{ margin: '8px 0 0' }}>{localGrants.length > 0 ? Math.round(totalSharesGranted / localGrants.length).toLocaleString() : 0}</Title>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Controls and Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setIsAddingGrant(true)}
              disabled={!isEditable}
            >
              Add New Grant
            </Button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<SearchOutlined />}
              style={{ maxWidth: '300px' }}
            />
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Select 
                value={filterStatus} 
                onChange={(value) => setFilterStatus(value)}
                style={{ width: '150px' }}
              >
                <Option value="all">All Status</Option>
                <Option value="active">Active</Option>
                <Option value="terminated">Terminated</Option>
                <Option value="fully-vested">Fully Vested</Option>
              </Select>
              
              <Select 
                value={sortBy} 
                onChange={(value) => setSortBy(value)}
                style={{ width: '180px' }}
              >
                <Option value="employeeName">Sort by Name</Option>
                <Option value="sharesGranted">Sort by Shares</Option>
                <Option value="grantDate">Sort by Date</Option>
                <Option value="vestingProgress">Sort by Progress</Option>
              </Select>
              
              <Button 
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                icon={sortOrder === 'asc' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
              >
                {sortOrder === 'asc' ? 'Asc' : 'Desc'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Add Grant Modal */}
      <Modal
        title="Add New ESOP Grant"
        open={isAddingGrant}
        onCancel={() => setIsAddingGrant(false)}
        footer={null}
        width={800}
      >
        <Form layout="vertical" style={{ marginTop: '16px' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                label="Employee Email" 
                required
                help={!newGrant.employeeName ? "Employee email is required (used for employee login)" : ""}
                validateStatus={!newGrant.employeeName ? "error" : ""}
              >
                <Input
                  placeholder="employee@company.com"
                  value={newGrant.employeeName}
                  onChange={(e) => setNewGrant({...newGrant, employeeName: e.target.value})}
                  prefix={<UserOutlined />}
                />
                <Text type="secondary" style={{ fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  This email will be used by the employee to log in to their ESOP dashboard
                </Text>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Employee ID">
                <Input
                  placeholder="Employee ID"
                  value={newGrant.employeeId}
                  onChange={(e) => setNewGrant({...newGrant, employeeId: e.target.value})}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Position">
                <Input
                  placeholder="Job title"
                  value={newGrant.position}
                  onChange={(e) => setNewGrant({...newGrant, position: e.target.value})}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Department">
                <Input
                  placeholder="Department"
                  value={newGrant.department}
                  onChange={(e) => setNewGrant({...newGrant, department: e.target.value})}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Grant Date" required>
                <Input
                  type="date"
                  value={newGrant.grantDate}
                  onChange={(e) => setNewGrant({...newGrant, grantDate: e.target.value})}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                label="Shares Granted" 
                required
                help={!newGrant.sharesGranted ? "Shares granted is required" : ""}
                validateStatus={!newGrant.sharesGranted ? "error" : ""}
              >
                <Input
                  type="number"
                  value={newGrant.sharesGranted}
                  onChange={(e) => setNewGrant({...newGrant, sharesGranted: parseInt(e.target.value) || 0})}
                  placeholder="Number of shares"
                  prefix={<DollarOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Vesting Schedule">
                <Select
                  value={newGrant.vestingSchedule}
                  onChange={(value) => setNewGrant({...newGrant, vestingSchedule: value as any})}
                >
                  <Option value="2-year">2 Years</Option>
                  <Option value="3-year">3 Years</Option>
                  <Option value="4-year">4 Years</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Cliff Period (months)">
                <Input
                  type="number"
                  value={newGrant.cliffPeriod}
                  onChange={(e) => setNewGrant({...newGrant, cliffPeriod: parseInt(e.target.value) || 0})}
                  placeholder="Cliff period"
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Vesting Frequency">
                <Select
                  value={newGrant.vestingFrequency}
                  onChange={(value) => setNewGrant({...newGrant, vestingFrequency: value as any})}
                >
                  <Option value="monthly">Monthly</Option>
                  <Option value="quarterly">Quarterly</Option>
                  <Option value="annually">Annually</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Exercise Price">
                <Input
                  type="number"
                  value={newGrant.exercisePrice}
                  onChange={(e) => setNewGrant({...newGrant, exercisePrice: parseFloat(e.target.value) || 0})}
                  placeholder="Exercise price per share"
                  prefix="$"
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item label="Notes">
            <Input.TextArea
              value={newGrant.notes}
              onChange={(e) => setNewGrant({...newGrant, notes: e.target.value})}
              placeholder="Additional notes about this grant"
              rows={3}
            />
          </Form.Item>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button onClick={() => setIsAddingGrant(false)}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              onClick={handleAddGrant}
              disabled={!newGrant.employeeName || !newGrant.sharesGranted}
            >
              Add Grant
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Grants Table */}
      <Card style={{ marginBottom: '24px' }}>
        <Table 
          dataSource={filteredGrants} 
          columns={columns} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
        {filteredGrants.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px' }}>
            <Text type="secondary">No ESOP grants found.</Text>
            <div style={{ marginTop: '16px' }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setIsAddingGrant(true)}
              >
                Add your first grant
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Vesting Timeline */}
      <Card title="📅 Vesting Timeline Overview">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {localGrants.map((grant) => {
            const vestingProgress = calculateVestingProgress(grant);
            const monthsToVest = (() => {
              switch (grant.vestingSchedule) {
                case '2-year': return 24;
                case '3-year': return 36;
                case '4-year': return 48;
                default: return 48;
              }
            })();
            
            return (
              <Card key={grant.id} style={{ borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <Text strong>{grant.employeeName}</Text>
                  <Tag>{grant.vestingSchedule}</Tag>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <Progress 
                    percent={Math.round(vestingProgress)} 
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                    style={{ flex: 1, marginRight: '16px' }}
                  />
                  <Text>{vestingProgress.toFixed(1)}%</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888' }}>
                  <span>{new Date(grant.grantDate).toLocaleDateString()}</span>
                  <span>
                    {new Date(new Date(grant.grantDate).getTime() + monthsToVest * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default ESOPTab;