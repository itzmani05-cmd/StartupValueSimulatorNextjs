import React, { useState, useMemo } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Input, 
  InputNumber, 
  Select, 
  Switch, 
  Button, 
  Typography, 
  Statistic, 
  Divider, 
  Space, 
  Badge, 
  Modal, 
  Form, 
  Tabs, 
  Tag, 
  Alert,
  List,
  Descriptions
} from 'antd';
import { 
  RocketOutlined, 
  DollarCircleOutlined, 
  TeamOutlined, 
  ClockCircleOutlined,
  PercentageOutlined,
  FileTextOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface ExitScenario {
  id: string;
  name: string;
  type: 'IPO' | 'Acquisition' | 'Secondary Sale' | 'Merger';
  probability: number;
  timeline: number; // years
  valuation: number;
  structure: 'Cash' | 'Stock' | 'Mixed';
  fees: number; // percentage
  taxes: number; // percentage
  lockupPeriod?: number; // months
  earnout?: boolean;
  earnoutTerms?: string;
}

interface ExitScenarioModelingProps {
  currentValuation: number;
  founders: any[];
  esopPool: number;
  fundingRounds: any[];
  onScenarioChange: (scenarios: ExitScenario[]) => void;
}

const ExitScenarioModeling: React.FC<ExitScenarioModelingProps> = ({
  currentValuation,
  founders,
  esopPool,
  fundingRounds,
  onScenarioChange
}) => {
  const [scenarios, setScenarios] = useState<ExitScenario[]>([
    {
      id: 'ipo-1',
      name: 'Traditional IPO',
      type: 'IPO',
      probability: 25,
      timeline: 7,
      valuation: currentValuation * 3,
      structure: 'Stock',
      fees: 7,
      taxes: 20,
      lockupPeriod: 180
    },
    {
      id: 'acquisition-1',
      name: 'Strategic Acquisition',
      type: 'Acquisition',
      probability: 40,
      timeline: 5,
      valuation: currentValuation * 2.5,
      structure: 'Mixed',
      fees: 3,
      taxes: 15,
      earnout: true,
      earnoutTerms: '2-year earnout based on performance'
    },
    {
      id: 'secondary-1',
      name: 'Secondary Sale',
      type: 'Secondary Sale',
      probability: 20,
      timeline: 4,
      valuation: currentValuation * 1.8,
      structure: 'Cash',
      fees: 2,
      taxes: 25
    },
    {
      id: 'spac-1',
      name: 'SPAC Merger',
      type: 'Merger',
      probability: 15,
      timeline: 6,
      valuation: currentValuation * 2.2,
      structure: 'Stock',
      fees: 5,
      taxes: 20,
      lockupPeriod: 90
    }
  ]);

  const [selectedScenario, setSelectedScenario] = useState<string>('ipo-1');
  const [showAddScenario, setShowAddScenario] = useState(false);
  const [editingScenario, setEditingScenario] = useState<ExitScenario | null>(null);
  const [form] = Form.useForm();

  // Calculate scenario metrics
  const scenarioMetrics = useMemo(() => {
    return scenarios.map(scenario => {
      const netValuation = scenario.valuation * (1 - scenario.fees / 100);
      const afterTaxValue = netValuation * (1 - scenario.taxes / 100);
      
      // Calculate founder payouts
      const founderEquity = 100 - esopPool;
      const founderPayout = (founderEquity / 100) * afterTaxValue;
      const esopPayout = (esopPool / 100) * afterTaxValue;
      const investorPayout = afterTaxValue - founderPayout - esopPayout;
      
      // Calculate expected value (probability weighted)
      const expectedValue = afterTaxValue * (scenario.probability / 100);
      
      return {
        ...scenario,
        netValuation,
        afterTaxValue,
        founderPayout,
        esopPayout,
        investorPayout,
        expectedValue,
        roi: ((afterTaxValue - currentValuation) / currentValuation) * 100
      };
    });
  }, [scenarios, esopPool, currentValuation]);

  // Calculate portfolio metrics
  const portfolioMetrics = useMemo(() => {
    const totalExpectedValue = scenarioMetrics.reduce((sum, s) => sum + s.expectedValue, 0);
    const avgTimeline = scenarioMetrics.reduce((sum, s) => sum + s.timeline, 0) / scenarioMetrics.length;
    const avgROI = scenarioMetrics.reduce((sum, s) => sum + s.roi, 0) / scenarioMetrics.length;
    
    return {
      totalExpectedValue,
      avgTimeline,
      avgROI,
      scenarioCount: scenarios.length
    };
  }, [scenarioMetrics, scenarios]);

  // Handle scenario updates
  const handleScenarioUpdate = (updatedScenario: ExitScenario) => {
    const updatedScenarios = scenarios.map(s => 
      s.id === updatedScenario.id ? updatedScenario : s
    );
    setScenarios(updatedScenarios);
    onScenarioChange(updatedScenarios);
  };

  // Add new scenario
  const handleAddScenario = (newScenario: Omit<ExitScenario, 'id'>) => {
    const scenario: ExitScenario = {
      ...newScenario,
      id: `scenario-${Date.now()}`
    };
    const updatedScenarios = [...scenarios, scenario];
    setScenarios(updatedScenarios);
    onScenarioChange(updatedScenarios);
    setShowAddScenario(false);
  };

  // Delete scenario
  const handleDeleteScenario = (scenarioId: string) => {
    if (window.confirm('Are you sure you want to delete this exit scenario?')) {
      const updatedScenarios = scenarios.filter(s => s.id !== scenarioId);
      setScenarios(updatedScenarios);
      onScenarioChange(updatedScenarios);
      if (selectedScenario === scenarioId) {
        setSelectedScenario(updatedScenarios[0]?.id || '');
      }
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const selectedScenarioData = scenarioMetrics.find(s => s.id === selectedScenario);

  // Get scenario type color
  const getScenarioTypeColor = (type: string) => {
    switch (type) {
      case 'IPO': return 'blue';
      case 'Acquisition': return 'green';
      case 'Secondary Sale': return 'orange';
      case 'Merger': return 'purple';
      default: return 'default';
    }
  };

  // Get scenario insights
  const getScenarioInsights = (scenario: any) => {
    const insights = [];
    
    if (scenario.type === 'IPO') {
      insights.push({
        type: 'info',
        message: 'IPO typically offers highest valuation but longest timeline',
        icon: <InfoCircleOutlined />
      });
      if (scenario.lockupPeriod) {
        insights.push({
          type: 'info',
          message: `${scenario.lockupPeriod} month lockup period affects liquidity`,
          icon: <ClockCircleOutlined />
        });
      }
    }
    
    if (scenario.type === 'Acquisition') {
      insights.push({
        type: 'info',
        message: 'Strategic acquisition often provides faster exit and synergies',
        icon: <ThunderboltOutlined />
      });
      if (scenario.earnout) {
        insights.push({
          type: 'info',
          message: `Earnout structure: ${scenario.earnoutTerms}`,
          icon: <FileTextOutlined />
        });
      }
    }
    
    if (scenario.type === 'Secondary Sale') {
      insights.push({
        type: 'info',
        message: 'Secondary sale provides liquidity without full exit',
        icon: <DollarCircleOutlined />
      });
    }
    
    if (scenario.type === 'Merger') {
      insights.push({
        type: 'info',
        message: 'SPAC merger offers public listing with private company benefits',
        icon: <RocketOutlined />
      });
    }
    
    if (scenario.roi > 200) {
      insights.push({
        type: 'success',
        message: 'Exceptional ROI potential - strong growth trajectory',
        icon: <CheckCircleOutlined />
      });
    }
    
    if (scenario.timeline < 5) {
      insights.push({
        type: 'success',
        message: 'Fast exit timeline - rapid execution strategy',
        icon: <ThunderboltOutlined />
      });
    }
    
    return insights;
  };

  return (
    <div className="exit-scenario-modeling">
      <Card 
        title={
          <Space>
            <RocketOutlined />
            <span>Exit Scenario Modeling</span>
          </Space>
        }
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setShowAddScenario(true)}
          >
            Add Scenario
          </Button>
        }
      >
        <Text type="secondary">
          Model different exit strategies and their financial implications
        </Text>
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: 24, marginTop: 24 }}>
        <Col xs={24} md={6}>
          <Card title="Portfolio Overview" style={{ height: '100%' }}>
            <Statistic 
              title="Total Expected Value" 
              value={formatCurrency(portfolioMetrics.totalExpectedValue)} 
              precision={0}
            />
            <Divider style={{ margin: '16px 0' }} />
            <Row gutter={16}>
              <Col span={12}>
                <Statistic 
                  title="Avg Timeline" 
                  value={portfolioMetrics.avgTimeline} 
                  precision={1}
                  suffix="years"
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="Avg ROI" 
                  value={portfolioMetrics.avgROI} 
                  precision={1}
                  suffix="%"
                />
              </Col>
            </Row>
            <Divider style={{ margin: '16px 0' }} />
            <Statistic 
              title="Scenarios" 
              value={portfolioMetrics.scenarioCount} 
            />
          </Card>
        </Col>

        <Col xs={24} md={18}>
          <Card 
            title="Scenario Comparison" 
            style={{ height: '100%' }}
          >
            <List
              dataSource={scenarioMetrics}
              renderItem={scenario => {
                const metrics = scenarioMetrics.find(s => s.id === scenario.id);
                return (
                  <List.Item
                    actions={[
                      <Button 
                        type="text" 
                        icon={<EditOutlined />} 
                        onClick={() => setEditingScenario(scenario)}
                      />,
                      <Button 
                        type="text" 
                        icon={<DeleteOutlined />} 
                        onClick={() => handleDeleteScenario(scenario.id)}
                        danger
                      />
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <Tag color={getScenarioTypeColor(scenario.type)}>
                            {scenario.type}
                          </Tag>
                          <span>{scenario.name}</span>
                        </Space>
                      }
                      description={
                        <Space size="large" wrap>
                          <span>Valuation: {formatCurrency(scenario.valuation)}</span>
                          <span>Timeline: {scenario.timeline} years</span>
                          <span>Probability: {scenario.probability}%</span>
                          <span>Expected: {formatCurrency(metrics?.expectedValue || 0)}</span>
                        </Space>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>
      </Row>

      <Card 
        title={
          <Space>
            <TeamOutlined />
            <span>Scenario Details</span>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Tabs 
          activeKey={selectedScenario} 
          onChange={setSelectedScenario}
          type="card"
        >
          {scenarios.map(scenario => {
            const metrics = scenarioMetrics.find(s => s.id === scenario.id);
            return (
              <TabPane
                tab={
                  <Space>
                    <Tag color={getScenarioTypeColor(scenario.type)}>
                      {scenario.type}
                    </Tag>
                    <span>{scenario.name}</span>
                    <Badge count={`${scenario.probability}%`} />
                  </Space>
                }
                key={scenario.id}
              >
                {metrics && (
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <Card size="small" title="Basic Metrics">
                        <Descriptions column={1} size="small">
                          <Descriptions.Item label="Exit Valuation">
                            {formatCurrency(metrics.valuation)}
                          </Descriptions.Item>
                          <Descriptions.Item label="Probability">
                            {metrics.probability}%
                          </Descriptions.Item>
                          <Descriptions.Item label="Timeline">
                            {metrics.timeline} years
                          </Descriptions.Item>
                          <Descriptions.Item label="Structure">
                            {metrics.structure}
                          </Descriptions.Item>
                        </Descriptions>
                      </Card>
                    </Col>

                    <Col xs={24} md={12}>
                      <Card size="small" title="Financial Impact">
                        <Descriptions column={1} size="small">
                          <Descriptions.Item label="Net After Fees">
                            {formatCurrency(metrics.netValuation)}
                          </Descriptions.Item>
                          <Descriptions.Item label="After Taxes">
                            {formatCurrency(metrics.afterTaxValue)}
                          </Descriptions.Item>
                          <Descriptions.Item label="ROI">
                            {metrics.roi.toFixed(1)}%
                          </Descriptions.Item>
                          <Descriptions.Item label="Expected Value">
                            {formatCurrency(metrics.expectedValue)}
                          </Descriptions.Item>
                        </Descriptions>
                      </Card>
                    </Col>

                    <Col xs={24} md={12}>
                      <Card size="small" title="Payout Distribution">
                        <Descriptions column={1} size="small">
                          <Descriptions.Item label="Founder Payout">
                            <span style={{ color: '#52c41a' }}>{formatCurrency(metrics.founderPayout)}</span>
                          </Descriptions.Item>
                          <Descriptions.Item label="ESOP Payout">
                            <span style={{ color: '#1890ff' }}>{formatCurrency(metrics.esopPayout)}</span>
                          </Descriptions.Item>
                          <Descriptions.Item label="Investor Returns">
                            <span style={{ color: '#fa8c16' }}>{formatCurrency(metrics.investorPayout)}</span>
                          </Descriptions.Item>
                        </Descriptions>
                      </Card>
                    </Col>

                    <Col xs={24} md={12}>
                      <Card size="small" title="Additional Details">
                        <Descriptions column={1} size="small">
                          <Descriptions.Item label="Fees">
                            {metrics.fees}%
                          </Descriptions.Item>
                          <Descriptions.Item label="Taxes">
                            {metrics.taxes}%
                          </Descriptions.Item>
                          {metrics.lockupPeriod && (
                            <Descriptions.Item label="Lockup Period">
                              {metrics.lockupPeriod} months
                            </Descriptions.Item>
                          )}
                          {metrics.earnout && (
                            <Descriptions.Item label="Earnout">
                              Yes
                            </Descriptions.Item>
                          )}
                        </Descriptions>
                      </Card>
                    </Col>

                    <Col xs={24}>
                      <Card size="small" title="Key Insights">
                        {getScenarioInsights(metrics).map((insight: any, index: number) => (
                          <Alert
                            key={index}
                            message={insight.message}
                            type={insight.type as any}
                            showIcon
                            icon={insight.icon}
                            style={{ marginBottom: 8 }}
                          />
                        ))}
                      </Card>
                    </Col>
                  </Row>
                )}
              </TabPane>
            );
          })}
        </Tabs>
      </Card>

      {/* Add/Edit Scenario Modal */}
      <ScenarioModal
        visible={showAddScenario || !!editingScenario}
        scenario={editingScenario}
        onCancel={() => {
          setShowAddScenario(false);
          setEditingScenario(null);
          form.resetFields();
        }}
        onSave={(scenarioData: any) => {
          if (editingScenario) {
            handleScenarioUpdate({ ...editingScenario, ...scenarioData });
          } else {
            handleAddScenario(scenarioData);
          }
          setShowAddScenario(false);
          setEditingScenario(null);
          form.resetFields();
        }}
        form={form}
      />
    </div>
  );
};

// Scenario Modal Component
interface ScenarioModalProps {
  visible: boolean;
  scenario?: ExitScenario | null;
  onCancel: () => void;
  onSave: (scenario: any) => void;
  form: any;
}

const ScenarioModal: React.FC<ScenarioModalProps> = ({ 
  visible, 
  scenario, 
  onCancel, 
  onSave,
  form
}) => {
  const [includeEarnout, setIncludeEarnout] = useState(!!scenario?.earnout);
  const [scenarioType, setScenarioType] = useState(scenario?.type || 'IPO');

  const handleFinish = (values: any) => {
    onSave(values);
  };

  return (
    <Modal
      title={scenario ? "Edit Exit Scenario" : "Add New Exit Scenario"}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          name: scenario?.name || '',
          type: scenario?.type || 'IPO',
          probability: scenario?.probability || 25,
          timeline: scenario?.timeline || 5,
          valuation: scenario?.valuation || 100000000,
          structure: scenario?.structure || 'Stock',
          fees: scenario?.fees || 5,
          taxes: scenario?.taxes || 20,
          lockupPeriod: scenario?.lockupPeriod,
          earnout: scenario?.earnout || false,
          earnoutTerms: scenario?.earnoutTerms || ''
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Scenario Name"
              rules={[{ required: true, message: 'Please input scenario name!' }]}
            >
              <Input placeholder="e.g., Strategic Acquisition by Tech Giant" />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="type"
              label="Exit Type"
              rules={[{ required: true, message: 'Please select exit type!' }]}
            >
              <Select onChange={(value) => setScenarioType(value)}>
                <Option value="IPO">IPO</Option>
                <Option value="Acquisition">Acquisition</Option>
                <Option value="Secondary Sale">Secondary Sale</Option>
                <Option value="Merger">Merger</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="probability"
              label="Probability (%)"
              rules={[{ required: true, message: 'Please input probability!' }]}
            >
              <InputNumber min={1} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="timeline"
              label="Timeline (years)"
              rules={[{ required: true, message: 'Please input timeline!' }]}
            >
              <InputNumber min={1} max={20} step={0.5} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="valuation"
              label="Exit Valuation ($)"
              rules={[{ required: true, message: 'Please input valuation!' }]}
            >
              <InputNumber 
                min={1000000} 
                step={1000000} 
                style={{ width: '100%' }} 
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value ? value.replace(/\$\s?|(,*)/g, '') : ''}
              />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="structure"
              label="Structure"
              rules={[{ required: true, message: 'Please select structure!' }]}
            >
              <Select>
                <Option value="Cash">Cash</Option>
                <Option value="Stock">Stock</Option>
                <Option value="Mixed">Mixed</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="fees"
              label="Fees (%)"
            >
              <InputNumber min={0} max={20} step={0.1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="taxes"
              label="Taxes (%)"
            >
              <InputNumber min={0} max={50} step={0.1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          {scenarioType === 'IPO' && (
            <Col span={12}>
              <Form.Item
                name="lockupPeriod"
                label="Lockup Period (months)"
              >
                <InputNumber min={0} max={365} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          )}
          
          <Col span={24}>
            <Form.Item 
              name="earnout" 
              label="Include Earnout" 
              valuePropName="checked"
            >
              <Switch onChange={(checked) => setIncludeEarnout(checked)} />
            </Form.Item>
          </Col>
          
          {includeEarnout && (
            <Col span={24}>
              <Form.Item
                name="earnoutTerms"
                label="Earnout Terms"
              >
                <Input.TextArea 
                  placeholder="Describe earnout structure and terms..." 
                  rows={3} 
                />
              </Form.Item>
            </Col>
          )}
        </Row>
        
        <Form.Item style={{ textAlign: 'right', marginTop: 24 }}>
          <Space>
            <Button onClick={onCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {scenario ? 'Update Scenario' : 'Add Scenario'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExitScenarioModeling;