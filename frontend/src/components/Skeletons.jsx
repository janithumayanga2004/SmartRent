import React from 'react';

/**
 * Generic shimmer skeleton block.
 * Usage: <Skeleton width="100%" height="1.5rem" radius="8px" />
 */
export function Skeleton({ width = '100%', height = '1rem', radius = '6px', style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: radius, ...style }}
    />
  );
}

/**
 * Stat card skeleton — matches the metric cards on DashboardPage.
 */
export function StatCardSkeleton() {
  return (
    <div className="glass-panel" style={{ padding: '1.4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <Skeleton width="55%" height="0.75rem" />
        <Skeleton width="18px" height="18px" radius="50%" />
      </div>
      <Skeleton width="45%" height="2rem" style={{ marginBottom: '0.5rem' }} />
      <Skeleton width="70%" height="0.65rem" />
    </div>
  );
}

/**
 * Table row skeleton — for the dashboard history table.
 */
export function TableRowSkeleton({ cols = 7 }) {
  return (
    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: '1rem' }}>
          <Skeleton
            width={i === 0 ? '80%' : i === cols - 1 ? '32px' : '60%'}
            height="0.9rem"
          />
        </td>
      ))}
    </tr>
  );
}

/**
 * Full-page centred spinner for heavier loading states.
 */
export function PageSpinner({ label = 'Loading…' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      padding: '4rem 1.5rem',
      color: 'var(--text-muted)',
    }}>
      <div className="spinner" />
      {label && <span style={{ fontSize: '0.88rem' }}>{label}</span>}
    </div>
  );
}

/**
 * Inline button spinner (tiny circle).
 */
export function BtnSpinner() {
  return <div className="spinner-sm" />;
}

/**
 * Analytics page skeleton — shimmer cards & charts matching the modern analytics layout.
 */
export function AnalyticsSkeleton() {
  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Header Skeleton */}
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Skeleton width="180px" height="1.4rem" radius="999px" />
          <Skeleton width="160px" height="1.4rem" radius="999px" />
        </div>
        <Skeleton width="80%" height="2.5rem" radius="8px" />
        <Skeleton width="60%" height="1.1rem" radius="6px" />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="glass-panel" style={{ padding: '1.2rem 1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Skeleton width="100px" height="1.2rem" />
          <Skeleton width="140px" height="2rem" radius="8px" />
          <Skeleton width="130px" height="2rem" radius="8px" />
        </div>
        <Skeleton width="220px" height="1rem" />
      </div>

      {/* 3 Smart Investment Insights Skeleton */}
      <div style={{ marginBottom: '2.5rem' }}>
        <Skeleton width="240px" height="1.4rem" style={{ marginBottom: '1rem' }} />
        <div className="grid-3" style={{ gap: '1.25rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <Skeleton width="60%" height="0.8rem" style={{ marginBottom: '0.75rem' }} />
            <Skeleton width="45%" height="2rem" style={{ marginBottom: '0.5rem' }} />
            <Skeleton width="75%" height="0.8rem" />
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <Skeleton width="60%" height="0.8rem" style={{ marginBottom: '0.75rem' }} />
            <Skeleton width="55%" height="2rem" style={{ marginBottom: '0.5rem' }} />
            <Skeleton width="75%" height="0.8rem" />
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <Skeleton width="60%" height="0.8rem" style={{ marginBottom: '0.75rem' }} />
            <Skeleton width="50%" height="2rem" style={{ marginBottom: '0.5rem' }} />
            <Skeleton width="75%" height="0.8rem" />
          </div>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Charts Section Skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <Skeleton width="320px" height="1.4rem" style={{ marginBottom: '1.5rem' }} />
          <Skeleton width="100%" height="260px" radius="10px" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <Skeleton width="240px" height="1.4rem" style={{ marginBottom: '1.5rem' }} />
            <Skeleton width="100%" height="220px" radius="10px" />
          </div>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <Skeleton width="240px" height="1.4rem" style={{ marginBottom: '1.5rem' }} />
            <Skeleton width="100%" height="220px" radius="10px" />
          </div>
        </div>
      </div>
    </div>
  );
}

