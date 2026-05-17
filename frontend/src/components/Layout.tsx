import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Badge } from './ui/Badge';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="layout-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-logo">⚡</span>
          <span className="brand-name">GigFlow</span>
        </div>

        {user && (
          <div className="sidebar-user-card">
            <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
            <div className="user-details">
              <div className="user-name">{user.name}</div>
              <div className="user-role-badge">
                <Badge variant={user.role === 'admin' ? 'primary' : 'secondary'}>
                  {user.role.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          {user?.role === 'admin' && (
            <Link
              to="/dashboard"
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              <span className="nav-icon">📊</span>
              <span className="nav-text">Dashboard</span>
            </Link>
          )}

          <Link
            to="/leads"
            className={`nav-link ${isActive('/leads') || isActive('/') ? 'active' : ''}`}
          >
            <span className="nav-icon">💼</span>
            <span className="nav-text">Leads Pipeline</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="main-content-pane">
        <header className="top-header">
          <div className="header-breadcrumbs">
            {location.pathname === '/dashboard' && 'Admin Analytics Dashboard'}
            {(location.pathname === '/leads' || location.pathname === '/') && 'Leads Pipeline Management'}
            {location.pathname.startsWith('/leads/') && 'Lead Direct Overview'}
          </div>
          <div className="header-date">
            📅 {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>
        <div className="page-body-container">{children}</div>
      </main>
    </div>
  );
};
