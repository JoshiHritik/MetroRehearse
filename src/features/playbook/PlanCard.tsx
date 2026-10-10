import React from 'react';
import type { Plan, RunSummary } from '../../domain/types';
import { formatMinutes, formatRiskPercent } from '../../domain/format';
import { Check, ShieldCheck, Zap, DollarSign, Train, Users } from 'lucide-react';

interface Props {
  plan: Plan;
  summary: RunSummary;
  baselineSummary: RunSummary;
  costBreakdown: {
    extraTrains: number;
    staffHours: number;
    costScore: number;
  };
  isApplied: boolean;
  onApply: (plan: Plan) => void;
  rankIndex: number;
}

export const PlanCard: React.FC<Props> = ({
  plan,
  summary,
  baselineSummary,
  costBreakdown,
  isApplied,
  onApply,
  rankIndex,
}) => {
  const riskReduced = baselineSummary.riskOvercrowd - summary.riskOvercrowd;
  const timeSaved = baselineSummary.clearMinP50 - summary.clearMinP50;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.25rem',
        border: isApplied ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
        backgroundColor: isApplied ? 'rgba(56, 189, 248, 0.05)' : undefined,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '0.15rem 0.5rem',
                borderRadius: '4px',
                backgroundColor: rankIndex === 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.15)',
                color: rankIndex === 0 ? '#10B981' : 'var(--accent-cyan)',
              }}
            >
              Option {rankIndex + 1}
            </span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{plan.name}</h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Pareto Optimization Score: {plan.score ?? 'Optimal'}
          </span>
        </div>

        {isApplied ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              color: '#10B981',
              border: '1px solid rgba(16, 185, 129, 0.4)',
            }}
          >
            <Check size={14} />
            <span>Applied to Briefing</span>
          </div>
        ) : (
          <button
            onClick={() => onApply(plan)}
            className="btn-primary"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
          >
            Apply Plan
          </button>
        )}
      </div>

      {/* Metrics Impact Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.75rem',
          backgroundColor: 'var(--bg-surface-elevated)',
          padding: '0.85rem',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CRUSH RISK P(&gt;4.5)</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: summary.riskOvercrowd < 0.1 ? '#10B981' : '#F59E0B' }}>
            {formatRiskPercent(summary.riskOvercrowd)}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#10B981' }}>
            ↓ {formatRiskPercent(riskReduced)} safer
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>STATION CLEAR (P50)</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {formatMinutes(summary.clearMinP50)}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#10B981' }}>
            {timeSaved > 0 ? `↓ ${timeSaved} min faster` : 'Baseline duration'}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>EXTRA TRAIN SERVICES</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
            +{costBreakdown.extraTrains}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {plan.headwayMin}m headway
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SERVICE EXTENSION</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
            +{plan.lastTrainExtMin}m
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>past scheduled end</div>
        </div>
      </div>

      {/* Plain Language Action Checklist */}
      <div>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Tactical Action Checklist:
        </h4>
        <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          {plan.actionsText?.map((act, i) => (
            <li key={i}>{act}</li>
          ))}
        </ul>
      </div>

      {/* Assumptions Footer */}
      <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        <span className="badge-assumed">(A)</span>
        <span>Action levers and clearance effects are based on editable station geometry assumptions.</span>
      </div>
    </div>
  );
};
