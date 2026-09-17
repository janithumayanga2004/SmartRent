import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '981175223925-t90tvsi4hpcdo3jmoo2mpjeajml5q823.apps.googleusercontent.com';

export default function AuthPage({ notify, setActivePage, initialMessage }) {
  const { login, signup, googleLogin } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleInitialized, setGoogleInitialized] = useState(false);

  // Initialize Google Identity Services
  useEffect(() => {
    let timer = null;
    const setupGoogleSignIn = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: async (response) => {
              if (response?.credential) {
                setLoading(true);
                try {
                  await googleLogin({ credential: response.credential });
                  notify && notify('Signed in with Google successfully!', 'success');
                  setActivePage('dashboard');
                } catch (err) {
                  notify && notify(err.message || 'Google authentication failed', 'error');
                } finally {
                  setLoading(false);
                }
              }
            },
            auto_select: false,
          });

          const container = document.getElementById('google-btn-container');
          if (container) {
            container.innerHTML = '';
            window.google.accounts.id.renderButton(container, {
              theme: 'outline',
              size: 'large',
              width: 360,
              text: 'continue_with',
              shape: 'rectangular',
              logo_alignment: 'left',
            });
            setGoogleInitialized(true);
          }
        } catch (e) {
          console.warn('Google Identity initialization notice:', e);
        }
      }
    };

    setupGoogleSignIn();
    timer = setInterval(setupGoogleSignIn, 300);
    const timeout = setTimeout(() => clearInterval(timer), 3000);

    return () => {
      if (timer) clearInterval(timer);
      if (timeout) clearTimeout(timeout);
    };
  }, [mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        notify && notify('Welcome back! Successfully logged in.', 'success');
        setActivePage('dashboard');
      } else {
        await signup(name, email, password);
        notify && notify('Account created successfully! Please sign in.', 'success');
        setMode('login');
        setPassword('');
      }
    } catch (err) {
      notify && notify(err.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleFallback = async () => {
    setLoading(true);
    try {
      await googleLogin();
      notify && notify('Authenticated with Google successfully!', 'success');
      setActivePage('dashboard');
    } catch (err) {
      notify && notify(err.message || 'Google login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{
      maxWidth: '460px',
      margin: '2rem auto',
      padding: '0 1rem'
    }}>
      {initialMessage && (
        <div style={{
          marginBottom: '1.25rem',
          padding: '0.85rem 1rem',
          background: 'rgba(6, 182, 212, 0.1)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          borderRadius: 'var(--radius-md)',
          color: '#38bdf8',
          fontSize: '0.88rem',
          textAlign: 'center'
        }}>
          {initialMessage}
        </div>
      )}

      <div className="glass-panel" style={{ padding: '2.25rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--gradient-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#051a13',
            marginBottom: '0.75rem',
            boxShadow: '0 0 20px var(--accent-emerald-glow)'
          }}>
            <Lock size={22} />
          </div>
          <h2 style={{ fontSize: '1.65rem', marginBottom: '0.35rem' }}>
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            {mode === 'login'
              ? 'Sign in to access your saved valuations and analytics'
              : 'Join SmartRent to unlock valuation history and metrics'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          background: 'var(--bg-surface)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            type="button"
            className={`btn btn-ghost btn-sm ${mode === 'login' ? 'pill-option active' : ''}`}
            onClick={() => setMode('login')}
            style={{ borderRadius: '8px', justifyContent: 'center' }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`btn btn-ghost btn-sm ${mode === 'signup' ? 'pill-option active' : ''}`}
            onClick={() => setMode('signup')}
            style={{ borderRadius: '8px', justifyContent: 'center' }}
          >
            Create Account
          </button>
        </div>

        {/* Google Auth Integration */}
        <div style={{ marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <div id="google-btn-container" style={{ width: '100%', display: 'flex', justifyContent: 'center' }} />

          {!googleInitialized && (
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleFallback}
              className="btn btn-google"
              style={{ width: '100%', gap: '0.75rem' }}
            >
              {/* Google SVG Logo */}
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          )}
        </div>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          margin: '1.25rem 0',
          color: 'var(--text-muted)',
          fontSize: '0.78rem'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          <span>or continue with email</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="Alex Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.75rem' }}
          >
            {loading ? 'Authenticating...' : (
              <>
                <span>{mode === 'login' ? 'Sign In to Account' : 'Create Account'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
