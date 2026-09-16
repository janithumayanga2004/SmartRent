import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatCardSkeleton, TableRowSkeleton } from '../components/Skeletons';
import { BtnSpinner } from '../components/Skeletons';
import {
  LayoutDashboard,
  Trash2,
  Download,
  Sparkles,
  Building,
  TrendingUp,
  Calendar,
  MapPin,
  RefreshCw,
  Clock,
  Home,
} from 'lucide-react';

export default function DashboardPage({ notify, setActivePage }) {
  const { user, isAuthenticated } = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [exporting, setExporting] = useState(false);

  const loadDashboardData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const [histRes, statsRes] = await Promise.all([
        api.getPredictions(),
        api.getDashboardStats()
      ]);
      setPredictions(histRes.predictions || []);
      setStats(statsRes.stats || null);
      if (isManual) notify && notify('Dashboard refreshed', 'success');
    } catch (err) {
      notify && notify('Failed to load dashboard data: ' + err.message, 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadDashboardData();
  }, [isAuthenticated]);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this prediction from your history?')) return;
    setDeletingId(id);
    try {
      await api.deletePrediction(id);
      setPredictions((prev) => prev.filter((p) => p.id !== id));
      notify && notify('Prediction removed from history', 'success');
      const statsRes = await api.getDashboardStats();
      setStats(statsRes.stats);
    } catch (err) {
      notify && notify('Error deleting prediction: ' + err.message, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const exportToCSV = () => {
    if (predictions.length === 0) return;
    setExporting(true);
    try {
      const headers = ['ID', 'City', 'Locality', 'BHK', 'Size (sq ft)', 'Floor', 'Furnishing', 'Tenant', 'Bathrooms', 'Predicted Rent (INR)', 'Date'];
      const rows = predictions.map((p) => [
        p.id,
        `"${p.city}"`,
        `"${p.area_locality || ''}"`,
        p.bhk,
        p.size,
        `"${p.floor}"`,
        `"${p.furnishing_status}"`,
        `"${p.tenant_preferred}"`,
        p.bathroom,
        p.predicted_rent,
        `"${p.created_at}"`
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const link = document.createElement('a');
      link.setAttribute('href', encodeURI(csvContent));
      link.setAttribute('download', `SmartRent_Valuations_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      notify && notify(`Exported ${predictions.length} records to CSV`, 'success');
    } catch {
      notify && notify('Export failed', 'error');
    } finally {
      setTimeout(() => setExporting(false), 800);
    }
  };

  // ── Unauthenticated gate ──────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="glass-panel" style={{
        padding: '3.5rem 2rem',
        textAlign: 'center',
        maxWidth: '480px',
        margin: '4rem auto',
        animation: 'scaleIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards'
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '18px',
          background: 'linear-gradient(135deg,rgba(16,185,129,0.18),rgba(6,182,212,0.18))',
          border: '1px solid rgba(16,185,129,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.25rem',
        }}>
          <LayoutDashboard size={28} color="var(--accent-emerald)" />
        </div>
        <h2 style={{ marginBottom: '0.5rem', fontSize: '1.45rem' }}>Authentication Required</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
          Sign in to view and manage your saved property valuations.
        </p>
        <button className="btn btn-primary" onClick={() => setActivePage('auth')}>
          Sign In to Continue
        </button>
      </div>
    );
  }

  // ── MAIN RENDER ───────────────────────────────────────────────────────────
  return (
    <div className="animate-fade-in">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user?.avatar_url || user?.picture ? (
            <img
              src={user.avatar_url || user.picture}
              alt={user.name || 'User'}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name || user.email || 'user')}`;
              }}
              style={{
                width: '58px', height: '58px', borderRadius: '16px',
                border: '2px solid var(--accent-emerald)',
                objectFit: 'cover',
                boxShadow: '0 0 20px rgba(16,185,129,0.25)'
              }}
            />
          ) : (
            <div style={{
              width: '58px', height: '58px', borderRadius: '16px',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(16,185,129,0.25)'
            }}>
              <Home size={26} color="#000" />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '2px' }}>
              Welcome, <span className="gradient-text">{user?.name || user?.email}</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Portfolio Valuation &amp; Real Estate Intelligence Dashboard
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => loadDashboardData(true)}
            disabled={refreshing}
            title="Reload Dashboard"
          >
            {refreshing
              ? <BtnSpinner />
              : <RefreshCw size={14} />
            }
            <span>{refreshing ? 'Refreshing…' : 'Refresh'}</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={exportToCSV}
            disabled={predictions.length === 0 || exporting}
          >
            {exporting ? <BtnSpinner /> : <Download size={14} />}
            <span>{exporting ? 'Exporting…' : 'Export CSV'}</span>
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => setActivePage('predict')}
          >
            <Sparkles size={14} />
            <span>New Valuation</span>
          </button>
        </div>
      </div>

      {/* ── Metric Cards ───────────────────────────────────────────────────── */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            {/* Saved Valuations */}
            <div className="glass-panel stat-card" style={{ padding: '1.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Saved Valuations
                </span>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '9px',
                  background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Building size={16} color="var(--accent-emerald)" />
                </div>
              </div>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                {stats ? stats.total_predictions : predictions.length}
              </div>
              <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Properties analyzed
              </div>
            </div>

            {/* Avg Estimated Rent */}
            <div className="glass-panel stat-card" style={{ padding: '1.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Avg Est. Rent
                </span>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '9px',
                  background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <TrendingUp size={16} color="var(--accent-cyan)" />
                </div>
              </div>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#38bdf8', lineHeight: 1 }}>
                ₹{stats?.avg_predicted_rent ? Number(stats.avg_predicted_rent).toLocaleString() : '—'}
              </div>
              <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Across portfolio listings
              </div>
            </div>

            {/* Top Metro */}
            <div className="glass-panel stat-card" style={{ padding: '1.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Top Metro
                </span>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '9px',
                  background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <MapPin size={16} color="var(--accent-purple)" />
                </div>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#a78bfa', lineHeight: 1 }}>
                {stats?.top_city || '—'}
              </div>
              <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Most frequent city
              </div>
            </div>

            {/* Platform Total */}
            <div className="glass-panel stat-card" style={{ padding: '1.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Platform Total
                </span>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '9px',
                  background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Clock size={16} color="var(--accent-amber)" />
                </div>
              </div>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#fbbf24', lineHeight: 1 }}>
                {stats?.global_predictions_count ?? '15+'}
              </div>
              <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Processed platform-wide
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── History Table ───────────────────────────────────────────────────── */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '3px' }}>Recent Valuation History</h3>
            <p style={{ fontSize: '0.81rem', color: 'var(--text-secondary)' }}>
              All property rent estimates generated under your account
            </p>
          </div>
          {!loading && (
            <span className="badge badge-emerald">
              {predictions.length} Records
            </span>
          )}
        </div>

        {loading ? (
          /* Skeleton table rows */
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <TableRowSkeleton cols={8} />
                <TableRowSkeleton cols={8} />
                <TableRowSkeleton cols={8} />
                <TableRowSkeleton cols={8} />
                <TableRowSkeleton cols={8} />
              </tbody>
            </table>
          </div>
        ) : predictions.length === 0 ? (
          /* Empty state */
          <div style={{
            padding: '3.5rem 1.5rem',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.01)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed rgba(255,255,255,0.07)'
          }}>
            <div style={{
              width: '54px', height: '54px', borderRadius: '16px',
              background: 'rgba(255,255,255,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Building size={26} color="var(--text-muted)" />
            </div>
            <h4 style={{ marginBottom: '0.4rem' }}>No Saved Valuations Yet</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem', maxWidth: '340px', margin: '0 auto 1.5rem' }}>
              Run your first property estimation using the prediction tool to populate this table.
            </p>
            <button className="btn btn-primary btn-sm" onClick={() => setActivePage('predict')}>
              <Sparkles size={14} /> Calculate First Rent
            </button>
          </div>
        ) : (
          /* Data table */
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.87rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['Location', 'Configuration', 'Size', 'Floor', 'Furnishing', 'Predicted Rent', 'Date', ''].map((h) => (
                    <th key={h} style={{
                      padding: '0.75rem 1rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      textAlign: h === '' ? 'right' : 'left',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {predictions.map((p) => (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{p.city}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.area_locality || p.city}</div>
                    </td>

                    <td style={{ padding: '0.9rem 1rem' }}>
                      <span className="badge badge-cyan" style={{ textTransform: 'none', fontSize: '0.75rem' }}>
                        {p.bhk} BHK · {p.bathroom} Bath
                      </span>
                    </td>

                    <td style={{ padding: '0.9rem 1rem', color: 'var(--text-secondary)' }}>
                      {Number(p.size).toLocaleString()} sq ft
                    </td>

                    <td style={{ padding: '0.9rem 1rem', color: 'var(--text-secondary)' }}>
                      {p.floor}
                    </td>

                    <td style={{ padding: '0.9rem 1rem', color: 'var(--text-secondary)' }}>
                      {p.furnishing_status}
                    </td>

                    <td style={{ padding: '0.9rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: '#34d399', fontSize: '1.05rem', letterSpacing: '-0.01em' }}>
                        ₹{Number(p.predicted_rent).toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>/ month</div>
                    </td>

                    <td style={{ padding: '0.9rem 1rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      {p.created_at ? new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Today'}
                    </td>

                    <td style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: deletingId === p.id ? 'var(--text-muted)' : '#fb7185', minWidth: '32px' }}
                        title="Delete Record"
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id}
                      >
                        {deletingId === p.id
                          ? <BtnSpinner />
                          : <Trash2 size={15} />
                        }
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
