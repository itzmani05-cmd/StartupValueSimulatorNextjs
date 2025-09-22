# Project Structure Documentation

## Overview

This document provides a comprehensive overview of the Startup Value Simulator project structure, following professional software development practices.

## Directory Structure

```
startup-simulator-next/
├── docs/                    # Documentation files
├── public/                  # Static assets
├── scripts/                 # Database and utility scripts
├── src/                     # Source code
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Business logic and utilities
│   ├── pages/               # Main application pages
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── .env.example            # Environment variables template
├── .eslintrc.json          # ESLint configuration
├── .gitignore              # Git ignore rules
├── .prettierrc             # Prettier configuration
├── LICENSE                 # License information
├── README.md               # Project documentation
├── package.json            # NPM package configuration
├── tsconfig.json           # TypeScript configuration
├── tsconfig.node.json      # Node TypeScript configuration
└── vite.config.ts          # Vite build configuration
```

## Source Code Structure

### Components Directory
The `src/components/` directory contains reusable UI components that follow the single responsibility principle:

- **FeatureGrid.tsx**: Professional feature display grid
- **Footer.tsx**: Application footer with navigation
- **ErrorBoundary.tsx**: Error handling boundary for React components

### Lib Directory
The `src/lib/` directory contains business logic, utilities, and service integrations:

- **supabase.ts**: Supabase client configuration and database operations
- **calculations.ts**: Financial calculations and modeling functions
- **validation.ts**: Data validation utilities
- **formatting.ts**: Data formatting and display utilities

### Pages Directory
The `src/pages/` directory contains the main application pages:

- **App.tsx**: Main application shell with tab navigation
- **Home.tsx**: Landing page with marketing content
- **LearnMore.tsx**: Detailed feature documentation

## Architecture Patterns

### Component Design
All components follow these professional patterns:

1. **Type Safety**: Full TypeScript typing for props and state
2. **Reusability**: Components designed for multiple use cases
3. **Accessibility**: Proper ARIA attributes and keyboard navigation
4. **Responsive Design**: Mobile-first approach with breakpoints
5. **Performance**: Optimized rendering with React.memo and useCallback

### State Management
The application uses React's built-in state management with:

1. **useState**: Local component state
2. **useEffect**: Side effects and lifecycle management
3. **useMemo**: Memoized computations
4. **useCallback**: Memoized callbacks
5. **Context API**: Global state when needed

### Data Flow
Data flows through the application in a unidirectional manner:

1. **User Input** → Components
2. **Components** → State Management
3. **State Management** → Business Logic
4. **Business Logic** → Database/API
5. **Database/API** → State Management
6. **State Management** → Components
7. **Components** → UI Rendering

## Styling System

### Design Tokens
The application uses a professional design system with:

- **Color Palette**: Consistent color scheme with semantic naming
- **Typography**: Proper font hierarchy and sizing
- **Spacing**: Consistent spacing system based on 4px grid
- **Border Radius**: Unified corner rounding system
- **Shadows**: Professional depth and elevation system

### CSS Architecture
The styling follows these professional practices:

1. **Utility-First**: Combination of utility classes and component CSS
2. **Responsive**: Mobile-first responsive design
3. **Consistent**: Unified design language across components
4. **Maintainable**: Organized and well-documented CSS

## Build and Deployment

### Development Workflow
1. **Development**: `npm run dev` for hot-reloading development server
2. **Linting**: `npm run lint` for code quality checks
3. **Type Checking**: `npm run type-check` for TypeScript validation
4. **Testing**: `npm run test` for unit tests

### Production Build
1. **Build**: `npm run build` for optimized production build
2. **Preview**: `npm run preview` for local production preview
3. **Deployment**: Static files in `dist/` directory

## Database Integration

### Supabase Integration
The application uses Supabase for data persistence with:

1. **Real-time**: Real-time data synchronization
2. **Offline Support**: Local storage fallback when offline
3. **Security**: Row-level security and authentication
4. **Scalability**: Cloud-based database infrastructure

### Data Models
The database schema includes:

1. **Companies**: Company profiles and settings
2. **Founders**: Founder information and equity distribution
3. **Funding Rounds**: Investment rounds and details
4. **ESOP Grants**: Employee stock option grants
5. **Scenarios**: Saved modeling scenarios

## Testing Strategy

### Unit Testing
- **Framework**: Vitest for fast unit testing
- **Coverage**: Target 80%+ code coverage
- **Mocking**: Proper dependency mocking
- **Assertions**: Clear and descriptive assertions

### Integration Testing
- **Component Testing**: React Testing Library for component integration
- **API Testing**: Mock service worker for API testing
- **E2E Testing**: Cypress for end-to-end testing

## Performance Optimization

### Code Splitting
- **Dynamic Imports**: Lazy loading for non-critical components
- **Bundle Analysis**: Regular bundle size monitoring
- **Tree Shaking**: Unused code elimination

### Caching Strategy
- **HTTP Caching**: Proper cache headers
- **Service Worker**: Offline support and caching
- **Memoization**: Computation result caching

### Rendering Optimization
- **Virtualization**: Large list virtualization
- **Debouncing**: Input and API call debouncing
- **Lazy Loading**: Component and data lazy loading

## Security Considerations

### Frontend Security
- **Input Validation**: Client-side validation
- **Sanitization**: Data sanitization before rendering
- **Authentication**: Secure authentication flow
- **Authorization**: Role-based access control

### Data Security
- **Encryption**: Data encryption in transit and at rest
- **Privacy**: GDPR and privacy compliance
- **Audit Trail**: Data access logging
- **Backup**: Regular data backups

## Accessibility

### WCAG Compliance
The application follows WCAG 2.1 AA guidelines:

1. **Perceivable**: Proper contrast and alternative text
2. **Operable**: Keyboard navigation and screen reader support
3. **Understandable**: Clear navigation and consistent behavior
4. **Robust**: Compatible with assistive technologies

### ARIA Implementation
- **Landmarks**: Proper page structure landmarks
- **Labels**: Descriptive labels for interactive elements
- **States**: Dynamic state announcements
- **Live Regions**: Dynamic content updates

## Internationalization

### i18n Support
- **Localization**: Multi-language support
- **Formatting**: Locale-specific number and date formatting
- **RTL Support**: Right-to-left language support
- **Cultural Considerations**: Culture-specific UI adaptations

## Monitoring and Analytics

### Error Tracking
- **Error Boundaries**: React error boundaries
- **Logging**: Centralized error logging
- **Reporting**: Automated error reporting
- **User Feedback**: Error context collection

### Performance Monitoring
- **Metrics**: Core Web Vitals tracking
- **User Experience**: Interaction performance monitoring
- **Resource Loading**: Asset loading performance
- **Real User Monitoring**: Actual user experience data

## Maintenance and Updates

### Version Control
- **Branching**: Git flow branching strategy
- **Commits**: Conventional commit messages
- **Reviews**: Pull request code reviews
- **CI/CD**: Automated testing and deployment

### Documentation
- **Code Comments**: Inline code documentation
- **API Docs**: Automated API documentation
- **User Guides**: Comprehensive user documentation
- **Architecture Docs**: System architecture documentation

### Dependency Management
- **Updates**: Regular dependency updates
- **Security**: Security vulnerability monitoring
- **Compatibility**: Version compatibility testing
- **Deprecation**: Deprecated feature tracking