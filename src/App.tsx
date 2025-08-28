import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy, useRef } from 'react';
import { supabase } from './lib/supabase';
import './App.css';

// Lazy load heavy components for code splitting
const CompanyModal = lazy(() => import('./components/CompanyModal'));
const ScenarioList = lazy(() => import('./components/ScenarioList'));
const ResultsDisplay = lazy(() => import('./components/ResultsDisplay'));

// Enhanced type definitions
interface Founder {
  id: string;
  name: string;
  shares: number;
  ownership: number;
  value: number;
  initialOwnership: number;
  dilutionHistory: number[];
}

interface FundingRound {
  id: string;
  name: string;
  capitalRaised: number;
  valuation: number;
  type: 'priced' | 'safe' | 'convertible_note';
  esopAdjustment: number;
  preMoneyValuation: number;
  postMoneyValuation: number;
  investorOwnership: number;
  founderDilution: number;
}

interface Company {
  id: string;
  name: string;
  description?: string;
  industry?: string;
  foundedDate?: string;
}

interface Scenario {
  id: string;
  name: string;
  companyId: string;
  data: {
    founders: Founder[];
    fundingRounds: FundingRound[];
    esopPool: number;
    exitValuation: number;
    totalShares: number;
  };
  created_at: string;
  updated_at: string;
}

interface FounderCardProps {
  founder: Founder;
  onUpdate: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
  index: number;
  totalShares: number;
  isEditable: boolean;
}

interface FundingRoundCardProps {
  round: FundingRound;
  onUpdate: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
  index: number;
  isEditable: boolean;
}

// Enhanced debounced input hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Enhanced memoized founder card with better UI
const MemoizedFounderCard = React.memo<FounderCardProps>(({ founder, onUpdate, onRemove, index, totalShares, isEditable }) => {
  const handleChange = useCallback((field: string, value: any) => {
    onUpdate(index, field, value);
  }, [index, onUpdate]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange('name', e.target.value);
  }, [handleChange]);

  const handleSharesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const shares = parseInt(e.target.value) || 0;
    handleChange('shares', shares);
  }, [handleChange]);

  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [onRemove, index]);

  const ownershipPercentage = totalShares > 0 ? (founder.shares / totalShares) * 100 : 0;

  return (
    <div className="founder-card enhanced">
      <div className="founder-header">
        <div className="founder-title">
          <h4>Founder {index + 1}</h4>
          {isEditable && (
            <button
              className="remove-founder-button"
              onClick={handleRemove}
              title="Remove Founder"
              aria-label="Remove founder"
            >
              <span className="icon">×</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="founder-content">
        <div className="input-group">
          <label htmlFor={`founder-name-${index}`}>Name</label>
          <input
            id={`founder-name-${index}`}
            type="text"
            className="founder-name-input"
            value={founder.name}
            onChange={handleNameChange}
            placeholder="Enter founder name"
            disabled={!isEditable}
          />
        </div>
        
        <div className="input-group">
          <label htmlFor={`founder-shares-${index}`}>Shares</label>
          <input
            id={`founder-shares-${index}`}
            type="number"
            value={founder.shares}
            onChange={handleSharesChange}
            min="0"
            step="1"
            disabled={!isEditable}
          />
        </div>
        
        <div className="founder-stats">
          <div className="stat-item">
            <span className="stat-label">Ownership</span>
            <span className="stat-value ownership">{ownershipPercentage.toFixed(2)}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Current Value</span>
            <span className="stat-value value">${founder.value?.toLocaleString() || '0'}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Initial</span>
            <span className="stat-value initial">{founder.initialOwnership?.toFixed(2) || '0'}%</span>
          </div>
        </div>
      </div>
    </div>
  );
});

// Enhanced memoized funding round card
const MemoizedFundingRoundCard = React.memo<FundingRoundCardProps>(({ round, onUpdate, onRemove, index, isEditable }) => {
  const handleChange = useCallback((field: string, value: any) => {
    onUpdate(index, field, value);
  }, [index, onUpdate]);

  const handleCapitalChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange('capitalRaised', parseFloat(e.target.value) || 0);
  }, [handleChange]);

  const handleValuationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange('valuation', parseFloat(e.target.value) || 0);
  }, [handleChange]);

  const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange('type', e.target.value);
  }, [handleChange]);

  const handleESOPChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange('esopAdjustment', parseFloat(e.target.value) || 0);
  }, [handleChange]);

  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [onRemove, index]);

  return (
    <div className="funding-round-card enhanced">
      <div className="round-header">
        <div className="round-title">
          <h4>{round.name}</h4>
          {isEditable && (
            <button
              className="remove-button"
              onClick={handleRemove}
              title="Remove Round"
              aria-label="Remove funding round"
            >
              <span className="icon">×</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="round-content">
        <div className="round-inputs">
          <div className="input-group">
            <label htmlFor={`capital-${index}`}>Capital Raised ($)</label>
            <input
              id={`capital-${index}`}
              type="number"
              value={round.capitalRaised}
              onChange={handleCapitalChange}
              min="0"
              step="1000"
              disabled={!isEditable}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor={`valuation-${index}`}>Valuation ($)</label>
            <input
              id={`capital-${index}`}
              type="number"
              value={round.valuation}
              onChange={handleValuationChange}
              min="0"
              step="1000"
              disabled={!isEditable}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor={`type-${index}`}>Round Type</label>
            <select
              id={`type-${index}`}
              value={round.type}
              onChange={handleTypeChange}
              disabled={!isEditable}
            >
              <option value="priced">Priced Round</option>
              <option value="safe">SAFE</option>
              <option value="convertible_note">Convertible Note</option>
            </select>
          </div>
          
          <div className="input-group">
            <label htmlFor={`esop-${index}`}>ESOP Adjustment (%)</label>
            <input
              id={`esop-${index}`}
              type="number"
              value={round.esopAdjustment}
              onChange={handleESOPChange}
              min="0"
              max="100"
              step="0.1"
              disabled={!isEditable}
            />
          </div>
        </div>
        
        <div className="round-stats">
          <div className="stat-item">
            <span className="stat-label">Pre-Money</span>
            <span className="stat-value">${round.preMoneyValuation?.toLocaleString() || '0'}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Post-Money</span>
            <span className="stat-value">${round.postMoneyValuation?.toLocaleString() || '0'}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Investor %</span>
            <span className="stat-value">{round.investorOwnership?.toFixed(2) || '0'}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Founder Dilution</span>
            <span className="stat-value dilution">{round.founderDilution?.toFixed(2) || '0'}%</span>
          </div>
        </div>
      </div>
    </div>
  );
});

// Enhanced memoized tab button
const MemoizedTabButton = React.memo<{ active: boolean; onClick: () => void; children: React.ReactNode }>(({ active, onClick, children }) => (
  <button
    className={`nav-tab ${active ? 'active' : ''}`}
    onClick={onClick}
  >
    {children}
  </button>
));

// Main App component
function App() {
  // Enhanced state management
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [activeTab, setActiveTab] = useState<'company' | 'founders' | 'funding' | 'exit'>('company');
  
  // Company modal state
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyDescription, setNewCompanyDescription] = useState('');
  const [newCompanyIndustry, setNewCompanyIndustry] = useState('');
  
  // Scenario state
  const [scenarioName, setScenarioName] = useState('');
  const [founders, setFounders] = useState<Founder[]>([
    { id: '1', name: 'Founder 1', shares: 1000000, ownership: 45, value: 0, initialOwnership: 45, dilutionHistory: [45] },
    { id: '2', name: 'Founder 2', shares: 1000000, ownership: 45, value: 0, initialOwnership: 45, dilutionHistory: [45] }
  ]);
  const [fundingRounds, setFundingRounds] = useState<FundingRound[]>([]);
  const [esopPool, setEsopPool] = useState(10);
  const [exitValuation, setExitValuation] = useState(10000000);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Refs for performance
  const companiesRef = useRef<Company[]>([]);
  const scenariosRef = useRef<Scenario[]>([]);
  
  // Debounced scenario name
  const debouncedScenarioName = useDebounce(scenarioName, 300);

  // Memoized calculations for better performance
  const totalFounderShares = useMemo(() => 
    founders.reduce((sum, founder) => sum + founder.shares, 0), 
    [founders]
  );

  const totalAllocation = useMemo(() => 
    founders.reduce((sum, founder) => sum + founder.ownership, 0) + esopPool, 
    [founders, esopPool]
  );

  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    if (Math.abs(totalAllocation - 100) > 0.01) {
      errors.push(`Total equity allocation must equal 100%. Current: ${totalAllocation.toFixed(2)}%`);
    }
    if (founders.some(f => f.name.trim() === '')) {
      errors.push('All founders must have names');
    }
    if (founders.some(f => f.shares <= 0)) {
      errors.push('All founders must have positive shares');
    }
    return errors;
  }, [totalAllocation, founders]);

  // Memoized company options
  const companyOptions = useMemo(() => 
    companies.map(company => (
      <option key={company.id} value={company.id}>
        {company.name}
      </option>
    )), 
    [companies]
  );



  // Enhanced functions with better error handling
  const loadCompanies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading companies:', error);
        setError('Failed to load companies');
        setCompanies([]);
        companiesRef.current = [];
        return;
      }

      setCompanies(data || []);
      companiesRef.current = data || [];
      
      if (data && data.length > 0 && !selectedCompanyId) {
        setSelectedCompanyId(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load companies:', error);
      setError('Failed to load companies');
      setCompanies([]);
      companiesRef.current = [];
    } finally {
      setIsLoading(false);
    }
  }, [selectedCompanyId]);

  const loadSavedScenarios = useCallback(async () => {
    if (!selectedCompanyId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .eq('company_id', selectedCompanyId)
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error loading scenarios:', error);
        setError('Failed to load scenarios');
        return;
      }

      setScenarios(data || []);
      scenariosRef.current = data || [];
    } catch (error) {
      console.error('Failed to load scenarios:', error);
      setError('Failed to load scenarios');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCompanyId]);

  const createCompany = useCallback(async () => {
    if (!newCompanyName.trim()) {
      setError('Please enter a company name');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const companyData = {
        name: newCompanyName.trim(),
        description: newCompanyDescription.trim() || null,
        industry: newCompanyIndustry.trim() || null
      };

      const { data, error } = await supabase
        .from('companies')
        .insert([companyData])
        .select();

      if (error) {
        console.error('Error creating company:', error);
        setError('Failed to create company');
        return;
      }

      setSuccess('Company created successfully!');
      setNewCompanyName('');
      setNewCompanyDescription('');
      setNewCompanyIndustry('');
      setShowCompanyModal(false);
      await loadCompanies();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Failed to create company:', error);
      setError('Failed to create company');
    } finally {
      setIsLoading(false);
    }
  }, [newCompanyName, newCompanyDescription, newCompanyIndustry, loadCompanies]);

  const saveScenario = useCallback(async () => {
    if (!debouncedScenarioName.trim()) {
      setError('Please enter a scenario name');
      return;
    }

    if (!selectedCompanyId) {
      setError('Please select a company first');
      return;
    }

    if (validationErrors.length > 0) {
      setError('Please fix validation errors before saving');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const scenarioData = {
        company_id: selectedCompanyId,
        name: debouncedScenarioName.trim(),
        data: {
          founders,
          esopPool,
          fundingRounds,
          exitValuation,
          totalShares: totalFounderShares
        }
      };

      const { error } = await supabase
        .from('scenarios')
        .insert([scenarioData]);

      if (error) {
        console.error('Error saving scenario:', error);
        setError('Failed to save scenario');
        return;
      }

      setSuccess('Scenario saved successfully!');
      setScenarioName('');
      await loadSavedScenarios();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Failed to save scenario:', error);
      setError('Failed to save scenario');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedScenarioName, selectedCompanyId, founders, esopPool, fundingRounds, exitValuation, totalFounderShares, validationErrors, loadSavedScenarios]);

  const loadScenario = useCallback(async (scenarioId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .eq('id', scenarioId)
        .single();

      if (error) {
        console.error('Error loading scenario:', error);
        setError('Failed to load scenario');
        return;
      }

      const scenario = data.data;
      setFounders(scenario.founders || []);
      setEsopPool(scenario.esopPool || 10);
      setFundingRounds(scenario.fundingRounds || []);
      setExitValuation(scenario.exitValuation || 10000000);
      setScenarioName(data.name);
      setActiveTab('founders');
      setSuccess('Scenario loaded successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Failed to load scenario:', error);
      setError('Failed to load scenario');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteScenario = useCallback(async (scenarioId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('scenarios')
        .update({ is_active: false })
        .eq('id', scenarioId);

      if (error) {
        console.error('Error deleting scenario:', error);
        setError('Failed to delete scenario');
        return;
      }

      await loadSavedScenarios();
      setSuccess('Scenario deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Failed to delete scenario:', error);
      setError('Failed to delete scenario');
    } finally {
      setIsLoading(false);
    }
  }, [loadSavedScenarios]);

  const addFounder = useCallback(() => {
    const newFounder: Founder = {
      id: Date.now().toString(),
      name: `Founder ${founders.length + 1}`,
      shares: 0,
      ownership: 0,
      value: 0,
      initialOwnership: 0,
      dilutionHistory: [0]
    };
    setFounders(prev => [...prev, newFounder]);
  }, [founders.length]);

  const removeFounder = useCallback((index: number) => {
    setFounders(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateFounder = useCallback((index: number, field: string, value: any) => {
    setFounders(prev => prev.map((founder, i) => 
      i === index ? { ...founder, [field]: value } : founder
    ));
  }, []);

  const addFundingRound = useCallback(() => {
    const newRound: FundingRound = {
      id: Date.now().toString(),
      name: `Round ${fundingRounds.length + 1}`,
      capitalRaised: 0,
      valuation: 0,
      type: 'priced',
      esopAdjustment: 0,
      preMoneyValuation: 0,
      postMoneyValuation: 0,
      investorOwnership: 0,
      founderDilution: 0
    };
    setFundingRounds(prev => [...prev, newRound]);
  }, [fundingRounds.length]);

  const removeFundingRound = useCallback((index: number) => {
    setFundingRounds(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateFundingRound = useCallback((index: number, field: string, value: any) => {
    setFundingRounds(prev => prev.map((round, i) => 
      i === index ? { ...round, [field]: value } : round
    ));
  }, []);

  const autoBalanceFounders = useCallback(() => {
    if (founders.length === 0) return;
    
    const remainingEquity = 100 - esopPool;
    const equityPerFounder = remainingEquity / founders.length;
    
    setFounders(prev => prev.map((founder, index) => ({
      ...founder,
      ownership: index === prev.length - 1 
        ? remainingEquity - (equityPerFounder * (prev.length - 1))
        : equityPerFounder,
      initialOwnership: index === prev.length - 1 
        ? remainingEquity - (equityPerFounder * (prev.length - 1))
        : equityPerFounder
    })));
  }, [founders.length, esopPool]);

  const updateScenario = useCallback(() => {
    // Enhanced calculations with funding round impact
    let currentTotalShares = totalFounderShares;
    let currentFounders = [...founders];
    
    // Calculate impact of each funding round
    fundingRounds.forEach((round, index) => {
      if (round.capitalRaised > 0 && round.valuation > 0) {
        const preMoneyShares = currentTotalShares;
        const newShares = (round.capitalRaised / round.valuation) * preMoneyShares;
        const postMoneyShares = preMoneyShares + newShares;
        
        // Update round calculations
        round.preMoneyValuation = round.valuation;
        round.postMoneyValuation = round.valuation + round.capitalRaised;
        round.investorOwnership = (newShares / postMoneyShares) * 100;
        round.founderDilution = (newShares / postMoneyShares) * 100;
        
        // Update founder ownership
        currentFounders = currentFounders.map(founder => ({
          ...founder,
          ownership: (founder.ownership * preMoneyShares) / postMoneyShares,
          dilutionHistory: [...founder.dilutionHistory, (founder.ownership * preMoneyShares) / postMoneyShares]
        }));
        
        currentTotalShares = postMoneyShares;
      }
    });
    
    // Update founders with new calculations
    setFounders(currentFounders.map(founder => ({
      ...founder,
      value: (founder.ownership / 100) * exitValuation
    })));
    
    setSuccess('Scenario updated successfully!');
    setTimeout(() => setSuccess(null), 3000);
  }, [totalFounderShares, founders, fundingRounds, exitValuation]);

  const handleTabClick = useCallback((tab: 'company' | 'founders' | 'funding' | 'exit') => {
    setActiveTab(tab);
  }, []);

  // Memoized founder cards
  const founderCards = useMemo(() => 
    founders.map((founder, index) => (
      <MemoizedFounderCard
        key={`${founder.id}-${index}`}
        founder={founder}
        onUpdate={updateFounder}
        onRemove={removeFounder}
        index={index}
        totalShares={totalFounderShares}
        isEditable={activeTab === 'founders'}
      />
    )), 
    [founders, updateFounder, removeFounder, totalFounderShares, activeTab]
  );

  // Memoized funding round cards
  const fundingRoundCards = useMemo(() => 
    fundingRounds.map((round, index) => (
      <MemoizedFundingRoundCard
        key={`${round.id}-${index}`}
        round={round}
        onUpdate={updateFundingRound}
        onRemove={removeFundingRound}
        index={index}
        isEditable={activeTab === 'funding'}
      />
    )), 
    [fundingRounds, updateFundingRound, removeFundingRound, activeTab]
  );

  // Load data on mount and when company changes
  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  useEffect(() => {
    if (selectedCompanyId) {
      loadSavedScenarios();
    }
  }, [selectedCompanyId, loadSavedScenarios]);

  // Clear messages after delay
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>🚀 Startup Value Simulator</h1>
          <p>Model ownership changes across funding rounds and calculate founder payouts</p>
          
          <div className="header-actions">
            <input
              type="text"
              placeholder="Enter scenario name..."
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              className="scenario-name-input"
            />
            <button
              className="save-button primary"
              onClick={saveScenario}
              disabled={validationErrors.length > 0 || !selectedCompanyId || isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Scenario'}
            </button>
            {/* Debug info */}
            <div className="debug-info">
              <small>
                Total: {totalAllocation.toFixed(2)}% | 
                Company: {selectedCompanyId ? 'Selected' : 'None'} | 
                Errors: {validationErrors.length}
              </small>
            </div>
          </div>
        </div>
      </header>

      {/* Status Messages */}
      {error && (
        <div className="status-message error">
          <span className="icon">⚠️</span>
          {error}
          <button onClick={() => setError(null)} className="close-button">×</button>
        </div>
      )}
      
      {success && (
        <div className="status-message success">
          <span className="icon">✅</span>
          {success}
          <button onClick={() => setSuccess(null)} className="close-button">×</button>
        </div>
      )}

      <nav className="dashboard-nav">
        <div className="nav-tabs">
          <MemoizedTabButton
            active={activeTab === 'company'}
            onClick={() => handleTabClick('company')}
          >
            🏢 Company
          </MemoizedTabButton>
          <MemoizedTabButton
            active={activeTab === 'founders'}
            onClick={() => handleTabClick('founders')}
          >
            👥 Founders
          </MemoizedTabButton>
          <MemoizedTabButton
            active={activeTab === 'funding'}
            onClick={() => handleTabClick('funding')}
          >
            💰 Funding
          </MemoizedTabButton>
          <MemoizedTabButton
            active={activeTab === 'exit'}
            onClick={() => handleTabClick('exit')}
          >
            🚀 Exit
          </MemoizedTabButton>
        </div>
      </nav>

      <main className="App-main">
        {activeTab === 'company' && (
          <div className="tab-content company-tab">
            <h2>🏢 Company Management</h2>
            <div className="company-selector">
              <select
                className="company-select"
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
              >
                <option value="">Select a Company</option>
                {companyOptions}
              </select>
              <button
                className="add-company-button primary"
                onClick={() => setShowCompanyModal(true)}
              >
                + New Company
              </button>
            </div>
            
            {selectedCompanyId && (
              <div className="scenarios-section">
                <h3>Company Scenarios</h3>
                <Suspense fallback={<div className="loading">Loading scenarios...</div>}>
                  <ScenarioList
                    scenarios={scenarios}
                    onLoad={loadScenario}
                    onDelete={deleteScenario}
                  />
                </Suspense>
              </div>
            )}
          </div>
        )}

        {activeTab === 'founders' && (
          <div className="tab-content founders-tab">
            <div className="section-header">
              <h2>👥 Founders & Equity</h2>
              <div className="header-actions">
                <button className="add-founder-button secondary" onClick={addFounder}>
                  + Add Founder
                </button>
                <button className="balance-button secondary" onClick={autoBalanceFounders}>
                  Auto-Balance
                </button>
              </div>
            </div>

            {validationErrors.length > 0 && (
              <div className="validation-errors">
                {validationErrors.map((error, index) => (
                  <div key={index} className="validation-message error">
                    <span className="icon">⚠️</span>
                    {error}
                  </div>
                ))}
              </div>
            )}

            <div className="founders-grid">
              {founderCards}
            </div>

            <div className="equity-summary">
              <div className="summary-item">
                <span className="label">Total Founder Shares:</span>
                <span className="value">{totalFounderShares.toLocaleString()}</span>
              </div>
              <div className="summary-item">
                <span className="label">ESOP Pool:</span>
                <span className="value">{esopPool}%</span>
              </div>
              <div className={`summary-item ${Math.abs(totalAllocation - 100) < 0.01 ? 'success' : 'error'}`}>
                <span className="label">Total Allocation:</span>
                <span className="value">{totalAllocation.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'funding' && (
          <div className="tab-content funding-tab">
            <div className="section-header">
              <h2>💰 Funding Rounds</h2>
              <button className="add-button secondary" onClick={addFundingRound}>
                + Add Funding Round
              </button>
            </div>
            
            <div className="funding-rounds">
              {fundingRoundCards}
            </div>
          </div>
        )}

        {activeTab === 'exit' && (
          <div className="tab-content exit-tab">
            <h2>🚀 Exit Scenario</h2>
            
            <div className="exit-inputs">
              <div className="input-group">
                <label htmlFor="exit-valuation">Exit Valuation ($)</label>
                <input
                  id="exit-valuation"
                  type="number"
                  value={exitValuation}
                  onChange={(e) => setExitValuation(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="100000"
                  className="exit-valuation-input"
                />
              </div>
            </div>

            <button
              className="update-button primary"
              onClick={updateScenario}
              disabled={validationErrors.length > 0 || isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Scenario & Calculate'}
            </button>

            {founders.some(f => f.value > 0) && (
              <Suspense fallback={<div className="loading">Loading results...</div>}>
                <ResultsDisplay
                  founders={founders}
                  esopPool={esopPool}
                  fundingRounds={fundingRounds}
                  exitValuation={exitValuation}
                />
              </Suspense>
            )}
          </div>
        )}
      </main>

      {showCompanyModal && (
        <Suspense fallback={<div className="loading">Loading modal...</div>}>
          <CompanyModal
            isOpen={showCompanyModal}
            onClose={() => setShowCompanyModal(false)}
            onSubmit={createCompany}
            companyName={newCompanyName}
            companyDescription={newCompanyDescription}
            companyIndustry={newCompanyIndustry}
            onCompanyNameChange={setNewCompanyName}
            onCompanyDescriptionChange={setNewCompanyDescription}
            onCompanyIndustryChange={setNewCompanyIndustry}
            isLoading={isLoading}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;


