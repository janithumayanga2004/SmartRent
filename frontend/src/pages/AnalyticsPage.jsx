import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { AnalyticsSkeleton } from '../components/Skeletons';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import {
  Compass,
  Filter,
  RotateCcw,
  TrendingUp,
  Percent,
  Wallet,
  Sparkles,
  Building2,
  PieChart as PieIcon,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Award
} from 'lucide-react';

// Custom Tooltip for Glassmorphic Dark Aesthetics
const CustomTooltip = ({ active, payload, label, prefix = '₹ ', suffix = '' }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div style={{
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '0.75rem 1rem',
        borderRadius: '10px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
        fontSize: '0.85rem'
      }}>
        <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>
          {label || data.name}
        </div>
        <div style={{ color: data.color || '#38bdf8', fontWeight: 600 }}>
          {data.name ? `${data.name}: ` : ''}
          {prefix}{typeof data.value === 'number' ? data.value.toLocaleString() : data.value}{suffix}
        </div>
        {data.payload?.price_per_sqft && (
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.2rem' }}>
            Unit Rate: ₹ {data.payload.price_per_sqft}/sq ft
          </div>
        )}
        {data.payload?.percentage != null && (
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.2rem' }}>
            Market Share: {data.payload.percentage}% ({data.payload.value?.toLocaleString()} listings)
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage({ notify }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedBhk, setSelectedBhk] = useState('All');

  const fetchAnalyticsData = useCallback(async (city, bhk) => {
    try {
      const res = await api.getAnalytics({ city, bhk });
      setData(res);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      notify && notify('Failed to load market analytics: ' + (err.message || 'Server error'), 'error');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    fetchAnalyticsData(selectedCity, selectedBhk);
  }, [selectedCity, selectedBhk, fetchAnalyticsData]);

  const handleCityChange = (e) => {
    const val = e.target.value;
    setSelectedCity(val);
  };

  const handleBhkChange = (e) => {
    const val = e.target.value;
    setSelectedBhk(val);
  };

  const handleResetFilters = () => {
    setSelectedCity('All');
    setSelectedBhk('All');
  };

  if (loading && !data) {
    return <AnalyticsSkeleton />;
  }

  const summary = data?.summary || {};
  const byCity = data?.by_city || [];
  const byFurnishing = data?.by_furnishing || [];
  const byBhk = data?.by_bhk || [];
  const insights = data?.insights || {};
  const filters = data?.filters || { available_cities: ['All'], available_bhks: ['All'] };

  const isFiltered = selectedCity !== 'All' || selectedBhk !== 'All';

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* ─── 1. Header ────────────────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span className="badge badge-cyan">
            <Compass size={13} /> Indian Metro Real Estate Intelligence
          </span>
          <span className="badge badge-emerald">
            <ShieldCheck size={13} /> {summary.total_dataset_records?.toLocaleString() || '4,746'} Verified Dataset Listings
          </span>
        </div>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Market Analytics & <span className="gradient-text">Investment Insights</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
          Interactive macroeconomic pricing benchmarks, spatial square-foot valuations, and rental yield curves calculated dynamically across Tier-1 metros.
        </p>
      </div>

      {/* ─── 2. Interactive Filtering Controls Bar ────────────────────────────── */}
      <div className="glass-panel" style={{
        padding: '1.2rem 1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(30, 41, 59, 0.5) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 600, fontSize: '0.9rem' }}>
            <Filter size={16} /> Filter Scope:
          </div>

          {/* City Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <label htmlFor="city-filter" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>City:</label>
            <select
              id="city-filter"
              value={selectedCity}
              onChange={handleCityChange}
              className="form-input"
              style={{
                padding: '0.45rem 0.9rem',
                fontSize: '0.85rem',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.8)',
                color: '#fff',
                borderColor: 'var(--border-subtle)',
                cursor: 'pointer',
                minWidth: '140px'
              }}
            >
              {filters.available_cities?.map((c) => (
                <option key={c} value={c} style={{ background: '#0f172a', color: '#fff' }}>
                  {c === 'All' ? 'All Metros' : c}
                </option>
              ))}
            </select>
          </div>

          {/* BHK Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <label htmlFor="bhk-filter" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Configuration:</label>
            <select
              id="bhk-filter"
              value={selectedBhk}
              onChange={handleBhkChange}
              className="form-input"
              style={{
                padding: '0.45rem 0.9rem',
                fontSize: '0.85rem',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.8)',
                color: '#fff',
                borderColor: 'var(--border-subtle)',
                cursor: 'pointer',
                minWidth: '130px'
              }}
            >
              {filters.available_bhks?.map((b) => (
                <option key={b} value={b.replace(' BHK', '')} style={{ background: '#0f172a', color: '#fff' }}>
                  {b === 'All' ? 'All BHKs' : b}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="btn-ghost"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                color: '#94a3b8'
              }}
            >
              <RotateCcw size={13} /> Reset
            </button>
          )}
        </div>

        {/* Dynamic Scope Tag */}
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Active Filter: <strong style={{ color: '#38bdf8' }}>{selectedCity === 'All' ? 'Pan-India' : selectedCity}</strong> • <strong style={{ color: '#34d399' }}>{selectedBhk === 'All' ? 'All Configurations' : `${selectedBhk} BHK`}</strong> ({summary.total_listings?.toLocaleString()} matching listings)
        </div>
      </div>

      {/* ─── 3. Smart Investment Insights ─────────────────────────────────────── */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Sparkles size={18} style={{ color: '#fbbf24' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
            Smart Investment & Yield Insights
          </h2>
        </div>

        <div className="grid-3" style={{ gap: '1.25rem' }}>
          {/* Card 1: Estimated Gross Yield */}
          <div className="glass-panel" style={{
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
            borderLeft: '4px solid #34d399',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(15, 23, 42, 0.4) 100%)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Rental Yield & Cashflow
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                <Percent size={11} /> Estimated ROI
              </span>
            </div>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#34d399', marginBottom: '0.25rem' }}>
              {insights.roi_yield?.estimated_yield_pct}%
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Wallet size={14} /> Annual Flow: <strong style={{ color: '#f8fafc' }}>₹ {Math.round(insights.roi_yield?.annual_rental_cashflow || 0).toLocaleString()}</strong>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
              {insights.roi_yield?.context || 'Calculated dynamically based on metro capitalization rates'}
            </div>
          </div>

          {/* Card 2: Best Budget Metro */}
          <div className="glass-panel" style={{
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
            borderLeft: '4px solid #38bdf8',
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.05) 0%, rgba(15, 23, 42, 0.4) 100%)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Best Budget Metro
              </span>
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                {insights.budget_metro?.highlight || 'Affordable'}
              </span>
            </div>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.25rem' }}>
              {insights.budget_metro?.city}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Avg Rent: <strong style={{ color: '#f8fafc' }}>₹ {Math.round(insights.budget_metro?.avg_rent || 0).toLocaleString()}</strong> (₹ {insights.budget_metro?.price_per_sqft}/sq ft)
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
              {insights.budget_metro?.description}
            </div>
          </div>

          {/* Card 3: Highest Yield / Premium Metro */}
          <div className="glass-panel" style={{
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
            borderLeft: '4px solid #a78bfa',
            background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.05) 0%, rgba(15, 23, 42, 0.4) 100%)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Highest Yield Metro
              </span>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                {insights.highest_yield_metro?.highlight || 'Top Velocity'}
              </span>
            </div>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#a78bfa', marginBottom: '0.25rem' }}>
              {insights.highest_yield_metro?.city}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Estimated Yield: <strong style={{ color: '#34d399' }}>{insights.highest_yield_metro?.estimated_yield}%</strong> • ₹ {insights.highest_yield_metro?.price_per_sqft}/sq ft
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
              {insights.highest_yield_metro?.description}
            </div>
          </div>
        </div>
      </div>

      {/* ─── 4. High-Level Summary Stat Tiles ─────────────────────────────────── */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Listings in Scope
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
            {summary.total_listings?.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', marginTop: '2px' }}>
            Real-Time Sample Set
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Mean Monthly Rent
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>
            ₹ {Math.round(summary.avg_rent || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Median: ₹ {Math.round(summary.median_rent || 0).toLocaleString()}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Unit Rate
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
            ₹ {summary.avg_price_per_sqft}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Per square foot
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Average Unit Size
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', marginTop: '2px' }}>
            {Math.round(summary.avg_size || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Square feet
          </div>
        </div>
      </div>

      {/* ─── 5. Visual Data Charts Section ───────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Chart 1: Bar Chart comparing Average Rent across Major Metros */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f8fafc' }}>
                <Building2 size={20} style={{ color: '#38bdf8' }} /> Average Rent Comparison Across Major Metros
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.35rem', margin: 0 }}>
                {selectedBhk === 'All' ? 'Cross-metro benchmark across all configurations' : `Filtered benchmark for ${selectedBhk} BHK properties`}
              </p>
            </div>
            <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>
              Dynamic Recharts Visual
            </span>
          </div>

          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCity} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
                <XAxis 
                  dataKey="city" 
                  stroke="#94a3b8" 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  tickFormatter={(v) => `₹ ${(v / 1000).toFixed(0)}k`}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                />
                <Tooltip content={<CustomTooltip prefix="₹ " />} />
                <Bar 
                  dataKey="avg_rent" 
                  name="Average Rent"
                  radius={[6, 6, 0, 0]}
                >
                  {byCity.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.isSelected || selectedCity === entry.city ? '#34d399' : '#38bdf8'}
                      opacity={selectedCity !== 'All' && selectedCity !== entry.city ? 0.45 : 0.95}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row: Donut (Furnishing) & Line (BHK Price Scaling) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '2rem' }}>
          
          {/* Chart 2: Donut / Pie Chart for Furnishing Status Distribution */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f8fafc' }}>
                <PieIcon size={18} style={{ color: '#34d399' }} /> Furnishing Status Distribution
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Market inventory share across Furnished, Semi-Furnished, & Unfurnished properties
              </p>
            </div>

            <div style={{ width: '100%', height: 260, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byFurnishing}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                  >
                    {byFurnishing.map((entry, index) => (
                      <Cell key={`donut-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip prefix="" suffix=" listings" />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(val, entry) => (
                      <span style={{ color: '#cbd5e1', fontSize: '0.82rem', marginRight: '1rem' }}>
                        {val} ({entry.payload?.percentage}%)
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Line Chart showing Price Scaling Curve across BHK */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f8fafc' }}>
                <TrendingUp size={18} style={{ color: '#a78bfa' }} /> BHK Price Scaling Curve
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Non-linear rental price progression curve from 1 BHK starter flats to 5 BHK luxury residences
              </p>
            </div>

            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={byBhk} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
                  <XAxis 
                    dataKey="bhk" 
                    stroke="#94a3b8" 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                    axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                    tickFormatter={(v) => `₹ ${(v / 1000).toFixed(0)}k`}
                    axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                  />
                  <Tooltip content={<CustomTooltip prefix="₹ " />} />
                  <Line 
                    type="monotone" 
                    dataKey="avg_rent" 
                    name="Mean Rent"
                    stroke="#a78bfa" 
                    strokeWidth={3}
                    dot={{ fill: '#a78bfa', stroke: '#fff', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: '#38bdf8', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
