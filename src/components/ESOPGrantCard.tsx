import React, { useCallback } from 'react';

interface ESOPGrant {
  id: string;
  employeeName: string;
  grantDate: string;
  totalShares: number;
  exercisePrice: number;
  vestingSchedule: {
    type: 'standard' | 'custom';
    years: number;
    cliffMonths: number;
    vestingFrequency: 'monthly' | 'quarterly' | 'annually';
    customSchedule?: { month: number; percentage: number }[];
  };
  currentVestedShares: number;
  exercisedShares: number;
  departureDate?: string;
  departureType?: 'voluntary' | 'involuntary' | 'retirement' | 'death';
  taxImplications: {
    exerciseCost: number;
    estimatedAMT: number;
    capitalGainsTax: number;
    totalTaxBurden: number;
  };
}

interface ESOPGrantCardProps {
  grant: ESOPGrant;
  onUpdate: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
  index: number;
  isEditable: boolean;
  currentValuation: number;
}

const ESOPGrantCard: React.FC<ESOPGrantCardProps> = ({ 
  grant, 
  onUpdate, 
  onRemove, 
  index, 
  isEditable, 
  currentValuation 
}) => {
  const handleChange = useCallback((field: string, value: any) => {
    onUpdate(index, field, value);
  }, [index, onUpdate]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange('employeeName', e.target.value);
  }, [handleChange]);

  const handleSharesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange('totalShares', parseInt(e.target.value) || 0);
  }, [handleChange]);

  const handleExercisePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange('exercisePrice', parseFloat(e.target.value) || 0);
  }, [handleChange]);

  const handleVestedSharesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange('currentVestedShares', parseInt(e.target.value) || 0);
  }, [handleChange]);

  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [onRemove, index]);

  // Calculate current value and tax implications
  const currentValue = grant.currentVestedShares * (currentValuation / 1000000); // Assuming $1M = 1 share
  const exerciseCost = grant.currentVestedShares * grant.exercisePrice;
  const estimatedAMT = currentValue * 0.28; // 28% AMT rate
  const capitalGainsTax = Math.max(0, (currentValue - exerciseCost) * 0.15); // 15% capital gains
  const totalTaxBurden = estimatedAMT + capitalGainsTax;

  // Calculate vesting percentage
  const vestingPercentage = grant.totalShares > 0 ? (grant.currentVestedShares / grant.totalShares) * 100 : 0;

  return (
    <div className="esop-grant-card enhanced">
      <div className="grant-header">
        <div className="grant-title">
          <h4>ESOP Grant {index + 1}</h4>
          {isEditable && (
            <button
              className="remove-button"
              onClick={handleRemove}
              title="Remove Grant"
              aria-label="Remove ESOP grant"
            >
              <span className="icon">×</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="grant-content">
        <div className="grant-inputs">
          <div className="input-group">
            <label htmlFor={`employee-name-${index}`}>Employee Name</label>
            <input
              id={`employee-name-${index}`}
              type="text"
              value={grant.employeeName}
              onChange={handleNameChange}
              placeholder="Enter employee name"
              disabled={!isEditable}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor={`total-shares-${index}`}>Total Shares</label>
            <input
              id={`total-shares-${index}`}
              type="number"
              value={grant.totalShares}
              onChange={handleSharesChange}
              min="0"
              step="100"
              disabled={!isEditable}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor={`exercise-price-${index}`}>Exercise Price ($)</label>
            <input
              id={`exercise-price-${index}`}
              type="number"
              value={grant.exercisePrice}
              onChange={handleExercisePriceChange}
              min="0"
              step="0.01"
              disabled={!isEditable}
            />
          </div>

          <div className="input-group">
            <label htmlFor={`vested-shares-${index}`}>Vested Shares</label>
            <input
              id={`vested-shares-${index}`}
              type="number"
              value={grant.currentVestedShares}
              onChange={handleVestedSharesChange}
              min="0"
              max={grant.totalShares}
              step="100"
              disabled={!isEditable}
            />
          </div>
        </div>
        
        <div className="grant-stats">
          <div className="stat-item">
            <span className="stat-label">Vesting %</span>
            <span className="stat-value">{vestingPercentage.toFixed(1)}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Current Value</span>
            <span className="stat-value value">${currentValue.toLocaleString()}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Exercise Cost</span>
            <span className="stat-value cost">${exerciseCost.toLocaleString()}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Tax</span>
            <span className="stat-value tax">${totalTaxBurden.toLocaleString()}</span>
          </div>
        </div>

        <div className="grant-details">
          <div className="detail-row">
            <span className="detail-label">Grant Date:</span>
            <span className="detail-value">{grant.grantDate}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Vesting Schedule:</span>
            <span className="detail-value">
              {grant.vestingSchedule.years} years, {grant.vestingSchedule.cliffMonths} month cliff
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Vesting Frequency:</span>
            <span className="detail-value">{grant.vestingSchedule.vestingFrequency}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESOPGrantCard;






