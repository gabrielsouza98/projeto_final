// Layout principal - Recriado exatamente como a imagem de referência

import type { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { logout, state, isOrganizer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const topNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/events', label: 'Eventos', icon: '📅' },
    { path: '/registrations', label: 'Minhas inscrições', icon: '📝' },
    { path: '/friends', label: 'Amizades', icon: '👥' },
    { path: '/messages', label: 'Mensagens', icon: '💬' },
  ];

  const sidebarItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/events', label: 'Eventos', icon: '📅', badge: '2' },
    { path: '/registrations', label: 'Minhas Inscrições', icon: '📝' },
    { path: '/friends', label: 'Amizades', icon: '👥' },
    { path: '/messages', label: 'Mensagens', icon: '💬' },
    { path: '/profile', label: 'Perfil', icon: '👤' },
  ];

  if (isOrganizer) {
    topNavItems.push({ path: '/my-events', label: 'Meus Eventos', icon: '⭐' });
    topNavItems.push({ path: '/events/create', label: 'Criar Evento', icon: '➕' });
    sidebarItems.splice(2, 0, { path: '/my-events', label: 'Meus Eventos', icon: '⭐' });
    sidebarItems.splice(3, 0, { path: '/events/create', label: 'Criar Evento', icon: '➕' });
  }

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">S</div>
          <div className="sidebar-logo-text">EventSync AI</div>
        </div>
        
        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <div className="sidebar-nav-item-content">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="sidebar-nav-badge">{item.badge}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="sidebar-logout">
          <button onClick={handleLogout} className="sidebar-logout-btn">
            <span>🔌</span>
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Top Header */}
        <header className="top-header">
          <div className="top-header-content">
            {/* Logo mobile */}
            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="lg:hidden">
              <div className="sidebar-logo-icon">S</div>
              <div className="sidebar-logo-text">EventSync AI</div>
            </Link>

            {/* Top Navigation */}
            <nav className="top-nav">
              {topNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`top-nav-link ${isActive(item.path) ? 'active' : ''}`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* User Profile */}
            <div className="user-profile">
              <div className="user-avatar">
                {state.user?.nome.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">{state.user?.nome}</span>
              <span className="user-dropdown">▼</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <div className="main-content-inner">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
