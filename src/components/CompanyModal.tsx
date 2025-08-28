import React from 'react';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  companyName: string;
  companyDescription: string;
  companyIndustry: string;
  onCompanyNameChange: (value: string) => void;
  onCompanyDescriptionChange: (value: string) => void;
  onCompanyIndustryChange: (value: string) => void;
  isLoading: boolean;
}

const CompanyModal: React.FC<CompanyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  companyName,
  companyDescription,
  companyIndustry,
  onCompanyNameChange,
  onCompanyDescriptionChange,
  onCompanyIndustryChange,
  isLoading
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>🏢 Create New Company</h3>
        <div className="input-group">
          <label>Company Name *</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => onCompanyNameChange(e.target.value)}
            placeholder="Enter company name"
            autoFocus
          />
        </div>
        <div className="input-group">
          <label>Description</label>
          <input
            type="text"
            value={companyDescription}
            onChange={(e) => onCompanyDescriptionChange(e.target.value)}
            placeholder="Brief description"
          />
        </div>
        <div className="input-group">
          <label>Industry</label>
          <input
            type="text"
            value={companyIndustry}
            onChange={(e) => onCompanyIndustryChange(e.target.value)}
            placeholder="e.g., Technology, Healthcare, E-commerce"
          />
        </div>
        <div className="modal-actions">
          <button 
            onClick={onSubmit} 
            className="save-confirm-button"
            disabled={isLoading || !companyName.trim()}
          >
            {isLoading ? 'Creating...' : 'Create Company'}
          </button>
          <button 
            onClick={onClose} 
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyModal;
