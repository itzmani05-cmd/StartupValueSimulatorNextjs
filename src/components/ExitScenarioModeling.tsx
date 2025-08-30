import React, { useState, useMemo } from 'react';

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

  return (
    <div className="exit-scenario-modeling">
      <div className="exit-scenario-header">
        <h2>🚀 Exit Scenario Modeling</h2>
        <p>Model different exit strategies and their financial implications</p>
      </div>

      <div className="exit-scenario-container">
        {/* Portfolio Overview */}
        <div className="portfolio-overview">
          <div className="overview-header">
            <h3>📊 Portfolio Overview</h3>
            <button 
              className="add-scenario-btn"
              onClick={() => setShowAddScenario(true)}
            >
              ➕ Add Scenario
            </button>
          </div>
          
          <div className="overview-metrics">
            <div className="overview-metric">
              <span className="metric-label">Total Expected Value</span>
              <span className="metric-value">{formatCurrency(portfolioMetrics.totalExpectedValue)}</span>
            </div>
            <div className="overview-metric">
              <span className="metric-label">Average Timeline</span>
              <span className="metric-value">{portfolioMetrics.avgTimeline.toFixed(1)} years</span>
            </div>
            <div className="overview-metric">
              <span className="metric-label">Average ROI</span>
              <span className="metric-value">{portfolioMetrics.avgROI.toFixed(1)}%</span>
            </div>
            <div className="overview-metric">
              <span className="metric-label">Scenarios</span>
              <span className="metric-value">{portfolioMetrics.scenarioCount}</span>
            </div>
          </div>
        </div>

        {/* Scenario Selection & Details */}
        <div className="scenario-details">
          <div className="scenario-tabs">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                className={`scenario-tab ${selectedScenario === scenario.id ? 'active' : ''}`}
                onClick={() => setSelectedScenario(scenario.id)}
              >
                <div className="tab-header">
                  <span className="scenario-type">{scenario.type}</span>
                  <span className="scenario-probability">{scenario.probability}%</span>
                </div>
                <div className="tab-name">{scenario.name}</div>
              </button>
            ))}
          </div>

          {selectedScenarioData && (
            <div className="scenario-content">
              <div className="scenario-header">
                <h3>{selectedScenarioData.name}</h3>
                <div className="scenario-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => setEditingScenario(selectedScenarioData)}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteScenario(selectedScenarioData.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>

              <div className="scenario-metrics-grid">
                {/* Basic Metrics */}
                <div className="metric-card basic">
                  <h4>📈 Basic Metrics</h4>
                  <div className="metric-rows">
                    <div className="metric-row">
                      <span className="metric-label">Exit Valuation</span>
                      <span className="metric-value">{formatCurrency(selectedScenarioData.valuation)}</span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-label">Probability</span>
                      <span className="metric-value">{selectedScenarioData.probability}%</span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-label">Timeline</span>
                      <span className="metric-value">{selectedScenarioData.timeline} years</span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-label">Structure</span>
                      <span className="metric-value">{selectedScenarioData.structure}</span>
                    </div>
                  </div>
                </div>

                {/* Financial Impact */}
                <div className="metric-card financial">
                  <h4>💰 Financial Impact</h4>
                  <div className="metric-rows">
                    <div className="metric-row">
                      <span className="metric-label">Net After Fees</span>
                      <span className="metric-value">{formatCurrency(selectedScenarioData.netValuation)}</span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-label">After Taxes</span>
                      <span className="metric-value">{formatCurrency(selectedScenarioData.afterTaxValue)}</span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-label">ROI</span>
                      <span className="metric-value">{selectedScenarioData.roi.toFixed(1)}%</span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-label">Expected Value</span>
                      <span className="metric-value">{formatCurrency(selectedScenarioData.expectedValue)}</span>
                    </div>
                  </div>
                </div>

                {/* Payout Distribution */}
                <div className="metric-card payouts">
                  <h4>👥 Payout Distribution</h4>
                  <div className="metric-rows">
                    <div className="metric-row">
                      <span className="metric-label">Founder Payout</span>
                      <span className="metric-value">{formatCurrency(selectedScenarioData.founderPayout)}</span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-label">ESOP Payout</span>
                      <span className="metric-value">{formatCurrency(selectedScenarioData.esopPayout)}</span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-label">Investor Returns</span>
                      <span className="metric-value">{formatCurrency(selectedScenarioData.investorPayout)}</span>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="metric-card details">
                  <h4>🔍 Additional Details</h4>
                  <div className="metric-rows">
                    <div className="metric-row">
                      <span className="metric-label">Fees</span>
                      <span className="metric-value">{selectedScenarioData.fees}%</span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-label">Taxes</span>
                      <span className="metric-value">{selectedScenarioData.taxes}%</span>
                    </div>
                    {selectedScenarioData.lockupPeriod && (
                      <div className="metric-row">
                        <span className="metric-label">Lockup Period</span>
                        <span className="metric-value">{selectedScenarioData.lockupPeriod} months</span>
                      </div>
                    )}
                    {selectedScenarioData.earnout && (
                      <div className="metric-row">
                        <span className="metric-label">Earnout</span>
                        <span className="metric-value">Yes</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Scenario-specific insights */}
              <div className="scenario-insights">
                <h4>💡 Key Insights</h4>
                <div className="insights-list">
                  {selectedScenarioData.type === 'IPO' && (
                    <>
                      <div className="insight info">
                        📊 IPO typically offers highest valuation but longest timeline
                      </div>
                      <div className="insight info">
                        🔒 {selectedScenarioData.lockupPeriod} month lockup period affects liquidity
                      </div>
                    </>
                  )}
                  
                  {selectedScenarioData.type === 'Acquisition' && (
                    <>
                      <div className="insight info">
                        🤝 Strategic acquisition often provides faster exit and synergies
                      </div>
                      {selectedScenarioData.earnout && (
                        <div className="insight info">
                          📋 Earnout structure: {selectedScenarioData.earnoutTerms}
                        </div>
                      )}
                    </>
                  )}
                  
                  {selectedScenarioData.type === 'Secondary Sale' && (
                    <div className="insight info">
                      💰 Secondary sale provides liquidity without full exit
                    </div>
                  )}
                  
                  {selectedScenarioData.type === 'Merger' && (
                    <div className="insight info">
                      🔄 SPAC merger offers public listing with private company benefits
                    </div>
                  )}
                  
                  {selectedScenarioData.roi > 200 && (
                    <div className="insight success">
                      🚀 Exceptional ROI potential - strong growth trajectory
                    </div>
                  )}
                  
                  {selectedScenarioData.timeline < 5 && (
                    <div className="insight success">
                      ⚡ Fast exit timeline - rapid execution strategy
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scenario Comparison Chart */}
        <div className="scenario-comparison">
          <h3>📊 Scenario Comparison</h3>
          <div className="comparison-chart">
            <div className="chart-header">
              <span className="chart-label">Scenario</span>
              <span className="chart-label">Valuation</span>
              <span className="chart-label">Timeline</span>
              <span className="chart-label">Probability</span>
              <span className="chart-label">Expected Value</span>
            </div>
            
            {scenarioMetrics.map((scenario) => (
              <div key={scenario.id} className="chart-row">
                <span className="scenario-name">{scenario.name}</span>
                <span className="scenario-valuation">{formatCurrency(scenario.valuation)}</span>
                <span className="scenario-timeline">{scenario.timeline} years</span>
                <span className="scenario-probability">{scenario.probability}%</span>
                <span className="scenario-expected">{formatCurrency(scenario.expectedValue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Scenario Modal */}
      {(showAddScenario || editingScenario) && (
        <div className="scenario-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingScenario ? 'Edit Exit Scenario' : 'Add New Exit Scenario'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowAddScenario(false);
                  setEditingScenario(null);
                }}
              >
                ✕
              </button>
            </div>
            
            <ScenarioForm
              scenario={editingScenario}
              onSave={editingScenario ? handleScenarioUpdate : handleAddScenario}
              onCancel={() => {
                setShowAddScenario(false);
                setEditingScenario(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Scenario Form Component
interface ScenarioFormProps {
  scenario?: ExitScenario | null;
  onSave: (scenario: ExitScenario) => void;
  onCancel: () => void;
}

const ScenarioForm: React.FC<ScenarioFormProps> = ({ scenario, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<ExitScenario, 'id'>>({
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
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (scenario) {
      onSave({ ...scenario, ...formData });
    } else {
      onSave(formData as ExitScenario);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="scenario-form">
      <div className="form-grid">
        <div className="form-group">
          <label>Scenario Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="e.g., Strategic Acquisition by Tech Giant"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Exit Type *</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value as any})}
            required
          >
            <option value="IPO">IPO</option>
            <option value="Acquisition">Acquisition</option>
            <option value="Secondary Sale">Secondary Sale</option>
            <option value="Merger">Merger</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Probability (%) *</label>
          <input
            type="number"
            value={formData.probability}
            onChange={(e) => setFormData({...formData, probability: parseInt(e.target.value)})}
            min="1"
            max="100"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Timeline (years) *</label>
          <input
            type="number"
            value={formData.timeline}
            onChange={(e) => setFormData({...formData, timeline: parseInt(e.target.value)})}
            min="1"
            max="20"
            step="0.5"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Exit Valuation ($) *</label>
          <input
            type="number"
            value={formData.valuation}
            onChange={(e) => setFormData({...formData, valuation: parseInt(e.target.value)})}
            min="1000000"
            step="1000000"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Structure *</label>
          <select
            value={formData.structure}
            onChange={(e) => setFormData({...formData, structure: e.target.value as any})}
            required
          >
            <option value="Cash">Cash</option>
            <option value="Stock">Stock</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Fees (%)</label>
          <input
            type="number"
            value={formData.fees}
            onChange={(e) => setFormData({...formData, fees: parseInt(e.target.value)})}
            min="0"
            max="20"
            step="0.1"
          />
        </div>
        
        <div className="form-group">
          <label>Taxes (%)</label>
          <input
            type="number"
            value={formData.taxes}
            onChange={(e) => setFormData({...formData, taxes: parseInt(e.target.value)})}
            min="0"
            max="50"
            step="0.1"
          />
        </div>
        
        {formData.type === 'IPO' && (
          <div className="form-group">
            <label>Lockup Period (months)</label>
            <input
              type="number"
              value={formData.lockupPeriod || ''}
              onChange={(e) => setFormData({...formData, lockupPeriod: parseInt(e.target.value) || undefined})}
              min="0"
              max="365"
            />
          </div>
        )}
        
        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              checked={formData.earnout}
              onChange={(e) => setFormData({...formData, earnout: e.target.checked})}
            />
            Include Earnout
          </label>
        </div>
        
        {formData.earnout && (
          <div className="form-group full-width">
            <label>Earnout Terms</label>
            <textarea
              value={formData.earnoutTerms}
              onChange={(e) => setFormData({...formData, earnoutTerms: e.target.value})}
              placeholder="Describe earnout structure and terms..."
              rows={3}
            />
          </div>
        )}
      </div>
      
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        <button type="submit" className="save-btn">
          {scenario ? 'Update Scenario' : 'Add Scenario'}
        </button>
      </div>
    </form>
  );
};

export default ExitScenarioModeling;






