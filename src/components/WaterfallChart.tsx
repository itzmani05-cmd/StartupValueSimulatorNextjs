import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

interface WaterfallChartProps {
  fundingRounds: FundingRound[];
  currentValuation: number;
}

const WaterfallChart: React.FC<WaterfallChartProps> = ({ fundingRounds, currentValuation }) => {
  // Create waterfall data
  const createWaterfallData = () => {
    const data = [];
    let runningTotal = 0;
    
    // Start with incorporation
    data.push({
      name: 'Incorporation',
      value: 0,
      type: 'start',
      runningTotal: 0
    });
    
    // Add each funding round
    fundingRounds.forEach((round, index) => {
      const preMoney = round.valuationType === 'pre-money' ? round.valuation : round.valuation - round.capitalRaised;
      const postMoney = round.valuationType === 'post-money' ? round.valuation : round.valuation + round.capitalRaised;
      
      data.push({
        name: round.name || `Round ${index + 1}`,
        value: preMoney,
        type: 'pre-money',
        runningTotal: runningTotal,
        roundType: round.roundType,
        capitalRaised: round.capitalRaised
      });
      
      runningTotal += preMoney;
      
      data.push({
        name: `${round.name || `Round ${index + 1}`} (Post)`,
        value: postMoney,
        type: 'post-money',
        runningTotal: runningTotal,
        roundType: round.roundType,
        capitalRaised: round.capitalRaised
      });
      
      runningTotal = postMoney;
    });
    
    // Add current valuation
    if (fundingRounds.length > 0) {
      data.push({
        name: 'Current',
        value: currentValuation,
        type: 'current',
        runningTotal: runningTotal
      });
    }
    
    return data;
  };

  const waterfallData = createWaterfallData();

  const getBarColor = (entry: any) => {
    switch (entry.type) {
      case 'start':
        return '#8884d8';
      case 'pre-money':
        return '#82ca9d';
      case 'post-money':
        return '#ffc658';
      case 'current':
        return '#ff6b6b';
      default:
        return '#8884d8';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '10px'
        }}>
          <p className="label">{`${label}`}</p>
          <p className="value">{`Value: $${data.value.toLocaleString()}`}</p>
          {data.capitalRaised && (
            <p className="capital">{`Capital Raised: $${data.capitalRaised.toLocaleString()}`}</p>
          )}
          <p className="type">{`Type: ${data.type}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="waterfall-chart-container">
      <h3>🌊 Valuation Waterfall</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            fill="#8884d8"
            shape={(props: any) => {
              const { x, y, width, height, value } = props;
              const data = waterfallData[props.index];
              
              if (data.type === 'start') {
                return <rect x={x} y={y} width={width} height={height} fill={getBarColor(data)} />;
              }
              
              // For other bars, start from the running total
              const barHeight = height;
              const barY = y - barHeight;
              
              return (
                <rect 
                  x={x} 
                  y={barY} 
                  width={width} 
                  height={barHeight} 
                  fill={getBarColor(data)}
                />
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>
      
      <div className="waterfall-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#8884d8' }}></span>
          <span>Incorporation</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#82ca9d' }}></span>
          <span>Pre-Money Valuation</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#ffc658' }}></span>
          <span>Post-Money Valuation</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#ff6b6b' }}></span>
          <span>Current Valuation</span>
        </div>
      </div>
    </div>
  );
};

export default WaterfallChart;



