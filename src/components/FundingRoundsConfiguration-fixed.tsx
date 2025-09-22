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
  valuationCap?: number;
  discountRate?: number;
  conversionTrigger?: 'next-round' | 'exit' | 'ipo';
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
  const [isAddingRound, setIsAddingRound] = useState(false);
  const [editingRoundId, setEditingRoundId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [newRound, setNewRound] = useState<Partial<FundingRound>>({
    name: '',
    roundType: 'SAFE',
    capitalRaised: 0,
    valuation: 0,
    valuationType: 'pre-money',
    sharesIssued: 0,
    sharePrice: 0,
    valuationCap: 0,
    discountRate: 0,
    conversionTrigger: 'next-round',
    investors: [''],
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    setLocalRounds(fundingRounds);
  }, [fundingRounds]);

  useEffect(() => {
    setLocalCurrentValuation(currentValuation);
  }, [currentValuation]);

  // Debug state changes
  useEffect(() => {
    console.log('isAddingRound state changed:', isAddingRound);
    console.log('editingRoundId state changed:', editingRoundId);
    console.log('Modal should be open:', isAddingRound || editingRoundId !== null);
  }, [isAddingRound, editingRoundId]);

  const validateRound = (round: Partial<FundingRound>): string[] => {
    const errors: string[] = [];
    
    if (!round.name?.trim()) {
      errors.push('Round name is required');
    }
    
    if (!round.capitalRaised || round.capitalRaised <= 0) {
      errors.push('Capital raised must be greater than 0');
    }
    
    if (!round.valuation || round.valuation <= 0) {
      errors.push('Valuation must be greater than 0');
    }
    
    if (round.roundType === 'Priced Round') {
      if (!round.sharesIssued || round.sharesIssued <= 0) {
        errors.push('Shares issued is required for priced rounds');
      }
      if (!round.sharePrice || round.sharePrice <= 0) {
        errors.push('Share price is required for priced rounds');
      }
    }
    
    if (round.roundType === 'SAFE') {
      if (!round.valuationCap || round.valuationCap <= 0) {
        errors.push('Valuation cap is required for SAFEs');
      }
    }
    
    return errors;
  };

  const handleAddRound = () => {
    console.log('handleAddRound called with newRound:', newRound);
    
    const errors = validateRound(newRound);
    if (errors.length > 0) {
      console.log('Validation errors:', errors);
      setValidationErrors(errors);
      return;
    }
    
    const round: FundingRound = {
      id: `round-${Date.now()}`,
      name: newRound.name!,
      roundType: newRound.roundType!,
      capitalRaised: newRound.capitalRaised!,
      valuation: newRound.valuation!,
      valuationType: newRound.valuationType!,
      sharesIssued: newRound.sharesIssued,
      sharePrice: newRound.sharePrice,
      valuationCap: newRound.valuationCap,
      discountRate: newRound.discountRate,
      conversionTrigger: newRound.conversionTrigger!,
      investors: newRound.investors!.filter(inv => inv.trim()),
      date: newRound.date!,
      notes: newRound.notes!
    };
    
    console.log('Created round object:', round);
    const updatedRounds = [...localRounds, round];
    console.log('Updated rounds:', updatedRounds);
    
    setLocalRounds(updatedRounds);
    onFundingRoundsChange(updatedRounds); // Notify parent component
    setIsAddingRound(false);
    setValidationErrors([]);
    resetNewRound();
    
    console.log('Round added successfully');
  };

  const handleEditRound = (round: FundingRound) => {
    console.log('Editing round:', round);
    setEditingRoundId(round.id);
    setNewRound({
      name: round.name,
      roundType: round.roundType,
      capitalRaised: round.capitalRaised,
      valuation: round.valuation,
      valuationType: round.valuationType,
      sharesIssued: round.sharesIssued,
      sharePrice: round.sharePrice,
      valuationCap: round.valuationCap,
      discountRate: round.discountRate,
      conversionTrigger: round.conversionTrigger,
      investors: round.investors,
      date: round.date,
      notes: round.notes
    });
  };

  const handleUpdateRound = () => {
    if (!editingRoundId) return;
    
    const errors = validateRound(newRound);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    const updatedRounds = localRounds.map(round => 
      round.id === editingRoundId 
        ? {
            ...round,
            name: newRound.name!,
            roundType: newRound.roundType!,
            capitalRaised: newRound.capitalRaised!,
            valuation: newRound.valuation!,
            valuationType: newRound.valuationType!,
            sharesIssued: newRound.sharesIssued,
            sharePrice: newRound.sharePrice,
            valuationCap: newRound.valuationCap,
            discountRate: newRound.discountRate,
            conversionTrigger: newRound.conversionTrigger!,
            investors: newRound.investors!.filter(inv => inv.trim()),
            date: newRound.date!,
            notes: newRound.notes!
          }
        : round
    );
    
    setLocalRounds(updatedRounds);
    onFundingRoundsChange(updatedRounds); // Notify parent component
    setEditingRoundId(null);
    setValidationErrors([]);
    resetNewRound();
  };

  const handleDeleteRound = (roundId: string) => {
    if (window.confirm('Are you sure you want to delete this funding round?')) {
      const updatedRounds = localRounds.filter(round => round.id !== roundId);
      setLocalRounds(updatedRounds);
      onFundingRoundsChange(updatedRounds); // Notify parent component
    }
  };

  const resetNewRound = () => {
    setNewRound({
      name: '',
      roundType: 'SAFE',
      capitalRaised: 0,
      valuation: 0,
      valuationType: 'pre-money',
      sharesIssued: 0,
      sharePrice: 0,
      valuationCap: 0,
      discountRate: 0,
      conversionTrigger: 'next-round',
      investors: [''],
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const addInvestor = () => {
    setNewRound(prev => ({
      ...prev,
      investors: [...(prev.investors || []), '']
    }));
  };

  const removeInvestor = (index: number) => {
    setNewRound(prev => ({
      ...prev,
      investors: prev.investors?.filter((_, i) => i !== index) || []
    }));
  };

  const updateInvestor = (index: number, value: string) => {
    setNewRound(prev => ({
      ...prev,
      investors: prev.investors?.map((inv, i) => i === index ? value : inv) || []
    }));
  };

  const filteredRounds = localRounds
    .filter(round => {
      if (searchTerm && !round.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filterType !== 'all' && round.roundType !== filterType) return false;
      return true;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'capitalRaised':
          aValue = a.capitalRaised;
          bValue = b.capitalRaised;
          break;
        case 'valuation':
          aValue = a.valuation;
          bValue = b.valuation;
          break;
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const totalCapitalRaised = localRounds.reduce((sum, round) => sum + round.capitalRaised, 0);
  const averageValuation = localRounds.length > 0 ? localRounds.reduce((sum, round) => sum + round.valuation, 0) / localRounds.length : 0;

  const handleSave = async () => {
    if (validationErrors.length > 0) return;
    
    setIsSaving(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
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

  const isModalOpen = isAddingRound || editingRoundId !== null;
  const modalTitle = editingRoundId ? 'Edit Funding Round' : 'Add New Funding Round';
  const modalAction = editingRoundId ? 'Update Round' : 'Add Round';
  const handleModalAction = editingRoundId ? handleUpdateRound : handleAddRound;

  const openAddRoundModal = () => {
    console.log('Opening add round modal...');
    setIsAddingRound(true);
    setEditingRoundId(null);
    resetNewRound();
    setValidationErrors([]);
  };

  const closeModal = () => {
    console.log('Closing modal...');
    setIsAddingRound(false);
    setEditingRoundId(null);
    resetNewRound();
    setValidationErrors([]);
  };

  return (
    <div className="funding-rounds-config">
      <div className="config-header">
        <h2>💰 Funding Rounds Configuration</h2>
        <p>Manage your startup's funding rounds, SAFEs, and valuations</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">🏦</div>
          <div className="card-content">
            <h3>Total Capital Raised</h3>
            <div className="card-value">${totalCapitalRaised.toLocaleString()}</div>
            <div className="card-subtitle">{localRounds.length} rounds</div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <h3>Current Valuation</h3>
            <div className="card-value">${localCurrentValuation.toLocaleString()}</div>
            <div className="card-subtitle">Latest round</div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3>Average Valuation</h3>
            <div className="card-value">${averageValuation.toLocaleString()}</div>
            <div className="card-subtitle">Across all rounds</div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon">🎯</div>
          <div className="card-content">
            <h3>Round Types</h3>
            <div className="card-value">
              {localRounds.filter(r => r.roundType === 'SAFE').length} SAFE / 
              {localRounds.filter(r => r.roundType === 'Priced Round').length} Priced
            </div>
            <div className="card-subtitle">Distribution</div>
          </div>
        </div>
      </div>

      {/* Current Valuation Input */}
      <div className="valuation-section">
        <div className="section-header">
          <h3>🎯 Current Company Valuation</h3>
          <p>Set the current valuation for calculations and future rounds</p>
        </div>
        <div className="valuation-input">
          <label htmlFor="currentValuation">Current Valuation ($)</label>
          <div className="input-group">
            <span className="input-prefix">$</span>
            <input
              id="currentValuation"
              type="number"
              value={localCurrentValuation}
              onChange={(e) => setLocalCurrentValuation(parseFloat(e.target.value) || 0)}
              placeholder="Enter current valuation"
              min="0"
              step="1000"
            />
          </div>
        </div>
      </div>

      {/* Controls and Filters */}
      <div className="controls-section">
        <div className="controls-left">
          <button 
            type="button"
            className="add-round-btn"
            onClick={openAddRoundModal}
          >
            ➕ Add Funding Round
          </button>
        </div>
        
        <div className="controls-right">
          <input
            type="text"
            placeholder="Search rounds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="SAFE">SAFE Only</option>
            <option value="Priced Round">Priced Rounds Only</option>
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="capitalRaised">Sort by Capital</option>
            <option value="valuation">Sort by Valuation</option>
          </select>
          
          <button 
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-order-btn"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Funding Rounds List */}
      <div className="rounds-section">
        {localRounds.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💼</div>
            <h3>No Funding Rounds Yet</h3>
            <p>Start by adding your first funding round to track your startup's funding journey</p>
            <button onClick={openAddRoundModal} className="add-first-round-btn">
              ➕ Add First Round
            </button>
          </div>
        ) : (
          <div className="rounds-grid">
            {filteredRounds.map((round) => (
              <div key={round.id} className="round-card">
                <div className="round-header">
                  <div className="round-type-badge">
                    {round.roundType === 'SAFE' ? '🔒 SAFE' : '💰 Priced'}
                  </div>
                  <div className="round-actions">
                    <button 
                      onClick={() => handleEditRound(round)}
                      className="edit-btn"
                      title="Edit Round"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDeleteRound(round.id)}
                      className="delete-btn"
                      title="Delete Round"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                <div className="round-content">
                  <h4 className="round-name">{round.name}</h4>
                  <div className="round-date">{new Date(round.date).toLocaleDateString()}</div>
                  
                  <div className="round-metrics">
                    <div className="metric">
                      <span className="metric-label">Capital Raised:</span>
                      <span className="metric-value">${round.capitalRaised.toLocaleString()}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Valuation:</span>
                      <span className="metric-value">${round.valuation.toLocaleString()}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Type:</span>
                      <span className="metric-value">{round.valuationType}</span>
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
                  
                  <div className="round-investors">
                    <span className="investors-label">Investors:</span>
                    <div className="investors-list">
                      {round.investors.map((investor, index) => (
                        <span key={index} className="investor-tag">{investor}</span>
                      ))}
                    </div>
                  </div>
                  
                  {round.notes && (
                    <div className="round-notes">
                      <span className="notes-label">Notes:</span>
                      <p>{round.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="save-section">
        <button 
          onClick={handleSave}
          className={`save-button ${isSaving ? 'saving' : ''} ${isSaved ? 'saved' : ''}`}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : isSaved ? 'Saved Successfully!' : 'Save Configuration'}
        </button>
      </div>

      {/* Add/Edit Round Modal */}
      {isModalOpen && (
        <div className="round-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{modalTitle}</h3>
              <button 
                onClick={closeModal}
                className="close-btn"
              >
                ✕
              </button>
            </div>
            
            {validationErrors.length > 0 && (
              <div className="validation-errors">
                {validationErrors.map((error, index) => (
                  <div key={index} className="error-message">⚠️ {error}</div>
                ))}
              </div>
            )}
            
            <div className="round-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Round Name *</label>
                  <input
                    type="text"
                    value={newRound.name}
                    onChange={(e) => setNewRound({...newRound, name: e.target.value})}
                    placeholder="e.g., Seed Round, Series A"
                  />
                </div>
                <div className="form-group">
                  <label>Round Date *</label>
                  <input
                    type="date"
                    value={newRound.date}
                    onChange={(e) => setNewRound({...newRound, date: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Round Type *</label>
                  <select
                    value={newRound.roundType}
                    onChange={(e) => setNewRound({...newRound, roundType: e.target.value as any})}
                  >
                    <option value="SAFE">SAFE (Simple Agreement for Future Equity)</option>
                    <option value="Priced Round">Priced Round (Direct Investment)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Capital Raised ($) *</label>
                  <input
                    type="number"
                    value={newRound.capitalRaised}
                    onChange={(e) => setNewRound({...newRound, capitalRaised: parseFloat(e.target.value) || 0})}
                    placeholder="Amount raised"
                    min="0"
                    step="1000"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Valuation ($) *</label>
                  <input
                    type="number"
                    value={newRound.valuation}
                    onChange={(e) => setNewRound({...newRound, valuation: parseFloat(e.target.value) || 0})}
                    placeholder="Company valuation"
                    min="0"
                    step="1000"
                  />
                </div>
                <div className="form-group">
                  <label>Valuation Type *</label>
                  <select
                    value={newRound.valuationType}
                    onChange={(e) => setNewRound({...newRound, valuationType: e.target.value as any})}
                  >
                    <option value="pre-money">Pre-Money</option>
                    <option value="post-money">Post-Money</option>
                  </select>
                </div>
              </div>
              
              {newRound.roundType === 'SAFE' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Valuation Cap ($) *</label>
                      <input
                        type="number"
                        value={newRound.valuationCap}
                        onChange={(e) => setNewRound({...newRound, valuationCap: parseFloat(e.target.value) || 0})}
                        placeholder="Maximum valuation cap"
                        min="0"
                        step="1000"
                      />
                    </div>
                    <div className="form-group">
                      <label>Discount Rate (%)</label>
                      <input
                        type="number"
                        value={newRound.discountRate}
                        onChange={(e) => setNewRound({...newRound, discountRate: parseFloat(e.target.value) || 0})}
                        placeholder="Discount percentage"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Conversion Trigger</label>
                    <select
                      value={newRound.conversionTrigger}
                      onChange={(e) => setNewRound({...newRound, conversionTrigger: e.target.value as any})}
                    >
                      <option value="next-round">Next Funding Round</option>
                      <option value="exit">Exit Event</option>
                      <option value="ipo">IPO</option>
                    </select>
                  </div>
                </>
              )}
              
              {newRound.roundType === 'Priced Round' && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Shares Issued *</label>
                    <input
                      type="number"
                      value={newRound.sharesIssued}
                      onChange={(e) => setNewRound({...newRound, sharesIssued: parseInt(e.target.value) || 0})}
                      placeholder="Number of shares issued"
                      min="0"
                      step="1000"
                    />
                  </div>
                  <div className="form-group">
                    <label>Share Price ($) *</label>
                    <input
                      type="number"
                      value={newRound.sharePrice}
                      onChange={(e) => setNewRound({...newRound, sharePrice: parseFloat(e.target.value) || 0})}
                      placeholder="Price per share"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              )}
              
              <div className="form-group">
                <label>Investors *</label>
                <div className="investors-input">
                  {newRound.investors?.map((investor, index) => (
                    <div key={index} className="investor-input-row">
                      <input
                        type="text"
                        value={investor}
                        onChange={(e) => updateInvestor(index, e.target.value)}
                        placeholder={`Investor ${index + 1}`}
                      />
                      {newRound.investors!.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => removeInvestor(index)}
                          className="remove-investor-btn"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={addInvestor}
                    className="add-investor-btn"
                  >
                    ➕ Add Investor
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={newRound.notes}
                  onChange={(e) => setNewRound({...newRound, notes: e.target.value})}
                  placeholder="Additional notes about this round"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                onClick={closeModal}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button 
                onClick={handleModalAction}
                className="save-btn"
                disabled={!newRound.name || !newRound.capitalRaised || !newRound.valuation}
              >
                {modalAction}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundingRoundsConfiguration;







