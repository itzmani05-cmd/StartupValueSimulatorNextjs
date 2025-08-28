import React from 'react';

interface Founder {
  name: string;
  shares: number;
  ownership: number;
  value: number;
}

interface FundingRound {
  name: string;
  capitalRaised: number;
  valuation: number;
  type: string;
  esopAdjustment: number;
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
  const esopValue = (esopPool / 100) * exitValuation;
  const totalInvestorValue = exitValuation - founders.reduce((sum, f) => sum + f.value, 0) - esopValue;

  return (
    <div className="results-grid">
      <div className="ownership-card">
        <h3>📊 Final Ownership</h3>
        {founders.map((founder, index) => (
          <div key={index} className="ownership-item">
            <span>{founder.name}</span>
            <span>{founder.ownership.toFixed(2)}%</span>
          </div>
        ))}
        <div className="ownership-item">
          <span>ESOP Pool</span>
          <span>{esopPool.toFixed(2)}%</span>
        </div>
        {fundingRounds.length > 0 && (
          <div className="ownership-item">
            <span>Investors</span>
            <span>{(100 - founders.reduce((sum, f) => sum + f.ownership, 0) - esopPool).toFixed(2)}%</span>
          </div>
        )}
      </div>

      <div className="payout-card">
        <h3>💰 Exit Payouts</h3>
        {founders.map((founder, index) => (
          <div key={index} className="payout-item">
            <span>{founder.name}</span>
            <span>${founder.value.toLocaleString()}</span>
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
