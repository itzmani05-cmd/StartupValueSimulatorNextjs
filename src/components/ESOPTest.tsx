import React, { useState } from 'react';
import ESOPTab from './ESOPTab';

// Test component to verify ESOP functionality
const ESOPTest: React.FC = () => {
  const [esopPool] = useState(10);
  const [esopGrants, setEsopGrants] = useState([
    {
      id: '1',
      employeeName: 'John Doe',
      grantDate: '2023-01-15',
      totalShares: 10000,
      exercisePrice: 0.01,
      vestingSchedule: {
        type: 'standard' as const,
        years: 4,
        cliffMonths: 12,
        vestingFrequency: 'monthly' as const
      },
      currentVestedShares: 2500,
      exercisedShares: 0,
      taxImplications: {
        exerciseCost: 0,
        estimatedAMT: 0,
        capitalGainsTax: 0,
        totalTaxBurden: 0
      }
    },
    {
      id: '2',
      employeeName: 'Jane Smith',
      grantDate: '2023-02-01',
      totalShares: 15000,
      exercisePrice: 0.01,
      vestingSchedule: {
        type: 'standard' as const,
        years: 4,
        cliffMonths: 12,
        vestingFrequency: 'monthly' as const
      },
      currentVestedShares: 3750,
      exercisedShares: 0,
      taxImplications: {
        exerciseCost: 0,
        estimatedAMT: 0,
        capitalGainsTax: 0,
        totalTaxBurden: 0
      }
    }
  ]);

  const [currentValuation] = useState(10000000);

  const handleUpdateGrant = (index: number, field: string, value: any) => {
    setEsopGrants(prev => prev.map((grant, i) => 
      i === index ? { ...grant, [field]: value } : grant
    ));
  };

  const handleRemoveGrant = (index: number) => {
    setEsopGrants(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddGrant = () => {
    const newGrant = {
      id: Date.now().toString(),
      employeeName: `Employee ${esopGrants.length + 1}`,
      grantDate: new Date().toISOString().split('T')[0],
      totalShares: 10000,
      exercisePrice: 0.01,
      vestingSchedule: {
        type: 'standard' as const,
        years: 4,
        cliffMonths: 12,
        vestingFrequency: 'monthly' as const
      },
      currentVestedShares: 2500,
      exercisedShares: 0,
      taxImplications: {
        exerciseCost: 0,
        estimatedAMT: 0,
        capitalGainsTax: 0,
        totalTaxBurden: 0
      }
    };
    setEsopGrants(prev => [...prev, newGrant]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>ESOP Functionality Test</h1>
      <p>This component tests the ESOP tab functionality with sample data.</p>
      
      <ESOPTab
        esopPool={esopPool}
        esopGrants={esopGrants}
        onUpdateGrant={handleUpdateGrant}
        onRemoveGrant={handleRemoveGrant}
        onAddGrant={handleAddGrant}
        currentValuation={currentValuation}
        isEditable={true}
      />
    </div>
  );
};

export default ESOPTest;

