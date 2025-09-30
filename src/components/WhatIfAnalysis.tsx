import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Card, Slider, InputNumber, Button, Typography, Divider, Statistic, Alert } from 'antd';
import { 
  DollarOutlined, 
  TeamOutlined, 
  BankOutlined, 
  LineChartOutlined, 
  ClockCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface WhatIfParameters {
  exitValuation: number;
  esopPool: number;
  fundingRounds: number;
  founderEquity: number;
  dilutionRate: number;
  timeToExit: number;
} 

interface WhatIfAnalysisProps {
  currentScenario: {
    founders: any[];
    esopPool: number;
    fundingRounds: any[];
    currentValuation: number;
    exitValuation: number;
  };
  onParametersChange: (params: WhatIfParameters) => void;
}

const WhatIfAnalysis: React.FC<WhatIfAnalysisProps> = ({
  currentScenario,
  onParametersChange
}) => {
  const [parameters, setParameters] = useState<WhatIfParameters>({
    exitValuation: currentScenario.exitValuation || 100000000,
    esopPool: currentScenario.esopPool || 15,
    fundingRounds: currentScenario.fundingRounds?.length || 2,
    founderEquity: 100 - (currentScenario.esopPool || 15),
    dilutionRate: 20,
    timeToExit: 5
  });

  const [activeParameter, setActiveParameter] = useState<string>('exitValuation');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Update parent component when parameters change
  useEffect(() => {
    onParametersChange(parameters);
  }, [parameters, onParametersChange]);

  // Calculate real-time projections
  const projections = useMemo(() => {
    const totalFounderEquity = parameters.founderEquity;
    const totalESOP = parameters.esopPool;
    const investorEquity = 100 - totalFounderEquity - totalESOP;
    
    // Calculate dilution over time
    const annualDilution = parameters.dilutionRate / 100;
    const yearsToExit = parameters.timeToExit;
    const totalDilution = Math.pow(1 - annualDilution, yearsToExit);
    
    // Final ownership projections
    const finalFounderEquity = totalFounderEquity * totalDilution;
    const finalESOP = totalESOP * totalDilution;
    const finalInvestorEquity = 100 - finalFounderEquity - finalESOP;
    
    // Exit value projections
    const founderExitValue = (finalFounderEquity / 100) * parameters.exitValuation;
    const esopExitValue = (finalESOP / 100) * parameters.exitValuation;
    const investorExitValue = (finalInvestorEquity / 100) * parameters.exitValuation;
    
    // Funding projections
    const avgValuationPerRound = parameters.exitValuation / (parameters.fundingRounds + 1);
    const totalFundingNeeded = avgValuationPerRound * 0.2 * parameters.fundingRounds; // Assume 20% dilution per round
    
    return {
      current: {
        founderEquity: totalFounderEquity,
        esopEquity: totalESOP,
        investorEquity: investorEquity
      },
      projected: {
        founderEquity: finalFounderEquity,
        esopEquity: finalESOP,
        investorEquity: finalInvestorEquity
      },
      exitValues: {
        founder: founderExitValue,
        esop: esopExitValue,
        investor: investorExitValue
      },
      funding: {
        totalNeeded: totalFundingNeeded,
        rounds: parameters.fundingRounds,
        avgValuation: avgValuationPerRound
      },
      timeline: {
        yearsToExit: yearsToExit,
        annualDilution: annualDilution * 100,
        totalDilution: (1 - totalDilution) * 100
      }
    };
  }, [parameters]);

  // Handle parameter changes
  const handleParameterChange = (param: keyof WhatIfParameters, value: number) => {
    setParameters(prev => {
      const newParams = { ...prev, [param]: value };
      
      // Auto-adjust related parameters
      if (param === 'esopPool') {
        newParams.founderEquity = 100 - value;
      } else if (param === 'founderEquity') {
        newParams.esopPool = 100 - value;
      }
      
      return newParams;
    });
    setActiveParameter(param);
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

  // Parameter configurations with Ant Design components
  const parameterConfigs = [
    {
      key: 'exitValuation',
      label: 'Exit Valuation',
      min: 1000000,
      max: 1000000000,
      step: 1000000,
      icon: <DollarOutlined />,
      description: 'Projected company value at exit'
    },
    {
      key: 'esopPool',
      label: 'ESOP Pool Size',
      min: 5,
      max: 30,
      step: 1,
      icon: <TeamOutlined />,
      description: 'Employee stock option pool percentage'
    },
    {
      key: 'fundingRounds',
      label: 'Funding Rounds',
      min: 0,
      max: 8,
      step: 1,
      icon: <BankOutlined />,
      description: 'Number of funding rounds before exit'
    },
    {
      key: 'dilutionRate',
      label: 'Annual Dilution Rate',
      min: 5,
      max: 50,
      step: 1,
      icon: <LineChartOutlined />,
      description: 'Expected annual ownership dilution'
    },
    {
      key: 'timeToExit',
      label: 'Time to Exit',
      min: 2,
      max: 15,
      step: 0.5,
      icon: <ClockCircleOutlined />,
      description: 'Years until expected exit'
    }
  ];

  return (
    <div className="what-if-analysis">
      <div className="what-if-header">
        <Title level={2}>🎯 What-If Analysis</Title>
        <Paragraph>Adjust parameters in real-time to see how they affect your startup's future</Paragraph>
      </div>

      <div className="what-if-container">
        <Row gutter={24}>
          {/* Interactive Parameters - Left Side */}
          <Col xs={24} lg={12}>
            <Card 
              title={<span><LineChartOutlined /> Interactive Parameters</span>} 
              className="interactive-parameters-card"
            >
              <div className="parameters-grid">
                {parameterConfigs.map((config) => (
                  <Card 
                    key={config.key}
                    className={`parameter-card ${activeParameter === config.key ? 'active' : ''}`}
                    onClick={() => setActiveParameter(config.key)}
                  >
                    <div className="parameter-header">
                      <div className="parameter-icon">
                        {config.icon}
                      </div>
                      <div className="parameter-info">
                        <Title level={5}>{config.label}</Title>
                        <Text type="secondary">{config.description}</Text>
                      </div>
                    </div>
                    
                    <div className="parameter-control">
                      <Slider
                        min={config.min}
                        max={config.max}
                        step={config.step}
                        value={parameters[config.key as keyof WhatIfParameters]}
                        onChange={(value) => handleParameterChange(config.key as keyof WhatIfParameters, value)}
                        className="parameter-slider"
                      />
                      
                      <InputNumber
                        min={config.min}
                        max={config.max}
                        step={config.step}
                        value={parameters[config.key as keyof WhatIfParameters]}
                        onChange={(value) => handleParameterChange(config.key as keyof WhatIfParameters, value || 0)}
                        className="parameter-input"
                      />
                    </div>
                  </Card>
                ))}
              </div>
              
              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <Button 
                  type="primary" 
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? 'Hide Advanced Analysis' : 'Show Advanced Analysis'}
                </Button>
              </div>
            </Card>
          </Col>

          {/* Real-Time Projections - Right Side */}
          <Col xs={24} lg={12}>
            <Card 
              title={<span><DollarOutlined /> Real-Time Projections</span>} 
              className="projections-card"
            >
              <div className="projections-content">
                {/* Current vs Projected Ownership */}
                <Card size="small" title="📊 Ownership Structure" className="ownership-card">
                  <div className="ownership-comparison">
                    <div className="comparison-row">
                      <Text strong>Founders</Text>
                      <div className="comparison-values">
                        <Text type="secondary">{projections.current.founderEquity.toFixed(1)}%</Text>
                        <Text>→</Text>
                        <Text strong>{projections.projected.founderEquity.toFixed(1)}%</Text>
                      </div>
                    </div>
                    
                    <Divider style={{ margin: '12px 0' }} />
                    
                    <div className="comparison-row">
                      <Text strong>ESOP Pool</Text>
                      <div className="comparison-values">
                        <Text type="secondary">{projections.current.esopEquity.toFixed(1)}%</Text>
                        <Text>→</Text>
                        <Text strong>{projections.projected.esopEquity.toFixed(1)}%</Text>
                      </div>
                    </div>
                    
                    <Divider style={{ margin: '12px 0' }} />
                    
                    <div className="comparison-row">
                      <Text strong>Investors</Text>
                      <div className="comparison-values">
                        <Text type="secondary">{projections.current.investorEquity.toFixed(1)}%</Text>
                        <Text>→</Text>
                        <Text strong>{projections.projected.investorEquity.toFixed(1)}%</Text>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Exit Value Projections */}
                <Card size="small" title="💰 Exit Value Distribution" className="exit-values-card">
                  <div className="exit-value-breakdown">
                    <div className="value-row">
                      <Text>Founder Payout</Text>
                      <Text strong>{formatCurrency(projections.exitValues.founder)}</Text>
                    </div>
                    <div className="value-row">
                      <Text>ESOP Value</Text>
                      <Text strong>{formatCurrency(projections.exitValues.esop)}</Text>
                    </div>
                    <div className="value-row">
                      <Text>Investor Returns</Text>
                      <Text strong>{formatCurrency(projections.exitValues.investor)}</Text>
                    </div>
                    <Divider style={{ margin: '12px 0' }} />
                    <div className="value-row total">
                      <Text strong>Total Exit Value</Text>
                      <Text strong type="success">{formatCurrency(parameters.exitValuation)}</Text>
                    </div>
                  </div>
                </Card>

                {/* Key Metrics */}
                <Card size="small" title="📈 Key Metrics" className="metrics-card">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic 
                        title="Time to Exit" 
                        value={projections.timeline.yearsToExit} 
                        suffix="years" 
                        precision={1}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic 
                        title="Total Dilution" 
                        value={projections.timeline.totalDilution} 
                        suffix="%" 
                        precision={1}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic 
                        title="Funding Rounds" 
                        value={projections.funding.rounds} 
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic 
                        title="Funding Needed" 
                        value={projections.funding.totalNeeded} 
                        formatter={formatCurrency}
                      />
                    </Col>
                  </Row>
                </Card>

                {/* Key Insights */}
                <Card size="small" title="💡 Key Insights" className="insights-card">
                  <div className="insights-list">
                    {projections.projected.founderEquity < 20 && (
                      <Alert 
                        message="⚠️ Founder ownership may drop below 20% - consider anti-dilution protection" 
                        type="warning" 
                        showIcon
                      />
                    )}
                    {projections.timeline.totalDilution > 40 && (
                      <Alert 
                        message="⚠️ High dilution expected - evaluate funding strategy" 
                        type="warning" 
                        showIcon
                      />
                    )}
                    {projections.funding.totalNeeded > parameters.exitValuation * 0.5 && (
                      <Alert 
                        message="⚠️ Funding needs exceed 50% of exit value - review business model" 
                        type="warning" 
                        showIcon
                      />
                    )}
                    {projections.projected.founderEquity > 40 && (
                      <Alert 
                        message="✅ Strong founder ownership maintained through exit" 
                        type="success" 
                        showIcon
                      />
                    )}
                    {projections.timeline.yearsToExit < 7 && (
                      <Alert 
                        message="✅ Aggressive timeline - potential for rapid growth" 
                        type="success" 
                        showIcon
                      />
                    )}
                  </div>
                </Card>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Advanced Analysis */}
        {showAdvanced && (
          <Row gutter={24} style={{ marginTop: 24 }}>
            <Col span={24}>
              <Card title="🔬 Advanced Analysis" className="advanced-analysis-card">
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Card size="small" title="📈 Dilution Timeline">
                      <div className="dilution-timeline">
                        {Array.from({ length: Math.ceil(projections.timeline.yearsToExit) }, (_, i) => {
                          const year = i + 1;
                          const cumulativeDilution = (1 - Math.pow(1 - projections.timeline.annualDilution / 100, year)) * 100;
                          const remainingEquity = 100 - cumulativeDilution;
                          
                          return (
                            <div key={year} className="timeline-year" style={{ marginBottom: 12 }}>
                              <Text strong>Year {year}</Text>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                                <Text type="secondary">Dilution: {cumulativeDilution.toFixed(1)}%</Text>
                                <Text>Remaining: {remainingEquity.toFixed(1)}%</Text>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Card size="small" title="🎯 Sensitivity Analysis">
                      <div className="sensitivity-analysis">
                        <div className="sensitivity-row" style={{ marginBottom: 16 }}>
                          <Text strong>Exit Value ±20%</Text>
                          <div style={{ marginTop: 8 }}>
                            <Text type="secondary">
                              {formatCurrency(projections.exitValues.founder * 0.8)} - {formatCurrency(projections.exitValues.founder * 1.2)}
                            </Text>
                          </div>
                        </div>
                        <div className="sensitivity-row" style={{ marginBottom: 16 }}>
                          <Text strong>Dilution ±10%</Text>
                          <div style={{ marginTop: 8 }}>
                            <Text type="secondary">
                              {(projections.projected.founderEquity * 1.1).toFixed(1)}% - {(projections.projected.founderEquity * 0.9).toFixed(1)}%
                            </Text>
                          </div>
                        </div>
                        <div className="sensitivity-row">
                          <Text strong>Timeline ±2 years</Text>
                          <div style={{ marginTop: 8 }}>
                            <Text type="secondary">
                              {Math.max(2, projections.timeline.yearsToExit - 2)} - {Math.min(15, projections.timeline.yearsToExit + 2)} years
                            </Text>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default WhatIfAnalysis;