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
      <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: '#FFFFFF' }}>
        No simulation summary calculated. Click "START SIMULATION" above.
      </div>
    );
  }

  const isHighRisk = summary.riskOvercrowd > 0.15;
  const isMedRisk = summary.riskOvercrowd > 0.05;
  const riskColor = isHighRisk ? 'var(--status-critical)' : isMedRisk ? 'var(--status-caution)' : 'var(--status-safe)';
  const riskBg = isHighRisk ? 'var(--status-critical-bg)' : isMedRisk ? 'var(--status-caution-bg)' : 'var(--status-safe-bg)';
  const riskBorder = isHighRisk ? 'var(--status-critical-border)' : isMedRisk ? 'var(--status-caution-border)' : 'var(--status-safe-border)';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
      {/* Overcrowding Risk Card */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem',
          backgroundColor: riskBg,
          border: `1px solid ${riskBorder}`,
          borderLeft: `4px solid ${riskColor}`,
          borderRadius: '10px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span className="meta-eyebrow" style={{ color: riskColor }}>
            CRUSH RISK P(&gt;4.5)
          </span>
          <span className="badge-assumed" title="Computed from assumed gate and density parameters">
            (A)
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.4rem' }}>
          <span className="hero-number" style={{ color: riskColor }}>
            {formatRiskPercent(summary.riskOvercrowd)}
          </span>
          {baselineSummary && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              vs {formatRiskPercent(baselineSummary.riskOvercrowd)} base
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.35rem', fontSize: '0.775rem', fontWeight: 600, color: riskColor }}>
          {isHighRisk ? <AlertTriangle size={14} /> : <ShieldAlert size={14} />}
          <span>{isHighRisk ? 'Dangerous Platform Crush' : isMedRisk ? 'Moderate Surge Risk' : 'Controlled / Safe'}</span>
        </div>
      </div>

      {/* Clearance Time (P50 & P90) */}
      <div className="glass-panel" style={{ padding: '1.25rem', backgroundColor: '#FFFFFF', borderRadius: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span className="meta-eyebrow">
            STATION CLEARANCE
          </span>
          <span className="badge-assumed">(A)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.4rem' }}>
          <span className="hero-number" style={{ color: 'var(--accent-blue)' }}>
            {formatMinutes(summary.clearMinP50)}
          </span>
          <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            (P90: {formatMinutes(summary.clearMinP90)})
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <Clock size={13} />
          <span>Full platform and concourse clearing</span>
        </div>
      </div>

      {/* Peak Concourse Gate Wait (P90) */}
      <div className="glass-panel" style={{ padding: '1.25rem', backgroundColor: '#FFFFFF', borderRadius: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span className="meta-eyebrow">
            PEAK TURNSTILE WAIT
          </span>
          <span className="badge-assumed">(A)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.4rem' }}>
          <span className="hero-number" style={{ color: 'var(--status-caution)' }}>
            {summary.gateWaitP90Min.toFixed(1)}
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>min wait</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <Users size={13} />
          <span>P90 outer gate queuing delay</span>
        </div>
      </div>

      {/* Peak Platform Density */}
      <div className="glass-panel" style={{ padding: '1.25rem', backgroundColor: '#FFFFFF', borderRadius: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span className="meta-eyebrow">
            PEAK PLATFORM DENSITY
          </span>
          <span className="badge-assumed">(A)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.4rem' }}>
          <span
            className="hero-number"
            style={{
              color: summary.peakDensityP50 >= 4.5 ? 'var(--status-critical)' : summary.peakDensityP50 >= 3.0 ? 'var(--status-caution)' : 'var(--status-safe)',
            }}
          >
            {summary.peakDensityP50.toFixed(2)}
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>pax/m²</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <ShieldAlert size={13} />
          <span>Median peak across 200 seeds</span>
        </div>
      </div>
    </div>
  );
};
