import React, { useState, useEffect } from 'react';

interface FundingRound {
  id: string;
  name: string;
  roundType: 'SAFE' | 'Priced Round';
  capitalRaised: number;
  valuation: number;
  valuationType: 'pre-money' | 'post-money';
  sharesIssued?: number;
  sharePrice?: number;
  // SAFE specific fields
  valuationCap?: number;
  discountRate?: number;
  conversionTrigger?: 'next-round' | 'exit' | 'ipo';
  // Additional fields
  investors: string[];
  date: string;
  notes: string;
}

interface FundingRoundsConfigurationProps {
  fundingRounds: FundingRound[];
  onFundingRoundsChange: (rounds: FundingRound[]) => void;
  currentValuation: number;
  onCurrentValuationChange: (valuation: number) => void;
}

const FundingRoundsConfiguration: React.FC<FundingRoundsConfigurationProps> = ({
  fundingRounds,
  onFundingRoundsChange,
  currentValuation,
  onCurrentValuationChange
}) => {
  const [localRounds, setLocalRounds] = useState<FundingRound[]>(fundingRounds);
  const [localCurrentValuation, setLocalCurrentValuation] = useState(currentValuation);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Validate funding rounds
  useEffect(() => {
    const errors: string[] = [];
    
    localRounds.forEach((round, index) => {
      if (round.capitalRaised <= 0) {
        errors.push(`Round ${index + 1}: Capital raised must be greater than 0`);
      }
      if (round.valuation <= 0) {
        errors.push(`Round ${index + 1}: Valuation must be greater than 0`);
      }
      if (round.roundType === 'Priced Round') {
        if (!round.sharesIssued || round.sharesIssued <= 0) {
          errors.push(`Round ${index + 1}: Shares issued must be greater than 0 for priced rounds`);
        }
        if (!round.sharePrice || round.sharePrice <= 0) {
          errors.push(`Round ${index + 1}: Share price must be greater than 0 for priced rounds`);
        }
      }
      if (round.roundType === 'SAFE') {
        if (!round.valuationCap || round.valuationCap <= 0) {
          errors.push(`Round ${index + 1}: Valuation cap must be set for SAFEs`);
        }
      }
    });

    setValidationErrors(errors);
  }, [localRounds]);

  const addRound = () => {
    const newRound: FundingRound = {
      id: `round-${Date.now()}`,
      name: '',
      roundType: 'SAFE',
      capitalRaised: 0,
      valuation: 0,
      valuationType: 'pre-money',
      investors: [],
      date: new Date().toISOString().split('T')[0],
      notes: ''
    };
    setLocalRounds([...localRounds, newRound]);
  };

  const removeRound = (id: string) => {
    setLocalRounds(localRounds.filter(r => r.id !== id));
  };

  const updateRound = (id: string, field: keyof FundingRound, value: any) => {
    const updatedRounds = localRounds.map(round => {
      if (round.id === id) {
        const updated = { ...round, [field]: value };
        
        // Auto-calculate related fields for priced rounds
        if (field === 'capitalRaised' && round.roundType === 'Priced Round' && round.sharePrice) {
          updated.sharesIssued = Math.round(value / round.sharePrice);
        }
        if (field === 'sharePrice' && round.roundType === 'Priced Round' && round.capitalRaised) {
          updated.sharesIssued = Math.round(round.capitalRaised / value);
        }
        if (field === 'sharesIssued' && round.roundType === 'Priced Round' && round.capitalRaised) {
          updated.sharePrice = round.capitalRaised / value;
        }
        
        return updated;
      }
      return round;
    });
    setLocalRounds(updatedRounds);
  };

  const addInvestor = (roundId: string, investor: string) => {
    if (!investor.trim()) return;
    
    const updatedRounds = localRounds.map(round => {
      if (round.id === roundId) {
        return {
          ...round,
          investors: [...round.investors, investor.trim()]
        };
      }
      return round;
    });
    setLocalRounds(updatedRounds);
  };

  const removeInvestor = (roundId: string, investorIndex: number) => {
    const updatedRounds = localRounds.map(round => {
      if (round.id === roundId) {
        return {
          ...round,
          investors: round.investors.filter((_, index) => index !== investorIndex)
        };
      }
      return round;
    });
    setLocalRounds(updatedRounds);
  };

  const handleSave = async () => {
    if (validationErrors.length > 0) return;
    
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onFundingRoundsChange(localRounds);
      onCurrentValuationChange(localCurrentValuation);
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000); // Reset after 3 seconds
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setLocalRounds(fundingRounds);
    setLocalCurrentValuation(currentValuation);
    setValidationErrors([]);
  };

  const calculatePostMoneyValuation = (round: FundingRound) => {
    if (round.valuationType === 'post-money') {
      return round.valuation;
    }
    return round.valuation + round.capitalRaised;
  };

  const calculatePreMoneyValuation = (round: FundingRound) => {
    if (round.valuationType === 'pre-money') {
      return round.valuation;
    }
    return round.valuation - round.capitalRaised;
  };

  return (
    <div className="funding-rounds-configuration">
      <div className="section-header">
        <h2>💰 Funding Rounds Configuration</h2>
        <div className="header-actions">
          <button className="add-button secondary" onClick={addRound}>
            + Add Funding Round
          </button>
        </div>
      </div>

      {/* Current Valuation */}
      <div className="current-valuation-config">
        <h3>Current Company Valuation</h3>
        <div className="input-group">
          <label>Current Valuation ($):</label>
          <input
            type="number"
            value={localCurrentValuation}
            onChange={(e) => setLocalCurrentValuation(Number(e.target.value))}
            min="0"
            step="1000"
            placeholder="e.g., 5000000"
          />
          <small>This is the current pre-money valuation before any new rounds</small>
        </div>
      </div>

      {/* Funding Rounds */}
      <div className="funding-rounds-list">
        <h3>Funding Rounds</h3>
        {localRounds.map((round, index) => (
          <div key={round.id} className="funding-round-item">
            <div className="round-header">
              <h4>{round.name || `Round ${index + 1}`}</h4>
              <button
                className="remove-button"
                onClick={() => removeRound(round.id)}
                title="Remove round"
              >
                ×
              </button>
            </div>

            <div className="round-inputs">
              <div className="input-row">
                <div className="input-group">
                  <label>Round Name:</label>
                  <input
                    type="text"
                    value={round.name}
                    onChange={(e) => updateRound(round.id, 'name', e.target.value)}
                    placeholder="e.g., Seed, Series A"
                  />
                </div>

                <div className="input-group">
                  <label>Round Type:</label>
                  <select
                    value={round.roundType}
                    onChange={(e) => updateRound(round.id, 'roundType', e.target.value)}
                  >
                    <option value="SAFE">SAFE</option>
                    <option value="Priced Round">Priced Round</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Date:</label>
                  <input
                    type="date"
                    value={round.date}
                    onChange={(e) => updateRound(round.id, 'date', e.target.value)}
                  />
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>Capital Raised ($):</label>
                  <input
                    type="number"
                    value={round.capitalRaised}
                    onChange={(e) => updateRound(round.id, 'capitalRaised', Number(e.target.value))}
                    min="0"
                    step="1000"
                    placeholder="0"
                  />
                </div>

                <div className="input-group">
                  <label>Valuation Type:</label>
                  <select
                    value={round.valuationType}
                    onChange={(e) => updateRound(round.id, 'valuationType', e.target.value)}
                  >
                    <option value="pre-money">Pre-Money</option>
                    <option value="post-money">Post-Money</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Valuation ($):</label>
                  <input
                    type="number"
                    value={round.valuation}
                    onChange={(e) => updateRound(round.id, 'valuation', Number(e.target.value))}
                    min="0"
                    step="1000"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* SAFE Specific Fields */}
              {round.roundType === 'SAFE' && (
                <div className="safe-fields">
                  <h5>SAFE Terms</h5>
                  <div className="input-row">
                    <div className="input-group">
                      <label>Valuation Cap ($):</label>
                      <input
                        type="number"
                        value={round.valuationCap || ''}
                        onChange={(e) => updateRound(round.id, 'valuationCap', Number(e.target.value))}
                        min="0"
                        step="1000"
                        placeholder="0"
                      />
                    </div>

                    <div className="input-group">
                      <label>Discount Rate (%):</label>
                      <input
                        type="number"
                        value={round.discountRate || ''}
                        onChange={(e) => updateRound(round.id, 'discountRate', Number(e.target.value))}
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="0.0"
                      />
                    </div>

                    <div className="input-group">
                      <label>Conversion Trigger:</label>
                      <select
                        value={round.conversionTrigger || 'next-round'}
                        onChange={(e) => updateRound(round.id, 'conversionTrigger', e.target.value)}
                      >
                        <option value="next-round">Next Round</option>
                        <option value="exit">Exit</option>
                        <option value="ipo">IPO</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Priced Round Specific Fields */}
              {round.roundType === 'Priced Round' && (
                <div className="priced-round-fields">
                  <h5>Priced Round Details</h5>
                  <div className="input-row">
                    <div className="input-group">
                      <label>Shares Issued:</label>
                      <input
                        type="number"
                        value={round.sharesIssued || ''}
                        onChange={(e) => updateRound(round.id, 'sharesIssued', Number(e.target.value))}
                        min="0"
                        step="1"
                        placeholder="0"
                      />
                    </div>

                    <div className="input-group">
                      <label>Share Price ($):</label>
                      <input
                        type="number"
                        value={round.sharePrice || ''}
                        onChange={(e) => updateRound(round.id, 'sharePrice', Number(e.target.value))}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Investors */}
              <div className="investors-section">
                <h5>Investors</h5>
                <div className="investors-list">
                  {round.investors.map((investor, investorIndex) => (
                    <div key={investorIndex} className="investor-tag">
                      <span>{investor}</span>
                      <button
                        className="remove-investor"
                        onClick={() => removeInvestor(round.id, investorIndex)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="add-investor">
                  <input
                    type="text"
                    placeholder="Add investor name"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addInvestor(round.id, e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <button onClick={() => {
                    const input = document.querySelector(`input[placeholder="Add investor name"]`) as HTMLInputElement;
                    if (input) {
                      addInvestor(round.id, input.value);
                      input.value = '';
                    }
                  }}>
                    Add
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div className="input-group">
                <label>Notes:</label>
                <textarea
                  value={round.notes}
                  onChange={(e) => updateRound(round.id, 'notes', e.target.value)}
                  placeholder="Additional notes about this round..."
                  rows={2}
                />
              </div>

              {/* Round Summary */}
              <div className="round-summary">
                <h5>Round Summary</h5>
                <div className="summary-stats">
                  <div className="stat-item">
                    <span>Pre-Money Valuation:</span>
                    <span>${calculatePreMoneyValuation(round).toLocaleString()}</span>
                  </div>
                  <div className="stat-item">
                    <span>Post-Money Valuation:</span>
                    <span>${calculatePostMoneyValuation(round).toLocaleString()}</span>
                  </div>
                  {round.roundType === 'Priced Round' && round.sharesIssued && (
                    <div className="stat-item">
                      <span>Ownership Dilution:</span>
                      <span>{((round.capitalRaised / calculatePostMoneyValuation(round)) * 100).toFixed(2)}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="validation-errors">
          <h3>Validation Errors</h3>
          {validationErrors.map((error, index) => (
            <div key={index} className="validation-error">
              ⚠️ {error}
            </div>
          ))}
        </div>
      )}

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
            disabled={validationErrors.length > 0}
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

export default FundingRoundsConfiguration;
