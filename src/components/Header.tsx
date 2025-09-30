import React from 'react';
import { Button, Dropdown, MenuProps, Avatar, Layout, theme, Space } from 'antd';
import { UserOutlined, LogoutOutlined, HomeOutlined, AppstoreOutlined, InfoCircleOutlined, MenuOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Header: AntHeader } = Layout;
const { useToken } = theme;

interface HeaderProps {
  showAuthControls?: boolean;
  onNavigate?: (path: string) => void;
}

const Header: React.FC<HeaderProps> = ({ showAuthControls = true, onNavigate }) => {
  const { user, logout } = useAuth();
  const { token } = useToken();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      if (onNavigate) {
        onNavigate('/login');
      } else {
        window.location.hash = '#/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.hash = `#${path}`;
    }
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  const items: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  // Navigation items for mobile menu
  const navItems = [
    { icon: <HomeOutlined />, label: 'Home', path: '/home' },
    { icon: <AppstoreOutlined />, label: 'App', path: '/app' },
    { icon: <InfoCircleOutlined />, label: 'Features', path: '/features' },
  ];

  return (
    <AntHeader 
      style={{ 
        background: token.colorBgContainer,
        padding: '0 16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          onClick={() => handleNavigate('/home')}
        >
          <div style={{ position: 'relative' }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              background: 'linear-gradient(to bottom right, #1890ff, #722ed1)', 
              borderRadius: '6px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <span style={{ fontSize: '16px' }}>🚀</span>
            </div>
            <div style={{ 
              position: 'absolute', 
              top: '-2px', 
              right: '-2px', 
              width: '10px', 
              height: '10px', 
              background: 'linear-gradient(to bottom right, #52c41a, #73d13d)', 
              borderRadius: '50%', 
              border: '2px solid #ffffff'
            }}></div>
          </div>
          <h1 style={{ 
            fontSize: '16px', 
            fontWeight: 'bold', 
            background: 'linear-gradient(to right, #1d1d1d, #4b4b4b)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '180px'
          }}>
            Startup Value Simulator
          </h1>
        </div>
        
        {/* Desktop Navigation */}
        <div style={{ display: 'none', alignItems: 'center', gap: '8px' }} className="desktop-nav">
          {showAuthControls && (
            <>
              {user ? (
                <>
                  <span style={{ color: '#595959', fontWeight: '500', display: 'none', fontSize: '14px' }} className="welcome-text">
                    Welcome, {user.name || user.email}
                  </span>
                  <Avatar 
                    icon={<UserOutlined />} 
                    style={{ backgroundColor: token.colorPrimary }}
                    size="small"
                  />
                  <Dropdown
                    menu={{ items }}
                    trigger={['click']}
                  >
                    <Button type="text" icon={<UserOutlined />} size="small" />
                  </Dropdown>
                </>
              ) : (
                <Button 
                  type="primary" 
                  icon={<UserOutlined />}
                  onClick={() => handleNavigate('/login')}
                  size="small"
                >
                  Login
                </Button>
              )}
            </>
          )}
          
          <Button 
            type="text"
            icon={<HomeOutlined />}
            onClick={() => handleNavigate('/home')}
            size="small"
          >
            <span style={{ display: 'none' }}>Home</span>
          </Button>
          
          <Button 
            type="text"
            icon={<AppstoreOutlined />}
            onClick={() => handleNavigate('/app')}
            size="small"
          >
            <span style={{ display: 'none' }}>App</span>
          </Button>
          
          <Button 
            type="text"
            icon={<InfoCircleOutlined />}
            onClick={() => handleNavigate('/features')}
            size="small"
          >
            <span style={{ display: 'none' }}>Features</span>
          </Button>
        </div>
        
        {/* Mobile Menu Button */}
        <Button 
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ display: 'block' }}
          className="mobile-menu-btn"
        />
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div style={{ 
          position: 'absolute', 
          top: '64px', 
          left: 0, 
          right: 0, 
          background: token.colorBgContainer,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          padding: '16px',
          zIndex: 1000
        }} className="mobile-nav-menu">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {showAuthControls && user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
                <Avatar 
                  icon={<UserOutlined />} 
                  style={{ backgroundColor: token.colorPrimary }}
                  size="small"
                />
                <span style={{ color: '#595959', fontWeight: '500', fontSize: '14px' }}>
                  {user.name || user.email}
                </span>
              </div>
            )}
            
            {navItems.map((item, index) => (
              <Button 
                key={index}
                type="text"
                icon={item.icon}
                onClick={() => handleNavigate(item.path)}
                style={{ 
                  justifyContent: 'flex-start', 
                  width: '100%',
                  padding: '12px 16px',
                  textAlign: 'left'
                }}
              >
                {item.label}
              </Button>
            ))}
            
            {showAuthControls && (
              <>
                {user ? (
                  <Button 
                    type="primary"
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                    style={{ marginTop: '8px' }}
                  >
                    Logout
                  </Button>
                ) : (
                  <Button 
                    type="primary"
                    icon={<UserOutlined />}
                    onClick={() => handleNavigate('/login')}
                    style={{ marginTop: '8px' }}
                  >
                    Login
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Add responsive CSS */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .welcome-text {
            display: block !important;
          }
        }
        
        @media (max-width: 767px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </AntHeader>
  );
};

export default Header;