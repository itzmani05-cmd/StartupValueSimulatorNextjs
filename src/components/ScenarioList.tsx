import React, { useState, useMemo } from 'react';
import { 
  Button, 
  Input, 
  Select, 
  Card, 
  Space, 
  Tag, 
  Row, 
  Col,
  Typography,
  Checkbox,
  message,
  Divider
} from 'antd';
import { 
  SaveOutlined, 
  SearchOutlined, 
  FilterOutlined, 
  SortAscendingOutlined, 
  SortDescendingOutlined,
  StarOutlined,
  StarFilled,
  FileOutlined,
  CopyOutlined,
  ExportOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  ClearOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface Scenario {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  version?: string;
  isFavorite?: boolean;
  metadata?: {
    founders: number;
    esopPool: number;
    fundingRounds: number;
    totalCapitalRaised: number;
    currentValuation: number;
    exitValuation: number;
  };
}

interface ScenarioListProps {
  scenarios: Scenario[];
  onLoad: (scenarioId: string) => void;
  onDelete: (scenarioId: string) => void;
  onSaveCurrent?: () => void;
  onDuplicate?: (scenarioId: string) => void;
  onExport?: (scenarioId: string) => void;
  onCompare?: (scenarioIds: string[]) => void;
}

const ScenarioList: React.FC<ScenarioListProps> = ({ 
  scenarios, 
  onLoad, 
  onDelete, 
  onSaveCurrent,
  onDuplicate,
  onExport,
  onCompare
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTags, setFilterTags] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'valuation' | 'favorites'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showDeleted, setShowDeleted] = useState(false);

  // Enhanced scenario data with sample metadata
  const enhancedScenarios: Scenario[] = useMemo(() => {
    if (!scenarios || !Array.isArray(scenarios)) return [];
    
    return scenarios.map(scenario => ({
      ...scenario,
      description: scenario.description || `Scenario created on ${new Date(scenario.created_at).toLocaleDateString()}`,
      tags: scenario.tags || ['startup', 'planning'],
      version: scenario.version || '1.0',
      isFavorite: scenario.isFavorite || false,
      metadata: scenario.metadata || {
        founders: Math.floor(Math.random() * 4) + 1,
        esopPool: Math.floor(Math.random() * 20) + 10,
        fundingRounds: Math.floor(Math.random() * 5),
        totalCapitalRaised: Math.floor(Math.random() * 10000000) + 1000000,
        currentValuation: Math.floor(Math.random() * 50000000) + 5000000,
        exitValuation: Math.floor(Math.random() * 200000000) + 50000000
      }
    }));
  }, [scenarios]);

  // Filter and sort scenarios
  const filteredAndSortedScenarios = useMemo(() => {
    let filtered = enhancedScenarios.filter(scenario => {
      const matchesSearch = scenario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           scenario.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           scenario.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesTags = filterTags === 'all' || scenario.tags?.includes(filterTags);
      
      return matchesSearch && matchesTags;
    });

    // Sort scenarios
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.updated_at);
          bValue = new Date(b.updated_at);
          break;
        case 'valuation':
          aValue = a.metadata?.currentValuation || 0;
          bValue = b.metadata?.currentValuation || 0;
          break;
        case 'favorites':
          aValue = a.isFavorite ? 1 : 0;
          bValue = b.isFavorite ? 1 : 0;
          break;
        default:
          aValue = new Date(a.updated_at);
          bValue = new Date(b.updated_at);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [enhancedScenarios, searchTerm, filterTags, sortBy, sortOrder]);

  // Get unique tags for filtering
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    enhancedScenarios.forEach(scenario => {
      scenario.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [enhancedScenarios]);

  // Handle scenario selection for comparison
  const handleScenarioSelect = (scenarioId: string) => {
    setSelectedScenarios(prev => 
      prev.includes(scenarioId) 
        ? prev.filter(id => id !== scenarioId)
        : [...prev, scenarioId]
    );
  };

  // Handle bulk actions
  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedScenarios.length} scenarios?`)) {
      selectedScenarios.forEach(id => onDelete(id));
      setSelectedScenarios([]);
      message.success(`${selectedScenarios.length} scenarios deleted successfully`);
    }
  };

  const handleBulkExport = () => {
    selectedScenarios.forEach(id => onExport?.(id));
    message.success(`${selectedScenarios.length} scenarios exported successfully`);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  // Safety checks
  if (!scenarios || !Array.isArray(scenarios)) {
    return (
      <div style={{ padding: '24px' }}>
        <Card>
          <Title level={2}>
            <SaveOutlined style={{ marginRight: '8px' }} />
            Scenarios Management
          </Title>
          <Text type="secondary">Save, load, and manage your startup scenarios</Text>
          
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
            <Title level={3}>No Scenarios Data</Title>
            <Text type="secondary">Unable to load scenarios data. Please try refreshing the page.</Text>
          </div>
        </Card>
      </div>
    );
  }

  if (enhancedScenarios.length === 0) {
    return (
      <div style={{ padding: '24px' }}>
        <Card style={{ marginBottom: '24px' }}>
          <Title level={2}>
            <SaveOutlined style={{ marginRight: '8px' }} />
            Scenarios Management
          </Title>
          <Text type="secondary">Save, load, and manage your startup scenarios</Text>
        </Card>
        
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
          <Title level={3}>No Scenarios Yet</Title>
          <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
            Start building your startup by creating and saving your first scenario
          </Text>
          {onSaveCurrent && (
            <Button 
              type="primary" 
              icon={<SaveOutlined />}
              onClick={onSaveCurrent}
              size="large"
            >
              Create First Scenario
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <SaveOutlined style={{ marginRight: '8px' }} />
          Scenarios Management
        </Title>
        <Text type="secondary">Save, load, and manage your startup scenarios</Text>
      </Card>

      {/* Actions Bar */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {onSaveCurrent && (
              <Button 
                type="primary" 
                icon={<SaveOutlined />}
                onClick={onSaveCurrent}
              >
                Save Current Scenario
              </Button>
            )}
            
            {selectedScenarios.length > 0 && (
              <>
                <Button 
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleBulkDelete}
                  title={`Delete ${selectedScenarios.length} selected scenarios`}
                >
                  Delete Selected ({selectedScenarios.length})
                </Button>
                
                {onExport && (
                  <Button 
                    icon={<ExportOutlined />}
                    onClick={handleBulkExport}
                    title={`Export ${selectedScenarios.length} selected scenarios`}
                  >
                    Export Selected ({selectedScenarios.length})
                  </Button>
                )}
                
                {onCompare && selectedScenarios.length >= 2 && (
                  <Button 
                    type="primary"
                    icon={<FileOutlined />}
                    onClick={() => onCompare(selectedScenarios)}
                    title="Compare selected scenarios"
                  >
                    Compare Scenarios
                  </Button>
                )}
              </>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button 
              icon={<AppstoreOutlined />}
              type={viewMode === 'grid' ? 'primary' : 'default'}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            />
            <Button 
              icon={<UnorderedListOutlined />}
              type={viewMode === 'list' ? 'primary' : 'default'}
              onClick={() => setViewMode('list')}
              title="List view"
            />
          </div>
        </div>
      </Card>

      {/* Search and Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Input
              placeholder="Search scenarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<SearchOutlined />}
            />
            <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
              {filteredAndSortedScenarios.length} of {enhancedScenarios.length} scenarios
            </Text>
          </Col>
          
          <Col xs={24} md={12}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Select 
                value={filterTags} 
                onChange={(value) => setFilterTags(value)}
                style={{ width: '150px' }}
              >
                <Option value="all">All Tags</Option>
                {allTags.map(tag => (
                  <Option key={tag} value={tag}>{tag}</Option>
                ))}
              </Select>
              
              <Select 
                value={sortBy} 
                onChange={(value) => setSortBy(value as any)}
                style={{ width: '180px' }}
              >
                <Option value="date">Sort by Date</Option>
                <Option value="name">Sort by Name</Option>
                <Option value="valuation">Sort by Valuation</Option>
                <Option value="favorites">Sort by Favorites</Option>
              </Select>
              
              <Button 
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                icon={sortOrder === 'asc' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
                title={`Sort ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
              >
                {sortOrder === 'asc' ? 'Asc' : 'Desc'}
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Scenarios Grid/List */}
      <Row gutter={16}>
        {filteredAndSortedScenarios.map((scenario) => (
          <Col 
            key={scenario.id} 
            xs={24} 
            sm={viewMode === 'grid' ? 12 : 24} 
            lg={viewMode === 'grid' ? 8 : 24}
            style={{ marginBottom: '16px' }}
          >
            <Card 
              style={{ 
                height: '100%',
                border: selectedScenarios.includes(scenario.id) ? '2px solid #1890ff' : '1px solid #f0f0f0',
                position: 'relative'
              }}
            >
              {/* Selection Checkbox */}
              <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                <Checkbox
                  checked={selectedScenarios.includes(scenario.id)}
                  onChange={() => handleScenarioSelect(scenario.id)}
                />
              </div>
              
              {/* Favorite Star */}
              <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                <Button
                  type="text"
                  icon={scenario.isFavorite ? <StarFilled style={{ color: '#ffd700' }} /> : <StarOutlined />}
                  onClick={() => {
                    // In a real app, you would update the scenario's favorite status
                    message.info('Favorite status would be updated in a real implementation');
                  }}
                />
              </div>
              
              {/* Scenario Header */}
              <div style={{ marginBottom: '16px' }}>
                <Title level={4} style={{ margin: '0 0 8px 0' }}>{scenario.name}</Title>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888' }}>
                  <span>v{scenario.version}</span>
                  <span>{new Date(scenario.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              {/* Scenario Description */}
              <div style={{ marginBottom: '16px' }}>
                <Text type="secondary">{scenario.description}</Text>
              </div>
              
              {/* Scenario Tags */}
              <div style={{ marginBottom: '16px' }}>
                {scenario.tags?.map(tag => (
                  <Tag key={tag} style={{ marginRight: '4px', marginBottom: '4px' }}>{tag}</Tag>
                ))}
              </div>
              
              {/* Scenario Metrics */}
              <div style={{ marginBottom: '16px', backgroundColor: '#fafafa', padding: '12px', borderRadius: '4px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Founders:</Text>
                    <Text strong>{scenario.metadata?.founders}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">ESOP Pool:</Text>
                    <Text strong>{scenario.metadata?.esopPool}%</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Funding Rounds:</Text>
                    <Text strong>{scenario.metadata?.fundingRounds}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Capital Raised:</Text>
                    <Text strong>{formatCurrency(scenario.metadata?.totalCapitalRaised || 0)}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#e6f7ff', padding: '4px', borderRadius: '2px' }}>
                    <Text type="secondary">Current Valuation:</Text>
                    <Text strong>{formatCurrency(scenario.metadata?.currentValuation || 0)}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#e6f7ff', padding: '4px', borderRadius: '2px' }}>
                    <Text type="secondary">Exit Valuation:</Text>
                    <Text strong>{formatCurrency(scenario.metadata?.exitValuation || 0)}</Text>
                  </div>
                </div>
              </div>
              
              {/* Scenario Actions */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Button
                  type="primary"
                  icon={<FileOutlined />}
                  onClick={() => onLoad(scenario.id)}
                  title="Load this scenario"
                  size="small"
                >
                  Load
                </Button>
                
                {onDuplicate && (
                  <Button
                    icon={<CopyOutlined />}
                    onClick={() => onDuplicate(scenario.id)}
                    title="Duplicate this scenario"
                    size="small"
                  >
                    Duplicate
                  </Button>
                )}
                
                {onExport && (
                  <Button
                    type="dashed"
                    icon={<ExportOutlined />}
                    onClick={() => onExport(scenario.id)}
                    title="Export this scenario"
                    size="small"
                  >
                    Export
                  </Button>
                )}
                
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this scenario?')) {
                      onDelete(scenario.id);
                      message.success('Scenario deleted successfully');
                    }
                  }}
                  title="Delete this scenario"
                  size="small"
                >
                  Delete
                </Button>
              </div>
              
              {/* Creation Info */}
              <div style={{ marginTop: '16px', fontSize: '12px', color: '#888' }}>
                <small>
                  Created: {new Date(scenario.created_at).toLocaleDateString()}
                  {scenario.created_at !== scenario.updated_at && (
                    <span> • Updated: {new Date(scenario.updated_at).toLocaleDateString()}</span>
                  )}
                </small>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* No Results State */}
      {filteredAndSortedScenarios.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <Title level={3}>No Scenarios Found</Title>
          <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
            Try adjusting your search terms or filters
          </Text>
          <Button 
            icon={<ClearOutlined />}
            onClick={() => {
              setSearchTerm('');
              setFilterTags('all');
            }}
          >
            Clear Filters
          </Button>
        </Card>
      )}

      {/* Statistics Footer */}
      <Card style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <span>
              <Text type="secondary">Total Scenarios:</Text>{' '}
              <Text strong>{enhancedScenarios.length}</Text>
            </span>
            <span>
              <Text type="secondary">Favorites:</Text>{' '}
              <Text strong>{enhancedScenarios.filter(s => s.isFavorite).length}</Text>
            </span>
            <span>
              <Text type="secondary">Selected:</Text>{' '}
              <Text strong>{selectedScenarios.length}</Text>
            </span>
          </div>
          
          <Button 
            onClick={() => setSelectedScenarios([])}
            disabled={selectedScenarios.length === 0}
          >
            Clear Selection
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ScenarioList;