import React, { useState, useEffect, useMemo } from 'react';
import './antd.css'; // Import Ant Design styles
import { Button, Card, Input, Select, Table, Tabs, Form, Space, Tag, Alert, Spin, Result, Avatar, Dropdown, Menu, Layout, theme, message } from 'antd';
import { 
  PlusOutlined, 
  SaveOutlined, 
  ReloadOutlined, 
  DatabaseOutlined,
  WifiOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
  HomeOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
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
import AIChatbot from './components/AIChatbot';
import AboutModal from './components/AboutModal';
import LoginModal from './components/LoginModal';
import Header from './components/Header';
import { useAuth } from './contexts/AuthContext';
import { 
  getUserCompanies, // Changed from getCompanies to getUserCompanies
  createCompany, 
  deleteCompany,
  getFounders,
  getFundingRounds,
  getEsopGrants,
  getCompanySettings,
  createCompanySettings,
  saveCompanyData,
  getScenarios,
  deleteScenario,
  isRunningInFallbackMode
} from './lib/supabase';

const { Content } = Layout;
const { useToken } = theme;

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
  valuationCap?: number;
  discountRate?: number;
  sharesIssued?: number;
  sharePrice?: number;
  conversionTrigger?: 'next-round' | 'exit' | 'ipo';
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

interface AppProps {
  initialCompanyId?: string;
  userId?: string;
}

function App({ initialCompanyId, userId }: AppProps) {
  const { user, logout, loading } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { token } = useToken();
  
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
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(initialCompanyId || null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Fallback mode indicator
  const isFallbackMode = useMemo(() => isRunningInFallbackMode(), []);
  
  // Selected company
  const selectedCompany = useMemo(() => {
    return companies.find(c => c.id === selectedCompanyId) || null;
  }, [companies, selectedCompanyId]);
  
  // Load companies on mount
  useEffect(() => {
    loadCompanies();
    
    // Online/offline status tracking
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Load company data when selected company changes
  useEffect(() => {
    if (selectedCompanyId) {
      loadCompanyData(selectedCompanyId);
    }
  }, [selectedCompanyId]);
  
  const loadCompanies = async () => {
    try {
      // Use getUserCompanies to only fetch companies for the current user
      const companyData = user?.id ? await getUserCompanies(user.id) : [];
      setCompanies(companyData);
      
      // If we have an initial company ID, select it
      if (initialCompanyId && companyData.some(c => c.id === initialCompanyId)) {
        setSelectedCompanyId(initialCompanyId);
      } else if (companyData.length > 0 && !selectedCompanyId) {
        // Select the first company if none is selected
        setSelectedCompanyId(companyData[0].id);
      }
    } catch (error) {
      console.error('Failed to load companies:', error);
      message.error('Failed to load companies');
    }
  };
  
  const loadCompanyData = async (companyId: string) => {
    setIsDataLoaded(false);
    try {
      // In a real app, we would load all the company-specific data here
      // For now, we'll just set the flag to indicate data is loaded
      setIsDataLoaded(true);
    } catch (error) {
      console.error('Failed to load company data:', error);
      message.error('Failed to load company data');
    }
  };
  
  const handleCreateCompany = async (companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newCompany = await createCompany({
        ...companyData,
        user_id: user?.id || null, // Ensure user_id is set when creating a company
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      setCompanies([...companies, newCompany]);
      setSelectedCompanyId(newCompany.id);
      setIsCompanyModalOpen(false);
      message.success('Company created successfully');
    } catch (error) {
      console.error('Failed to create company:', error);
      message.error('Failed to create company');
    }
  };
  
  const handleDeleteCompany = async (companyId: string) => {
    try {
      await deleteCompany(companyId);
      const updatedCompanies = companies.filter(c => c.id !== companyId);
      setCompanies(updatedCompanies);
      
      // If we deleted the selected company, select another one
      if (selectedCompanyId === companyId) {
        setSelectedCompanyId(updatedCompanies.length > 0 ? updatedCompanies[0].id : null);
      }
      
      message.success('Company deleted successfully');
    } catch (error) {
      console.error('Failed to delete company:', error);
      message.error('Failed to delete company');
    }
  };
  
  const handleSaveData = async () => {
    if (!selectedCompanyId) return;
    
    setIsSaving(true);
    try {
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
      
      message.success('Data saved successfully');
    } catch (error) {
      console.error('Failed to save data:', error);
      message.error('Failed to save data');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      window.location.hash = '#/login';
    } catch (error) {
      console.error('Logout error:', error);
      message.error('Failed to logout');
    }
  };
  
  // If still loading auth state, show spinner
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(to bottom right, #f0f9ff, #e0f2fe)'
      }}>
        <Spin size="large" />
      </div>
    );
  }
  
  // If not logged in and we don't have a userId prop, but we're trying to access a specific route
  // that doesn't require authentication, allow it
  if (!user && !userId) {
    // Check if we're on a route that should be accessible without login
    const currentPath = window.location.hash.slice(1);
    const publicRoutes = ['/home', '/features', '/learn-more', '/documentation', '/simple-features', '/features-no-animation'];
    
    if (publicRoutes.includes(currentPath)) {
      // Allow access to public routes
      console.log('Allowing access to public route:', currentPath);
    } else {
      // Redirect to login for protected routes
      window.location.hash = '#/login';
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          background: 'linear-gradient(to bottom right, #f0f9ff, #e0f2fe)'
        }}>
          <Spin size="large" />
        </div>
      );
    }
  }
  
  // If we have a userId prop but no user in context yet, show loading state
  // This handles the case where we're in a user-specific route but auth context hasn't updated yet
  if (userId && !user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(to bottom right, #f0f9ff, #e0f2fe)'
      }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Loading your dashboard...</div>
      </div>
    );
  }
  
  // If we have a user, but no userId prop was passed, redirect to home page
  if (user && !userId) {
    // Instead of redirecting to home page, we'll stay on the app
    // This allows the user-specific URLs to work properly
    console.log('User authenticated but no userId in URL - staying in app');
  }
  
  // If userId prop was passed but doesn't match the authenticated user, redirect to home page
  if (user && userId && user.id !== userId) {
    // Instead of redirecting to home page, we'll redirect to user's own dashboard
    window.location.hash = `#/user/${user.id}`;
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(to bottom right, #f0f9ff, #e0f2fe)'
      }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Redirecting to your dashboard...</div>
      </div>
    );
  }
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header 
        showAuthControls={true}
        onNavigate={(path) => {
          // Special handling for home navigation
          if (path === '/home') {
            window.location.hash = '#/home';
            return;
          }
          
          if (path === '/login') {
            handleLogout();
          } else {
            window.location.hash = path;
          }
        }}
      />
      
      <Content style={{ padding: '16px', background: 'linear-gradient(to bottom right, #f0f9ff, #e0f2fe)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Status indicators */}
          <div style={{ marginBottom: '16px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {!isOnline && (
                <Alert
                  message="Offline Mode"
                  description="You are currently offline. Changes will be saved locally and synced when you're back online."
                  type="warning"
                  icon={<WifiOutlined />}
                  showIcon
                />
              )}
              {isFallbackMode && (
                <Alert
                  message="Fallback Mode"
                  description="Database connection unavailable. Using local storage for data persistence."
                  type="info"
                  icon={<DatabaseOutlined />}
                  showIcon
                />
              )}
            </Space>
          </div>
          
          {/* Employee Access Notice */}
          <Alert
            message="Employee Access"
            description={
              <div>
                Employees can view their ESOP grants at{' '}
                <Button 
                  type="link" 
                  onClick={() => window.location.hash = '#/employee'}
                  style={{ padding: 0 }}
                >
                  Employee Dashboard
                </Button>
                {' '}using the email address you assign to their grants.
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />

          {/* Main content */}
          <Card 
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              border: 'none'
            }}
          >
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h1 style={{ 
                  fontSize: '22px', 
                  fontWeight: 600, 
                  margin: 0,
                  color: token.colorText
                }}>
                  {selectedCompany ? selectedCompany.name : 'Startup Value Simulator'}
                </h1>
                {selectedCompany && (
                  <p style={{ 
                    margin: '4px 0 0 0', 
                    color: token.colorTextSecondary,
                    fontSize: '14px'
                  }}>
                    {selectedCompany.description}
                  </p>
                )}
              </div>
              
              <Space wrap>
                <Button 
                  icon={<PlusOutlined />} 
                  onClick={() => setIsCompanyModalOpen(true)}
                  size="middle"
                >
                  <span style={{ display: 'none' }}>New Company</span>
                </Button>
                <Button 
                  type="primary" 
                  icon={<SaveOutlined />} 
                  onClick={handleSaveData}
                  loading={isSaving}
                  size="middle"
                >
                  <span style={{ display: 'none' }}>Save Changes</span>
                </Button>
              </Space>
            </div>
            
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab}
              items={[
                {
                  key: 'companies',
                  label: 'Companies',
                  children: (
                    <CompanyDashboard
                      companies={companies}
                      selectedCompanyId={selectedCompanyId || ''}
                      onCompanySelect={setSelectedCompanyId}
                      onCompanyDelete={handleDeleteCompany}
                    />
                  )
                },
                {
                  key: 'founders',
                  label: 'Founders',
                  children: (
                    <FounderConfiguration
                      founders={founders}
                      esopPool={esopPool}
                      totalShares={totalShares}
                      onFoundersChange={setFounders}
                      onEsopPoolChange={setEsopPool}
                      onTotalSharesChange={setTotalShares}
                    />
                  )
                },
                {
                  key: 'funding',
                  label: 'Funding Rounds',
                  children: (
                    <FundingRoundsConfiguration
                      fundingRounds={fundingRounds}
                      onFundingRoundsChange={(rounds) => setFundingRounds(rounds)}
                      currentValuation={currentValuation}
                      onCurrentValuationChange={setCurrentValuation}
                    />
                  )
                },
                {
                  key: 'esop',
                  label: 'ESOP Management',
                  children: (
                    <ESOPTab
                      esopGrants={esopGrants}
                      esopPool={esopPool}
                      onUpdateGrant={(index, field, value) => {
                        const updatedGrants = [...esopGrants];
                        if (field === 'status') {
                          updatedGrants[index] = { ...updatedGrants[index], status: value };
                        } else if (field === 'sharesGranted') {
                          updatedGrants[index] = { ...updatedGrants[index], sharesGranted: value };
                        }
                        setEsopGrants(updatedGrants);
                      }}
                      onRemoveGrant={(index) => {
                        const updatedGrants = [...esopGrants];
                        updatedGrants.splice(index, 1);
                        setEsopGrants(updatedGrants);
                      }}
                      onAddGrant={(grant) => {
                        setEsopGrants([...esopGrants, grant]);
                      }}
                      currentValuation={currentValuation}
                      isEditable={true}
                    />
                  )
                },
                {
                  key: 'scenarios',
                  label: 'Scenarios',
                  children: (
                    <ScenarioList
                      scenarios={scenarios}
                      onLoad={(scenarioId) => console.log('Load scenario:', scenarioId)}
                      onDelete={(scenarioId) => console.log('Delete scenario:', scenarioId)}
                      onSaveCurrent={() => console.log('Save current scenario')}
                      onDuplicate={(scenarioId) => console.log('Duplicate scenario:', scenarioId)}
                      onExport={(scenarioId) => console.log('Export scenario:', scenarioId)}
                      onCompare={(scenarioIds) => console.log('Compare scenarios:', scenarioIds)}
                    />
                  )
                },
                {
                  key: 'results',
                  label: 'Results',
                  children: (
                    <ResultsDisplay
                      founders={founders}
                      fundingRounds={fundingRounds}
                      esopPool={esopPool}
                      exitValuation={exitValuation}
                    />
                  )
                },
                {
                  key: 'charts',
                  label: 'Charts',
                  children: (
                    <Charts
                      founders={founders}
                      fundingRounds={fundingRounds}
                      totalShares={totalShares}
                      esopPool={esopPool}
                      currentValuation={currentValuation}
                    />
                  )
                },
                {
                  key: 'monte-carlo',
                  label: 'Monte Carlo',
                  children: (
                    <MonteCarloSimulator
                      currentValuation={currentValuation}
                      exitValuation={exitValuation}
                      esopPool={esopPool}
                    />
                  )
                },
                {
                  key: 'what-if',
                  label: 'What-If Analysis',
                  children: (
                    <WhatIfAnalysis
                      currentScenario={{
                        founders,
                        esopPool,
                        fundingRounds,
                        currentValuation,
                        exitValuation
                      }}
                      onParametersChange={(params) => {
                        setExitValuation(params.exitValuation);
                        setEsopPool(params.esopPool);
                      }}
                    />
                  )
                },
                {
                  key: 'exit-modeling',
                  label: 'Exit Modeling',
                  children: (
                    <ExitScenarioModeling
                      founders={founders}
                      fundingRounds={fundingRounds}
                      esopPool={esopPool}
                      currentValuation={currentValuation}
                      onScenarioChange={(scenarios) => console.log('Scenario changed:', scenarios)}
                    />
                  )
                }
              ]}
              tabBarStyle={{ 
                fontSize: '14px',
                flexWrap: 'wrap'
              }}
            />
          </Card>
        </div>
      </Content>
      
      <Footer />
      
      {/* Modals */}
      <CompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        onSubmit={(companyData) => {
          handleCreateCompany(companyData);
        }}
        isLoading={false}
      />
      
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />
      
      {/* Add responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .ant-layout-content {
            padding: 12px !important;
          }
          
          .ant-card {
            margin-bottom: 12px;
          }
          
          .ant-card-body {
            padding: 16px;
          }
          
          .ant-tabs-tab {
            padding: 8px 12px !important;
            font-size: 13px !important;
          }
          
          .ant-btn {
            font-size: 13px !important;
          }
          
          .ant-alert {
            padding: 8px 12px !important;
          }
        }
        
        @media (max-width: 480px) {
          .ant-layout-content {
            padding: 8px !important;
          }
          
          .ant-card {
            margin-bottom: 8px;
          }
          
          .ant-card-body {
            padding: 12px;
          }
          
          .ant-tabs-tab {
            padding: 6px 8px !important;
            font-size: 12px !important;
          }
          
          .ant-btn {
            font-size: 12px !important;
            padding: 4px 8px !important;
          }
          
          .ant-alert {
            padding: 6px 10px !important;
          }
          
          .ant-typography {
            font-size: 13px !important;
          }
        }
      `}</style>
    </Layout>
  );
}

export default App;