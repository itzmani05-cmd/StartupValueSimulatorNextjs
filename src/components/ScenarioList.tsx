import React, { useState, useMemo } from 'react';

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
    }
  };

  const handleBulkExport = () => {
    selectedScenarios.forEach(id => onExport?.(id));
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
      <div className="scenarios-container">
        <div className="scenarios-header">
          <h2>💾 Scenarios Management</h2>
          <p>Save, load, and manage your startup scenarios</p>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3>No Scenarios Data</h3>
          <p>Unable to load scenarios data. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  if (enhancedScenarios.length === 0) {
    return (
      <div className="scenarios-container">
        <div className="scenarios-header">
          <h2>💾 Scenarios Management</h2>
          <p>Save, load, and manage your startup scenarios</p>
        </div>
        
        <div className="scenarios-actions">
          {onSaveCurrent && (
            <button className="save-current-btn primary" onClick={onSaveCurrent}>
              💾 Save Current Scenario
            </button>
          )}
        </div>
        
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3>No Scenarios Yet</h3>
          <p>Start building your startup by creating and saving your first scenario</p>
          {onSaveCurrent && (
            <button className="empty-action-btn" onClick={onSaveCurrent}>
              Create First Scenario
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="scenarios-container">
      <div className="scenarios-header">
        <h2>💾 Scenarios Management</h2>
        <p>Save, load, and manage your startup scenarios</p>
      </div>

      {/* Actions Bar */}
      <div className="scenarios-actions">
        <div className="actions-left">
          {onSaveCurrent && (
            <button className="save-current-btn primary" onClick={onSaveCurrent}>
              💾 Save Current Scenario
            </button>
          )}
          
          {selectedScenarios.length > 0 && (
            <>
              <button 
                className="bulk-action-btn warning" 
                onClick={handleBulkDelete}
                title={`Delete ${selectedScenarios.length} selected scenarios`}
              >
                🗑️ Delete Selected ({selectedScenarios.length})
              </button>
              
              {onExport && (
                <button 
                  className="bulk-action-btn info" 
                  onClick={handleBulkExport}
                  title={`Export ${selectedScenarios.length} selected scenarios`}
                >
                  📤 Export Selected ({selectedScenarios.length})
                </button>
              )}
              
              {onCompare && selectedScenarios.length >= 2 && (
                <button 
                  className="bulk-action-btn success" 
                  onClick={() => onCompare(selectedScenarios)}
                  title="Compare selected scenarios"
                >
                  📊 Compare Scenarios
                </button>
              )}
            </>
          )}
        </div>
        
        <div className="actions-right">
          <button 
            className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid view"
          >
            ⊞
          </button>
          <button 
            className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List view"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="scenarios-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search scenarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-count">
            {filteredAndSortedScenarios.length} of {enhancedScenarios.length} scenarios
          </span>
        </div>
        
        <div className="filters-section">
          <select 
            value={filterTags} 
            onChange={(e) => setFilterTags(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)}
            className="sort-select"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="valuation">Sort by Valuation</option>
            <option value="favorites">Sort by Favorites</option>
          </select>
          
          <button 
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-order-btn"
            title={`Sort ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Scenarios Grid/List */}
      <div className={`scenarios-display ${viewMode}`}>
        {filteredAndSortedScenarios.map((scenario) => (
          <div key={scenario.id} className={`scenario-card ${scenario.isFavorite ? 'favorite' : ''}`}>
            {/* Selection Checkbox */}
            <div className="scenario-selection">
              <input
                type="checkbox"
                checked={selectedScenarios.includes(scenario.id)}
                onChange={() => handleScenarioSelect(scenario.id)}
                className="scenario-checkbox"
              />
            </div>
            
            {/* Favorite Star */}
            <div className="scenario-favorite">
              <span className={`favorite-star ${scenario.isFavorite ? 'active' : ''}`}>
                {scenario.isFavorite ? '⭐' : '☆'}
              </span>
            </div>
            
            {/* Scenario Header */}
            <div className="scenario-header">
              <h3 className="scenario-name">{scenario.name}</h3>
              <div className="scenario-meta">
                <span className="scenario-version">v{scenario.version}</span>
                <span className="scenario-date">
                  {new Date(scenario.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            {/* Scenario Description */}
            <div className="scenario-description">
              <p>{scenario.description}</p>
            </div>
            
            {/* Scenario Tags */}
            <div className="scenario-tags">
              {scenario.tags?.map(tag => (
                <span key={tag} className="scenario-tag">{tag}</span>
              ))}
            </div>
            
            {/* Scenario Metrics */}
            <div className="scenario-metrics">
              <div className="metric-row">
                <span className="metric-label">Founders:</span>
                <span className="metric-value">{scenario.metadata?.founders}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">ESOP Pool:</span>
                <span className="metric-value">{scenario.metadata?.esopPool}%</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Funding Rounds:</span>
                <span className="metric-value">{scenario.metadata?.fundingRounds}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Capital Raised:</span>
                <span className="metric-value">{formatCurrency(scenario.metadata?.totalCapitalRaised || 0)}</span>
              </div>
              <div className="metric-row highlight">
                <span className="metric-label">Current Valuation:</span>
                <span className="metric-value">{formatCurrency(scenario.metadata?.currentValuation || 0)}</span>
              </div>
              <div className="metric-row highlight">
                <span className="metric-label">Exit Valuation:</span>
                <span className="metric-value">{formatCurrency(scenario.metadata?.exitValuation || 0)}</span>
              </div>
            </div>
            
            {/* Scenario Actions */}
            <div className="scenario-actions">
              <button
                className="action-btn primary"
                onClick={() => onLoad(scenario.id)}
                title="Load this scenario"
              >
                📂 Load
              </button>
              
              {onDuplicate && (
                <button
                  className="action-btn info"
                  onClick={() => onDuplicate(scenario.id)}
                  title="Duplicate this scenario"
                >
                  📋 Duplicate
                </button>
              )}
              
              {onExport && (
                <button
                  className="action-btn success"
                  onClick={() => onExport(scenario.id)}
                  title="Export this scenario"
                >
                  📤 Export
                </button>
              )}
              
              <button
                className="action-btn warning"
                onClick={() => onDelete(scenario.id)}
                title="Delete this scenario"
              >
                🗑️ Delete
              </button>
            </div>
            
            {/* Creation Info */}
            <div className="scenario-creation">
              <small>
                Created: {new Date(scenario.created_at).toLocaleDateString()}
                {scenario.created_at !== scenario.updated_at && (
                  <span> • Updated: {new Date(scenario.updated_at).toLocaleDateString()}</span>
                )}
              </small>
            </div>
          </div>
        ))}
      </div>

      {/* No Results State */}
      {filteredAndSortedScenarios.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No Scenarios Found</h3>
          <p>Try adjusting your search terms or filters</p>
          <button 
            className="clear-filters-btn"
            onClick={() => {
              setSearchTerm('');
              setFilterTags('all');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Statistics Footer */}
      <div className="scenarios-footer">
        <div className="footer-stats">
          <span className="stat-item">
            <span className="stat-label">Total Scenarios:</span>
            <span className="stat-value">{enhancedScenarios.length}</span>
          </span>
          <span className="stat-item">
            <span className="stat-label">Favorites:</span>
            <span className="stat-value">{enhancedScenarios.filter(s => s.isFavorite).length}</span>
          </span>
          <span className="stat-item">
            <span className="stat-label">Selected:</span>
            <span className="stat-value">{selectedScenarios.length}</span>
          </span>
        </div>
        
        <div className="footer-actions">
          <button 
            className="footer-btn"
            onClick={() => setSelectedScenarios([])}
            disabled={selectedScenarios.length === 0}
          >
            Clear Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScenarioList;

