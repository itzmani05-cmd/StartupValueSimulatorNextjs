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

function App() {
  // Tab state
  const [activeTab, setActiveTab] = useState('founders');
  
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
  
  const [esopGrants] = useState([]);
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
      
      {/* Tab Navigation */}
      <div className="tab-navigation">
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
          className={`tab-button ${activeTab === 'companies' ? 'active' : ''}`}
          onClick={() => setActiveTab('companies')}
        >
          🏢 Companies
        </button>
        <button
          className={`tab-button ${activeTab === 'charts' ? 'active' : ''}`}
          onClick={() => setActiveTab('charts')}
        >
          📊 Charts
        </button>
      </div>
      
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
      </main>
      
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
