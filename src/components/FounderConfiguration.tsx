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

  const equalSplit = () => {
    if (localFounders.length === 0) return;
    const remainingForFounders = Math.max(0, 100 - localEsopPool);
    const perFounder = remainingForFounders / localFounders.length;
    const updated = localFounders.map(f => ({
      ...f,
      equityPercentage: Number(perFounder.toFixed(2)),
      shares: Math.round((perFounder / 100) * localTotalShares)
    }));
    setLocalFounders(updated);
  };

  const distributeRemaining = () => {
    const currentTotalFounders = localFounders.reduce((s, f) => s + f.equityPercentage, 0);
    const remaining = Math.max(0, 100 - localEsopPool - currentTotalFounders);
    if (remaining <= 0 || localFounders.length === 0) return;
    const addEach = remaining / localFounders.length;
    const updated = localFounders.map(f => {
      const newPct = f.equityPercentage + addEach;
      return {
        ...f,
        equityPercentage: Number(newPct.toFixed(2)),
        shares: Math.round((newPct / 100) * localTotalShares)
      };
    });
    setLocalFounders(updated);
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
      <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>👥 Founder Configuration</h2>
        <div className="header-actions" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="add-button secondary" onClick={addFounder} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}>
            + Add Founder
          </button>
          <button onClick={equalSplit} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}>
            ⇄ Equal Split
          </button>
          <button onClick={distributeRemaining} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}>
            ➕ Distribute Remaining
          </button>
        </div>
      </div>

      {/* Total Shares Configuration */}
      <div className="total-shares-config" style={{ border: '1px solid #eee', borderRadius: 10, padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginTop: 0 }}>Total Company Shares</h3>
        <div className="input-group" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', alignItems: 'center', gap: 12 }}>
          <label>Total Shares Outstanding:</label>
          <input
            type="number"
            value={localTotalShares}
            onChange={(e) => setLocalTotalShares(Number(e.target.value))}
            min="1000"
            step="1000"
            placeholder="e.g., 10000000"
          />
          <small style={{ gridColumn: '1 / -1', color: '#6b7280' }}>Common values: 10M, 100M, 1B shares</small>
        </div>
      </div>

      {/* Founders List */}
      <div className="founders-list">
        <h3>Founders & Equity Split</h3>
        {localFounders.map((founder, index) => (
          <div key={founder.id} className="founder-item" style={{ border: '1px solid #eee', borderRadius: 10, padding: 16, marginBottom: 12 }}>
            <div className="founder-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
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
            
            <div className="founder-inputs" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
              <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label>Name:</label>
                <input
                  type="text"
                  value={founder.name}
                  onChange={(e) => updateFounder(founder.id, 'name', e.target.value)}
                  placeholder="Founder name"
                />
              </div>
              
              <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label>Role:</label>
                <input
                  type="text"
                  value={founder.role}
                  onChange={(e) => updateFounder(founder.id, 'role', e.target.value)}
                  placeholder="e.g., CEO, CTO"
                />
              </div>
              
              <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={0.1}
                  value={founder.equityPercentage}
                  onChange={(e) => updateFounder(founder.id, 'equityPercentage', Number(e.target.value))}
                />
                <small>Shares: {founder.shares.toLocaleString()}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ESOP Pool Configuration */}
      <div className="esop-pool-config" style={{ border: '1px solid #eee', borderRadius: 10, padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginTop: 0 }}>ESOP Pool</h3>
        <div className="input-group" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', alignItems: 'center', gap: 12 }}>
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
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={localEsopPool}
            onChange={(e) => setLocalEsopPool(Number(e.target.value))}
          />
          <small style={{ gridColumn: '1 / -1', color: '#6b7280' }}>Shares: {Math.round((localEsopPool / 100) * localTotalShares).toLocaleString()}</small>
        </div>
      </div>

      {/* Validation Summary */}
      <div className="validation-summary" style={{ border: '1px solid #eee', borderRadius: 10, padding: 16, marginBottom: 12 }}>
        <h3 style={{ marginTop: 0 }}>Equity Allocation Summary</h3>
        <div className="allocation-breakdown" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
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
        <div style={{ height: 8, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden', marginTop: 8 }}>
          <div style={{ width: `${Math.min(100, Math.max(0, totalAllocation))}%`, height: '100%', background: totalAllocation === 100 ? '#10b981' : '#f59e0b' }} />
        </div>
        
        {validationError && (
          <div className="validation-error">
            ⚠️ {validationError}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons" style={{ display: 'flex', gap: 8, marginTop: 8 }}>
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
