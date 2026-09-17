import React from 'react';
import { Home, ShieldCheck, Cpu } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'rgba(7, 9, 14, 0.95)',
      padding: '2.5rem 1.5rem',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#051a13'
          }}>
            <Home size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
              SmartRent Platform
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Next-Generation ML Real Estate Valuation & Metro Intelligence
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Cpu size={14} color="var(--accent-emerald)" />
            Extra Trees LogTarget Regressor (R²: 0.712)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={14} color="var(--accent-cyan)" />
            Bank-Grade JWT & OAuth
          </span>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} SmartRent AI. All calculations based on authenticated Indian metro datasets.
        </div>
      </div>
    </footer>
  );
}
