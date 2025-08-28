import React, { useCallback, useMemo } from 'react';
import ESOPGrantCard from './ESOPGrantCard';

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

interface ESOPTabProps {
  esopPool: number;
  esopGrants: ESOPGrant[];
  onUpdateGrant: (index: number, field: string, value: any) => void;
  onRemoveGrant: (index: number) => void;
  onAddGrant: () => void;
  currentValuation: number;
  isEditable: boolean;
}

const ESOPTab: React.FC<ESOPTabProps> = ({
  esopPool,
  esopGrants,
  onUpdateGrant,
  onRemoveGrant,
  onAddGrant,
  currentValuation,
  isEditable
}) => {
  // Calculate ESOP summary statistics
  const esopSummary = useMemo(() => {
    // Add safety checks for undefined or null values
    if (!esopGrants || !Array.isArray(esopGrants)) {
      return {
        totalGrantedShares: 0,
        totalVestedShares: 0,
        totalExercisedShares: 0,
        totalUnvestedShares: 0,
        totalCurrentValue: 0,
        totalExerciseCost: 0,
        totalTaxBurden: 0,
        poolUtilization: 0
      };
    }
    
    const totalGrantedShares = esopGrants.reduce((sum, grant) => sum + (grant?.totalShares || 0), 0);
    const totalVestedShares = esopGrants.reduce((sum, grant) => sum + (grant?.currentVestedShares || 0), 0);
    const totalExercisedShares = esopGrants.reduce((sum, grant) => sum + (grant?.exercisedShares || 0), 0);
    const totalUnvestedShares = totalGrantedShares - totalVestedShares;
    
    // Calculate total value and tax implications
    const totalCurrentValue = esopGrants.reduce((sum, grant) => {
      const grantValue = (grant?.currentVestedShares || 0) * (currentValuation / 1000000);
      return sum + grantValue;
    }, 0);
    
    const totalExerciseCost = esopGrants.reduce((sum, grant) => {
      return sum + ((grant?.currentVestedShares || 0) * (grant?.exercisePrice || 0));
    }, 0);
    
    const totalTaxBurden = esopGrants.reduce((sum, grant) => {
      const grantValue = (grant?.currentVestedShares || 0) * (currentValuation / 1000000);
      const exerciseCost = (grant?.currentVestedShares || 0) * (grant?.exercisePrice || 0);
      const estimatedAMT = grantValue * 0.28;
      const capitalGainsTax = Math.max(0, (grantValue - exerciseCost) * 0.15);
      return sum + estimatedAMT + capitalGainsTax;
    }, 0);

    return {
      totalGrantedShares,
      totalVestedShares,
      totalExercisedShares,
      totalUnvestedShares,
      totalCurrentValue,
      totalExerciseCost,
      totalTaxBurden,
      poolUtilization: totalGrantedShares > 0 ? (totalGrantedShares / (esopPool * 10000)) * 100 : 0
    };
  }, [esopGrants, currentValuation, esopPool]);

  const handleAddGrant = useCallback(() => {
    onAddGrant();
  }, [onAddGrant]);

  return (
    <div className="tab-content esop-tab">
      <div className="section-header">
        <h2>📈 Employee Stock Option Plan (ESOP)</h2>
        <div className="header-actions">
          {isEditable && (
            <button className="add-button secondary" onClick={handleAddGrant}>
              + Add ESOP Grant
            </button>
          )}
        </div>
      </div>
      
      {/* ESOP Pool Overview */}
      <div className="esop-overview">
        <div className="overview-card">
          <h3>ESOP Pool Summary</h3>
          <div className="overview-stats">
            <div className="stat-item">
              <span className="stat-label">Total Pool</span>
              <span className="stat-value">{esopPool}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pool Utilization</span>
              <span className="stat-value">{esopSummary.poolUtilization.toFixed(1)}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Active Grants</span>
              <span className="stat-value">{esopGrants.length}</span>
            </div>
          </div>
        </div>

        <div className="overview-card">
          <h3>Shares Summary</h3>
          <div className="overview-stats">
            <div className="stat-item">
              <span className="stat-label">Total Granted</span>
              <span className="stat-value">{esopSummary.totalGrantedShares.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Vested</span>
              <span className="stat-value">{esopSummary.totalVestedShares.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Unvested</span>
              <span className="stat-value">{esopSummary.totalUnvestedShares.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="overview-card">
          <h3>Financial Summary</h3>
          <div className="overview-stats">
            <div className="stat-item">
              <span className="stat-label">Current Value</span>
              <span className="stat-value value">${esopSummary.totalCurrentValue.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Exercise Cost</span>
              <span className="stat-value cost">${esopSummary.totalExerciseCost.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Tax</span>
              <span className="stat-value tax">${esopSummary.totalTaxBurden.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ESOP Grants */}
      <div className="esop-grants-section">
        <h3>Individual Grants</h3>
        {esopGrants.length === 0 ? (
          <div className="empty-state">
            <p>No ESOP grants have been created yet.</p>
            {isEditable && (
              <button className="add-button primary" onClick={handleAddGrant}>
                Create Your First Grant
              </button>
            )}
          </div>
        ) : (
          <div className="esop-grants">
            {esopGrants.map((grant, index) => (
              <ESOPGrantCard
                key={`${grant.id}-${index}`}
                grant={grant}
                onUpdate={onUpdateGrant}
                onRemove={onRemoveGrant}
                index={index}
                isEditable={isEditable}
                currentValuation={currentValuation}
              />
            ))}
          </div>
        )}
      </div>

      {/* Vesting Schedule Visualization */}
      {esopGrants.length > 0 && (
        <div className="vesting-visualization">
          <h3>Vesting Schedule Overview</h3>
          <div className="vesting-timeline">
            {esopGrants.map((grant, index) => (
              <div key={index} className="vesting-item">
                <div className="vesting-header">
                  <span className="employee-name">{grant.employeeName}</span>
                  <span className="vesting-percentage">
                    {grant.totalShares > 0 ? ((grant.currentVestedShares / grant.totalShares) * 100).toFixed(1) : '0'}% Vested
                  </span>
                </div>
                <div className="vesting-bar">
                  <div 
                    className="vesting-progress" 
                    style={{ 
                      width: `${grant.totalShares > 0 ? (grant.currentVestedShares / grant.totalShares) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
                <div className="vesting-details">
                  <span>{grant.currentVestedShares.toLocaleString()} / {grant.totalShares.toLocaleString()} shares</span>
                  <span>{grant.vestingSchedule.years} years, {grant.vestingSchedule.cliffMonths} month cliff</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ESOPTab;

