import React, { useMemo } from 'react';

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
      <div className="results-display">
        <div className="results-header">
          <h2>📊 Results & Analysis</h2>
          <p>Configure founders and funding rounds to see detailed results</p>
        </div>
        <div className="empty-results">
          <div className="empty-icon">📈</div>
          <h3>No Data Available</h3>
          <p>Please configure founders and funding rounds in the previous tabs to see results</p>
        </div>
      </div>
    );
  }

  return (
    <div className="results-display">
      <div className="results-header">
        <h2>📊 Results & Analysis</h2>
        <p>Comprehensive analysis of ownership, payouts, and cap table at exit</p>
      </div>

      {/* Key Metrics Summary */}
      <div className="metrics-summary">
        <div className="metric-card primary">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>Exit Valuation</h3>
            <div className="metric-value">${exitValuation.toLocaleString()}</div>
            <div className="metric-subtitle">Total company value at exit</div>
          </div>
        </div>
        
        <div className="metric-card success">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>Founder Payouts</h3>
            <div className="metric-value">${results.totalFounderPayout.toLocaleString()}</div>
            <div className="metric-subtitle">{founders.length} founders</div>
          </div>
        </div>
        
        <div className="metric-card warning">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <h3>ESOP Pool Value</h3>
            <div className="metric-value">${results.esopPayout.toLocaleString()}</div>
            <div className="metric-subtitle">{esopPool.toFixed(1)}% of company</div>
          </div>
        </div>
        
        <div className="metric-card info">
          <div className="metric-icon">🏦</div>
          <div className="metric-content">
            <h3>Investor Value</h3>
            <div className="metric-value">${results.investorPayout.toLocaleString()}</div>
            <div className="metric-subtitle">Remaining value</div>
          </div>
        </div>
      </div>

      {/* Ownership Analysis */}
      <div className="analysis-section">
        <div className="section-header">
          <h3>🎯 Ownership Analysis</h3>
          <p>Current ownership structure and exit scenario analysis</p>
        </div>
        
        <div className="ownership-grid">
          <div className="ownership-card">
            <h4>Founder Ownership</h4>
            <div className="ownership-stats">
              <div className="stat-row">
                <span className="stat-label">Total Shares:</span>
                <span className="stat-value">{results.totalFounderShares.toLocaleString()}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Total Equity:</span>
                <span className="stat-value">{results.totalFounderEquity.toFixed(1)}%</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Exit Value:</span>
                <span className="stat-value">${results.totalFounderPayout.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="ownership-card">
            <h4>ESOP Pool</h4>
            <div className="ownership-stats">
              <div className="stat-row">
                <span className="stat-label">Pool Size:</span>
                <span className="stat-value">{esopPool.toFixed(1)}%</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Total Shares:</span>
                <span className="stat-value">{results.esopShares.toLocaleString()}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Exit Value:</span>
                <span className="stat-value">${results.esopPayout.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="ownership-card">
            <h4>Funding Summary</h4>
            <div className="ownership-stats">
              <div className="stat-row">
                <span className="stat-label">Total Raised:</span>
                <span className="stat-value">${results.fundingSummary.totalRaised.toLocaleString()}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Rounds:</span>
                <span className="stat-value">{results.fundingSummary.rounds}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Last Valuation:</span>
                <span className="stat-value">${results.fundingSummary.lastValuation.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Founder Payouts */}
      <div className="analysis-section">
        <div className="section-header">
          <h3>👥 Founder Exit Payouts</h3>
          <p>Individual founder payouts at exit valuation</p>
        </div>
        
        <div className="founder-payouts">
          {results.founderPayouts.map((founder, index) => (
            <div key={founder.id} className="founder-payout-card">
              <div className="founder-header">
                <div className="founder-info">
                  <h4>{founder.name}</h4>
                  <span className="founder-role">{founder.role}</span>
                </div>
                <div className="founder-rank">#{index + 1}</div>
              </div>
              
              <div className="founder-metrics">
                <div className="metric-grid">
                  <div className="metric-item">
                    <span className="metric-label">Initial Equity</span>
                    <span className="metric-value">{founder.equityPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Shares</span>
                    <span className="metric-value">{founder.shares.toLocaleString()}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Exit Ownership</span>
                    <span className="metric-value">{founder.ownershipAtExit.toFixed(2)}%</span>
                  </div>
                  <div className="metric-item highlight">
                    <span className="metric-label">Exit Payout</span>
                    <span className="metric-value">${founder.payout.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cap Table */}
      <div className="analysis-section">
        <div className="section-header">
          <h3>📋 Cap Table Analysis</h3>
          <p>Complete ownership breakdown and value distribution</p>
        </div>
        
        <div className="cap-table-container">
          <table className="cap-table">
            <thead>
              <tr>
                <th>Stakeholder</th>
                <th>Type</th>
                <th>Shares</th>
                <th>Ownership %</th>
                <th>Exit Value</th>
              </tr>
            </thead>
            <tbody>
              {results.capTable.map((stakeholder, index) => (
                <tr key={index} className={`stakeholder-row ${stakeholder.type.toLowerCase()}`}>
                  <td className="stakeholder-name">{stakeholder.name}</td>
                  <td className="stakeholder-type">
                    <span className={`type-badge type-${stakeholder.type.toLowerCase()}`}>
                      {stakeholder.type}
                    </span>
                  </td>
                  <td className="stakeholder-shares">{stakeholder.shares.toLocaleString()}</td>
                  <td className="stakeholder-percentage">{stakeholder.percentage.toFixed(2)}%</td>
                  <td className="stakeholder-value">${stakeholder.value.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dilution Analysis */}
      <div className="analysis-section">
        <div className="section-header">
          <h3>📉 Dilution Analysis</h3>
          <p>Impact of funding rounds on ownership structure</p>
        </div>
        
        <div className="dilution-grid">
          <div className="dilution-card">
            <div className="dilution-header">
              <h4>Founder Dilution</h4>
              <div className="dilution-icon">👥</div>
            </div>
            <div className="dilution-value">{results.dilutionAnalysis.founderDilution.toFixed(1)}%</div>
            <div className="dilution-description">
              Reduction in founder ownership due to funding rounds
            </div>
          </div>
          
          <div className="dilution-card">
            <div className="dilution-header">
              <h4>ESOP Dilution</h4>
              <div className="dilution-icon">📈</div>
            </div>
            <div className="dilution-value">{results.dilutionAnalysis.esopDilution.toFixed(1)}%</div>
            <div className="dilution-description">
              Reduction in ESOP pool size due to funding rounds
            </div>
          </div>
          
          <div className="dilution-card">
            <div className="dilution-header">
              <h4>Investor Ownership</h4>
              <div className="dilution-icon">🏦</div>
            </div>
            <div className="dilution-value">{results.dilutionAnalysis.investorDilution.toFixed(1)}%</div>
            <div className="dilution-description">
              Total investor ownership from funding rounds
            </div>
          </div>
        </div>
      </div>

      {/* Funding Rounds Impact */}
      {fundingRounds.length > 0 && (
        <div className="analysis-section">
          <div className="section-header">
            <h3>💼 Funding Rounds Impact</h3>
            <p>Detailed analysis of each funding round's effect</p>
          </div>
          
          <div className="funding-impact">
            {fundingRounds.map((round, index) => {
              const preMoneyValuation = round.valuationType === 'pre-money' 
                ? round.valuation 
                : round.valuation - round.capitalRaised;
              const postMoneyValuation = round.valuationType === 'post-money' 
                ? round.valuation 
                : round.valuation + round.capitalRaised;
              const ownershipSold = (round.capitalRaised / postMoneyValuation) * 100;
              
              return (
                <div key={round.id} className="round-impact-card">
                  <div className="round-header">
                    <h4>{round.name}</h4>
                    <span className={`round-type-badge type-${round.roundType.toLowerCase().replace(' ', '-')}`}>
                      {round.roundType}
                    </span>
                  </div>
                  
                  <div className="round-details">
                    <div className="detail-row">
                      <span className="detail-label">Capital Raised:</span>
                      <span className="detail-value">${round.capitalRaised.toLocaleString()}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Pre-Money Valuation:</span>
                      <span className="detail-value">${preMoneyValuation.toLocaleString()}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Post-Money Valuation:</span>
                      <span className="detail-value">${postMoneyValuation.toLocaleString()}</span>
                    </div>
                    <div className="detail-row highlight">
                      <span className="detail-label">Ownership Sold:</span>
                      <span className="detail-value">{ownershipSold.toFixed(2)}%</span>
                    </div>
                  </div>
                  
                  {round.roundType === 'SAFE' && (
                    <div className="safe-details">
                      <div className="safe-metric">
                        <span className="metric-label">Valuation Cap:</span>
                        <span className="metric-value">${round.valuationCap?.toLocaleString()}</span>
                      </div>
                      <div className="safe-metric">
                        <span className="metric-label">Discount Rate:</span>
                        <span className="metric-value">{round.discountRate}%</span>
                      </div>
                    </div>
                  )}
                  
                  {round.roundType === 'Priced Round' && (
                    <div className="priced-details">
                      <div className="priced-metric">
                        <span className="metric-label">Shares Issued:</span>
                        <span className="metric-value">{round.sharesIssued?.toLocaleString()}</span>
                      </div>
                      <div className="priced-metric">
                        <span className="metric-label">Share Price:</span>
                        <span className="metric-value">${round.sharePrice?.toFixed(4)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="summary-section">
        <div className="summary-header">
          <h3>📊 Summary Statistics</h3>
        </div>
        
        <div className="summary-stats">
          <div className="summary-stat">
            <span className="stat-label">Total Company Shares</span>
            <span className="stat-value">{results.totalShares.toLocaleString()}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Founder Equity (Initial)</span>
            <span className="stat-value">{results.totalFounderEquity.toFixed(1)}%</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">ESOP Pool Size</span>
            <span className="stat-value">{esopPool.toFixed(1)}%</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Funding Rounds</span>
            <span className="stat-value">{results.fundingSummary.rounds}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Total Capital Raised</span>
            <span className="stat-value">${results.fundingSummary.totalRaised.toLocaleString()}</span>
          </div>
          <div className="summary-stat highlight">
            <span className="stat-label">Exit Valuation</span>
            <span className="stat-value">${exitValuation.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;

