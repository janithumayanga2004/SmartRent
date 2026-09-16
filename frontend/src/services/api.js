const API_BASE = '';

// ─── Token helpers ────────────────────────────────────────────────────────────
function getAccessToken()  { return localStorage.getItem('smartrent_access_token'); }
function getRefreshToken() { return localStorage.getItem('smartrent_refresh_token'); }

function saveAccessToken(token) {
  localStorage.setItem('smartrent_access_token', token);
  // Keep legacy key in sync so any code still reading it continues to work
  localStorage.setItem('smartrent_token', token);
}

function clearTokens() {
  localStorage.removeItem('smartrent_access_token');
  localStorage.removeItem('smartrent_refresh_token');
  localStorage.removeItem('smartrent_token');
}

function getAuthHeader() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Token refresh logic ──────────────────────────────────────────────────────
let isRefreshing = false;
let refreshSubscribers = [];          // queued retries while refresh is in flight

function subscribeToRefresh(callback) {
  refreshSubscribers.push(callback);
}

function notifySubscribers(newToken) {
  refreshSubscribers.forEach(cb => cb(newToken));
  refreshSubscribers = [];
}

async function tryRefreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) {
      clearTokens();
      return null;
    }

    const data = await res.json();
    const newToken = data.token;
    if (newToken) {
      saveAccessToken(newToken);
    }
    return newToken || null;
  } catch {
    clearTokens();
    return null;
  }
}

// ─── Core request with auto-refresh ──────────────────────────────────────────
async function request(endpoint, options = {}, _isRetry = false) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });

  // Happy path
  if (res.ok) {
    return res.json();
  }

  // Handle 401 — attempt token refresh exactly once
  if (res.status === 401 && !_isRetry) {
    if (!isRefreshing) {
      isRefreshing = true;
      const newToken = await tryRefreshAccessToken();
      isRefreshing = false;
      notifySubscribers(newToken);

      if (!newToken) {
        // Refresh failed — surface the original error
        const data = await res.clone().json().catch(() => ({}));
        throw new Error(data.error || 'Session expired. Please log in again.');
      }

      // Retry original request with fresh token
      return request(endpoint, options, true);
    } else {
      // Another refresh is already in flight — wait for it
      return new Promise((resolve, reject) => {
        subscribeToRefresh(async (newToken) => {
          if (!newToken) {
            reject(new Error('Session expired. Please log in again.'));
            return;
          }
          try {
            resolve(await request(endpoint, options, true));
          } catch (err) {
            reject(err);
          }
        });
      });
    }
  }

  // All other errors
  let errData = {};
  try { errData = await res.json(); } catch {}
  const message = errData.error || (errData.details ? errData.details.join(', ') : 'Request failed');
  console.error(`API Error on ${endpoint}:`, message);
  throw new Error(message);
}

// ─── Public API surface ───────────────────────────────────────────────────────
export const api = {
  // Auth
  register:       (payload) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login:          (payload) => request('/api/auth/login',    { method: 'POST', body: JSON.stringify(payload) }),
  googleAuth:     (payload) => request('/api/auth/google',   { method: 'POST', body: JSON.stringify(payload) }),
  refreshToken:   (payload) => request('/api/auth/refresh',  { method: 'POST', body: JSON.stringify(payload) }),
  getCurrentUser: ()        => request('/api/auth/me'),

  // Prediction
  predict: (payload) => request('/api/predict', { method: 'POST', body: JSON.stringify(payload) }),

  // User Dashboard
  getPredictions:   (limit = 50) => request(`/api/predictions?limit=${limit}`),
  deletePrediction: (id)         => request(`/api/predictions/${id}`, { method: 'DELETE' }),
  getDashboardStats: ()          => request('/api/dashboard/stats'),

  // Market Intelligence
  getAnalytics: (params = {}) => {
    const query = new URLSearchParams();
    if (params.city && params.city !== 'All') query.append('city', params.city);
    if (params.bhk && params.bhk !== 'All') query.append('bhk', params.bhk);
    const qs = query.toString();
    return request(`/api/analytics${qs ? `?${qs}` : ''}`);
  },
  getLocalities: () => request('/api/localities'),
  getModelInfo: ()  => request('/api/model/info'),
  getHealth: ()     => request('/health'),
};

// ─── Token storage helpers exported for AuthContext ───────────────────────────
export { saveAccessToken, clearTokens };
