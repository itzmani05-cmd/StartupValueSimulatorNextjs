import React from 'react';

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
  // Add safety checks for undefined or null values
  if (!founders || !Array.isArray(founders) || !fundingRounds || !Array.isArray(fundingRounds)) {
    return (
      <div className="results-grid">
        <div className="ownership-card">
          <h3>📊 Final Ownership</h3>
          <p>No data available</p>
        </div>
        <div className="payout-card">
          <h3>💰 Exit Payouts</h3>
          <p>No data available</p>
        </div>
      </div>
    );
  }

  const esopValue = (esopPool / 100) * exitValuation;
  const totalFounderValue = founders.reduce((sum, f) => sum + ((f.equityPercentage / 100) * exitValuation), 0);
  const totalInvestorValue = exitValuation - totalFounderValue - esopValue;

  return (
    <div className="results-grid">
      <div className="ownership-card">
        <h3>📊 Final Ownership</h3>
        {founders.map((founder, index) => (
          <div key={founder.id} className="ownership-item">
            <span>{founder.name}</span>
            <span>{founder.equityPercentage.toFixed(2)}%</span>
          </div>
        ))}
        <div className="ownership-item">
          <span>ESOP Pool</span>
          <span>{esopPool.toFixed(2)}%</span>
        </div>
        {fundingRounds.length > 0 && (
          <div className="ownership-item">
            <span>Investors</span>
            <span>{(100 - founders.reduce((sum, f) => sum + f.equityPercentage, 0) - esopPool).toFixed(2)}%</span>
          </div>
        )}
      </div>

      <div className="payout-card">
        <h3>💰 Exit Payouts</h3>
        {founders.map((founder, index) => (
          <div key={founder.id} className="payout-item">
            <span>{founder.name}</span>
            <span>${((founder.equityPercentage / 100) * exitValuation).toLocaleString()}</span>
          </div>
        ))}
        <div className="payout-item">
          <span>ESOP Pool</span>
          <span>${esopValue.toLocaleString()}</span>
        </div>
        {fundingRounds.length > 0 && (
          <div className="payout-item">
            <span>Investors</span>
            <span>${totalInvestorValue.toLocaleString()}</span>
          </div>
        )}
        <div className="payout-item" style={{ fontWeight: 'bold', borderTop: '2px solid rgba(255,255,255,0.3)', paddingTop: '10px' }}>
          <span>Total Exit Value</span>
          <span>${exitValuation.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;

