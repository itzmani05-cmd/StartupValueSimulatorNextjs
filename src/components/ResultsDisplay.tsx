import React, { useMemo } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Statistic, 
  Table, 
  Tag, 
  Divider,
  Progress
} from 'antd';
import { 
  DollarOutlined, 
  TeamOutlined, 
  BarChartOutlined, 
  UserOutlined,
  BankOutlined,
  PieChartOutlined,
  LineChartOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface Founder {
  id: string;
  name: string;
  equityPercentage: number;
  shares: number;
  role: string;
}

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

interface ResultsDisplayProps {
  founders: Founder[];
  esopPool: number;
  fundingRounds: FundingRound[];
  exitValuation: number;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  founders,
  esopPool,
  fundingRounds,
  exitValuation
}) => {
  const results = useMemo(() => {
    if (!founders || founders.length === 0) {
      return {
        totalFounderShares: 0,
        totalFounderEquity: 0,
        esopShares: 0,
        totalShares: 10000000, // Default 10M shares
        founderPayouts: [],
        totalFounderPayout: 0,
        esopPayout: 0,
        investorPayout: 0,
        capTable: [],
        fundingSummary: {
          totalRaised: 0,
          rounds: 0,
          averageValuation: 0,
          lastValuation: 0
        },
        dilutionAnalysis: {
          founderDilution: 0,
          esopDilution: 0,
          investorDilution: 0
        }
      };
    }

    const totalFounderShares = founders.reduce((sum, founder) => sum + founder.shares, 0);
    const totalFounderEquity = founders.reduce((sum, founder) => sum + founder.equityPercentage, 0);
    const esopShares = (esopPool / 100) * 10000000; // Assuming 10M total shares
    const totalShares = 10000000; // Assuming 10M total shares

    // Calculate founder payouts at exit
    const founderPayouts = founders.map(founder => {
      const exitShares = (founder.shares / totalShares) * 10000000;
      const payout = (exitShares / 10000000) * exitValuation;
      return {
        ...founder,
        exitShares,
        payout,
        ownershipAtExit: (exitShares / 10000000) * 100
      };
    });

    const totalFounderPayout = founderPayouts.reduce((sum, founder) => sum + founder.payout, 0);
    const esopPayout = (esopShares / 10000000) * exitValuation;
    const investorPayout = exitValuation - totalFounderPayout - esopPayout;

    // Cap table analysis
    const capTable = [
      ...founders.map(founder => ({
        name: founder.name,
        type: 'Founder',
        shares: founder.shares,
        percentage: (founder.shares / totalShares) * 100,
        value: (founder.shares / totalShares) * exitValuation
      })),
      {
        name: 'ESOP Pool',
        type: 'ESOP',
        shares: esopShares,
        percentage: (esopShares / totalShares) * 100,
        value: esopPayout
      }
    ];

    // Funding summary
    const totalRaised = fundingRounds.reduce((sum, round) => sum + round.capitalRaised, 0);
    const averageValuation = fundingRounds.length > 0 
      ? fundingRounds.reduce((sum, round) => sum + round.valuation, 0) / fundingRounds.length 
      : 0;
    const lastValuation = fundingRounds.length > 0 
      ? Math.max(...fundingRounds.map(r => r.valuation))
      : 0;

    // Dilution analysis
    const founderDilution = ((totalFounderEquity - (totalFounderShares / totalShares * 100)) / totalFounderEquity) * 100;
    const esopDilution = ((esopPool - (esopShares / totalShares * 100)) / esopPool) * 100;
    const investorDilution = 100 - founderDilution - esopDilution;

    return {
      totalFounderShares,
      totalFounderEquity,
      esopShares,
      totalShares,
      founderPayouts,
      totalFounderPayout,
      esopPayout,
      investorPayout,
      capTable,
      fundingSummary: {
        totalRaised,
        rounds: fundingRounds.length,
        averageValuation,
        lastValuation
      },
      dilutionAnalysis: {
        founderDilution: Math.max(0, founderDilution),
        esopDilution: Math.max(0, esopDilution),
        investorDilution: Math.max(0, investorDilution)
      }
    };
  }, [founders, esopPool, fundingRounds, exitValuation]);

  if (!founders || founders.length === 0) {
    return (
      <div style={{ padding: '24px' }}>
        <Card>
          <Title level={2}>
            <BarChartOutlined style={{ marginRight: '8px' }} />
            Results & Analysis
          </Title>
          <Text type="secondary">Configure founders and funding rounds to see detailed results</Text>
          
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📈</div>
            <Title level={3}>No Data Available</Title>
            <Text type="secondary">
              Please configure founders and funding rounds in the previous tabs to see results
            </Text>
          </div>
        </Card>
      </div>
    );
  }

  // Cap table columns
  const capTableColumns = [
    {
      title: 'Stakeholder',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'Founder' ? 'blue' : type === 'ESOP' ? 'green' : 'orange'}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Shares',
      dataIndex: 'shares',
      key: 'shares',
      render: (shares: number) => shares.toLocaleString(),
    },
    {
      title: 'Ownership %',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage: number) => `${percentage.toFixed(2)}%`,
    },
    {
      title: 'Exit Value',
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <BarChartOutlined style={{ marginRight: '8px' }} />
          Results & Analysis
        </Title>
        <Text type="secondary">Comprehensive analysis of ownership, payouts, and cap table at exit</Text>
      </Card>

      {/* Key Metrics Summary */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ height: '100%', backgroundColor: '#e6f7ff' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ fontSize: '24px', marginRight: '12px' }}>💰</div>
              <div>
                <Text type="secondary">Exit Valuation</Text>
                <Title level={4} style={{ margin: '4px 0 0' }}>
                  ${exitValuation.toLocaleString()}
                </Title>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Total company value at exit
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ height: '100%', backgroundColor: '#f6ffed' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ fontSize: '24px', marginRight: '12px' }}>👥</div>
              <div>
                <Text type="secondary">Founder Payouts</Text>
                <Title level={4} style={{ margin: '4px 0 0' }}>
                  ${results.totalFounderPayout.toLocaleString()}
                </Title>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {founders.length} founders
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ height: '100%', backgroundColor: '#fffbe6' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ fontSize: '24px', marginRight: '12px' }}>📈</div>
              <div>
                <Text type="secondary">ESOP Pool Value</Text>
                <Title level={4} style={{ margin: '4px 0 0' }}>
                  ${results.esopPayout.toLocaleString()}
                </Title>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {esopPool.toFixed(1)}% of company
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ height: '100%', backgroundColor: '#f0f5ff' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ fontSize: '24px', marginRight: '12px' }}>🏦</div>
              <div>
                <Text type="secondary">Investor Value</Text>
                <Title level={4} style={{ margin: '4px 0 0' }}>
                  ${results.investorPayout.toLocaleString()}
                </Title>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Remaining value
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Ownership Analysis */}
      <Card style={{ marginBottom: '24px' }}>
        <Title level={3}>
          <TeamOutlined style={{ marginRight: '8px' }} />
          Ownership Analysis
        </Title>
        <Text type="secondary">Current ownership structure and exit scenario analysis</Text>
        
        <Divider />
        
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Card>
              <Title level={4}>Founder Ownership</Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Total Shares:</Text>
                  <Text strong>{results.totalFounderShares.toLocaleString()}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Total Equity:</Text>
                  <Text strong>{results.totalFounderEquity.toFixed(1)}%</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Exit Value:</Text>
                  <Text strong>${results.totalFounderPayout.toLocaleString()}</Text>
                </div>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card>
              <Title level={4}>ESOP Pool</Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Pool Size:</Text>
                  <Text strong>{esopPool.toFixed(1)}%</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Total Shares:</Text>
                  <Text strong>{results.esopShares.toLocaleString()}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Exit Value:</Text>
                  <Text strong>${results.esopPayout.toLocaleString()}</Text>
                </div>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card>
              <Title level={4}>Funding Summary</Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Total Raised:</Text>
                  <Text strong>${results.fundingSummary.totalRaised.toLocaleString()}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Rounds:</Text>
                  <Text strong>{results.fundingSummary.rounds}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Last Valuation:</Text>
                  <Text strong>${results.fundingSummary.lastValuation.toLocaleString()}</Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Founder Payouts */}
      <Card style={{ marginBottom: '24px' }}>
        <Title level={3}>
          <UserOutlined style={{ marginRight: '8px' }} />
          Founder Exit Payouts
        </Title>
        <Text type="secondary">Individual founder payouts at exit valuation</Text>
        
        <Divider />
        
        <Row gutter={16}>
          {results.founderPayouts.map((founder, index) => (
            <Col xs={24} md={12} lg={8} key={founder.id}>
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <Title level={4} style={{ margin: 0 }}>{founder.name}</Title>
                    <Text type="secondary">{founder.role}</Text>
                  </div>
                  <Tag>#{index + 1}</Tag>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <Text type="secondary">Initial Equity</Text>
                    <div>{founder.equityPercentage.toFixed(1)}%</div>
                  </div>
                  <div>
                    <Text type="secondary">Shares</Text>
                    <div>{founder.shares.toLocaleString()}</div>
                  </div>
                  <div>
                    <Text type="secondary">Exit Ownership</Text>
                    <div>{founder.ownershipAtExit.toFixed(2)}%</div>
                  </div>
                  <div style={{ backgroundColor: '#f6ffed', padding: '8px', borderRadius: '4px' }}>
                    <Text type="secondary">Exit Payout</Text>
                    <div style={{ fontWeight: 'bold' }}>${founder.payout.toLocaleString()}</div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Cap Table */}
      <Card style={{ marginBottom: '24px' }}>
        <Title level={3}>
          <PieChartOutlined style={{ marginRight: '8px' }} />
          Cap Table Analysis
        </Title>
        <Text type="secondary">Complete ownership breakdown and value distribution</Text>
        
        <Divider />
        
        <Table 
          dataSource={results.capTable} 
          columns={capTableColumns} 
          pagination={false}
          rowKey={(record, index) => index?.toString() || '0'}
        />
      </Card>

      {/* Dilution Analysis */}
      <Card style={{ marginBottom: '24px' }}>
        <Title level={3}>
          <LineChartOutlined style={{ marginRight: '8px' }} />
          Dilution Analysis
        </Title>
        <Text type="secondary">Impact of funding rounds on ownership structure</Text>
        
        <Divider />
        
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <Title level={4} style={{ margin: 0 }}>Founder Dilution</Title>
                <div style={{ fontSize: '24px' }}>👥</div>
              </div>
              <Title level={2} style={{ margin: '8px 0', color: '#1890ff' }}>
                {results.dilutionAnalysis.founderDilution.toFixed(1)}%
              </Title>
              <Text type="secondary">
                Reduction in founder ownership due to funding rounds
              </Text>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <Title level={4} style={{ margin: 0 }}>ESOP Dilution</Title>
                <div style={{ fontSize: '24px' }}>📈</div>
              </div>
              <Title level={2} style={{ margin: '8px 0', color: '#52c41a' }}>
                {results.dilutionAnalysis.esopDilution.toFixed(1)}%
              </Title>
              <Text type="secondary">
                Reduction in ESOP pool size due to funding rounds
              </Text>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <Title level={4} style={{ margin: 0 }}>Investor Ownership</Title>
                <div style={{ fontSize: '24px' }}>🏦</div>
              </div>
              <Title level={2} style={{ margin: '8px 0', color: '#722ed1' }}>
                {results.dilutionAnalysis.investorDilution.toFixed(1)}%
              </Title>
              <Text type="secondary">
                Total investor ownership from funding rounds
              </Text>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Funding Rounds Impact */}
      {fundingRounds.length > 0 && (
        <Card style={{ marginBottom: '24px' }}>
          <Title level={3}>
            <BankOutlined style={{ marginRight: '8px' }} />
            Funding Rounds Impact
          </Title>
          <Text type="secondary">Detailed analysis of each funding round's effect</Text>
          
          <Divider />
          
          <Row gutter={16}>
            {fundingRounds.map((round) => {
              const preMoneyValuation = round.valuationType === 'pre-money' 
                ? round.valuation 
                : round.valuation - round.capitalRaised;
              const postMoneyValuation = round.valuationType === 'post-money' 
                ? round.valuation 
                : round.valuation + round.capitalRaised;
              const ownershipSold = (round.capitalRaised / postMoneyValuation) * 100;
              
              return (
                <Col xs={24} md={12} lg={8} key={round.id}>
                  <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <Title level={4} style={{ margin: 0 }}>{round.name}</Title>
                      <Tag color={round.roundType === 'SAFE' ? 'blue' : 'green'}>
                        {round.roundType}
                      </Tag>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary">Capital Raised:</Text>
                        <Text strong>${round.capitalRaised.toLocaleString()}</Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary">Pre-Money Valuation:</Text>
                        <Text strong>${preMoneyValuation.toLocaleString()}</Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary">Post-Money Valuation:</Text>
                        <Text strong>${postMoneyValuation.toLocaleString()}</Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f6ffed', padding: '8px', borderRadius: '4px' }}>
                        <Text type="secondary">Ownership Sold:</Text>
                        <Text strong>{ownershipSold.toFixed(2)}%</Text>
                      </div>
                    </div>
                    
                    {round.roundType === 'SAFE' && (
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <div>
                          <Text type="secondary">Valuation Cap:</Text>
                          <div>${round.valuationCap?.toLocaleString()}</div>
                        </div>
                        <div>
                          <Text type="secondary">Discount Rate:</Text>
                          <div>{round.discountRate}%</div>
                        </div>
                      </div>
                    )}
                    
                    {round.roundType === 'Priced Round' && (
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <div>
                          <Text type="secondary">Shares Issued:</Text>
                          <div>{round.sharesIssued?.toLocaleString()}</div>
                        </div>
                        <div>
                          <Text type="secondary">Share Price:</Text>
                          <div>${round.sharePrice?.toFixed(4)}</div>
                        </div>
                      </div>
                    )}
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Card>
      )}

      {/* Summary Statistics */}
      <Card>
        <Title level={3}>
          <BarChartOutlined style={{ marginRight: '8px' }} />
          Summary Statistics
        </Title>
        
        <Divider />
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', backgroundColor: '#fafafa', borderRadius: '4px' }}>
            <Text type="secondary">Total Company Shares</Text>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{results.totalShares.toLocaleString()}</div>
          </div>
          <div style={{ padding: '16px', backgroundColor: '#fafafa', borderRadius: '4px' }}>
            <Text type="secondary">Founder Equity (Initial)</Text>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{results.totalFounderEquity.toFixed(1)}%</div>
          </div>
          <div style={{ padding: '16px', backgroundColor: '#fafafa', borderRadius: '4px' }}>
            <Text type="secondary">ESOP Pool Size</Text>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{esopPool.toFixed(1)}%</div>
          </div>
          <div style={{ padding: '16px', backgroundColor: '#fafafa', borderRadius: '4px' }}>
            <Text type="secondary">Funding Rounds</Text>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{results.fundingSummary.rounds}</div>
          </div>
          <div style={{ padding: '16px', backgroundColor: '#fafafa', borderRadius: '4px' }}>
            <Text type="secondary">Total Capital Raised</Text>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>${results.fundingSummary.totalRaised.toLocaleString()}</div>
          </div>
          <div style={{ padding: '16px', backgroundColor: '#e6f7ff', borderRadius: '4px' }}>
            <Text type="secondary">Exit Valuation</Text>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>${exitValuation.toLocaleString()}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResultsDisplay;