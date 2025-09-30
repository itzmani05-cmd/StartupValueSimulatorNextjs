# Deployment and Operations Documentation

## Overview

This document provides comprehensive guidance for deploying, operating, and maintaining the Startup Value Simulator application in production environments. It covers deployment strategies, monitoring, scaling, and operational best practices.

## Deployment Architecture

### Static Site Deployment

The application is designed as a static site that can be deployed to any static hosting provider:

1. **Build Process**: `npm run build` generates optimized static assets
2. **Output Directory**: `dist/` contains all production files
3. **Static Assets**: HTML, CSS, JavaScript, and media files
4. **Client-side Routing**: Hash-based routing for SPA functionality

### Hosting Options

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod
```

#### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy to Netlify
netlify deploy --prod
```

#### GitHub Pages

```bash
# Build for GitHub Pages
npm run build

# Deploy using GitHub Actions or manual upload
```

#### AWS S3 + CloudFront

```bash
# Build application
npm run build

# Upload to S3 bucket
aws s3 sync dist/ s3://your-bucket-name --delete

# Configure CloudFront distribution
```

## Environment Configuration

### Environment Variables

Create a `.env.production` file with production values:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key

# Application Settings
VITE_APP_NAME=Startup Value Simulator
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_MOCK_DATA=false
VITE_ENABLE_ANALYTICS=true
```

### Build Configuration

The build process automatically injects environment variables:

```bash
# Production build with environment variables
npm run build
```

## Continuous Integration/Continuous Deployment (CI/CD)

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Automated Testing

```yaml
# Test job in CI pipeline
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm ci
    - run: npm run type-check
    - run: npm run lint
    - run: npm run test:coverage
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
```

## Monitoring and Analytics

### Performance Monitoring

```typescript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(onPerfEntry)
    getFID(onPerfEntry)
    getFCP(onPerfEntry)
    getLCP(onPerfEntry)
    getTTFB(onPerfEntry)
  }
}

export default reportWebVitals
```

### Error Tracking

```typescript
// Error boundary with reporting
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
})

const ErrorBoundaryWithReporting = ({ children }: { children: React.ReactNode }) => (
  <Sentry.ErrorBoundary fallback={<ErrorMessage />}>
    {children}
  </Sentry.ErrorBoundary>
)
```

### User Analytics

```typescript
// Basic analytics setup
const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (import.meta.env.VITE_ENABLE_ANALYTICS) {
    // Send to analytics service
    analytics.track(eventName, properties)
  }
}

// Track page views
useEffect(() => {
  trackEvent('page_view', { path: location.pathname })
}, [location.pathname])
```

## Security Considerations

### Content Security Policy (CSP)

Add CSP headers to prevent XSS attacks:

```html
<!-- index.html -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://*.supabase.co; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
               img-src 'self' data: https:; 
               font-src 'self' https://fonts.gstatic.com; 
               connect-src 'self' https://*.supabase.co;"
/>
```

### HTTPS Enforcement

Ensure all connections use HTTPS:

```nginx
# Nginx configuration
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        root /var/www/html;
        index index.html;
        try_files $uri $uri/ =404;
    }
}
```

### Security Headers

```nginx
# Additional security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

## Backup and Recovery

### Database Backups

Supabase provides automated backups:

```sql
-- Manual backup using pg_dump
pg_dump -h db.supabase.co -p 5432 -U postgres -d your_database > backup.sql

-- Restore from backup
psql -h db.supabase.co -p 5432 -U postgres -d your_database < backup.sql
```

### Local Data Export

```typescript
// Export user data functionality
const exportUserData = async (companyId: string) => {
  const data = {
    company: await getCompany(companyId),
    founders: await getFounders(companyId),
    fundingRounds: await getFundingRounds(companyId),
    esopGrants: await getEsopGrants(companyId),
    scenarios: await getScenarios(companyId),
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `startup-data-${companyId}.json`
  a.click()
}
```

### Disaster Recovery Plan

1. **Daily Backups**: Automated database snapshots
2. **Weekly Exports**: Full data exports for offline storage
3. **Monthly Tests**: Recovery procedure testing
4. **Annual Reviews**: Security and compliance audits

## Scaling Considerations

### Horizontal Scaling

The static nature of the application allows for easy horizontal scaling:

1. **CDN Distribution**: Global content delivery
2. **Load Balancing**: Multiple server instances
3. **Caching Layers**: Redis or similar caching
4. **Database Read Replicas**: For high-traffic scenarios

### Database Scaling

```sql
-- Index optimization for performance
CREATE INDEX idx_companies_user_id ON companies(user_id);
CREATE INDEX idx_founders_company_id ON founders(company_id);
CREATE INDEX idx_funding_rounds_company_id ON funding_rounds(company_id);
CREATE INDEX idx_esop_grants_company_id ON esop_grants(company_id);
CREATE INDEX idx_scenarios_company_id ON scenarios(company_id);

-- Partitioning for large datasets
CREATE TABLE funding_rounds_2023 PARTITION OF funding_rounds
FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');
```

### Caching Strategy

```typescript
// Client-side caching
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

const getCachedData = async (key: string, fetchFn: () => Promise<any>) => {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }

  const data = await fetchFn()
  cache.set(key, { data, timestamp: Date.now() })
  return data
}
```

## Maintenance Operations

### Database Migrations

```sql
-- Migration script example
-- Version 1.1.0 - Add exit_valuation to company_settings

ALTER TABLE company_settings
ADD COLUMN IF NOT EXISTS exit_valuation BIGINT;

-- Update existing records with default value
UPDATE company_settings
SET exit_valuation = current_valuation
WHERE exit_valuation IS NULL;
```

### Application Updates

```bash
# Update dependencies
npm outdated
npm update

# Security audit
npm audit
npm audit fix

# Type checking
npm run type-check

# Linting
npm run lint

# Testing
npm run test
```

### Performance Optimization

```bash
# Bundle analysis
npm run build -- --stats
npx webpack-bundle-analyzer dist/stats.json

# Performance testing
npm run test:perf

# Lighthouse audit
npx lighthouse https://your-domain.com
```

## Troubleshooting Guide

### Common Issues

#### Build Failures

```bash
# Clear build cache
rm -rf node_modules/.vite
npm run build

# Check TypeScript errors
npm run type-check

# Check linting issues
npm run lint
```

#### Runtime Errors

```typescript
// Enhanced error logging
const logError = (error: Error, context: string) => {
  console.error(`[${new Date().toISOString()}] ${context}:`, error)

  // Send to error tracking service
  if (import.meta.env.PROD) {
    errorTracker.captureException(error, { context })
  }
}
```

#### Database Connection Issues

```typescript
// Retry logic for database operations
const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
    }
  }
  throw new Error('Max retries exceeded')
}
```

### Monitoring Dashboard

Create a monitoring dashboard with key metrics:

1. **Application Uptime**: 99.9% target
2. **Response Time**: < 200ms for static assets
3. **Error Rate**: < 0.1% for all requests
4. **User Sessions**: Daily/monthly active users
5. **Feature Usage**: Popular features tracking

## Compliance and Regulations

### GDPR Compliance

```typescript
// Data deletion functionality
const deleteUserData = async (userId: string) => {
  // Delete all user data from database
  await supabase.from('companies').delete().eq('user_id', userId)

  // Delete user account
  await supabase.auth.admin.deleteUser(userId)
}
```

### Data Privacy

```typescript
// Privacy-focused analytics
const trackAnonymousEvent = (eventName: string, properties?: Record<string, any>) => {
  // Remove personally identifiable information
  const anonymousProperties = {
    ...properties,
    userId: undefined,
    userEmail: undefined,
    userName: undefined,
  }

  analytics.track(eventName, anonymousProperties)
}
```

## Backup and Recovery Procedures

### Automated Backups

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
pg_dump -h db.supabase.co -p 5432 -U postgres -d your_database > backups/backup-$DATE.sql
find backups/ -name "backup-*.sql" -mtime +30 -delete
```

### Manual Recovery

```bash
# Restore from backup
psql -h db.supabase.co -p 5432 -U postgres -d your_database < backups/backup-20231201.sql
```

## Future Enhancements

### Containerization

```dockerfile
# Dockerfile for containerized deployment
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Kubernetes Deployment

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: startup-simulator
spec:
  replicas: 3
  selector:
    matchLabels:
      app: startup-simulator
  template:
    metadata:
      labels:
        app: startup-simulator
    spec:
      containers:
        - name: startup-simulator
          image: your-registry/startup-simulator:latest
          ports:
            - containerPort: 80
          envFrom:
            - secretRef:
                name: startup-simulator-secrets
```

### Serverless Functions

```typescript
// Edge function for complex calculations
export const calculateScenario = async (req: Request) => {
  const { scenarioData } = await req.json()
  const results = performComplexCalculation(scenarioData)

  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' },
  })
}
```

---

_This deployment and operations documentation ensures professional-grade application delivery with robust monitoring, security, and scalability._
