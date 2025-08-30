import React from 'react';

interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  createdAt: string;
  updatedAt: string;
}

interface CompanyDashboardProps {
  companies: Company[];
  selectedCompanyId: string;
  onCompanySelect: (id: string) => void;
  onCompanyDelete: (id: string) => void;
}

const CompanyDashboard: React.FC<CompanyDashboardProps> = ({
  companies,
  selectedCompanyId,
  onCompanySelect,
  onCompanyDelete
}) => {
  if (!companies || companies.length === 0) {
    return (
      <div className="companies-empty">
        <h3>🏢 No Companies Yet</h3>
        <p>Create your first company to get started with the simulator.</p>
      </div>
    );
  }

  return (
    <div className="company-dashboard">
      <div className="dashboard-header">
        <h2>🏢 Company Dashboard</h2>
        <p>Manage and switch between your startup companies</p>
      </div>
      
      <div className="companies-grid">
        {companies.map((company) => (
          <div
            key={company.id}
            className={`company-card ${selectedCompanyId === company.id ? 'selected' : ''}`}
            onClick={() => onCompanySelect(company.id)}
          >
            <div className="company-header">
              <h3>{company.name}</h3>
              <span className="company-industry">{company.industry}</span>
            </div>
            
            <p className="company-description">{company.description}</p>
            
            <div className="company-meta">
              <small>Created: {new Date(company.createdAt).toLocaleDateString()}</small>
              <small>Updated: {new Date(company.updatedAt).toLocaleDateString()}</small>
            </div>
            
            <div className="company-actions">
              {selectedCompanyId === company.id && (
                <span className="selected-badge">✓ Active</span>
              )}
              <button
                className="delete-company-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Are you sure you want to delete "${company.name}"?`)) {
                    onCompanyDelete(company.id);
                  }
                }}
                title="Delete Company"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="dashboard-info">
        <p>
          <strong>Selected Company:</strong> {companies.find(c => c.id === selectedCompanyId)?.name || 'None'}
        </p>
        <p>
          <strong>Total Companies:</strong> {companies.length}
        </p>
      </div>
    </div>
  );
};

export default CompanyDashboard;





