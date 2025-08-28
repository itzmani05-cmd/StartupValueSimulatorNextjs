import React, { useState } from 'react';
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
      roundType: 'SAFE' as const,
      capitalRaised: 1000000, 
      valuation: 5000000, 
      valuationType: 'pre-money' as const,
      valuationCap: 5000000,
      discountRate: 20,
      conversionTrigger: 'next-round' as const,
      investors: ['Angel Investor 1'],
      date: new Date().toISOString().split('T')[0],
      notes: 'Initial seed funding'
    }
  ]);
  const [exitValuation] = useState(10000000);
  
  const [scenarios] = useState([
    { id: '1', name: 'Default Scenario', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ]);
  
  const [esopGrants] = useState([
    {
      id: 'grant-1',
      employeeName: 'Sarah Johnson',
      employeeId: 'EMP001',
      position: 'Senior Software Engineer',
      department: 'Engineering',
      grantDate: '2023-01-15',
      sharesGranted: 50000,
      vestingSchedule: '4-year' as const,
      cliffPeriod: 12,
      vestingFrequency: 'monthly' as const,
      exercisePrice: 0.01,
      status: 'active' as const,
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
      vestingSchedule: '4-year' as const,
      cliffPeriod: 12,
      vestingFrequency: 'monthly' as const,
      exercisePrice: 0.01,
      status: 'active' as const,
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
      vestingSchedule: '3-year' as const,
      cliffPeriod: 6,
      vestingFrequency: 'quarterly' as const,
      exercisePrice: 0.005,
      status: 'active' as const,
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
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [companyIndustry, setCompanyIndustry] = useState('');
  const [isCompanyLoading, setIsCompanyLoading] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState('company-1');
  
  const handleLoadScenario = (scenarioId: string) => {
    console.log('Loading scenario:', scenarioId);
  };
  
  const handleDeleteScenario = (scenarioId: string) => {
    console.log('Deleting scenario:', scenarioId);
  };
  
  const handleUpdateGrant = (index: number, field: string, value: any) => {
    console.log('Updating grant:', index, field, value);
  };
  
  const handleRemoveGrant = (index: number) => {
    console.log('Removing grant:', index);
  };
  
  const handleAddGrant = () => {
    console.log('Adding new grant');
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
  
     const handleCompanySubmit = () => {
     if (!companyName.trim()) return;
     
     const newCompany = {
       id: `company-${Date.now()}`,
       name: companyName.trim(),
       description: companyDescription.trim(),
       industry: companyIndustry.trim() || 'Technology',
       createdAt: new Date().toISOString(),
       updatedAt: new Date().toISOString()
     };
     
     setCompanies([...companies, newCompany]);
     setSelectedCompanyId(newCompany.id);
     setActiveTab('companies'); // Switch to companies tab
     setIsCompanyLoading(false);
     setIsCompanyModalOpen(false);
     setCompanyName('');
     setCompanyDescription('');
     setCompanyIndustry('');
   };
  
  const handleCompanyClose = () => {
    setIsCompanyModalOpen(false);
    setCompanyName('');
    setCompanyDescription('');
    setCompanyIndustry('');
  };

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
          {/* Founders Tab */}
          {activeTab === 'founders' && (
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
          {activeTab === 'funding' && (
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
          {activeTab === 'esop' && (
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
          {activeTab === 'results' && (
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
          {activeTab === 'scenarios' && (
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
          {activeTab === 'companies' && (
            <div className="companies-section">
              <ErrorBoundary>
                <CompanyDashboard
                  companies={companies}
                  selectedCompanyId={selectedCompanyId}
                  onCompanySelect={setSelectedCompanyId}
                  onCompanyDelete={(id) => {
                    setCompanies(companies.filter(c => c.id !== id));
                    if (selectedCompanyId === id) {
                      setSelectedCompanyId(companies[0]?.id || '');
                    }
                  }}
                />
              </ErrorBoundary>
            </div>
          )}
          
          {/* Charts Tab */}
          {activeTab === 'charts' && (
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
          {activeTab === 'what-if' && (
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
          {activeTab === 'exit-scenarios' && (
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
          {activeTab === 'founders' && (
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
          companyName={companyName}
          companyDescription={companyDescription}
          companyIndustry={companyIndustry}
          onCompanyNameChange={setCompanyName}
          onCompanyDescriptionChange={setCompanyDescription}
          onCompanyIndustryChange={setCompanyIndustry}
          isLoading={isCompanyLoading}
        />
      </ErrorBoundary>
    </div>
  );
}

export default App;
