import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BtnSpinner } from '../components/Skeletons';
import { 
  Sparkles, 
  Building2, 
  MapPin, 
  Maximize2, 
  Layers, 
  Armchair, 
  Users, 
  Bath, 
  TrendingUp, 
  CheckCircle2, 
  Info,
  ArrowRight,
  ShieldCheck,
  Bookmark
} from 'lucide-react';

const CITIES = ['Mumbai', 'Bangalore', 'Delhi', 'Chennai', 'Hyderabad', 'Kolkata'];
const BHK_OPTIONS = [1, 2, 3, 4, 5, 6];
const BATHROOM_OPTIONS = [1, 2, 3, 4, 5];
const AREA_TYPES = ['Super Area', 'Carpet Area', 'Built Area'];
const FURNISHING_OPTIONS = [
  { id: 'Unfurnished', label: 'Unfurnished', desc: 'Bare property' },
  { id: 'Semi-Furnished', label: 'Semi-Furnished', desc: 'Wardrobes & basic fittings' },
  { id: 'Furnished', label: 'Furnished', desc: 'Move-in ready with appliances' }
];
const TENANT_OPTIONS = [
  { id: 'Bachelors/Family', label: 'Any (Bachelors/Family)' },
  { id: 'Family', label: 'Family Only' },
  { id: 'Bachelors', label: 'Bachelors Only' }
];

export default function PredictPage({ notify, setActivePage }) {
  const { user, isAuthenticated } = useAuth();

  // Form State with high quality defaults
  const [bhk, setBhk] = useState(2);
  const [size, setSize] = useState(1100);
  const [city, setCity] = useState('Mumbai');
  const [floorLevel, setFloorLevel] = useState(3);
  const [totalFloors, setTotalFloors] = useState(8);
  const [areaType, setAreaType] = useState('Carpet Area');
  const [furnishing, setFurnishing] = useState('Semi-Furnished');
  const [tenant, setTenant] = useState('Bachelors/Family');
  const [bathroom, setBathroom] = useState(2);
  const [locality, setLocality] = useState('');

  // Suggestions & Async Data
  const [localitiesMap, setLocalitiesMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load localities on mount
  useEffect(() => {
    async function fetchLocalities() {
      try {
        const res = await api.getLocalities();
        setLocalitiesMap(res);
        if (res[city] && res[city].length > 0) {
          setLocality(res[city][0]);
        }
      } catch (e) {
        console.warn('Failed to load localities:', e);
      }
    }
    fetchLocalities();
  }, []);

  // Update locality default when city changes
  const handleCityChange = (newCity) => {
    setCity(newCity);
    if (localitiesMap[newCity] && localitiesMap[newCity].length > 0) {
      setLocality(localitiesMap[newCity][0]);
    }
  };

  // Compute Floor string
  const formatFloorString = () => {
    const current = floorLevel === 0 ? 'Ground' : floorLevel;
    return `${current} out of ${totalFloors}`;
  };

  // Real-time Size Category indicator
  const getSizeCategory = (s) => {
    if (s < 800) return 'Small Space';
    if (s < 1500) return 'Medium Residence';
    if (s < 2500) return 'Spacious Premium';
    return 'Luxury Estate';
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSavedSuccess(false);

    try {
      const payload = {
        BHK: bhk,
        Size: Number(size),
        City: city,
        Floor: formatFloorString(),
        'Area Type': areaType,
        'Area Locality': locality || city,
        'Furnishing Status': furnishing,
        'Tenant Preferred': tenant,
        Bathroom: bathroom,
      };

      const res = await api.predict(payload);
      setResult(res);
      if (res.saved_id) {
        setSavedSuccess(true);
      }
      notify && notify('Valuation computed successfully!', 'success');
    } catch (err) {
      notify && notify(err.message || 'Failed to compute prediction', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem', maxWidth: '750px', margin: '0 auto 2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <span className="badge badge-emerald">
            <Sparkles size={12} /> Real-Time Machine Learning Regressor
          </span>
          <span className="badge badge-cyan">
            Trained on 4,700+ Verified Metro Listings
          </span>
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.85rem' }}>
          Instant, Precision <span className="gradient-text">House Rent Valuation</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>
          Configure structural features, spatial dimensions, and location dynamics to generate calibrated rent estimates with 71.2% explained market variance.
        </p>
      </div>

      {/* Main Grid: Form Left, Real-Time Prediction Card Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Prediction Form Panel */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            {/* 1. BHK Selector */}
            <div className="form-group">
              <label className="form-label">
                <span><Building2 size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> BHK Configuration</span>
                <span className="helper-text">Bedrooms, Hall & Kitchen</span>
              </label>
              <div className="pills-container">
                {BHK_OPTIONS.map((num) => (
                  <button
                    type="button"
                    key={num}
                    className={`pill-option ${bhk === num ? 'active' : ''}`}
                    onClick={() => setBhk(num)}
                    style={{ flex: '1 1 auto', justifyContent: 'center' }}
                  >
                    {num} BHK
                  </button>
                ))}
              </div>
            </div>

            {/* 2. City Selection */}
            <div className="form-group">
              <label className="form-label">
                <span><MapPin size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Metro City</span>
                <span className="helper-text">Select target real estate market</span>
              </label>
              <div className="pills-container">
                {CITIES.map((c) => (
                  <button
                    type="button"
                    key={c}
                    className={`pill-option ${city === c ? 'active' : ''}`}
                    onClick={() => handleCityChange(c)}
                    style={{ flex: '1 1 calc(33.333% - 0.5rem)', justifyContent: 'center' }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Locality Selection */}
            <div className="form-group">
              <label className="form-label">
                <span>Area Locality</span>
                <span className="helper-text">Popular hubs in {city}</span>
              </label>
              <select 
                className="select-field"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
              >
                {(localitiesMap[city] || [city]).map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Property Size (Slider & Number) */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  <Maximize2 size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Super/Carpet Area
                </label>
                <span className="badge badge-emerald" style={{ textTransform: 'none' }}>
                  {getSizeCategory(size)}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ flex: 1 }} className="range-slider-wrapper">
                  <input
                    type="range"
                    min="200"
                    max="4500"
                    step="25"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="range-slider"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>200 sq ft</span>
                    <span>2,000 sq ft</span>
                    <span>4,500 sq ft</span>
                  </div>
                </div>
                <div style={{ width: '130px', position: 'relative' }}>
                  <input
                    type="number"
                    min="100"
                    max="10000"
                    value={size}
                    onChange={(e) => setSize(Math.max(50, Number(e.target.value)))}
                    className="input-field"
                    style={{ paddingRight: '2.5rem', fontWeight: '600' }}
                  />
                  <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    sq ft
                  </span>
                </div>
              </div>
            </div>

            {/* 5. Floor Configuration */}
            <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  <span><Layers size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Floor Level</span>
                </label>
                <select
                  className="select-field"
                  value={floorLevel}
                  onChange={(e) => setFloorLevel(Number(e.target.value))}
                >
                  <option value={0}>Ground Floor</option>
                  {[...Array(25)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Floor {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  <span>Total Building Floors</span>
                </label>
                <input
                  type="number"
                  min={Math.max(1, floorLevel)}
                  max="70"
                  value={totalFloors}
                  onChange={(e) => setTotalFloors(Math.max(floorLevel, Number(e.target.value)))}
                  className="input-field"
                />
              </div>
            </div>

            {/* 6. Area Type */}
            <div className="form-group">
              <label className="form-label">
                <span>Area Calculation Type</span>
              </label>
              <div className="pills-container">
                {AREA_TYPES.map((type) => (
                  <button
                    type="button"
                    key={type}
                    className={`pill-option ${areaType === type ? 'active' : ''}`}
                    onClick={() => setAreaType(type)}
                    style={{ flex: '1 1 auto', justifyContent: 'center' }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* 7. Furnishing Status */}
            <div className="form-group">
              <label className="form-label">
                <span><Armchair size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Furnishing Status</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                {FURNISHING_OPTIONS.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => setFurnishing(f.id)}
                    className={`pill-option ${furnishing === f.id ? 'active' : ''}`}
                    style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '0.75rem', height: '100%' }}
                  >
                    <div style={{ fontWeight: 600 }}>{f.label}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. Tenant Preferred & Bathroom */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">
                  <span><Users size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Tenant Preferred</span>
                </label>
                <select
                  className="select-field"
                  value={tenant}
                  onChange={(e) => setTenant(e.target.value)}
                >
                  {TENANT_OPTIONS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span><Bath size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Bathrooms</span>
                </label>
                <div className="pills-container">
                  {BATHROOM_OPTIONS.map((num) => (
                    <button
                      type="button"
                      key={num}
                      className={`pill-option ${bathroom === num ? 'active' : ''}`}
                      onClick={() => setBathroom(num)}
                      style={{ flex: '1 1 auto', justifyContent: 'center' }}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit CTA Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem', gap: '0.65rem' }}
            >
              {loading ? (
                <><BtnSpinner /><span>Computing ML Pipeline…</span></>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Calculate Property Rent Estimate</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Prediction Results Display Panel */}
        <div style={{ position: 'sticky', top: '5.5rem' }}>
          {result ? (
            <div className="glass-panel animate-fade-in" style={{
              padding: '2rem',
              border: '1px solid var(--accent-emerald)',
              boxShadow: '0 0 35px var(--accent-emerald-glow)',
              background: 'linear-gradient(175deg, rgba(16, 185, 129, 0.08) 0%, rgba(14, 19, 31, 0.95) 100%)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span className="badge badge-emerald">
                  <CheckCircle2 size={13} /> Machine Learning Output
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Model: {result.model || 'Extra Trees LogTarget'}
                </span>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Estimated Fair Market Rent
                </div>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-heading)',
                  color: '#ffffff',
                  lineHeight: '1.1',
                  margin: '0.35rem 0'
                }}>
                  {result.formatted_rent}
                  <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500, marginLeft: '6px' }}>/ month</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Indian National Rupee (INR)
                </div>
              </div>

              {/* Confidence Range & Price per sqft */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem',
                padding: '1rem',
                background: 'rgba(0, 0, 0, 0.35)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                border: '1px solid var(--border-subtle)'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Confidence Band</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    ₹ {result.rent_range?.low?.toLocaleString()} – ₹ {result.rent_range?.high?.toLocaleString()}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unit Rate</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#38bdf8' }}>
                    ₹ {result.price_per_sqft} / sq ft
                  </div>
                </div>
              </div>

              {/* City Comparison */}
              {result.city_comparison && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.75rem 1rem',
                  background: 'rgba(16, 185, 129, 0.08)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  fontSize: '0.85rem'
                }}>
                  <TrendingUp size={16} color="var(--accent-emerald)" />
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {result.city_comparison.label}
                    </span>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>
                      City Benchmark Avg: ₹ {result.city_comparison.city_average?.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Config Overview */}
              <div style={{
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.6',
                marginBottom: '1.25rem'
              }}>
                <div>• <strong>Property:</strong> {bhk} BHK • {size} sq ft • {furnishing}</div>
                <div>• <strong>Location:</strong> {locality ? `${locality}, ` : ''}{city}</div>
                <div>• <strong>Placement:</strong> {formatFloorString()} • {bathroom} Bathrooms</div>
              </div>

              {/* Save / Status */}
              {savedSuccess ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  color: '#34d399',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  padding: '0.75rem',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <CheckCircle2 size={16} /> Saved to Your Personal Dashboard
                </div>
              ) : isAuthenticated ? (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  ✓ Valuation automatically archived in your dashboard
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setActivePage('auth')}
                  style={{ width: '100%', fontSize: '0.85rem' }}
                >
                  <Bookmark size={14} /> Sign in to Save Valuation History
                </button>
              )}
            </div>
          ) : (
            <div className="glass-panel" style={{
              padding: '2.5rem 2rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-emerald)',
                marginBottom: '1.25rem',
                boxShadow: '0 0 25px var(--accent-emerald-glow)'
              }}>
                <Sparkles size={28} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>
                Ready to Value Your Property
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '300px', lineHeight: '1.5' }}>
                Adjust the parameters on the left and click <strong>Calculate Property Rent Estimate</strong> to run the trained regression pipeline.
              </p>

              <div style={{
                marginTop: '2rem',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                width: '100%',
                textAlign: 'left',
                fontSize: '0.82rem',
                color: 'var(--text-muted)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>
                  <ShieldCheck size={14} color="var(--accent-emerald)" /> Model Assurance
                </div>
                Engineered with 10 production features including vertical floor ratios, bathroom-to-BHK density, and log-transformed target normalization.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
