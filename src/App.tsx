import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import './antd.css'; // Import Ant Design styles
import { Button, Card, Input, Select, Table, Tabs, Form, Space, Tag, Alert, Spin, Result } from 'antd';
import { PlusOutlined, SaveOutlined, ReloadOutlined, DatabaseOutlined, WifiOutlined } from '@ant-design/icons';
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
import MonteCarloSimulator from './components/MonteCarloSimulator';
import FeatureGrid from './components/FeatureGrid';
import Footer from './components/Footer';
import { 
  getCompanies, 
  createCompany, 
  deleteCompany,
  getFounders,
  getFundingRounds,
  getEsopGrants,
  getCompanySettings,
  createCompanySettings,
  saveCompanyData,
  getScenarios,
  deleteScenario
} from './lib/supabase';

// Define types for our data structures
interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  createdAt: string;
  updatedAt: string;
}

interface Founder {
  id: string;
  name: string;
  equityPercentage: number;
  shares: number;
  role: string;
}

interface FundingRound {
  id: string;
  name: string;
  roundType: 'SAFE' | 'Priced Round';
  capitalRaised: number;
  valuation: number;
  valuationType: 'pre-money' | 'post-money';
  valuationCap: number;
  discountRate: number;
  sharesIssued?: number;
  sharePrice?: number;
  conversionTrigger: 'next-round' | 'exit' | 'ipo';
  investors: string[];
  date: string;
  notes: string;
}

interface ESOPGrant {
  id: string;
  employeeName: string;
  employeeId: string;
  position: string;
  department: string;
  grantDate: string;
  sharesGranted: number;
  vestingSchedule: '4-year' | '3-year' | '2-year' | 'custom';
  cliffPeriod: number;
  vestingFrequency: 'monthly' | 'quarterly' | 'annually';
  exercisePrice: number;
  status: 'active' | 'terminated' | 'fully-vested';
  notes: string;
}

interface Scenario {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  data?: any;
}

// Check if running in fallback mode
const isRunningInFallbackMode = () => {
  return localStorage.getItem('startup_simulator_companies') !== null;
};

function App() {
  // Tab state
  const [activeTab, setActiveTab] = useState('companies');
  
  // Default state values to prevent runtime errors
  const [founders, setFounders] = useState<Founder[]>([
    { id: 'founder-1', name: 'Founder 1', equityPercentage: 60, shares: 6000000, role: 'CEO' },
    { id: 'founder-2', name: 'Founder 2', equityPercentage: 30, shares: 3000000, role: 'CTO' }
  ]);
  
  const [esopPool, setEsopPool] = useState(10);
  const [totalShares, setTotalShares] = useState(10000000);
  const [fundingRounds, setFundingRounds] = useState<FundingRound[]>([
    { 
      id: 'round-1',
      name: 'Seed Round', 
      roundType: 'SAFE',
      capitalRaised: 1000000, 
      valuation: 5000000, 
      valuationType: 'pre-money',
      valuationCap: 5000000,
      discountRate: 20,
      conversionTrigger: 'next-round',
      investors: ['Angel Investor 1'],
      date: new Date().toISOString().split('T')[0],
      notes: 'Initial seed funding'
    }
  ]);
  const [exitValuation, setExitValuation] = useState(10000000);
  
  const [scenarios, setScenarios] = useState<Scenario[]>([
    { id: '1', name: 'Default Scenario', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ]);
  
  const [esopGrants, setEsopGrants] = useState<ESOPGrant[]>([
    {
      id: 'grant-1',
      employeeName: 'Sarah Johnson',
      employeeId: 'EMP001',
      position: 'Senior Software Engineer',
      department: 'Engineering',
      grantDate: '2023-01-15',
      sharesGranted: 50000,
      vestingSchedule: '4-year',
      cliffPeriod: 12,
      vestingFrequency: 'monthly',
      exercisePrice: 0.01,
      status: 'active',
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
      vestingSchedule: '4-year',
      cliffPeriod: 12,
      vestingFrequency: 'monthly',
      exercisePrice: 0.01,
      status: 'active',
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
      vestingSchedule: '3-year',
      cliffPeriod: 6,
      vestingFrequency: 'quarterly',
      exercisePrice: 0.005,
      status: 'active',
      notes: 'Brand development and growth marketing'
    }
  ]);
  const [currentValuation, setCurrentValuation] = useState(5000000);
  
  // Company management state
  const [companies, setCompanies] = useState<Company[]>([
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
  const [companySearch, setCompanySearch] = useState('');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  
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

  const filteredCompanies = useMemo(() => {
    if (!companySearch) return companies;
    const term = companySearch.toLowerCase();
    return companies.filter(c => c.name.toLowerCase().includes(term));
  }, [companies, companySearch]);

  const selectedCompanyName = useMemo(() => {
    const found = companies.find(c => c.id === selectedCompanyId);
    return found ? found.name : '';
  }, [companies, selectedCompanyId]);

  const formatRelativeTime = (date: Date) => {
    const diffMs = Date.now() - date.getTime();
    const sec = Math.floor(diffMs / 1000);
    if (sec < 10) return 'just now';
    if (sec < 60) return `${sec}s ago`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    return `${hr}h ago`;
  };

  const handleRefresh = async () => {
    try {
      if (selectedCompanyId && selectedCompanyId !== 'company-1') {
        await loadCompanyDataFromDatabase(selectedCompanyId);
      } else {
        await loadCompaniesFromDatabase();
      }
    } catch (e) {
      console.error('Refresh failed:', e);
    }
  };

  const loadCompaniesFromDatabase = async () => {
    try {
      setIsLoading(true);
      const companiesData: any[] = await getCompanies();
      if (companiesData && companiesData.length > 0) {
        setCompanies(companiesData.map((company: any) => ({
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
      const foundersData: any[] = await getFounders(companyId);
      if (foundersData) {
        setFounders(foundersData.map((founder: any) => ({
          id: founder.id,
          name: founder.name,
          equityPercentage: founder.equity_percentage,
          shares: founder.shares,
          role: founder.role || ''
        })));
      }

      // Load funding rounds
      const fundingRoundsData: any[] = await getFundingRounds(companyId);
      if (fundingRoundsData) {
        setFundingRounds(fundingRoundsData.map((round: any) => ({
          id: round.id as string,
          name: (round.name ?? '') as string,
          roundType: (round.round_type === 'SAFE' ? 'SAFE' : 'Priced Round') as 'SAFE' | 'Priced Round',
          capitalRaised: Number(round.capital_raised ?? round.investment_amount ?? 0),
          valuation: Number(round.valuation ?? round.pre_money_valuation ?? 0),
          valuationType: (round.valuation_type === 'pre-money' ? 'pre-money' : 'post-money') as 'pre-money' | 'post-money',
          valuationCap: Number(round.valuation_cap ?? round.valuationCap ?? 0),
          discountRate: Number(round.discount_rate ?? round.discountRate ?? 0),
          sharesIssued: Number(round.shares_issued ?? 0),
          sharePrice: Number(round.price_per_share ?? 0),
          conversionTrigger: 'next-round' as 'next-round' | 'exit' | 'ipo',
          investors: Array.isArray(round.investors) ? round.investors.map((inv: any) => String(inv)) : [],
          date: (round.round_date || round.created_at?.split('T')[0] || new Date().toISOString().split('T')[0]) as string,
          notes: (round.notes || '') as string
        })));
      }

      // Load ESOP grants
      const esopGrantsData: any[] = await getEsopGrants(companyId);
      if (esopGrantsData) {
        setEsopGrants(esopGrantsData.map((grant: any) => ({
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
        const companySettingsData: any = await getCompanySettings(companyId);
        if (companySettingsData) {
          setCurrentValuation(companySettingsData.current_valuation);
          setEsopPool(companySettingsData.esop_pool_percentage);
          setTotalShares(companySettingsData.total_shares);
          if (companySettingsData.exit_valuation !== undefined && companySettingsData.exit_valuation !== null) {
            setExitValuation(companySettingsData.exit_valuation);
          }
        }
      } catch (error) {
        // Company settings don't exist yet, use defaults
        console.log('No company settings found, using defaults');
      }

      // Load scenarios for the selected company
      try {
        const scenariosData: any[] = await getScenarios(companyId);
        if (Array.isArray(scenariosData)) {
          setScenarios(scenariosData);
        }
      } catch (error) {
        console.error('Failed to load scenarios:', error);
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
      setLastSavedAt(new Date());
    } catch (error) {
      console.error('Failed to save company data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadScenario = async (scenarioId: string) => {
    try {
      // Load scenario data from database
      const scenariosData: any[] = await getScenarios(selectedCompanyId);
      if (Array.isArray(scenariosData)) {
        setScenarios(scenariosData);
      }
      const scenario = scenariosData.find((s: any) => s.id === scenarioId);
      if (scenario && scenario.data) {
        // Apply scenario data to current state
        if (scenario.data.founders) setFounders(scenario.data.founders);
        if (scenario.data.fundingRounds) setFundingRounds(scenario.data.fundingRounds);
        if (scenario.data.esopGrants) setEsopGrants(scenario.data.esopGrants);
        if (scenario.data.companySettings) {
          setCurrentValuation(scenario.data.companySettings.currentValuation);
          setEsopPool(scenario.data.companySettings.esopPool);
          setTotalShares(scenario.data.companySettings.totalShares);
          if (scenario.data.companySettings.exitValuation !== undefined && scenario.data.companySettings.exitValuation !== null) {
            setExitValuation(scenario.data.companySettings.exitValuation);
          }
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
      setScenarios(updatedScenarios);
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
      console.log('Creating company with data:', companyData);
      
      // Create the company first
      const newCompany: any = await createCompany({
        name: companyData.name.trim(),
        description: companyData.description.trim(),
        industry: companyData.industry.trim() || 'Technology',
        founded_date: companyData.foundedYear
      });
      
      console.log('Company created successfully:', newCompany);
      
      // Create company settings with financial data
      await createCompanySettings({
        company_id: newCompany.id,
        current_valuation: companyData.initialValuation,
        esop_pool_percentage: companyData.esopPool,
        total_shares: companyData.totalShares
      });
      
      console.log('Company settings created successfully');
      
      const companyDataFormatted: Company = {
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
      
      console.log('Company creation process completed successfully');
      
      // Show success message
      if (newCompany.id.startsWith('local_')) {
        alert('✅ Company created successfully! (Data saved locally due to database connection issues)');
      } else {
        alert('✅ Company created successfully!');
      }
      
    } catch (error) {
      console.error('Failed to create company:', error);
      alert(`❌ Failed to create company: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      <header className="App-header relative bg-white/90 backdrop-blur-lg border-b border-gray-200/50">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold">🚀</span>
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Startup Value Simulator
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Select
                value={selectedCompanyId}
                onChange={(value) => setSelectedCompanyId(value)}
                style={{ width: 200 }}
                options={companies.map(company => ({ label: company.name, value: company.id }))}
              />
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setIsCompanyModalOpen(true)}
              >
                New Company
              </Button>
              <Button 
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
              >
                Refresh
              </Button>
              <Button 
                type="primary" 
                icon={<SaveOutlined />}
                onClick={saveCompanyDataToDatabase}
                disabled={!selectedCompanyId || selectedCompanyId === 'company-1'}
                loading={isSaving}
              >
                Save
              </Button>
              <Button 
                type="primary" 
                icon={<DatabaseOutlined />}
                onClick={() => setActiveTab('monte-carlo')}
              >
                Monte Carlo
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Fallback Mode Notification */}
      {isRunningInFallbackMode() && (
        <Alert 
          message="Running in offline mode - Data is stored locally" 
          type="warning" 
          icon={<WifiOutlined />}
          banner
        />
      )}
      
      {/* Database Mode Notification */}
      {!isRunningInFallbackMode() && (
        <Alert 
          message="Database connected - All data is stored in the database" 
          type="success" 
          icon={<DatabaseOutlined />}
          banner
        />
      )}
      
      {/* Professional Tab Navigation - Only show when a company is selected */}
      {selectedCompanyId && selectedCompanyId !== '' && (
        <Card className="m-6">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              { key: 'companies', label: '🏢 Companies' },
              { key: 'founders', label: '👥 Founders' },
              { key: 'funding', label: '💰 Funding Rounds' },
              { key: 'esop', label: '📈 ESOP Management' },
              { key: 'results', label: '📊 Results' },
              { key: 'scenarios', label: '📋 Scenarios' },
              { key: 'charts', label: '📊 Charts' },
              { key: 'what-if', label: '🎯 What-If Analysis' },
              { key: 'exit-scenarios', label: '🚀 Exit Scenarios' },
              { key: 'monte-carlo', label: '🎲 Monte Carlo' }
            ]}
          />
        </Card>
      )}
      
      {/* Main Content - Only show when a company is selected */}
      {selectedCompanyId && selectedCompanyId !== '' ? (
        <main className="max-w-7xl mx-auto px-6 py-6">
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Spin size="large" />
              <p className="text-gray-600 font-medium mt-4">Loading company data...</p>
            </div>
          )}

          {/* Saving indicator */}
          {isSaving && (
            <div className="flex flex-col items-center justify-center py-12">
              <Spin size="large" />
              <p className="text-gray-600 font-medium mt-4">Saving changes...</p>
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

          {/* Monte Carlo Tab */}
          {activeTab === 'monte-carlo' && !isLoading && (
            <div className="monte-carlo-section">
              <ErrorBoundary>
                <MonteCarloSimulator
                  currentValuation={currentValuation}
                  exitValuation={exitValuation}
                  esopPool={esopPool}
                />
              </ErrorBoundary>
            </div>
          )}

          {/* Comments Tab - Integrated into other tabs */}
          {activeTab === 'founders' && !isLoading && (
            <div className="comments-section mt-8">
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
          <div className="max-w-7xl mx-auto px-6 py-12">
            <Result
              status="success"
              title="Welcome to Startup Value Simulator"
              subTitle="Model ESOP, funding rounds, dilution, and exits with precision. Compare scenarios and run Monte Carlo simulations to make confident, data-driven decisions for your startup's future."
              extra={[
                <Button 
                  type="primary" 
                  key="create" 
                  icon={<PlusOutlined />}
                  onClick={() => setIsCompanyModalOpen(true)}
                >
                  Create New Company
                </Button>,
                <Button 
                  key="view" 
                  onClick={() => {
                    setActiveTab('companies');
                    if (companies.length > 0) {
                      setSelectedCompanyId(companies[0].id);
                    }
                  }}
                >
                  View All Companies
                </Button>,
                <Button 
                  type="primary" 
                  key="monte-carlo"
                  icon={<DatabaseOutlined />}
                  onClick={() => setActiveTab('monte-carlo')}
                >
                  Try Monte Carlo
                </Button>
              ]}
            />
            
            <div className="flex justify-center gap-6 text-sm text-gray-500 mb-16">
              <Tag color="green">No credit card required</Tag>
              <Tag color="blue">Local-first modeling</Tag>
              <Tag color="purple">Open data export</Tag>
            </div>
          </div>
          
          {/* Marketing Features moved to bottom */}
          <div className="bg-gradient-to-b from-slate-50/50 to-white py-12">
            <div className="max-w-7xl mx-auto px-6">
              <FeatureGrid
                items={[
                  { icon: '📈', title: 'Scenario planning', description: 'Compare multiple growth and exit paths.' },
                  { icon: '🧮', title: 'Cap table math', description: 'See dilution impacts across rounds.' },
                  { icon: '🧑‍🤝‍🧑', title: 'ESOP clarity', description: 'Understand option pool needs by stage.' },
                  { icon: '🎲', title: 'Monte Carlo', description: 'Quantify risk with distributions.' }
                ]}
                columns={4}
                cardPadding={24}
              />

              <div className="h-8"></div>

              <FeatureGrid
                items={[
                  { icon: '🏢', title: 'Company Management', description: 'Create and manage multiple companies with industry profiles.' },
                  { icon: '👥', title: 'Founder Configuration', description: 'Set equity splits, roles, and validate ownership.' },
                  { icon: '💰', title: 'Funding Rounds', description: 'Model SAFEs, convertibles, and priced rounds.' },
                  { icon: '📊', title: 'Analytics', description: 'Ownership, dilution, and financial projections.' },
                  { icon: '🎯', title: 'What-If Analysis', description: 'Interactive sliders with real-time updates.' },
                  { icon: '🚀', title: 'Exit Scenarios', description: 'IPO, acquisition, and secondary modeling.' }
                ]}
                columns={3}
                cardPadding={24}
              />
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
      <Footer />
    </div>
  );
}

export default App;