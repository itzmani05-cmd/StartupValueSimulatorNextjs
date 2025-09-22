import React, { useState, useEffect } from 'react';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (companyData: CompanyFormData) => void;
  isLoading: boolean;
}

interface CompanyFormData {
  name: string;
  description: string;
  industry: string;
  foundedYear: string;
  totalShares: number;
  initialValuation: number;
  esopPool: number;
  legalStructure: string;
  headquarters: string;
  website: string;
}

interface CompanyFormErrors {
  name?: string;
  description?: string;
  industry?: string;
  foundedYear?: string;
  totalShares?: string;
  initialValuation?: string;
  esopPool?: string;
  legalStructure?: string;
  headquarters?: string;
  website?: string;
}

const CompanyModal: React.FC<CompanyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    description: '',
    industry: '',
    foundedYear: new Date().getFullYear().toString(),
    totalShares: 10000000,
    initialValuation: 1000000,
    esopPool: 10,
    legalStructure: 'C-Corporation',
    headquarters: '',
    website: ''
  });

  const [errors, setErrors] = useState<CompanyFormErrors>({});
  const [touched, setTouched] = useState<Partial<CompanyFormData>>({});

  const industries = [
    'Technology',
    'Healthcare',
    'E-commerce',
    'Fintech',
    'SaaS',
    'Biotech',
    'Clean Energy',
    'AI/ML',
    'Blockchain',
    'EdTech',
    'Real Estate',
    'Manufacturing',
    'Other'
  ];

  const legalStructures = [
    'C-Corporation',
    'S-Corporation',
    'LLC',
    'Partnership',
    'Sole Proprietorship'
  ];

  const currentYear = new Date().getFullYear();
  const foundedYears = Array.from({ length: 30 }, (_, i) => (currentYear - i).toString());

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        description: '',
        industry: '',
        foundedYear: new Date().getFullYear().toString(),
        totalShares: 10000000,
        initialValuation: 1000000,
        esopPool: 10,
        legalStructure: 'C-Corporation',
        headquarters: '',
        website: ''
      });
      setErrors({});
      setTouched({});
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: CompanyFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Company name must be at least 2 characters';
    }

    if (formData.totalShares <= 0) {
      newErrors.totalShares = 'Total shares must be greater than 0';
    }

    if (formData.initialValuation < 0) {
      newErrors.initialValuation = 'Initial valuation cannot be negative';
    }

    if (formData.esopPool < 0 || formData.esopPool > 100) {
      newErrors.esopPool = 'ESOP pool must be between 0% and 100%';
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (field: keyof CompanyFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof CompanyFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    console.log('Current errors:', errors);
    
    if (validateForm()) {
      console.log('Form validation passed');
      // Convert foundedYear to a proper date format (YYYY-01-01)
      const companyDataWithDate = {
        ...formData,
        foundedYear: `${formData.foundedYear}-01-01`
      };
      console.log('Calling onSubmit with data:', companyDataWithDate);
      onSubmit(companyDataWithDate);
    } else {
      console.log('Form validation failed:', errors);
    }
  };

  const formatNumber = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const formatShares = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toLocaleString();
  };

  if (!isOpen) return null;

  return (
    <div className="company-modal-overlay">
      <div className="company-modal">
        <div className="company-modal-header">
          <div className="modal-title-section">
            <div className="modal-icon">🏢</div>
            <div>
              <h2>Create New Company</h2>
              <p>Set up your startup's foundation and initial structure</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="modal-close-btn"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="company-modal-form">
          <div className="form-sections">
            {/* Basic Information Section */}
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="company-name">
                    Company Name <span className="required">*</span>
                  </label>
                  <input
                    id="company-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    placeholder="Enter your company name"
                    className={errors.name && touched.name ? 'error' : ''}
                    autoFocus
                  />
                  {errors.name && touched.name && (
                    <span className="error-message">{errors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="company-industry">Industry</label>
                  <select
                    id="company-industry"
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                  >
                    <option value="">Select an industry</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="company-founded">Founded Year</label>
                  <select
                    id="company-founded"
                    value={formData.foundedYear}
                    onChange={(e) => handleInputChange('foundedYear', e.target.value)}
                  >
                    {foundedYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="company-structure">Legal Structure</label>
                  <select
                    id="company-structure"
                    value={formData.legalStructure}
                    onChange={(e) => handleInputChange('legalStructure', e.target.value)}
                  >
                    {legalStructures.map(structure => (
                      <option key={structure} value={structure}>{structure}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="company-description">Company Description</label>
                <textarea
                  id="company-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Briefly describe your company, mission, and what you do..."
                  rows={3}
                />
              </div>
            </div>

            {/* Financial Structure Section */}
            <div className="form-section">
              <h3>Financial Structure</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="company-shares">
                    Total Shares <span className="required">*</span>
                  </label>
                  <div className="input-with-prefix">
                    <input
                      id="company-shares"
                      type="number"
                      value={formData.totalShares}
                      onChange={(e) => handleInputChange('totalShares', parseInt(e.target.value) || 0)}
                      onBlur={() => handleBlur('totalShares')}
                      placeholder="10000000"
                      className={errors.totalShares && touched.totalShares ? 'error' : ''}
                    />
                    <span className="input-prefix">{formatShares(formData.totalShares)}</span>
                  </div>
                  {errors.totalShares && touched.totalShares && (
                    <span className="error-message">{errors.totalShares}</span>
                  )}
                  <small className="form-help">Standard is 10M shares for most startups</small>
                </div>

                <div className="form-group">
                  <label htmlFor="company-valuation">Initial Valuation</label>
                  <div className="input-with-prefix">
                    <input
                      id="company-valuation"
                      type="number"
                      value={formData.initialValuation}
                      onChange={(e) => handleInputChange('initialValuation', parseInt(e.target.value) || 0)}
                      onBlur={() => handleBlur('initialValuation')}
                      placeholder="1000000"
                      className={errors.initialValuation && touched.initialValuation ? 'error' : ''}
                    />
                    <span className="input-prefix">{formatNumber(formData.initialValuation)}</span>
                  </div>
                  {errors.initialValuation && touched.initialValuation && (
                    <span className="error-message">{errors.initialValuation}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="company-esop">ESOP Pool (%)</label>
                  <div className="input-with-prefix">
                    <input
                      id="company-esop"
                      type="number"
                      value={formData.esopPool}
                      onChange={(e) => handleInputChange('esopPool', parseFloat(e.target.value) || 0)}
                      onBlur={() => handleBlur('esopPool')}
                      placeholder="10"
                      min="0"
                      max="100"
                      step="0.1"
                      className={errors.esopPool && touched.esopPool ? 'error' : ''}
                    />
                    <span className="input-prefix">%</span>
                  </div>
                  {errors.esopPool && touched.esopPool && (
                    <span className="error-message">{errors.esopPool}</span>
                  )}
                  <small className="form-help">Standard is 10-20% for early-stage startups</small>
                </div>
              </div>
            </div>

            {/* Location & Contact Section */}
            <div className="form-section">
              <h3>Location & Contact</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="company-headquarters">Headquarters</label>
                  <input
                    id="company-headquarters"
                    type="text"
                    value={formData.headquarters}
                    onChange={(e) => handleInputChange('headquarters', e.target.value)}
                    placeholder="City, State/Country"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="company-website">Website</label>
                  <input
                    id="company-website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://example.com"
                    onBlur={() => handleBlur('website')}
                    className={errors.website && touched.website ? 'error' : ''}
                  />
                  {errors.website && touched.website && (
                    <span className="error-message">{errors.website}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="company-modal-actions">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading || !formData.name.trim()}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Creating Company...
                </>
              ) : (
                'Create Company'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyModal;
