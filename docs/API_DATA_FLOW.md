# API and Data Flow Documentation

## Overview

This document details the API endpoints, data flow architecture, and integration patterns used in the Startup Value Simulator. The system follows a professional approach to data management with both cloud-based persistence and local fallback capabilities.

## Architecture Overview

### Data Flow Patterns

1. **User Input** → React Components
2. **React Components** → State Management (useState/useReducer)
3. **State Management** → Business Logic Layer
4. **Business Logic Layer** → Supabase Client
5. **Supabase Client** → Database/API
6. **Database/API** → Business Logic Layer
7. **Business Logic Layer** → State Management
8. **State Management** → React Components
9. **React Components** → UI Rendering

### Offline Support

When Supabase is unavailable, the system automatically falls back to localStorage with the same data structure, ensuring seamless user experience.

## Supabase Integration

### Client Configuration

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

### Authentication

The application uses Supabase's built-in authentication system:

- **Anonymous Access**: Read-only access for public data
- **Email/Password**: User account authentication
- **Social Login**: Google, GitHub, and other providers
- **Row-level Security**: Database-level access control

## Database Schema

### Companies Table

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT,
  founded_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Company Settings Table

```sql
CREATE TABLE company_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  current_valuation BIGINT,
  esop_pool_percentage DECIMAL(5,2),
  total_shares BIGINT,
  exit_valuation BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Founders Table

```sql
CREATE TABLE founders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  equity_percentage DECIMAL(5,2),
  shares BIGINT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Funding Rounds Table

```sql
CREATE TABLE funding_rounds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  round_type TEXT CHECK (round_type IN ('SAFE', 'Priced Round')),
  capital_raised BIGINT,
  valuation BIGINT,
  valuation_type TEXT CHECK (valuation_type IN ('pre-money', 'post-money')),
  valuation_cap BIGINT,
  discount_rate DECIMAL(5,2),
  shares_issued BIGINT,
  price_per_share DECIMAL(10,4),
  conversion_trigger TEXT CHECK (conversion_trigger IN ('next-round', 'exit', 'ipo')),
  investors JSONB,
  round_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### ESOP Grants Table

```sql
CREATE TABLE esop_grants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  employee_name TEXT NOT NULL,
  employee_id TEXT,
  position TEXT,
  department TEXT,
  grant_date DATE,
  shares_granted BIGINT,
  vesting_schedule TEXT CHECK (vesting_schedule IN ('4-year', '3-year', '2-year', 'custom')),
  cliff_period INTEGER,
  vesting_frequency TEXT CHECK (vesting_frequency IN ('monthly', 'quarterly', 'annually')),
  exercise_price DECIMAL(10,4),
  status TEXT CHECK (status IN ('active', 'terminated', 'fully-vested')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Scenarios Table

```sql
CREATE TABLE scenarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Endpoints

### Companies API

#### Get All Companies

```typescript
// GET /rest/v1/companies
const getCompanies = async () => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
```

#### Create Company

```typescript
// POST /rest/v1/companies
const createCompany = async (companyData: Partial<Company>) => {
  const { data, error } = await supabase
    .from('companies')
    .insert([{ ...companyData, user_id: currentUser.id }])
    .select()
    .single()

  if (error) throw error
  return data
}
```

#### Update Company

```typescript
// PATCH /rest/v1/companies/{id}
const updateCompany = async (id: string, companyData: Partial<Company>) => {
  const { data, error } = await supabase
    .from('companies')
    .update(companyData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
```

#### Delete Company

```typescript
// DELETE /rest/v1/companies/{id}
const deleteCompany = async (id: string) => {
  const { error } = await supabase.from('companies').delete().eq('id', id)

  if (error) throw error
  return true
}
```

### Founders API

#### Get Founders by Company

```typescript
// GET /rest/v1/founders?company_id=eq.{companyId}
const getFounders = async (companyId: string) => {
  const { data, error } = await supabase
    .from('founders')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}
```

#### Create Founder

```typescript
// POST /rest/v1/founders
const createFounder = async (founderData: Partial<Founder>) => {
  const { data, error } = await supabase.from('founders').insert([founderData]).select().single()

  if (error) throw error
  return data
}
```

### Funding Rounds API

#### Get Funding Rounds by Company

```typescript
// GET /rest/v1/funding_rounds?company_id=eq.{companyId}
const getFundingRounds = async (companyId: string) => {
  const { data, error } = await supabase
    .from('funding_rounds')
    .select('*')
    .eq('company_id', companyId)
    .order('round_date', { ascending: true })

  if (error) throw error
  return data
}
```

### ESOP Grants API

#### Get ESOP Grants by Company

```typescript
// GET /rest/v1/esop_grants?company_id=eq.{companyId}
const getEsopGrants = async (companyId: string) => {
  const { data, error } = await supabase
    .from('esop_grants')
    .select('*')
    .eq('company_id', companyId)
    .order('grant_date', { ascending: true })

  if (error) throw error
  return data
}
```

### Scenarios API

#### Get Scenarios by Company

```typescript
// GET /rest/v1/scenarios?company_id=eq.{companyId}
const getScenarios = async (companyId: string) => {
  const { data, error } = await supabase
    .from('scenarios')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
```

#### Create Scenario

```typescript
// POST /rest/v1/scenarios
const createScenario = async (scenarioData: Partial<Scenario>) => {
  const { data, error } = await supabase.from('scenarios').insert([scenarioData]).select().single()

  if (error) throw error
  return data
}
```

## Data Synchronization

### Real-time Updates

```typescript
// Subscribe to company changes
const subscription = supabase
  .channel('company-changes')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'companies',
    },
    payload => {
      console.log('Company updated:', payload.new)
      // Update local state
    }
  )
  .subscribe()
```

### Conflict Resolution

When offline changes conflict with server data:

1. **Last Write Wins**: Most recent timestamp takes precedence
2. **User Resolution**: Prompt user to resolve conflicts
3. **Merge Strategy**: Combine changes when possible
4. **Audit Trail**: Log all conflict resolutions

## Local Storage Fallback

### Data Structure

```typescript
interface LocalStorageData {
  companies: LocalCompany[]
  founders: LocalFounder[]
  fundingRounds: LocalFundingRound[]
  esopGrants: LocalESOPGrant[]
  scenarios: LocalScenario[]
  settings: AppSettings
}

interface LocalCompany extends Company {
  id: string // 'local_' prefix for local IDs
}

interface LocalFounder extends Founder {
  id: string
  companyId: string
}

// ... similar for other entities
```

### Synchronization Logic

```typescript
const syncWithServer = async () => {
  // Check if online
  if (!navigator.onLine) return

  // Get local data
  const localData = getLocalData()

  // Sync companies
  for (const company of localData.companies) {
    if (company.id.startsWith('local_')) {
      // Create new company on server
      const serverCompany = await createCompany(company)
      // Update local ID references
      updateLocalReferences(company.id, serverCompany.id)
    } else {
      // Update existing company
      await updateCompany(company.id, company)
    }
  }

  // Sync other entities...
}
```

## Error Handling

### Network Errors

```typescript
const handleNetworkError = (error: any) => {
  if (error.status === 0) {
    // Network error - switch to offline mode
    setOfflineMode(true)
    saveToLocalStorage()
  } else if (error.status === 401) {
    // Authentication error
    redirectToLogin()
  } else {
    // Other errors
    showErrorMessage(error.message)
  }
}
```

### Data Validation

```typescript
const validateData = (data: any, schema: ZodSchema) => {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof ZodError) {
      // Handle validation errors
      const formattedErrors = formatZodErrors(error)
      throw new ValidationError(formattedErrors)
    }
    throw error
  }
}
```

## Performance Optimization

### Query Optimization

```typescript
// Use select() to limit fields
const { data } = await supabase.from('companies').select('id, name, industry, created_at')

// Use filters to reduce data transfer
const { data } = await supabase
  .from('funding_rounds')
  .select('*')
  .eq('company_id', companyId)
  .gte('round_date', startDate)
  .lte('round_date', endDate)

// Use pagination for large datasets
const { data } = await supabase.from('scenarios').select('*').range(0, 19) // First 20 records
```

### Caching Strategy

```typescript
// Cache frequently accessed data
const companyCache = new Map()

const getCachedCompany = async (id: string) => {
  if (companyCache.has(id)) {
    return companyCache.get(id)
  }

  const company = await getCompany(id)
  companyCache.set(id, company)
  return company
}
```

## Security Considerations

### Row Level Security

```sql
-- Companies table RLS
CREATE POLICY "Users can view their own companies"
ON companies FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own companies"
ON companies FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own companies"
ON companies FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own companies"
ON companies FOR DELETE
USING (auth.uid() = user_id);
```

### Data Encryption

```typescript
// Encrypt sensitive data before storage
const encryptData = (data: string, key: string) => {
  // Implementation using Web Crypto API
  return encryptedData
}

// Decrypt data after retrieval
const decryptData = (encryptedData: string, key: string) => {
  // Implementation using Web Crypto API
  return decryptedData
}
```

## Monitoring and Analytics

### API Usage Tracking

```typescript
const trackApiCall = (endpoint: string, method: string, duration: number) => {
  // Send to analytics service
  analytics.track('api_call', {
    endpoint,
    method,
    duration,
    timestamp: new Date(),
  })
}
```

### Error Monitoring

```typescript
const logError = (error: Error, context: string) => {
  // Send to error tracking service
  errorTracker.captureException(error, {
    contexts: { context },
  })
}
```

## Testing Strategy

### Mock API Layer

```typescript
// Mock Supabase client for testing
const mockSupabase = {
  from: (table: string) => ({
    select: () => mockSupabase,
    insert: () => mockSupabase,
    update: () => mockSupabase,
    delete: () => mockSupabase,
    eq: () => mockSupabase,
    single: () => Promise.resolve({ data: {}, error: null }),
  }),
}
```

### Integration Tests

```typescript
describe('Company API', () => {
  beforeEach(() => {
    // Setup test data
  })

  afterEach(() => {
    // Cleanup test data
  })

  test('should create company successfully', async () => {
    const companyData = { name: 'Test Company' }
    const result = await createCompany(companyData)
    expect(result.name).toBe('Test Company')
  })

  test('should handle network errors gracefully', async () => {
    // Mock network failure
    await expect(createCompany({})).rejects.toThrow('Network error')
  })
})
```

## Future Enhancements

### GraphQL API

Consider migrating to GraphQL for more flexible data fetching:

```graphql
query GetCompanyWithDetails($companyId: ID!) {
  company(id: $companyId) {
    id
    name
    founders {
      id
      name
      equityPercentage
    }
    fundingRounds {
      id
      name
      capitalRaised
      valuation
    }
    esopGrants {
      id
      employeeName
      sharesGranted
      vestedShares
    }
  }
}
```

### WebSocket Integration

For real-time collaboration features:

```typescript
const socket = new WebSocket('wss://api.startupvaluesimulator.com')

socket.onmessage = event => {
  const data = JSON.parse(event.data)
  // Handle real-time updates
}
```

### Edge Functions

Serverless functions for complex calculations:

```typescript
// Supabase Edge Function
export const calculateMonteCarlo = async (req: Request) => {
  const { parameters } = await req.json()
  const results = performMonteCarloSimulation(parameters)
  return new Response(JSON.stringify(results))
}
```

---

_This API and data flow documentation ensures professional-grade data management with robust offline support and seamless user experience._
