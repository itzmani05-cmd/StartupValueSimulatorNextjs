import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Home from './pages/Home'
import LearnMore from './pages/LearnMore'
import LoginPage from './pages/LoginPage'
import TestPage from './pages/TestPage'
import SimpleFeatures from './pages/SimpleFeatures'
import FeaturesNoAnimation from './pages/FeaturesNoAnimation'
import OAuthCallbackHandler from './components/OAuthCallbackHandler'
import AuthDebug from './components/AuthDebug'
import EmployerDashboard from './pages/EmployerDashboard'
import './styles/globals.css'
import 'antd/dist/reset.css'
import { AuthProvider } from './contexts/AuthContext'

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element with id 'root' not found");
}

// Professional URL routing system
const getRoute = () => {
  const path = window.location.hash.slice(1) || '/'
  console.log('Current route path:', path); // Debug log
  return path
}

// Professional route mapping
const ROUTES = {
  '/': 'login',  // Changed default route to login
  '/home': 'home', 
  '/features': 'features-no-animation', // Try the no animation version first
  '/learn-more': 'learn-more', // Keep backward compatibility
  '/documentation': 'learn-more', // Alternative professional URL
  '/app': 'app',
  '/dashboard': 'app', // More professional alternative
  '/simulator': 'app', // Another professional alternative
  '/login': 'login', // Added explicit login route
  '/auth/callback': 'oauth-callback', // OAuth callback route
  '/auth/debug': 'auth-debug', // Auth debug route
  '/test': 'test', // Test route
  '/simple-features': 'simple-features', // Simple features route
  '/features-no-animation': 'features-no-animation', // No animation features route
  '/user/:id': 'app', // User-specific dashboard
  '/user/:id/company/:id': 'app', // User-specific company dashboard
  '/employee': 'employee' // Employee dashboard route
} as const

// Function to extract company ID from URL
const getCompanyIdFromRoute = (route: string): string | null => {
  // Check for company-specific routes like /company/:id
  const companyRouteMatch = route.match(/^\/company\/([a-zA-Z0-9_-]+)$/);
  return companyRouteMatch ? companyRouteMatch[1] : null;
}

// Function to extract user ID from URL
const getUserIdFromRoute = (route: string): string | null => {
  // Check for user-specific routes like /user/:id
  const userRouteMatch = route.match(/^\/user\/([a-zA-Z0-9_-]+)$/);
  return userRouteMatch ? userRouteMatch[1] : null;
}

// Function to extract user ID and company ID from URL
const getUserAndCompanyFromRoute = (route: string): { userId: string | null, companyId: string | null } => {
  // Check for user-specific routes like /user/:id/company/:id
  const userCompanyRouteMatch = route.match(/^\/user\/([a-zA-Z0-9_-]+)\/company\/([a-zA-Z0-9_-]+)$/);
  if (userCompanyRouteMatch) {
    return { userId: userCompanyRouteMatch[1], companyId: userCompanyRouteMatch[2] };
  }
  
  // Check for user-specific routes like /user/:id
  const userRouteMatch = route.match(/^\/user\/([a-zA-Z0-9_-]+)$/);
  if (userRouteMatch) {
    return { userId: userRouteMatch[1], companyId: null };
  }
  
  // Check for company-specific routes like /company/:id
  const companyRouteMatch = route.match(/^\/company\/([a-zA-Z0-9_-]+)$/);
  if (companyRouteMatch) {
    return { userId: null, companyId: companyRouteMatch[1] };
  }
  
  return { userId: null, companyId: null };
}

const Root: React.FC = () => {
  const [route, setRoute] = React.useState(getRoute());
  
  React.useEffect(() => {
    const onHashChange = () => {
      const newRoute = getRoute();
      console.log('Route changed to:', newRoute); // Debug log
      // Add a check to prevent redirect to home
      if (newRoute === '/home' && window.location.hash !== '#/home') {
        console.log('Preventing redirect to home');
        return;
      }
      setRoute(newRoute);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  
  // Check for user-specific or company-specific routes
  const { userId, companyId } = getUserAndCompanyFromRoute(route);
  
  // Route resolution with professional URLs
  let routeType = ROUTES[route as keyof typeof ROUTES] || 'login' // Changed default to login
  
  // Check for parameterized routes
  if (routeType === 'login' && route.startsWith('/user/')) {
    routeType = 'app';
  }
  
  // Also check for exact parameterized routes
  if (routeType === 'login') {
    // Check for /user/:id pattern
    const userRouteMatch = route.match(/^\/user\/([a-zA-Z0-9_-]+)$/);
    if (userRouteMatch) {
      routeType = 'app';
    }
    
    // Check for /user/:id/company/:id pattern
    const userCompanyRouteMatch = route.match(/^\/user\/([a-zA-Z0-9_-]+)\/company\/([a-zA-Z0-9_-]+)$/);
    if (userCompanyRouteMatch) {
      routeType = 'app';
    }
  }
  
  console.log('Resolved route type:', routeType); // Debug log
  console.log('All routes:', ROUTES); // Debug log
  console.log('Current route:', route); // Debug log
  console.log('User ID:', userId, 'Company ID:', companyId); // Debug log
  
  // If we have a user ID in the URL, show the app with user-specific dashboard
  if (userId) {
    console.log('Rendering App with user ID:', userId); // Debug log
    return (
      <AuthProvider>
        <App userId={userId} initialCompanyId={companyId || undefined} />
      </AuthProvider>
    );
  }
  
  // If we have a company ID in the URL, show the app with that company selected
  if (companyId) {
    console.log('Rendering App with company ID:', companyId); // Debug log
    return (
      <AuthProvider>
        <App initialCompanyId={companyId} />
      </AuthProvider>
    );
  }
  
  console.log('Rendering component for route type:', routeType); // Debug log
  switch (routeType) {
    case 'learn-more':
      console.log('Rendering LearnMore component'); // Debug log
      return (
        <AuthProvider>
          <LearnMore />
        </AuthProvider>
      );
    case 'home':
      console.log('Rendering Home component'); // Debug log
      return (
        <AuthProvider>
          <Home />
        </AuthProvider>
      );
    case 'login':
      console.log('Rendering Login component'); // Debug log
      return (
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      );
    case 'oauth-callback':
      console.log('Rendering OAuth Callback component'); // Debug log
      return (
        <AuthProvider>
          <OAuthCallbackHandler />
        </AuthProvider>
      );
    case 'auth-debug':
      console.log('Rendering Auth Debug component'); // Debug log
      return (
        <AuthProvider>
          <AuthDebug />
        </AuthProvider>
      );
    case 'app':
      console.log('Rendering App component'); // Debug log
      return (
        <AuthProvider>
          <App />
        </AuthProvider>
      );
    case 'test':
      console.log('Rendering Test component'); // Debug log
      return (
        <AuthProvider>
          <TestPage />
        </AuthProvider>
      );
    case 'simple-features':
      console.log('Rendering Simple Features component'); // Debug log
      return (
        <AuthProvider>
          <SimpleFeatures />
        </AuthProvider>
      );
    case 'features-no-animation':
      console.log('Rendering Features No Animation component'); // Debug log
      return (
        <AuthProvider>
          <FeaturesNoAnimation />
        </AuthProvider>
      );
    case 'employee':
      console.log('Rendering Employee Dashboard component'); // Debug log
      return (
        <AuthProvider>
          <EmployerDashboard />
        </AuthProvider>
      );
    default:
      console.log('Defaulting to home page'); // Debug log
      // Instead of defaulting to login, default to home page for better UX
      window.location.hash = '#/home';
      return (
        <AuthProvider>
          <Home />
        </AuthProvider>
      );
  }
};

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)