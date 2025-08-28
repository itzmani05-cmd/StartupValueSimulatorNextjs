import React, { useState, useEffect, useMemo } from 'react';

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

  // Slider configurations
  const sliders = [
    {
      key: 'exitValuation',
      label: 'Exit Valuation',
      min: 1000000,
      max: 1000000000,
      step: 1000000,
      format: formatCurrency,
      icon: '💰',
      description: 'Projected company value at exit'
    },
    {
      key: 'esopPool',
      label: 'ESOP Pool Size',
      min: 5,
      max: 30,
      step: 1,
      format: (value: number) => `${value}%`,
      icon: '📈',
      description: 'Employee stock option pool percentage'
    },
    {
      key: 'fundingRounds',
      label: 'Funding Rounds',
      min: 0,
      max: 8,
      step: 1,
      format: (value: number) => `${value} rounds`,
      icon: '🏦',
      description: 'Number of funding rounds before exit'
    },
    {
      key: 'dilutionRate',
      label: 'Annual Dilution Rate',
      min: 5,
      max: 50,
      step: 1,
      format: (value: number) => `${value}%`,
      icon: '📉',
      description: 'Expected annual ownership dilution'
    },
    {
      key: 'timeToExit',
      label: 'Time to Exit',
      min: 2,
      max: 15,
      step: 0.5,
      format: (value: number) => `${value} years`,
      icon: '⏰',
      description: 'Years until expected exit'
    }
  ];

  return (
    <div className="what-if-analysis">
      <div className="what-if-header">
        <h2>🎯 What-If Analysis</h2>
        <p>Adjust parameters in real-time to see how they affect your startup's future</p>
      </div>

      <div className="what-if-container">
        {/* Interactive Sliders */}
        <div className="sliders-section">
          <div className="sliders-header">
            <h3>📊 Interactive Parameters</h3>
            <button 
              className={`toggle-advanced ${showAdvanced ? 'active' : ''}`}
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced
            </button>
          </div>
          
          <div className="sliders-grid">
            {sliders.map((slider) => (
              <div 
                key={slider.key} 
                className={`slider-card ${activeParameter === slider.key ? 'active' : ''}`}
                onClick={() => setActiveParameter(slider.key)}
              >
                <div className="slider-header">
                  <span className="slider-icon">{slider.icon}</span>
                  <div className="slider-info">
                    <h4>{slider.label}</h4>
                    <p>{slider.description}</p>
                  </div>
                </div>
                
                <div className="slider-control">
                  <input
                    type="range"
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    value={parameters[slider.key as keyof WhatIfParameters]}
                    onChange={(e) => handleParameterChange(
                      slider.key as keyof WhatIfParameters, 
                      parseFloat(e.target.value)
                    )}
                    className="parameter-slider"
                  />
                  
                  <div className="slider-value">
                    {slider.format(parameters[slider.key as keyof WhatIfParameters])}
                  </div>
                </div>
                
                <div className="slider-range">
                  <span className="range-min">{slider.format(slider.min)}</span>
                  <span className="range-max">{slider.format(slider.max)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-Time Projections */}
        <div className="projections-section">
          <div className="projections-header">
            <h3>🚀 Real-Time Projections</h3>
            <span className="projection-timestamp">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
          
          <div className="projections-grid">
            {/* Current vs Projected Ownership */}
            <div className="projection-card ownership">
              <h4>📊 Ownership Structure</h4>
              <div className="ownership-comparison">
                <div className="comparison-row">
                  <span className="comparison-label">Founders</span>
                  <div className="comparison-values">
                    <span className="current-value">{projections.current.founderEquity.toFixed(1)}%</span>
                    <span className="arrow">→</span>
                    <span className="projected-value">{projections.projected.founderEquity.toFixed(1)}%</span>
                  </div>
                </div>
                
                <div className="comparison-row">
                  <span className="comparison-label">ESOP Pool</span>
                  <div className="comparison-values">
                    <span className="current-value">{projections.current.esopEquity.toFixed(1)}%</span>
                    <span className="arrow">→</span>
                    <span className="projected-value">{projections.projected.esopEquity.toFixed(1)}%</span>
                  </div>
                </div>
                
                <div className="comparison-row">
                  <span className="comparison-label">Investors</span>
                  <div className="comparison-values">
                    <span className="current-value">{projections.current.investorEquity.toFixed(1)}%</span>
                    <span className="arrow">→</span>
                    <span className="projected-value">{projections.projected.investorEquity.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Exit Value Projections */}
            <div className="projection-card exit-values">
              <h4>💰 Exit Value Distribution</h4>
              <div className="exit-value-breakdown">
                <div className="value-row">
                  <span className="value-label">Founder Payout</span>
                  <span className="value-amount">{formatCurrency(projections.exitValues.founder)}</span>
                </div>
                <div className="value-row">
                  <span className="value-label">ESOP Value</span>
                  <span className="value-amount">{formatCurrency(projections.exitValues.esop)}</span>
                </div>
                <div className="value-row">
                  <span className="value-label">Investor Returns</span>
                  <span className="value-amount">{formatCurrency(projections.exitValues.investor)}</span>
                </div>
                <div className="value-row total">
                  <span className="value-label">Total Exit Value</span>
                  <span className="value-amount">{formatCurrency(parameters.exitValuation)}</span>
                </div>
              </div>
            </div>

            {/* Funding & Timeline */}
            <div className="projection-card funding-timeline">
              <h4>📅 Funding & Timeline</h4>
              <div className="timeline-metrics">
                <div className="metric-row">
                  <span className="metric-label">Total Funding Needed</span>
                  <span className="metric-value">{formatCurrency(projections.funding.totalNeeded)}</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Funding Rounds</span>
                  <span className="metric-value">{projections.funding.rounds}</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Avg Valuation per Round</span>
                  <span className="metric-value">{formatCurrency(projections.funding.avgValuation)}</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Time to Exit</span>
                  <span className="metric-value">{projections.timeline.yearsToExit} years</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Total Dilution</span>
                  <span className="metric-value">{projections.timeline.totalDilution.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="projection-card insights">
              <h4>💡 Key Insights</h4>
              <div className="insights-list">
                {projections.projected.founderEquity < 20 && (
                  <div className="insight warning">
                    ⚠️ Founder ownership may drop below 20% - consider anti-dilution protection
                  </div>
                )}
                {projections.timeline.totalDilution > 40 && (
                  <div className="insight warning">
                    ⚠️ High dilution expected - evaluate funding strategy
                  </div>
                )}
                {projections.funding.totalNeeded > parameters.exitValuation * 0.5 && (
                  <div className="insight warning">
                    ⚠️ Funding needs exceed 50% of exit value - review business model
                  </div>
                )}
                {projections.projected.founderEquity > 40 && (
                  <div className="insight success">
                    ✅ Strong founder ownership maintained through exit
                  </div>
                )}
                {projections.timeline.yearsToExit < 7 && (
                  <div className="insight success">
                    ✅ Aggressive timeline - potential for rapid growth
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Analysis */}
        {showAdvanced && (
          <div className="advanced-section">
            <div className="advanced-header">
              <h3>🔬 Advanced Analysis</h3>
              <p>Detailed breakdowns and sensitivity analysis</p>
            </div>
            
            <div className="advanced-grid">
              <div className="advanced-card">
                <h4>📈 Dilution Timeline</h4>
                <div className="dilution-timeline">
                  {Array.from({ length: Math.ceil(projections.timeline.yearsToExit) }, (_, i) => {
                    const year = i + 1;
                    const cumulativeDilution = (1 - Math.pow(1 - projections.timeline.annualDilution / 100, year)) * 100;
                    const remainingEquity = 100 - cumulativeDilution;
                    
                    return (
                      <div key={year} className="timeline-year">
                        <span className="year-label">Year {year}</span>
                        <span className="dilution-amount">{cumulativeDilution.toFixed(1)}%</span>
                        <span className="remaining-equity">{remainingEquity.toFixed(1)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="advanced-card">
                <h4>🎯 Sensitivity Analysis</h4>
                <div className="sensitivity-matrix">
                  <div className="sensitivity-row">
                    <span className="sensitivity-label">Exit Value ±20%</span>
                    <span className="sensitivity-impact">
                      {formatCurrency(projections.exitValues.founder * 0.8)} - {formatCurrency(projections.exitValues.founder * 1.2)}
                    </span>
                  </div>
                  <div className="sensitivity-row">
                    <span className="sensitivity-label">Dilution ±10%</span>
                    <span className="sensitivity-impact">
                      {(projections.projected.founderEquity * 1.1).toFixed(1)}% - {(projections.projected.founderEquity * 0.9).toFixed(1)}%
                    </span>
                  </div>
                  <div className="sensitivity-row">
                    <span className="sensitivity-label">Timeline ±2 years</span>
                    <span className="sensitivity-impact">
                      {Math.max(2, projections.timeline.yearsToExit - 2)} - {Math.min(15, projections.timeline.yearsToExit + 2)} years
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatIfAnalysis;
