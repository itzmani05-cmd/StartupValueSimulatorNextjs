import React from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, ComposedChart
} from 'recharts';
import WaterfallChart from './WaterfallChart';

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

interface ChartsProps {
  founders: Founder[];
  esopPool: number;
  fundingRounds: FundingRound[];
  currentValuation: number;
  totalShares: number;
}

const Charts: React.FC<ChartsProps> = ({
  founders,
  esopPool,
  fundingRounds,
  currentValuation,
  totalShares
}) => {
  // Prepare data for ownership pie chart
  const ownershipData = [
    ...founders.map(founder => ({
      name: founder.name,
      value: founder.equityPercentage,
      shares: founder.shares,
      type: 'Founder'
    })),
    {
      name: 'ESOP Pool',
      value: esopPool,
      shares: Math.round((esopPool / 100) * totalShares),
      type: 'ESOP'
    },
    {
      name: 'Investors',
      value: Math.max(0, 100 - founders.reduce((sum, f) => sum + f.equityPercentage, 0) - esopPool),
      shares: Math.round((Math.max(0, 100 - founders.reduce((sum, f) => sum + f.equityPercentage, 0) - esopPool) / 100) * totalShares),
      type: 'Investor'
    }
  ].filter(item => item.value > 0);

  // Prepare data for cap table bar chart
  const capTableData = [
    ...founders.map(founder => ({
      name: founder.name,
      shares: founder.shares,
      percentage: founder.equityPercentage,
      type: 'Founder'
    })),
    {
      name: 'ESOP Pool',
      shares: Math.round((esopPool / 100) * totalShares),
      percentage: esopPool,
      type: 'ESOP'
    }
  ];

  // Prepare data for valuation timeline
  const valuationTimeline = [
    { name: 'Incorporation', valuation: 0, type: 'Pre-Funding' },
    ...fundingRounds.map((round, index) => ({
      name: round.name || `Round ${index + 1}`,
      valuation: round.valuation,
      type: round.roundType,
      capitalRaised: round.capitalRaised
    })),
    { name: 'Current', valuation: currentValuation, type: 'Current' }
  ];

  // Prepare data for founder dilution
  const founderDilutionData = founders.map(founder => {
    const initialOwnership = founder.equityPercentage;
    const currentOwnership = (founder.shares / totalShares) * 100;
    const dilution = initialOwnership - currentOwnership;
    
    return {
      name: founder.name,
      initial: initialOwnership,
      current: currentOwnership,
      dilution: Math.max(0, dilution)
    };
  });

  // Color scheme for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'];

  return (
    <div className="charts-container">
      <div className="charts-header">
        <h2>📊 Visual Analytics Dashboard</h2>
        <p>Interactive charts and graphs for better insights</p>
      </div>

      <div className="charts-grid">
        {/* Ownership Distribution Pie Chart */}
        <div className="chart-card">
          <h3>👥 Ownership Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ownershipData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, shares }) => `${name}: ${value.toFixed(1)}% (${shares.toLocaleString()} shares)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {ownershipData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string, props: any) => [
                  `${value.toFixed(2)}% (${props.payload.shares.toLocaleString()} shares)`,
                  name
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Cap Table Bar Chart */}
        <div className="chart-card">
          <h3>📊 Cap Table Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={capTableData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string, props: any) => [
                  `${value.toLocaleString()} shares (${props.payload.percentage.toFixed(1)}%)`,
                  name === 'shares' ? 'Shares' : 'Percentage'
                ]}
              />
              <Legend />
              <Bar dataKey="shares" fill="#8884d8" name="Shares" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Valuation Timeline */}
        <div className="chart-card">
          <h3>💰 Valuation Progression</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={valuationTimeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string, props: any) => [
                  `$${value.toLocaleString()}`,
                  name === 'valuation' ? 'Valuation' : 'Capital Raised'
                ]}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="valuation" 
                stackId="1" 
                stroke="#8884d8" 
                fill="#8884d8" 
                name="Valuation"
              />
              {fundingRounds.length > 0 && (
                <Bar 
                  dataKey="capitalRaised" 
                  fill="#82ca9d" 
                  name="Capital Raised"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Founder Dilution Chart */}
        <div className="chart-card">
          <h3>📉 Founder Dilution Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={founderDilutionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${value.toFixed(1)}%`,
                  name === 'initial' ? 'Initial Ownership' : 
                  name === 'current' ? 'Current Ownership' : 'Dilution'
                ]}
              />
              <Legend />
              <Bar dataKey="initial" fill="#0088FE" name="Initial Ownership" />
              <Bar dataKey="current" fill="#00C49F" name="Current Ownership" />
              <Line type="monotone" dataKey="dilution" stroke="#FF8042" name="Dilution" strokeWidth={3} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Funding Rounds Summary */}
        <div className="chart-card">
          <h3>🏦 Funding Rounds Summary</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fundingRounds}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `$${value.toLocaleString()}`,
                  name === 'capitalRaised' ? 'Capital Raised' : 'Valuation'
                ]}
              />
              <Legend />
              <Bar dataKey="capitalRaised" fill="#8884d8" name="Capital Raised" />
              <Bar dataKey="valuation" fill="#82ca9d" name="Valuation" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ESOP Pool Utilization */}
        <div className="chart-card">
          <h3>📈 ESOP Pool Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Allocated', value: esopPool, fill: '#00C49F' },
                  { name: 'Available', value: Math.max(0, 100 - esopPool), fill: '#FFBB28' }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                outerRadius={80}
                dataKey="value"
              />
              <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Valuation Waterfall Chart */}
        <div className="chart-card waterfall-card">
          <WaterfallChart 
            fundingRounds={fundingRounds}
            currentValuation={currentValuation}
          />
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="charts-summary">
        <h3>📋 Key Metrics Summary</h3>
        <div className="metrics-grid">
          <div className="metric-item">
            <span className="metric-label">Total Company Value:</span>
            <span className="metric-value">${currentValuation.toLocaleString()}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Total Shares Outstanding:</span>
            <span className="metric-value">{totalShares.toLocaleString()}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Share Price:</span>
            <span className="metric-value">${(currentValuation / totalShares).toFixed(4)}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Funding Rounds:</span>
            <span className="metric-value">{fundingRounds.length}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Total Capital Raised:</span>
            <span className="metric-value">${fundingRounds.reduce((sum, round) => sum + round.capitalRaised, 0).toLocaleString()}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">ESOP Pool Utilization:</span>
            <span className="metric-value">{esopPool.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
