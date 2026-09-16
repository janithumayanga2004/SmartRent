import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from './ConfirmModal';
import { Home, BarChart3, LayoutDashboard, User, LogOut, Sparkles } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, onOpenAuth, notify }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const handleLogoutConfirm = () => {
    setShowSignOutModal(false);
    logout();
    setActivePage('predict');
    notify && notify('You have been signed out.', 'info');
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          {/* Brand */}
          <div
            className="nav-brand"
            onClick={() => setActivePage('predict')}
            style={{ cursor: 'pointer' }}
          >
            <div className="nav-brand-icon">
              <Home size={22} strokeWidth={2.4} />
            </div>
            <div>
              <span>Smart<span className="gradient-text">Rent</span></span>
              <span style={{
                fontSize: '0.65rem',
                display: 'block',
                fontWeight: 600,
                letterSpacing: '0.12em',
                color: 'var(--accent-emerald)',
                textTransform: 'uppercase',
                marginTop: '-3px'
              }}>
                AI Valuations
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="nav-links">
            <button
              className={`nav-link btn-ghost ${activePage === 'predict' ? 'active' : ''}`}
              onClick={() => setActivePage('predict')}
            >
              <Sparkles size={16} />
              <span>Predict Rent</span>
            </button>

            <button
              className={`nav-link btn-ghost ${activePage === 'analytics' ? 'active' : ''}`}
              onClick={() => setActivePage('analytics')}
            >
              <BarChart3 size={16} />
              <span>Market Analytics</span>
            </button>

            <button
              className={`nav-link btn-ghost ${activePage === 'dashboard' ? 'active' : ''}`}
              onClick={() => {
                if (!isAuthenticated) {
                  onOpenAuth('Please sign in to access your personal valuation dashboard.');
                } else {
                  setActivePage('dashboard');
                }
              }}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </button>
          </nav>

          {/* Auth CTA / User State */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  className="user-menu-pill"
                  onClick={() => setActivePage('dashboard')}
                  title="View Dashboard"
                >
                  {user.avatar_url || user.picture ? (
                    <img
                      src={user.avatar_url || user.picture}
                      alt={user.name || 'User'}
                      className="user-avatar"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name || user.email || 'user')}`;
                      }}
                    />
                  ) : (
                    <div className="user-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                      <User size={14} />
                    </div>
                  )}
                  <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>
                    {user.name || user.email}
                  </span>
                </div>

                {/* Sign Out — opens confirmation modal */}
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowSignOutModal(true)}
                  title="Sign out"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setActivePage('auth')}
                >
                  <User size={14} />
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sign-Out Confirmation Modal */}
      <ConfirmModal
        isOpen={showSignOutModal}
        onCancel={() => setShowSignOutModal(false)}
        onConfirm={handleLogoutConfirm}
        title="Sign out of SmartRent?"
        message="Your session will be cleared. You'll need to sign in again to access your dashboard and saved valuations."
        confirmLabel="Yes, Sign Out"
        cancelLabel="Stay Signed In"
        variant="danger"
      />
    </>
  );
}
