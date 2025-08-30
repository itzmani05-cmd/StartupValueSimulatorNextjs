import React, { useState, useEffect } from 'react';
import './App.css';
import ESOPTab from './components/ESOPTab';
import ResultsDisplay from './components/ResultsDisplay';
import ScenarioList from './components/ScenarioList';
import CompanyModal from './components/CompanyModal';
import CompanyDashboard from './components/CompanyDashboard';
import Charts from './components/Charts';
import ErrorBoundary from './components/ErrorBoundary';
import FounderConfiguration from './components/FounderConfiguration';
import FundingRoundsConfiguration from './components/FundingRoundsConfiguration';
import WhatIfAnalysis from './components/WhatIfAnalysis';
import ExitScenarioModeling from './components/ExitScenarioModeling';
import CommentSystem from './components/CommentSystem';
import { 
  getCompanies, 
  createCompany, 
  updateCompany, 
  deleteCompany,
  getFounders,
  getFundingRounds,
  getEsopGrants,
  getCompanySettings,
  createCompanySettings,
  saveCompanyData,
  getScenarios,
  createScenario,
  updateScenario,
  deleteScenario
} from './lib/supabase';

function App() {
  // Tab state
  const [activeTab, setActiveTab] = useState('companies');
  
  // Default state values to prevent runtime errors
  const [founders, setFounders] = useState([
    { id: 'founder-1', name: 'Founder 1', equityPercentage: 60, shares: 6000000, role: 'CEO' },
    { id: 'founder-2', name: 'Founder 2', equityPercentage: 30, shares: 3000000, role: 'CTO' }
  ]);
  
  const [esopPool, setEsopPool] = useState(10);
  const [totalShares, setTotalShares] = useState(10000000);
  const [fundingRounds, setFundingRounds] = useState([
    { 
      id: 'round-1',
      name: 'Seed Round', 
      roundType: 'SAFE' as 'SAFE' | 'Priced Round',
      capitalRaised: 1000000, 
      valuation: 5000000, 
      valuationType: 'pre-money' as 'pre-money' | 'post-money',
      valuationCap: 5000000,
      discountRate: 20,
      conversionTrigger: 'next-round' as 'next-round' | 'exit' | 'ipo',
      investors: ['Angel Investor 1'],
      date: new Date().toISOString().split('T')[0],
      notes: 'Initial seed funding'
    }
  ]);
  const [exitValuation, setExitValuation] = useState(10000000);
  
  const [scenarios, setScenarios] = useState([
    { id: '1', name: 'Default Scenario', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ]);
  
  const [esopGrants, setEsopGrants] = useState([
    {
      id: 'grant-1',
      employeeName: 'Sarah Johnson',
      employeeId: 'EMP001',
      position: 'Senior Software Engineer',
      department: 'Engineering',
      grantDate: '2023-01-15',
      sharesGranted: 50000,
      vestingSchedule: '4-year' as '4-year' | '3-year' | '2-year' | 'custom',
      cliffPeriod: 12,
      vestingFrequency: 'monthly' as 'monthly' | 'quarterly' | 'annually',
      exercisePrice: 0.01,
      status: 'active' as 'active' | 'terminated' | 'fully-vested',
      notes: 'Key engineering hire, leading backend development'
    },
    {
      id: 'grant-2',
      employeeName: 'Michael Chen',
      employeeId: 'EMP002',
      position: 'Product Manager',
      department: 'Product',
      grantDate: '2023-03-20',
      sharesGranted: 75000,
      vestingSchedule: '4-year' as '4-year' | '3-year' | '2-year' | 'custom',
      cliffPeriod: 12,
      vestingFrequency: 'monthly' as 'monthly' | 'quarterly' | 'annually',
      exercisePrice: 0.01,
      status: 'active' as 'active' | 'terminated' | 'fully-vested',
      notes: 'Product strategy and roadmap development'
    },
    {
      id: 'grant-3',
      employeeName: 'Emily Rodriguez',
      employeeId: 'EMP003',
      position: 'Marketing Director',
      department: 'Marketing',
      grantDate: '2022-11-10',
      sharesGranted: 60000,
      vestingSchedule: '3-year' as '4-year' | '3-year' | '2-year' | 'custom',
      cliffPeriod: 6,
      vestingFrequency: 'quarterly' as 'monthly' | 'quarterly' | 'annually',
      exercisePrice: 0.005,
      status: 'active' as 'active' | 'terminated' | 'fully-vested',
      notes: 'Brand development and growth marketing'
    }
  ]);
  const [currentValuation, setCurrentValuation] = useState(5000000);
  
  // Company management state
  const [companies, setCompanies] = useState([
    {
      id: 'company-1',
      name: 'TechStart Inc.',
      description: 'AI-powered SaaS platform',
      industry: 'Technology',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isCompanyLoading, setIsCompanyLoading] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState('company-1');
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Load data from database on component mount
  useEffect(() => {
    loadCompaniesFromDatabase();
  }, []);

  // Load company data when selected company changes
  useEffect(() => {
    if (selectedCompanyId && selectedCompanyId !== 'company-1') {
      loadCompanyDataFromDatabase(selectedCompanyId);
    }
  }, [selectedCompanyId]);

  const loadCompaniesFromDatabase = async () => {
    try {
      setIsLoading(true);
      const companiesData = await getCompanies();
      if (companiesData && companiesData.length > 0) {
        setCompanies(companiesData.map(company => ({
          id: company.id,
          name: company.name,
          description: company.description || '',
          industry: company.industry || 'Technology',
          createdAt: company.created_at,
          updatedAt: company.updated_at
        })));
        setSelectedCompanyId(companiesData[0].id);
      }
    } catch (error) {
      console.error('Failed to load companies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCompanyDataFromDatabase = async (companyId: string) => {
    try {
      setIsLoading(true);
      
      // Load founders
      const foundersData = await getFounders(companyId);
      if (foundersData) {
        setFounders(foundersData.map(founder => ({
          id: founder.id,
          name: founder.name,
          equityPercentage: founder.equity_percentage,
          shares: founder.shares,
          role: founder.role || ''
        })));
      }

      // Load funding rounds
      const fundingRoundsData = await getFundingRounds(companyId);
      if (fundingRoundsData) {
        setFundingRounds(fundingRoundsData.map(round => ({
          id: round.id,
          name: round.name,
          roundType: (round.round_type === 'SAFE' ? 'SAFE' : 'Priced Round') as 'SAFE' | 'Priced Round',
          capitalRaised: round.capital_raised || round.investment_amount || 0,
          valuation: round.valuation || round.pre_money_valuation || 0,
          valuationType: (round.valuation_type === 'pre-money' ? 'pre-money' : 'post-money') as 'pre-money' | 'post-money',
          sharesIssued: round.shares_issued || 0,
          sharePrice: round.share_price || 0,
          valuationCap: round.valuation_cap || 0,
          discountRate: round.discount_rate || 0,
          conversionTrigger: (round.conversion_trigger === 'next_round' ? 'next-round' : 
                             round.conversion_trigger === 'exit' ? 'exit' : 'ipo') as 'next-round' | 'exit' | 'ipo',
          investors: Array.isArray(round.investors) ? round.investors : [],
          date: round.round_date || round.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          notes: round.notes || ''
        })));
      }

      // Load ESOP grants
      const esopGrantsData = await getEsopGrants(companyId);
      if (esopGrantsData) {
        setEsopGrants(esopGrantsData.map(grant => ({
          id: grant.id,
          employeeName: grant.employee_name,
          employeeId: grant.employee_id || '',
          position: grant.position || '',
          department: grant.department || '',
          grantDate: grant.grant_date || grant.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          sharesGranted: grant.shares_granted || 0,
          vestingSchedule: (grant.vesting_schedule === '3-year' ? '3-year' : 
                           grant.vesting_schedule === '4-year' ? '4-year' : 
                           grant.vesting_schedule === '2-year' ? '2-year' : 'custom') as '4-year' | '3-year' | '2-year' | 'custom',
          cliffPeriod: grant.cliff_period || 12,
          vestingFrequency: (grant.vesting_frequency === 'monthly' ? 'monthly' : 
                            grant.vesting_frequency === 'quarterly' ? 'quarterly' : 'annually') as 'monthly' | 'quarterly' | 'annually',
          exercisePrice: grant.exercise_price || 0.01,
          status: (grant.status === 'active' ? 'active' : 
                  grant.status === 'terminated' ? 'terminated' : 'fully-vested') as 'active' | 'terminated' | 'fully-vested',
          notes: grant.notes || ''
        })));
      }

      // Load company settings
      try {
        const companySettingsData = await getCompanySettings(companyId);
        if (companySettingsData) {
          setCurrentValuation(companySettingsData.current_valuation);
          setEsopPool(companySettingsData.esop_pool_percentage);
          setTotalShares(companySettingsData.total_shares);
        }
      } catch (error) {
        // Company settings don't exist yet, use defaults
        console.log('No company settings found, using defaults');
      }

    } catch (error) {
      console.error('Failed to load company data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCompanyDataToDatabase = async () => {
    if (!selectedCompanyId || selectedCompanyId === 'company-1') return;
    
    try {
      setIsSaving(true);
      await saveCompanyData(selectedCompanyId, {
        founders,
        fundingRounds,
        esopGrants,
        companySettings: {
          currentValuation,
          esopPool,
          totalShares,
          exitValuation
        }
      });
      console.log('Company data saved successfully');
    } catch (error) {
      console.error('Failed to save company data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadScenario = async (scenarioId: string) => {
    try {
      // Load scenario data from database
      const scenariosData = await getScenarios(selectedCompanyId);
      const scenario = scenariosData.find(s => s.id === scenarioId);
      if (scenario && scenario.data) {
        // Apply scenario data to current state
        if (scenario.data.founders) setFounders(scenario.data.founders);
        if (scenario.data.fundingRounds) setFundingRounds(scenario.data.fundingRounds);
        if (scenario.data.esopGrants) setEsopGrants(scenario.data.esopGrants);
        if (scenario.data.companySettings) {
          setCurrentValuation(scenario.data.companySettings.currentValuation);
          setEsopPool(scenario.data.companySettings.esopPool);
          setTotalShares(scenario.data.companySettings.totalShares);
        }
        console.log('Scenario loaded:', scenario.name);
      }
    } catch (error) {
      console.error('Failed to load scenario:', error);
    }
  };
  
  const handleDeleteScenario = async (scenarioId: string) => {
    try {
      await deleteScenario(scenarioId);
      console.log('Scenario deleted:', scenarioId);
      // Reload scenarios list
      const updatedScenarios = scenarios.filter(s => s.id !== scenarioId);
      // Update scenarios state
    } catch (error) {
      console.error('Failed to delete scenario:', error);
    }
  };
  
  const handleUpdateGrant = (index: number, field: string, value: any) => {
    console.log('Updating grant:', index, field, value);
    const updatedGrants = [...esopGrants];
    updatedGrants[index] = { ...updatedGrants[index], [field]: value };
    setEsopGrants(updatedGrants);
  };
  
  const handleRemoveGrant = (index: number) => {
    console.log('Removing grant:', index);
    const updatedGrants = esopGrants.filter((_, i) => i !== index);
    setEsopGrants(updatedGrants);
  };
  
  const handleAddGrant = (grant: any) => {
    console.log('App.tsx handleAddGrant called with:', grant);
    console.log('Current esopGrants:', esopGrants);
    setEsopGrants([...esopGrants, grant]);
    console.log('Updated esopGrants:', [...esopGrants, grant]);
  };
  
  const handleFoundersChange = (newFounders: any[]) => {
    setFounders(newFounders);
  };
  
  const handleEsopPoolChange = (newEsopPool: number) => {
    setEsopPool(newEsopPool);
  };
  
  const handleTotalSharesChange = (newTotalShares: number) => {
    setTotalShares(newTotalShares);
  };
  
  const handleFundingRoundsChange = (newRounds: any[]) => {
    setFundingRounds(newRounds);
  };
  
  const handleCurrentValuationChange = (newValuation: number) => {
    setCurrentValuation(newValuation);
  };
  
  const handleCompanySubmit = async (companyData: any) => {
    setIsCompanyLoading(true);
    
    try {
      // Create the company first
      const newCompany = await createCompany({
        name: companyData.name.trim(),
        description: companyData.description.trim(),
        industry: companyData.industry.trim() || 'Technology',
        founded_date: companyData.foundedYear
      });
      
      // Create company settings with financial data
      await createCompanySettings({
        company_id: newCompany.id,
        current_valuation: companyData.initialValuation,
        esop_pool_percentage: companyData.esopPool,
        total_shares: companyData.totalShares
      });
      
      const companyDataFormatted = {
        id: newCompany.id,
        name: newCompany.name,
        description: newCompany.description || '',
        industry: newCompany.industry || 'Technology',
        createdAt: newCompany.created_at,
        updatedAt: newCompany.updated_at
      };
      
      setCompanies([...companies, companyDataFormatted]);
      setSelectedCompanyId(newCompany.id);
      setActiveTab('companies');
      setIsCompanyModalOpen(false);
      
      // Update local state with new company data
      setTotalShares(companyData.totalShares);
      setEsopPool(companyData.esopPool);
      
    } catch (error) {
      console.error('Failed to create company:', error);
    } finally {
      setIsCompanyLoading(false);
    }
  };
  
  const handleCompanyClose = () => {
    setIsCompanyModalOpen(false);
  };

  const handleCompanyDelete = async (companyId: string) => {
    try {
      await deleteCompany(companyId);
      const updatedCompanies = companies.filter(c => c.id !== companyId);
      setCompanies(updatedCompanies);
      
      if (selectedCompanyId === companyId) {
        setSelectedCompanyId(updatedCompanies[0]?.id || '');
      }
    } catch (error) {
      console.error('Failed to delete company:', error);
    }
  };

  // Auto-save data when it changes
  useEffect(() => {
    if (selectedCompanyId && selectedCompanyId !== 'company-1') {
      const timeoutId = setTimeout(() => {
        saveCompanyDataToDatabase();
      }, 2000); // Save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [founders, fundingRounds, esopGrants, currentValuation, esopPool, totalShares, selectedCompanyId]);

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Startup Value Simulator</h1>
            <p>Calculate and analyze your startup's value with ESOP scenarios</p>
          </div>
          
          <div className="header-actions">
            <div className="company-selector">
              <select 
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  marginRight: '10px',
                  fontSize: '14px'
                }}
              >
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={() => setIsCompanyModalOpen(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              + New Company
            </button>
          </div>
        </div>
      </header>
      
      {/* Features Section */}
      <div className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2>🚀 Powerful Startup Financial Modeling</h2>
            <p>Everything you need to model, analyze, and optimize your startup's financial future</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏢</div>
              <h3>Company Management</h3>
              <p>Create and manage multiple companies with detailed profiles and industry categorization</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Founder Configuration</h3>
              <p>Set up founder equity splits, roles, and ownership structure with real-time validation</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Funding Rounds</h3>
              <p>Model SAFE agreements, priced rounds, and track investor relationships</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>ESOP Management</h3>
              <p>Design employee stock option plans with vesting schedules and performance metrics</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Advanced Analytics</h3>
              <p>Visualize ownership structure, dilution impact, and financial projections</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>What-If Analysis</h3>
              <p>Interactive sliders to adjust parameters and see real-time changes in projections</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Exit Scenarios</h3>
              <p>Model IPO, acquisition, and secondary sale projections with detailed financial analysis</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Collaboration Tools</h3>
              <p>Add comments, track feedback, and collaborate with your team on financial decisions</p>
            </div>
          </div>
          
          <div className="features-cta">
            <h3>Ready to Start Modeling?</h3>
            <p>Choose a company and begin building your startup's financial future</p>
            <button 
              className="cta-button"
              onClick={() => {
                setActiveTab('companies');
                // Ensure a company is selected to show the dashboard
                if (companies.length > 0) {
                  setSelectedCompanyId(companies[0].id);
                }
              }}
            >
              🏢 Get Started
            </button>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation - Only show when a company is selected */}
      {selectedCompanyId && selectedCompanyId !== '' && (
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'companies' ? 'active' : ''}`}
            onClick={() => setActiveTab('companies')}
          >
            🏢 Companies
          </button>
          <button
            className={`tab-button ${activeTab === 'founders' ? 'active' : ''}`}
            onClick={() => setActiveTab('founders')}
          >
            👥 Founders
          </button>
          <button
            className={`tab-button ${activeTab === 'funding' ? 'active' : ''}`}
            onClick={() => setActiveTab('funding')}
          >
            💰 Funding Rounds
          </button>
          <button
            className={`tab-button ${activeTab === 'esop' ? 'active' : ''}`}
            onClick={() => setActiveTab('esop')}
          >
            📈 ESOP Management
          </button>
          <button
            className={`tab-button ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            📊 Results
          </button>
          <button
            className={`tab-button ${activeTab === 'scenarios' ? 'active' : ''}`}
            onClick={() => setActiveTab('scenarios')}
          >
            📋 Scenarios
          </button>
          <button
            className={`tab-button ${activeTab === 'charts' ? 'active' : ''}`}
            onClick={() => setActiveTab('charts')}
          >
            📊 Charts
          </button>
          <button
            className={`tab-button ${activeTab === 'what-if' ? 'active' : ''}`}
            onClick={() => setActiveTab('what-if')}
          >
            🎯 What-If Analysis
          </button>
          <button
            className={`tab-button ${activeTab === 'exit-scenarios' ? 'active' : ''}`}
            onClick={() => setActiveTab('exit-scenarios')}
          >
            🚀 Exit Scenarios
          </button>
        </div>
      )}
      
      {/* Main Content - Only show when a company is selected */}
      {selectedCompanyId && selectedCompanyId !== '' ? (
        <main className="App-main">
          {/* Loading indicator */}
          {isLoading && (
            <div className="loading-indicator">
              <div className="loading-spinner"></div>
              <p>Loading company data...</p>
            </div>
          )}

          {/* Saving indicator */}
          {isSaving && (
            <div className="saving-indicator">
              <div className="saving-spinner"></div>
              <p>Saving changes...</p>
            </div>
          )}

          {/* Founders Tab */}
          {activeTab === 'founders' && !isLoading && (
            <ErrorBoundary>
              <FounderConfiguration
                founders={founders}
                esopPool={esopPool}
                totalShares={totalShares}
                onFoundersChange={handleFoundersChange}
                onEsopPoolChange={handleEsopPoolChange}
                onTotalSharesChange={handleTotalSharesChange}
              />
            </ErrorBoundary>
          )}
          
          {/* Funding Rounds Tab */}
          {activeTab === 'funding' && !isLoading && (
            <ErrorBoundary>
              <FundingRoundsConfiguration
                fundingRounds={fundingRounds}
                onFundingRoundsChange={handleFundingRoundsChange}
                currentValuation={currentValuation}
                onCurrentValuationChange={handleCurrentValuationChange}
              />
            </ErrorBoundary>
          )}
          
          {/* ESOP Tab */}
          {activeTab === 'esop' && !isLoading && (
            <ErrorBoundary>
              <ESOPTab 
                esopPool={esopPool}
                esopGrants={esopGrants}
                onUpdateGrant={handleUpdateGrant}
                onRemoveGrant={handleRemoveGrant}
                onAddGrant={handleAddGrant}
                currentValuation={currentValuation}
                isEditable={true}
              />
            </ErrorBoundary>
          )}
          
          {/* Results Tab */}
          {activeTab === 'results' && !isLoading && (
            <div className="results-section">
              <ErrorBoundary>
                <ResultsDisplay 
                  founders={founders}
                  esopPool={esopPool}
                  fundingRounds={fundingRounds}
                  exitValuation={exitValuation}
                />
              </ErrorBoundary>
            </div>
          )}
          
          {/* Scenarios Tab */}
          {activeTab === 'scenarios' && !isLoading && (
            <div className="scenarios-section">
              <ErrorBoundary>
                <ScenarioList 
                  scenarios={scenarios}
                  onLoad={handleLoadScenario}
                  onDelete={handleDeleteScenario}
                />
              </ErrorBoundary>
            </div>
          )}
          
          {/* Companies Tab */}
          {activeTab === 'companies' && !isLoading && (
            <div className="companies-section">
              <ErrorBoundary>
                <CompanyDashboard
                  companies={companies}
                  selectedCompanyId={selectedCompanyId}
                  onCompanySelect={setSelectedCompanyId}
                  onCompanyDelete={handleCompanyDelete}
                />
              </ErrorBoundary>
            </div>
          )}
          
          {/* Charts Tab */}
          {activeTab === 'charts' && !isLoading && (
            <div className="charts-section">
              <ErrorBoundary>
                <Charts
                  founders={founders}
                  esopPool={esopPool}
                  fundingRounds={fundingRounds}
                  currentValuation={currentValuation}
                  totalShares={totalShares}
                />
              </ErrorBoundary>
            </div>
          )}

          {/* What-If Analysis Tab */}
          {activeTab === 'what-if' && !isLoading && (
            <div className="what-if-section">
              <ErrorBoundary>
                <WhatIfAnalysis
                  currentScenario={{
                    founders,
                    esopPool,
                    fundingRounds,
                    currentValuation,
                    exitValuation
                  }}
                  onParametersChange={(params) => {
                    console.log('What-If parameters changed:', params);
                    // Here you can implement logic to update the main scenario
                  }}
                />
              </ErrorBoundary>
            </div>
          )}

          {/* Exit Scenarios Tab */}
          {activeTab === 'exit-scenarios' && !isLoading && (
            <div className="exit-scenarios-section">
              <ErrorBoundary>
                <ExitScenarioModeling
                  currentValuation={currentValuation}
                  founders={founders}
                  esopPool={esopPool}
                  fundingRounds={fundingRounds}
                  onScenarioChange={(scenarios) => {
                    console.log('Exit scenarios changed:', scenarios);
                    // Here you can implement logic to save scenarios
                  }}
                />
              </ErrorBoundary>
            </div>
          )}

          {/* Comments Tab - Integrated into other tabs */}
          {activeTab === 'founders' && !isLoading && (
            <div className="comments-section">
              <ErrorBoundary>
                <CommentSystem
                  entityId="founders-config"
                  entityType="founder"
                  entityName="Founder Configuration"
                  onCommentsChange={(comments) => {
                    console.log('Founder comments changed:', comments);
                  }}
                  currentUser={{
                    name: "Current User",
                    role: "Founder"
                  }}
                />
              </ErrorBoundary>
            </div>
          )}
        </main>
      ) : (
        /* Welcome Message when no company is selected */
        <div className="welcome-section">
          <div className="welcome-container">
            <div className="welcome-content">
              <h2>🎉 Welcome to Startup Value Simulator!</h2>
              <p>Select a company from the dropdown above or create a new one to get started with your financial modeling journey.</p>
              <div className="welcome-actions">
                <button 
                  className="welcome-button primary"
                  onClick={() => setIsCompanyModalOpen(true)}
                >
                  🏢 Create New Company
                </button>
                <button 
                  className="welcome-button secondary"
                  onClick={() => {
                    setActiveTab('companies');
                    // Ensure a company is selected to show the dashboard
                    if (companies.length > 0) {
                      setSelectedCompanyId(companies[0].id);
                    }
                  }}
                >
                  📋 View All Companies
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <ErrorBoundary>
        <CompanyModal 
          isOpen={isCompanyModalOpen}
          onClose={handleCompanyClose}
          onSubmit={handleCompanySubmit}
          isLoading={isCompanyLoading}
        />
      </ErrorBoundary>
    </div>
  );
}

export default App;
