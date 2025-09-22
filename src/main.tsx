import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Home from './pages/Home'
import LearnMore from './pages/LearnMore'
import './index.css'
import 'antd/dist/reset.css'

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element with id 'root' not found");
}

// Professional URL routing system
const getRoute = () => {
  const path = window.location.hash.slice(1) || '/'
  return path
}

// Professional route mapping
const ROUTES = {
  '/': 'home',
  '/home': 'home', 
  '/features': 'learn-more', // More professional than 'learn-more'
  '/learn-more': 'learn-more', // Keep backward compatibility
  '/documentation': 'learn-more', // Alternative professional URL
  '/app': 'app',
  '/dashboard': 'app', // More professional alternative
  '/simulator': 'app' // Another professional alternative
} as const

const Root: React.FC = () => {
  const [route, setRoute] = React.useState(getRoute());
  
  React.useEffect(() => {
    const onHashChange = () => setRoute(getRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  
  // Route resolution with professional URLs
  const routeType = ROUTES[route as keyof typeof ROUTES] || 'home'
  
  switch (routeType) {
    case 'learn-more':
      return <LearnMore />;
    case 'app':
      return <App />;
    default:
      return <Home />;
  }
};

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
