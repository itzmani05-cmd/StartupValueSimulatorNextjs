import React, { useState, useEffect } from 'react';

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
      setTimeout(() => setIsSaved(false), 3000); // Reset after 3 seconds
    } catch (error) {
      console.error('Save failed:', error);
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
    <div className="founder-configuration">
      <div className="section-header">
        <h2>👥 Founder Configuration</h2>
        <div className="header-actions">
          <button className="add-button secondary" onClick={addFounder}>
            + Add Founder
          </button>
        </div>
      </div>

      {/* Total Shares Configuration */}
      <div className="total-shares-config">
        <h3>Total Company Shares</h3>
        <div className="input-group">
          <label>Total Shares Outstanding:</label>
          <input
            type="number"
            value={localTotalShares}
            onChange={(e) => setLocalTotalShares(Number(e.target.value))}
            min="1000"
            step="1000"
            placeholder="e.g., 10000000"
          />
          <small>Common values: 10M, 100M, 1B shares</small>
        </div>
      </div>

      {/* Founders List */}
      <div className="founders-list">
        <h3>Founders & Equity Split</h3>
        {localFounders.map((founder, index) => (
          <div key={founder.id} className="founder-item">
            <div className="founder-header">
              <h4>Founder {index + 1}</h4>
              {localFounders.length > 1 && (
                <button
                  className="remove-button"
                  onClick={() => removeFounder(founder.id)}
                  title="Remove founder"
                >
                  ×
                </button>
              )}
            </div>
            
            <div className="founder-inputs">
              <div className="input-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={founder.name}
                  onChange={(e) => updateFounder(founder.id, 'name', e.target.value)}
                  placeholder="Founder name"
                />
              </div>
              
              <div className="input-group">
                <label>Role:</label>
                <input
                  type="text"
                  value={founder.role}
                  onChange={(e) => updateFounder(founder.id, 'role', e.target.value)}
                  placeholder="e.g., CEO, CTO"
                />
              </div>
              
              <div className="input-group">
                <label>Equity %:</label>
                <input
                  type="number"
                  value={founder.equityPercentage}
                  onChange={(e) => updateFounder(founder.id, 'equityPercentage', Number(e.target.value))}
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="0.00"
                />
                <small>Shares: {founder.shares.toLocaleString()}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ESOP Pool Configuration */}
      <div className="esop-pool-config">
        <h3>ESOP Pool</h3>
        <div className="input-group">
          <label>ESOP Pool Size (%):</label>
          <input
            type="number"
            value={localEsopPool}
            onChange={(e) => setLocalEsopPool(Number(e.target.value))}
            min="0"
            max="100"
            step="0.01"
            placeholder="0.00"
          />
          <small>Shares: {Math.round((localEsopPool / 100) * localTotalShares).toLocaleString()}</small>
        </div>
      </div>

      {/* Validation Summary */}
      <div className="validation-summary">
        <h3>Equity Allocation Summary</h3>
        <div className="allocation-breakdown">
          <div className="allocation-item">
            <span>Founders:</span>
            <span>{totalFounderEquity.toFixed(2)}%</span>
          </div>
          <div className="allocation-item">
            <span>ESOP Pool:</span>
            <span>{localEsopPool.toFixed(2)}%</span>
          </div>
          <div className="allocation-item total">
            <span>Total:</span>
            <span className={totalAllocation === 100 ? 'valid' : 'invalid'}>
              {totalAllocation.toFixed(2)}%
            </span>
          </div>
        </div>
        
        {validationError && (
          <div className="validation-error">
            ⚠️ {validationError}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        {isSaving ? (
          <button className="save-button saving" disabled>
            💾 Saving...
          </button>
        ) : isSaved ? (
          <button className="save-button saved" disabled>
            ✅ Saved Successfully!
          </button>
        ) : (
          <button
            className="save-button"
            onClick={handleSave}
            disabled={!!validationError}
          >
            💾 Save Configuration
          </button>
        )}
        <button className="reset-button" onClick={handleReset}>
          Reset to Original
        </button>
      </div>
    </div>
  );
};

export default FounderConfiguration;
