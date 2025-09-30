import React, { useState, useEffect } from 'react';
import { Button, Card, Input, InputNumber, Row, Col, Space, Alert, message, Divider, Tag, Progress } from 'antd';
import { UserOutlined, DollarOutlined, TeamOutlined, PieChartOutlined, SaveOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';

interface Founder {
  id: string;
  name: string;
  equityPercentage: number;
  shares: number;
  role: string;
}

interface FounderConfigurationProps {
  founders: Founder[];
  esopPool: number;
  totalShares: number;
  onFoundersChange: (founders: Founder[]) => void;
  onEsopPoolChange: (esopPool: number) => void;
  onTotalSharesChange: (totalShares: number) => void;
}

const FounderConfiguration: React.FC<FounderConfigurationProps> = ({
  founders,
  esopPool,
  totalShares,
  onFoundersChange,
  onEsopPoolChange,
  onTotalSharesChange
}) => {
  const [localFounders, setLocalFounders] = useState<Founder[]>(founders);
  const [localEsopPool, setLocalEsopPool] = useState(esopPool);
  const [localTotalShares, setLocalTotalShares] = useState(totalShares);
  const [validationError, setValidationError] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Calculate total equity allocation
  const totalFounderEquity = localFounders.reduce((sum, founder) => sum + founder.equityPercentage, 0);
  const totalAllocation = totalFounderEquity + localEsopPool;

  // Validate equity allocation
  useEffect(() => {
    if (Math.abs(totalAllocation - 100) > 0.01) {
      setValidationError(`Total allocation must equal 100%. Current: ${totalAllocation.toFixed(2)}%`);
    } else {
      setValidationError('');
    }
  }, [totalAllocation]);

  // Update shares when equity percentage changes
  useEffect(() => {
    const updatedFounders = localFounders.map(founder => ({
      ...founder,
      shares: Math.round((founder.equityPercentage / 100) * localTotalShares)
    }));
    setLocalFounders(updatedFounders);
  }, [localTotalShares]);

  const addFounder = () => {
    const newFounder: Founder = {
      id: `founder-${Date.now()}`,
      name: '',
      equityPercentage: 0,
      shares: 0,
      role: 'Founder'
    };
    const updatedFounders = [...localFounders, newFounder];
    setLocalFounders(updatedFounders);
  };

  const equalSplit = () => {
    if (localFounders.length === 0) return;
    const remainingForFounders = Math.max(0, 100 - localEsopPool);
    const perFounder = remainingForFounders / localFounders.length;
    const updated = localFounders.map(f => ({
      ...f,
      equityPercentage: Number(perFounder.toFixed(2)),
      shares: Math.round((perFounder / 100) * localTotalShares)
    }));
    setLocalFounders(updated);
  };

  const distributeRemaining = () => {
    const currentTotalFounders = localFounders.reduce((s, f) => s + f.equityPercentage, 0);
    const remaining = Math.max(0, 100 - localEsopPool - currentTotalFounders);
    if (remaining <= 0 || localFounders.length === 0) return;
    const addEach = remaining / localFounders.length;
    const updated = localFounders.map(f => {
      const newPct = f.equityPercentage + addEach;
      return {
        ...f,
        equityPercentage: Number(newPct.toFixed(2)),
        shares: Math.round((newPct / 100) * localTotalShares)
      };
    });
    setLocalFounders(updated);
  };

  const removeFounder = (id: string) => {
    const updatedFounders = localFounders.filter(f => f.id !== id);
    setLocalFounders(updatedFounders);
  };

  const updateFounder = (id: string, field: keyof Founder, value: any) => {
    const updatedFounders = localFounders.map(founder => {
      if (founder.id === id) {
        const updated = { ...founder, [field]: value };
        // Recalculate shares if equity percentage changes
        if (field === 'equityPercentage') {
          updated.shares = Math.round((value / 100) * localTotalShares);
        }
        return updated;
      }
      return founder;
    });
    setLocalFounders(updatedFounders);
  };

  const handleSave = async () => {
    if (validationError) return;
    
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onFoundersChange(localFounders);
      onEsopPoolChange(localEsopPool);
      onTotalSharesChange(localTotalShares);
      
      setIsSaved(true);
      message.success('Founder configuration saved successfully!');
      setTimeout(() => setIsSaved(false), 3000); // Reset after 3 seconds
    } catch (error) {
      console.error('Save failed:', error);
      message.error('Failed to save founder configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setLocalFounders(founders);
    setLocalEsopPool(esopPool);
    setLocalTotalShares(totalShares);
    setValidationError('');
  };

  return (
    <div style={{ padding: '16px' }}>
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px' }}>
              <TeamOutlined style={{ marginRight: '8px' }} />
              Founder Configuration
            </h2>
            <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>
              Set up founders and equity distribution
            </p>
          </div>
          <Space wrap>
            <Button 
              icon={<PlusOutlined />} 
              onClick={addFounder}
              type="primary"
              size="middle"
            >
              <span style={{ display: 'none' }}>Add Founder</span>
            </Button>
            <Button onClick={equalSplit} size="middle">
              Equal Split
            </Button>
            <Button onClick={distributeRemaining} size="middle">
              Distribute Remaining
            </Button>
          </Space>
        </div>

        {validationError && (
          <Alert 
            message="Validation Error" 
            description={validationError} 
            type="error" 
            showIcon 
            style={{ marginBottom: '16px' }}
          />
        )}

        {/* Total Shares Configuration */}
        <Card size="small" title="Total Company Shares" style={{ marginBottom: '16px' }}>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12}>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ marginRight: '8px', minWidth: '140px', fontSize: '14px' }}>Total Shares Outstanding:</span>
                <InputNumber
                  value={localTotalShares}
                  onChange={(value) => setLocalTotalShares(value || 0)}
                  min={1000}
                  step={1000}
                  placeholder="e.g., 10000000"
                  style={{ width: '100%', maxWidth: '200px' }}
                  size="middle"
                />
              </div>
              <div style={{ marginTop: '6px', color: '#666', fontSize: '12px' }}>
                Common values: 10M, 100M, 1B shares
              </div>
            </Col>
          </Row>
        </Card>

        {/* Founders List */}
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ marginBottom: '12px', fontSize: '18px' }}>
            <UserOutlined style={{ marginRight: '6px' }} />
            Founders & Equity Split
          </h3>
          {localFounders.map((founder, index) => (
            <Card 
              key={founder.id} 
              size="small" 
              style={{ marginBottom: '12px' }}
              title={`Founder ${index + 1}`}
              extra={localFounders.length > 1 && (
                <Button 
                  danger 
                  size="small" 
                  onClick={() => removeFounder(founder.id)}
                >
                  Remove
                </Button>
              )}
            >
              <Row gutter={16}>
                <Col xs={24} sm={24} md={8}>
                  <div style={{ marginBottom: '6px', fontSize: '14px' }}>Name:</div>
                  <Input
                    value={founder.name}
                    onChange={(e) => updateFounder(founder.id, 'name', e.target.value)}
                    placeholder="Founder name"
                    prefix={<UserOutlined />}
                    size="middle"
                  />
                </Col>
                
                <Col xs={24} sm={24} md={8}>
                  <div style={{ marginBottom: '6px', fontSize: '14px' }}>Role:</div>
                  <Input
                    value={founder.role}
                    onChange={(e) => updateFounder(founder.id, 'role', e.target.value)}
                    placeholder="e.g., CEO, CTO"
                    size="middle"
                  />
                </Col>
                
                <Col xs={24} sm={24} md={8}>
                  <div style={{ marginBottom: '6px', fontSize: '14px' }}>Equity %:</div>
                  <InputNumber
                    value={founder.equityPercentage}
                    onChange={(value) => updateFounder(founder.id, 'equityPercentage', value || 0)}
                    min={0}
                    max={100}
                    step={0.01}
                    placeholder="0.00"
                    style={{ width: '100%' }}
                    size="middle"
                  />
                  <div style={{ marginTop: '6px', fontSize: '12px' }}>
                    Shares: {founder.shares.toLocaleString()}
                  </div>
                </Col>
              </Row>
            </Card>
          ))}
        </div>

        {/* ESOP Pool Configuration */}
        <Card size="small" title="ESOP Pool" style={{ marginBottom: '16px' }}>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12}>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ marginRight: '8px', minWidth: '140px', fontSize: '14px' }}>ESOP Pool Size (%):</span>
                <InputNumber
                  value={localEsopPool}
                  onChange={(value) => setLocalEsopPool(value || 0)}
                  min={0}
                  max={100}
                  step={0.01}
                  placeholder="0.00"
                  style={{ width: '100%', maxWidth: '200px' }}
                  size="middle"
                />
              </div>
              <div style={{ marginTop: '6px', color: '#666', fontSize: '12px' }}>
                Shares: {Math.round((localEsopPool / 100) * localTotalShares).toLocaleString()}
              </div>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <div style={{ marginTop: '16px' }}>
                <Progress 
                  percent={Math.min(100, Math.max(0, totalAllocation))} 
                  status={totalAllocation === 100 ? 'success' : 'active'}
                  size="small"
                />
              </div>
            </Col>
          </Row>
        </Card>

        {/* Validation Summary */}
        <Card size="small" title="Equity Allocation Summary" style={{ marginBottom: '16px' }}>
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span>Founders:</span>
                <span>{totalFounderEquity.toFixed(2)}%</span>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span>ESOP Pool:</span>
                <span>{localEsopPool.toFixed(2)}%</span>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px' }}>
                <span>Total:</span>
                <span style={{ color: totalAllocation === 100 ? '#52c41a' : '#faad14' }}>
                  {totalAllocation.toFixed(2)}%
                </span>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={isSaving}
            disabled={!!validationError}
            size="middle"
          >
            <span style={{ display: 'none' }}>{isSaving ? 'Saving...' : 'Save Configuration'}</span>
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleReset}
            size="middle"
          >
            <span style={{ display: 'none' }}>Reset to Original</span>
          </Button>
        </div>
      </Card>
      
      {/* Add responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .ant-card {
            margin-bottom: 12px;
          }
          
          .ant-card-body {
            padding: 16px;
          }
          
          .ant-row {
            margin: 0 !important;
          }
          
          .ant-col {
            margin-bottom: 12px;
          }
          
          .ant-btn {
            font-size: 13px !important;
          }
          
          .ant-input-number {
            width: 100% !important;
          }
        }
        
        @media (max-width: 480px) {
          .ant-card {
            margin-bottom: 8px;
          }
          
          .ant-card-body {
            padding: 12px;
          }
          
          .ant-col {
            margin-bottom: 8px;
          }
          
          .ant-btn {
            font-size: 12px !important;
            padding: 4px 8px !important;
          }
          
          .ant-typography {
            font-size: 13px !important;
          }
          
          .ant-input-number {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FounderConfiguration;