import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NetworkMap } from './NetworkMap';
import { Train, ShieldCheck, PlayCircle, Activity, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Hero Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(17, 28, 51, 0.95), rgba(30, 41, 59, 0.85))',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '680px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(225, 29, 72, 0.18)', border: '1px solid rgba(225, 29, 72, 0.4)', color: '#F43F5E', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <Train size={13} />
            <span>AHMEDABAD METRO (GMRC) • OCTOBER 2026 EDITION</span>
          </div>

          <h1 style={{ fontSize: '2.1rem', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            Tactical Crowd Simulation & Offline Briefing Platform
          </h1>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '0.75rem', lineHeight: 1.6 }}>
            MetroRehearse runs 100% in your browser. Rehearse stadium egress surges, optimize train headways and concourse turnstiles, and dispatch trilingual Event Orders — completely functional in <strong>Airplane Mode</strong>.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
              style={{ fontSize: '0.9rem', padding: '0.75rem 1.4rem' }}
            >
              <span>Explore Rehearsals</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => navigate('/backtest')}
              className="btn-secondary"
              style={{ fontSize: '0.9rem' }}
            >
              <span>IPL 2026 Backtest Replay</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)', marginBottom: '0.75rem' }}>
            <PlayCircle size={20} />
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>200-Seed Monte Carlo</h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Web Worker simulation computes platform density quantiles (Q10, Q50, Q90) and crush risk probabilities in seconds.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', marginBottom: '0.75rem' }}>
            <ShieldCheck size={20} />
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Tactical Playbook</h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Synthesizes 300 candidate action levers across safety, time, and budget frontiers to produce plain-language action plans.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', marginBottom: '0.75rem' }}>
            <Activity size={20} />
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Live Bayesian Re-Forecast</h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Concourse supervisor Tap Pad updates arrival rate posteriors and alerts controllers when platform metering is required.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FBBF24', marginBottom: '0.75rem' }}>
            <FileText size={20} />
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Printable Event Order</h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Generates standardized operational dispatches in English, Hindi, and Gujarati with dedicated A4 print stylesheet.
          </p>
        </div>
      </div>

      {/* Network Map Section */}
      <NetworkMap onSelectStation={(stId) => console.log('Station selected:', stId)} />
    </div>
  );
};
