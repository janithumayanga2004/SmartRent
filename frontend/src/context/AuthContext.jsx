import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, saveAccessToken, clearTokens } from '../services/api';

const AuthContext = createContext(null);

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('smartrent_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Read access token; support legacy key fallback on first load
  const [token, setToken] = useState(() =>
    localStorage.getItem('smartrent_access_token') ||
    localStorage.getItem('smartrent_token') ||
    null
  );

  const [loading, setLoading] = useState(true);

  // On mount, verify the stored session
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.getCurrentUser();
        if (res.user) {
          setUser((prev) => {
            const updated = {
              ...prev,
              ...res.user,
              avatar_url: res.user.avatar_url || res.user.picture || prev?.avatar_url || prev?.picture,
              picture:    res.user.avatar_url || res.user.picture || prev?.avatar_url || prev?.picture,
            };
            localStorage.setItem('smartrent_user', JSON.stringify(updated));
            return updated;
          });
        }
      } catch (err) {
        console.warn('Session check failed — logging out:', err);
        logout();
      } finally {
        setLoading(false);
      }
    }
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ── Persist both tokens and user profile ──────────────────────────────────
  const saveAuth = (accessToken, refreshToken, newUser) => {
    // Access token (+ legacy key kept in sync by saveAccessToken)
    saveAccessToken(accessToken);
    // Refresh token
    if (refreshToken) {
      localStorage.setItem('smartrent_refresh_token', refreshToken);
    }
    if (newUser) {
      localStorage.setItem('smartrent_user', JSON.stringify(newUser));
    }
    setToken(accessToken);
    setUser(newUser);
  };

  // ── Auth actions ──────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const res = await api.login({ email, password });
    saveAuth(res.token, res.refresh_token, res.user);
    return res;
  };

  const signup = async (name, email, password) => {
    const res = await api.register({ name, email, password });
    return res;
  };

  const googleLogin = async (googlePayload = {}) => {
    let clientPicture = null;
    let clientName = null;

    if (googlePayload.credential) {
      const parsed = parseJwt(googlePayload.credential);
      if (parsed) {
        clientPicture = parsed.picture;
        clientName    = parsed.name;
      }
    }

    const payload = Object.keys(googlePayload).length > 0 ? {
      ...googlePayload,
      avatar_url: googlePayload.avatar_url || googlePayload.picture || clientPicture,
      picture:    googlePayload.picture    || googlePayload.avatar_url || clientPicture,
      name:       googlePayload.name       || clientName,
    } : {
      email:      'alex.chen.developer@gmail.com',
      name:       'Alex Chen',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      google_id:  'google_oauth2_108489201948'
    };

    const res = await api.googleAuth(payload);

    const resolvedAvatar = res.user?.avatar_url || res.user?.picture || clientPicture || payload.avatar_url;
    const resolvedUser   = {
      ...res.user,
      avatar_url: resolvedAvatar,
      picture:    resolvedAvatar,
    };

    saveAuth(res.token, res.refresh_token, resolvedUser);
    return { ...res, user: resolvedUser };
  };

  const logout = () => {
    clearTokens();
    localStorage.removeItem('smartrent_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
