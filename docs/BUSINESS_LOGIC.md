# Business Logic & Financial Modeling Documentation

## Overview

This document provides a comprehensive overview of the financial modeling and business logic implemented in the Startup Value Simulator. The system is designed to provide professional-grade startup valuation capabilities with accuracy and transparency.

## Core Financial Concepts

### Equity Distribution

#### Founders' Equity
- **Initial Allocation**: Founders distribute 100% of non-ESOP shares
- **Validation**: Real-time total validation with visual feedback
- **Equal Split**: Utility for automatic equal distribution
- **Role-Based**: Different roles can have different equity percentages

#### ESOP Pool
- **Percentage-Based**: Configurable percentage of total shares
- **Dilution Impact**: Automatic calculation of dilution effects
- **Vesting Schedules**: Support for various vesting structures
- **Cliff Periods**: Configurable cliff periods for grants

### Funding Rounds

#### SAFE (Simple Agreement for Future Equity)
- **Valuation Cap**: Maximum valuation for discount application
- **Discount Rate**: Percentage discount on next priced round
- **Conversion Triggers**: Next round, exit, or IPO triggers
- **Investor Tracking**: Detailed investor information storage

#### Priced Rounds
- **Pre-Money vs Post-Money**: Valuation type selection
- **Share Price Calculation**: Automatic price per share computation
- **Shares Issued**: Calculated shares based on investment
- **Dilution Modeling**: Impact on existing shareholders

### Dilution Calculation

#### Pre-Money Dilution
```
New Share Price = Pre-Money Valuation / Total Shares
Shares Issued = Investment Amount / New Share Price
Post-Round Ownership % = Shares Issued / (Total Shares + Shares Issued)
```

#### Post-Money Dilution
```
New Share Price = Post-Money Valuation / Total Shares
Shares Issued = Investment Amount / New Share Price
Post-Round Ownership % = Shares Issued / (Total Shares + Shares Issued)
```

### ESOP Management

#### Vesting Schedules
- **4-Year Standard**: 1-year cliff, monthly vesting
- **3-Year Accelerated**: 6-month cliff, monthly vesting
- **2-Year Fast**: 3-month cliff, quarterly vesting
- **Custom**: User-defined vesting schedules

#### Grant Calculations
- **Fully Vested Shares**: Based on vesting schedule and date
- **Tax Implications**: Automatic tax calculation for exercises
- **Fair Market Value**: Based on current company valuation
- **Exercise Cost**: Shares granted × exercise price

## Exit Scenarios

### IPO Modeling
- **Market Valuation**: Public market valuation estimation
- **Lock-up Periods**: Restricted share selling periods
- **Underwriting Discounts**: IPO fee deductions
- **Secondary Sales**: Founder/investor share sales

### Acquisition Modeling
- **Acquisition Price**: Total company purchase price
- **Earn-outs**: Performance-based additional payments
- **Retention Bonuses**: Key employee retention payments
- **Transaction Fees**: Legal, banking, and advisory costs

### Secondary Sales
- **Partial Liquidity**: Selective share sales
- **Market Dynamics**: Buyer/seller price negotiation
- **Tax Treatment**: Capital gains vs ordinary income
- **Timing Impact**: Valuation at time of sale

## Monte Carlo Simulations

### Risk Modeling
- **Valuation Volatility**: Statistical distribution of outcomes
- **Market Conditions**: Economic factor integration
- **Company Performance**: Operational metric variations
- **Investor Behavior**: Funding timeline uncertainties

### Statistical Methods
- **Random Sampling**: Thousands of scenario iterations
- **Probability Distributions**: Normal, log-normal, triangular
- **Correlation Modeling**: Interdependent variable relationships
- **Confidence Intervals**: Statistical significance levels

### Output Analysis
- **Expected Value**: Probability-weighted average outcome
- **Standard Deviation**: Risk measurement
- **Percentile Analysis**: Best/worst case scenarios
- **Histogram Visualization**: Distribution shape analysis

## What-If Analysis

### Sensitivity Testing
- **Variable Sliders**: Interactive parameter adjustment
- **Real-time Updates**: Instant calculation feedback
- **Scenario Comparison**: Side-by-side result viewing
- **Impact Visualization**: Graphical representation of changes

### Key Variables
- **Revenue Growth**: Annual growth rate adjustments
- **Expense Management**: Cost structure modifications
- **Funding Timing**: Round scheduling variations
- **Market Conditions**: TAM and competition factors

## Financial Calculations

### Cap Table Math

#### Share Ownership Percentage
```
Ownership % = Individual Shares / Total Outstanding Shares × 100
```

#### Fully Diluted Shares
```
Fully Diluted = Outstanding Shares + Unexercised Options + Unissued Pool
```

#### Post-Round Ownership
```
New Founder Shares = Original Shares / (1 + New Shares Issued / Existing Shares)
New Investor Shares = Investment / Price Per Share
```

### Valuation Metrics

#### Pre-Money Valuation
```
Pre-Money = Post-Money - Investment Amount
```

#### Post-Money Valuation
```
Post-Money = Pre-Money + Investment Amount
```

#### Price Per Share
```
Price Per Share = Valuation / Fully Diluted Shares
```

### ESOP Calculations

#### Vested Shares
```
Vested % = min(1, max(0, (Time Since Grant - Cliff) / (Vesting Period - Cliff)))
Vested Shares = Grant Shares × Vested %
```

#### Exercise Cost
```
Exercise Cost = Vested Shares × Exercise Price
```

#### Tax Liability
```
Taxable Gain = Vested Shares × (Current FMV - Exercise Price)
Tax Owed = Taxable Gain × Tax Rate
```

## Data Models

### Company Model
```typescript
interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  createdAt: string;
  updatedAt: string;
  totalShares: number;
  esopPoolPercentage: number;
  currentValuation: number;
}
```

### Founder Model
```typescript
interface Founder {
  id: string;
  name: string;
  equityPercentage: number;
  shares: number;
  role: string;
}
```

### Funding Round Model
```typescript
interface FundingRound {
  id: string;
  name: string;
  roundType: 'SAFE' | 'Priced Round';
  capitalRaised: number;
  valuation: number;
  valuationType: 'pre-money' | 'post-money';
  valuationCap?: number;
  discountRate?: number;
  conversionTrigger: 'next-round' | 'exit' | 'ipo';
  investors: string[];
  date: string;
  notes: string;
}
```

### ESOP Grant Model
```typescript
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
```

### Scenario Model
```typescript
interface Scenario {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  data: {
    founders: Founder[];
    fundingRounds: FundingRound[];
    esopGrants: ESOPGrant[];
    companySettings: {
      currentValuation: number;
      esopPool: number;
      totalShares: number;
      exitValuation: number;
    };
  };
}
```

## Validation Rules

### Equity Distribution
- **Total Validation**: Founders + ESOP must equal 100%
- **Minimum Shares**: At least 1,000,000 total shares recommended
- **ESOP Range**: 5-20% typical for early-stage startups
- **Founder Minimum**: Each founder must have >0% equity

### Funding Rounds
- **Sequential Dates**: Rounds must be in chronological order
- **Valuation Growth**: Post-money >= Pre-money
- **Investment Limits**: Investment must be > $0
- **SAFE Constraints**: Cap and discount must be reasonable

### ESOP Grants
- **Employee Validation**: Each grant must have employee info
- **Share Limits**: Grant cannot exceed available ESOP pool
- **Vesting Logic**: Cliff cannot exceed vesting period
- **Exercise Pricing**: Exercise price must be >= $0

## Error Handling

### Data Validation
- **Input Sanitization**: Remove malicious content
- **Type Checking**: Ensure correct data types
- **Range Validation**: Check numerical boundaries
- **Format Validation**: Verify date and email formats

### Calculation Errors
- **Division by Zero**: Handle zero-share scenarios
- **Negative Values**: Prevent negative share counts
- **Overflow Protection**: Large number handling
- **Precision Management**: Floating point accuracy

### User Feedback
- **Clear Error Messages**: Human-readable error descriptions
- **Field Highlighting**: Visual indication of problematic inputs
- **Suggested Fixes**: Guidance for correction
- **Preventive Warnings**: Alert before problematic actions

## Performance Optimization

### Calculation Caching
- **Memoization**: Cache expensive calculations
- **Dependency Tracking**: Recalculate only when inputs change
- **Batch Updates**: Group related calculations
- **Lazy Evaluation**: Defer calculations until needed

### Data Management
- **Efficient Storage**: Normalize data structures
- **Indexing**: Optimize database queries
- **Pagination**: Limit large dataset loading
- **Compression**: Reduce data transfer sizes

## Security Considerations

### Data Protection
- **Encryption**: Encrypt sensitive data at rest
- **Transmission**: HTTPS for all data transfer
- **Access Control**: Role-based permissions
- **Audit Logging**: Track data modifications

### Privacy
- **Data Minimization**: Collect only necessary information
- **User Consent**: Explicit permission for data usage
- **Right to Erasure**: Ability to delete personal data
- **Data Portability**: Export functionality

## Integration Points

### Supabase Database
- **Real-time Sync**: Live data updates
- **Offline Support**: Local storage fallback
- **Row-level Security**: Fine-grained access control
- **Backup Strategy**: Automated data backups

### Third-party Services
- **Charting Libraries**: Recharts for data visualization
- **UI Components**: Professional component libraries
- **Analytics**: Usage tracking and metrics
- **Payment Processing**: Future monetization integration

## Testing Strategy

### Unit Tests
- **Calculation Accuracy**: Verify all financial formulas
- **Edge Cases**: Test boundary conditions
- **Error Handling**: Validate error scenarios
- **Performance**: Benchmark calculation speed

### Integration Tests
- **Data Flow**: End-to-end data processing
- **UI Interaction**: Component behavior validation
- **Database Operations**: CRUD operation testing
- **API Communication**: External service integration

### User Acceptance Testing
- **Scenario Validation**: Real-world use case testing
- **Usability Testing**: User experience evaluation
- **Accessibility Testing**: Compliance verification
- **Cross-browser Testing**: Compatibility assurance

## Future Enhancements

### Advanced Features
- **Multi-currency Support**: International valuation modeling
- **Tax Optimization**: Advanced tax planning scenarios
- **Comparative Analysis**: Benchmark against similar companies
- **Forecasting Models**: Predictive financial modeling

### Professional Services
- **Expert Review**: Professional valuation consultation
- **Report Generation**: PDF and presentation exports
- **Collaboration Tools**: Team-based scenario sharing
- **Audit Trail**: Comprehensive change history

### Integration Opportunities
- **Accounting Software**: QuickBooks/Xero integration
- **HR Systems**: BambooHR/Workday integration
- **Investor Portals**: Syndicate and fund integration
- **Legal Documentation**: Contract generation tools

---

*This business logic framework ensures accurate, transparent, and professional startup valuation modeling for founders, investors, and financial professionals.*