import React, { useState, useEffect } from 'react';

interface ESOPGrant {
  id: string;
  employeeName: string;
  employeeId: string;
  position: string;
  department: string;
  grantDate: string;
  sharesGranted: number;
  vestingSchedule: '4-year' | '3-year' | '2-year' | 'custom';
  cliffPeriod: number; // in months
  vestingFrequency: 'monthly' | 'quarterly' | 'annually';
  exercisePrice: number;
  status: 'active' | 'terminated' | 'fully-vested';
  notes: string;
  performanceMetrics?: {
    kpi1?: string;
    kpi2?: string;
    kpi3?: string;
  };
}

interface ESOPTabProps {
  esopPool: number;
  esopGrants: ESOPGrant[];
  onUpdateGrant: (index: number, field: string, value: any) => void;
  onRemoveGrant: (index: number) => void;
  onAddGrant: (grant: ESOPGrant) => void;
  currentValuation: number;
  isEditable: boolean;
}

const ESOPTab: React.FC<ESOPTabProps> = ({
  esopPool,
  esopGrants,
  onUpdateGrant,
  onRemoveGrant,
  onAddGrant,
  currentValuation,
  isEditable
}) => {
  const [localGrants, setLocalGrants] = useState<ESOPGrant[]>(esopGrants);
  const [isAddingGrant, setIsAddingGrant] = useState(false);
  const [newGrant, setNewGrant] = useState<Partial<ESOPGrant>>({
    employeeName: '',
    employeeId: '',
    position: '',
    department: '',
    grantDate: new Date().toISOString().split('T')[0],
    sharesGranted: 0,
    vestingSchedule: '4-year',
    cliffPeriod: 12,
    vestingFrequency: 'monthly',
    exercisePrice: 0.01,
    status: 'active',
    notes: ''
  });
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('grantDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    setLocalGrants(esopGrants);
  }, [esopGrants]);

  const handleAddGrant = () => {
    console.log('handleAddGrant called with newGrant:', newGrant);
    
    if (!newGrant.employeeName || !newGrant.sharesGranted) {
      console.log('Validation failed:', { 
        employeeName: newGrant.employeeName, 
        sharesGranted: newGrant.sharesGranted 
      });
      return;
    }
    
    const grant: ESOPGrant = {
      id: `grant-${Date.now()}`,
      employeeName: newGrant.employeeName!,
      employeeId: newGrant.employeeId!,
      position: newGrant.position!,
      department: newGrant.department!,
      grantDate: newGrant.grantDate!,
      sharesGranted: newGrant.sharesGranted!,
      vestingSchedule: newGrant.vestingSchedule!,
      cliffPeriod: newGrant.cliffPeriod!,
      vestingFrequency: newGrant.vestingFrequency!,
      exercisePrice: newGrant.exercisePrice!,
      status: newGrant.status!,
      notes: newGrant.notes!,
      performanceMetrics: newGrant.performanceMetrics
    };
    
    console.log('Created grant object:', grant);
    onAddGrant(grant);
    setLocalGrants([...localGrants, grant]);
    setIsAddingGrant(false);
    setNewGrant({
      employeeName: '',
      employeeId: '',
      position: '',
      department: '',
      grantDate: new Date().toISOString().split('T')[0],
      sharesGranted: 0,
      vestingSchedule: '4-year',
      cliffPeriod: 12,
      vestingFrequency: 'monthly',
      exercisePrice: 0.01,
      status: 'active',
      notes: ''
    });
  };

  const calculateVestingProgress = (grant: ESOPGrant) => {
    const grantDate = new Date(grant.grantDate);
    const now = new Date();
    const monthsSinceGrant = (now.getFullYear() - grantDate.getFullYear()) * 12 + 
                            (now.getMonth() - grantDate.getMonth());
    
    let totalVestingMonths = 0;
    switch (grant.vestingSchedule) {
      case '2-year': totalVestingMonths = 24; break;
      case '3-year': totalVestingMonths = 36; break;
      case '4-year': totalVestingMonths = 48; break;
      default: totalVestingMonths = 48;
    }
    
    if (monthsSinceGrant < grant.cliffPeriod) {
      return 0; // Still in cliff period
    }
    
    const vestedMonths = Math.min(monthsSinceGrant - grant.cliffPeriod, totalVestingMonths - grant.cliffPeriod);
    const progress = (vestedMonths / (totalVestingMonths - grant.cliffPeriod)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const calculateVestedShares = (grant: ESOPGrant) => {
    const progress = calculateVestingProgress(grant);
    return Math.round((progress / 100) * grant.sharesGranted);
  };

  const calculateGrantValue = (grant: ESOPGrant) => {
    const vestedShares = calculateVestedShares(grant);
    const sharePrice = currentValuation / 10000000; // Assuming 10M total shares
    return vestedShares * sharePrice;
  };

  const filteredGrants = localGrants
    .filter(grant => {
      if (filterStatus !== 'all' && grant.status !== filterStatus) return false;
      if (searchTerm && !grant.employeeName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'employeeName':
          aValue = a.employeeName;
          bValue = b.employeeName;
          break;
        case 'sharesGranted':
          aValue = a.sharesGranted;
          bValue = b.sharesGranted;
          break;
        case 'grantDate':
          aValue = new Date(a.grantDate);
          bValue = new Date(b.grantDate);
          break;
        case 'vestingProgress':
          aValue = calculateVestingProgress(a);
          bValue = calculateVestingProgress(b);
          break;
        default:
          aValue = a.employeeName;
          bValue = b.employeeName;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const totalSharesGranted = localGrants.reduce((sum, grant) => sum + grant.sharesGranted, 0);
  const totalSharesVested = localGrants.reduce((sum, grant) => sum + calculateVestedShares(grant), 0);
  const totalGrantValue = localGrants.reduce((sum, grant) => sum + calculateGrantValue(grant), 0);
  const poolUtilization = (totalSharesGranted / 1000000) * 100; // Assuming 1M shares = 100%

  return (
    <div className="esop-tab">
      <div className="esop-header">
        <h2>📈 ESOP Management Dashboard</h2>
        <p>Comprehensive Employee Stock Option Plan management and analytics</p>
      </div>

      {/* ESOP Pool Overview */}
      <div className="esop-overview">
        <div className="overview-card">
          <h3>🏦 ESOP Pool Status</h3>
          <div className="overview-stats">
            <div className="stat-item">
              <span className="stat-label">Total Pool Size:</span>
              <span className="stat-value">{esopPool.toFixed(1)}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Shares Granted:</span>
              <span className="stat-value">{totalSharesGranted.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pool Utilization:</span>
              <span className="stat-value">{poolUtilization.toFixed(1)}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Available Pool:</span>
              <span className="stat-value">{Math.max(0, esopPool - poolUtilization).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="overview-card">
          <h3>📊 Grant Analytics</h3>
          <div className="overview-stats">
            <div className="stat-item">
              <span className="stat-label">Total Grants:</span>
              <span className="stat-value">{localGrants.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Shares Vested:</span>
              <span className="stat-value">{totalSharesVested.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Value:</span>
              <span className="stat-value">${totalGrantValue.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Avg Grant Size:</span>
              <span className="stat-value">{localGrants.length > 0 ? Math.round(totalSharesGranted / localGrants.length).toLocaleString() : 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls and Filters */}
      <div className="esop-controls">
        <div className="controls-left">
          <button 
            className="add-grant-btn"
            onClick={() => setIsAddingGrant(true)}
            disabled={!isEditable}
          >
            ➕ Add New Grant
          </button>
        </div>
        
        <div className="controls-right">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="terminated">Terminated</option>
            <option value="fully-vested">Fully Vested</option>
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="employeeName">Sort by Name</option>
            <option value="sharesGranted">Sort by Shares</option>
            <option value="grantDate">Sort by Date</option>
            <option value="vestingProgress">Sort by Progress</option>
          </select>
          
          <button 
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-order-btn"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Add Grant Modal */}
      {isAddingGrant && (
        <div className="add-grant-modal">
          <div className="modal-content">
            <h3>Add New ESOP Grant</h3>
            <div className="grant-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Employee Name *</label>
                  <input
                    type="text"
                    value={newGrant.employeeName}
                    onChange={(e) => setNewGrant({...newGrant, employeeName: e.target.value})}
                    placeholder="Enter employee name"
                  />
                </div>
                <div className="form-group">
                  <label>Employee ID</label>
                  <input
                    type="text"
                    value={newGrant.employeeId}
                    onChange={(e) => setNewGrant({...newGrant, employeeId: e.target.value})}
                    placeholder="Employee ID"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Position</label>
                  <input
                    type="text"
                    value={newGrant.position}
                    onChange={(e) => setNewGrant({...newGrant, position: e.target.value})}
                    placeholder="Job title"
                  />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    value={newGrant.department}
                    onChange={(e) => setNewGrant({...newGrant, department: e.target.value})}
                    placeholder="Department"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Grant Date *</label>
                  <input
                    type="date"
                    value={newGrant.grantDate}
                    onChange={(e) => setNewGrant({...newGrant, grantDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Shares Granted *</label>
                  <input
                    type="number"
                    value={newGrant.sharesGranted}
                    onChange={(e) => setNewGrant({...newGrant, sharesGranted: parseInt(e.target.value) || 0})}
                    placeholder="Number of shares"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Vesting Schedule</label>
                  <select
                    value={newGrant.vestingSchedule}
                    onChange={(e) => setNewGrant({...newGrant, vestingSchedule: e.target.value as any})}
                  >
                    <option value="2-year">2 Years</option>
                    <option value="3-year">3 Years</option>
                    <option value="4-year">4 Years</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Cliff Period (months)</label>
                  <input
                    type="number"
                    value={newGrant.cliffPeriod}
                    onChange={(e) => setNewGrant({...newGrant, cliffPeriod: parseInt(e.target.value) || 0})}
                    placeholder="Cliff period"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Vesting Frequency</label>
                  <select
                    value={newGrant.vestingFrequency}
                    onChange={(e) => setNewGrant({...newGrant, vestingFrequency: e.target.value as any})}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Exercise Price</label>
                  <input
                    type="number"
                    value={newGrant.exercisePrice}
                    onChange={(e) => setNewGrant({...newGrant, exercisePrice: parseFloat(e.target.value) || 0})}
                    placeholder="Exercise price per share"
                  />
                </div>
              </div>
              
              <div className="form-group full-width">
                <label>Notes</label>
                <textarea
                  value={newGrant.notes}
                  onChange={(e) => setNewGrant({...newGrant, notes: e.target.value})}
                  placeholder="Additional notes about this grant"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <button onClick={() => setIsAddingGrant(false)} className="cancel-btn">
                Cancel
              </button>
              <button onClick={handleAddGrant} className="save-btn" disabled={!newGrant.employeeName || !newGrant.sharesGranted}>
                Add Grant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grants Table */}
      <div className="grants-table-container">
        <table className="grants-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Position</th>
              <th>Grant Date</th>
              <th>Shares Granted</th>
              <th>Vesting Progress</th>
              <th>Vested Shares</th>
              <th>Current Value</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGrants.map((grant, index) => {
              const vestingProgress = calculateVestingProgress(grant);
              const vestedShares = calculateVestedShares(grant);
              const grantValue = calculateGrantValue(grant);
              
              return (
                <tr key={grant.id}>
                  <td>
                    <div className="employee-info">
                      <div className="employee-name">{grant.employeeName}</div>
                      <div className="employee-id">{grant.employeeId}</div>
                    </div>
                  </td>
                  <td>
                    <div className="position-info">
                      <div className="position-title">{grant.position}</div>
                      <div className="department">{grant.department}</div>
                    </div>
                  </td>
                  <td>{new Date(grant.grantDate).toLocaleDateString()}</td>
                  <td>{grant.sharesGranted.toLocaleString()}</td>
                  <td>
                    <div className="vesting-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{width: `${vestingProgress}%`}}
                        ></div>
                      </div>
                      <span className="progress-text">{vestingProgress.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td>{vestedShares.toLocaleString()}</td>
                  <td>${grantValue.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge status-${grant.status}`}>
                      {grant.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => onUpdateGrant(index, 'status', grant.status === 'active' ? 'terminated' : 'active')}
                        className="action-btn"
                        disabled={!isEditable}
                      >
                        {grant.status === 'active' ? '⏸️' : '▶️'}
                      </button>
                      <button 
                        onClick={() => onRemoveGrant(index)}
                        className="action-btn delete"
                        disabled={!isEditable}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredGrants.length === 0 && (
          <div className="no-grants">
            <p>No ESOP grants found. {!isAddingGrant && <button onClick={() => setIsAddingGrant(true)}>Add your first grant</button>}</p>
          </div>
        )}
      </div>

      {/* Vesting Timeline */}
      <div className="vesting-timeline">
        <h3>📅 Vesting Timeline Overview</h3>
        <div className="timeline-chart">
          {localGrants.map((grant, index) => {
            const vestingProgress = calculateVestingProgress(grant);
            const monthsToVest = (() => {
              switch (grant.vestingSchedule) {
                case '2-year': return 24;
                case '3-year': return 36;
                case '4-year': return 48;
                default: return 48;
              }
            })();
            
            return (
              <div key={grant.id} className="timeline-item">
                <div className="timeline-header">
                  <span className="employee-name">{grant.employeeName}</span>
                  <span className="vesting-schedule">{grant.vestingSchedule}</span>
                </div>
                <div className="timeline-bar">
                  <div className="cliff-period" style={{width: `${(grant.cliffPeriod / monthsToVest) * 100}%`}}>
                    <span className="cliff-label">Cliff</span>
                  </div>
                  <div 
                    className="vesting-progress" 
                    style={{width: `${(vestingProgress / 100) * (1 - grant.cliffPeriod / monthsToVest) * 100}%`}}
                  ></div>
                </div>
                <div className="timeline-labels">
                  <span className="start-date">{new Date(grant.grantDate).toLocaleDateString()}</span>
                  <span className="end-date">
                    {new Date(new Date(grant.grantDate).getTime() + monthsToVest * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ESOPTab;

