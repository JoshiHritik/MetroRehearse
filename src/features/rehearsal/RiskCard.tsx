import React from 'react';
import type { RunSummary } from '../../domain/types';
import { formatMinutes, formatRiskPercent } from '../../domain/format';
import { AlertTriangle, Clock, Users, ShieldAlert } from 'lucide-react';

interface Props {
  summary: RunSummary | null;
  baselineSummary?: RunSummary | null;
}

export const RiskCard: React.FC<Props> = ({ summary, baselineSummary }) => {
  if (!summary) {
    return (
      <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No simulation summary calculated. Click "Run Simulation" above.
      </div>
    );
  }

  const isHighRisk = summary.riskOvercrowd > 0.15;
  const isMedRisk = summary.riskOvercrowd > 0.05;
  const riskColor = isHighRisk ? '#EF4444' : isMedRisk ? '#F59E0B' : '#10B981';
  const riskBg = isHighRisk ? 'rgba(239, 68, 68, 0.15)' : isMedRisk ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
      {/* Overcrowding Risk Card */}
      <div
        className="glass-panel"
        style={{
          padding: '1rem',
          borderLeft: `4px solid ${riskColor}`,
          backgroundColor: riskBg,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Crush Risk P(&gt;4.5)
          </span>
          <span className="badge-assumed" title="Computed from assumed gate and density parameters">
            (A)
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.4rem' }}>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: riskColor, fontFamily: 'var(--font-mono)' }}>
            {formatRiskPercent(summary.riskOvercrowd)}
          </span>
          {baselineSummary && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
              vs {formatRiskPercent(baselineSummary.riskOvercrowd)} base
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.3rem', fontSize: '0.75rem', color: riskColor }}>
          {isHighRisk ? <AlertTriangle size={13} /> : <ShieldAlert size={13} />}
          <span>{isHighRisk ? 'Dangerous Platform Crush' : isMedRisk ? 'Moderate Surge Risk' : 'Controlled / Safe'}</span>
        </div>
      </div>

      {/* Clearance Time (P50 & P90) */}
      <div className="glass-panel" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Station Clearance
          </span>
          <span className="badge-assumed">(A)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.4rem' }}>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
            {formatMinutes(summary.clearMinP50)}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            (P90: {formatMinutes(summary.clearMinP90)})
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <Clock size={13} />
          <span>Full platform and concourse clearing</span>
        </div>
      </div>

      {/* Peak Concourse Gate Wait (P90) */}
      <div className="glass-panel" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Peak Turnstile Wait
          </span>
          <span className="badge-assumed">(A)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.4rem' }}>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FBBF24', fontFamily: 'var(--font-mono)' }}>
            {summary.gateWaitP90Min.toFixed(1)}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>min wait</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <Users size={13} />
          <span>P90 outer gate queuing delay</span>
        </div>
      </div>

      {/* Peak Platform Density */}
      <div className="glass-panel" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Peak Platform Density
          </span>
          <span className="badge-assumed">(A)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.4rem' }}>
          <span
            style={{
              fontSize: '1.8rem',
              fontWeight: 800,
              color: summary.peakDensityP50 >= 4.5 ? '#EF4444' : summary.peakDensityP50 >= 3.0 ? '#F59E0B' : '#10B981',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {summary.peakDensityP50.toFixed(2)}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>pax/m²</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <ShieldAlert size={13} />
          <span>Median peak across 200 seeds</span>
        </div>
      </div>
    </div>
  );
};
