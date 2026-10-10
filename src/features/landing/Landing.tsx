import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RehearseSvgTitle, ConfettiBannerArt } from './LandingHeroArt';
import './landing.css';
import {
  Train,
  ArrowRight,
  ShieldCheck,
  PlayCircle,
  Activity,
  Sliders,
  FileText,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Cpu,
} from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container landing-grid-bg">
      {/* Top Header */}
      <header className="lp-header">
        <div
          className="lp-logo-group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ cursor: 'pointer' }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #E11D48, #0284C7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(225, 29, 72, 0.4)',
            }}
          >
            <Train size={18} color="#FFFFFF" />
          </div>
          <span className="lp-logo-mark">MetroRehearse</span>
          <span className="lp-badge-num">v2.6</span>
        </div>

        <nav className="lp-nav-links">
          <a href="#how-it-works" className="lp-nav-link">How It Works</a>
          <a href="#dossier" className="lp-nav-link">Event Scenarios</a>
          <a href="#metrics" className="lp-nav-link">Physics Engine</a>
          <button
            onClick={() => navigate('/welcome')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
            className="lp-nav-link"
          >
            Network Map
          </button>
        </nav>

        <div className="lp-header-actions">
          <div className="lp-pill-pwa">GMRC</div>
          <button
            onClick={() => navigate('/')}
            className="lp-btn-orange"
            style={{ border: 'none', cursor: 'pointer' }}
          >
            <span>Open Console</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="lp-hero-section">
        {/* Technical Corner Marks */}
        <span className="lp-corner-mark" style={{ top: '0.5rem', left: '1rem' }}>+ 23.0984° N, 72.5956° E</span>
        <span className="lp-corner-mark" style={{ top: '0.5rem', right: '1rem' }}>STATION 01 // MOTERA</span>

        {/* Large Visual Wordmark Banner */}
        <div className="lp-rehearse-wrapper">
          <RehearseSvgTitle />
        </div>

        {/* Hero Split Statistics & Introduction */}
        <div className="lp-hero-split">
          <div className="lp-stat-left">
            <span className="lp-stat-label">GMRC Calibration Benchmark Record</span>
            <div className="lp-stat-number">1,95,868</div>
            <div className="lp-stat-sub">
              <span style={{ color: 'var(--lp-orange)' }}>●</span>
              <span>Daily Passenger Journeys Replayed (IPL 2026 Final)</span>
            </div>
          </div>

          <div className="lp-hero-right">
            <div className="lp-asterisk">✱</div>
            <p className="lp-hero-desc">
              <strong>Offline crowd rehearsal & live operational telemetry</strong> for Ahmedabad Metro station controllers. Simulate stadium surges, calculate critical platform crush densities, synthesize tactical plans, and print trilingual orders in seconds.
            </p>

            <div className="lp-hero-btns">
              <button
                onClick={() => navigate('/')}
                className="lp-btn-purple"
                style={{ border: 'none', cursor: 'pointer' }}
              >
                <span>Launch Operations Console</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => navigate('/events/evt-gt-vs-mi-2026/rehearsal')}
                className="lp-btn-outline"
                style={{ cursor: 'pointer' }}
              >
                <span>Live 200-Seed Rehearsal</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow: How It Works for Normal Users */}
      <section id="how-it-works" style={{ padding: '3.5rem 2.5rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="lp-section-tag">// SIMPLE 4-STEP OPERATIONAL FLOW</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginTop: '0.5rem' }}>
            How to Operate MetroRehearse
          </h2>
          <p style={{ color: 'var(--lp-text-muted)', maxWidth: '650px', margin: '0.5rem auto 0 auto', fontSize: '1rem' }}>
            A complete walkthrough designed for Station Controllers, Crowd Safety Marshals, and Operations Planners.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {/* Step 1 */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.75rem',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(234, 88, 12, 0.12)',
                color: 'var(--lp-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.1rem',
                marginBottom: '1rem',
              }}
            >
              1
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem' }}>Schedule or Pick an Event</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--lp-text-muted)', lineHeight: 1.6 }}>
              Select a calibrated stadium preset (IPL Cricket Night, Navratri Garba, or Weekday Peak) or create a custom event with expected spectator attendance and metro modal share.
            </p>
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <button
                onClick={() => navigate('/')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--lp-orange)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <span>View Scheduled Events</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.75rem',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(109, 40, 217, 0.12)',
                color: 'var(--lp-purple)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.1rem',
                marginBottom: '1rem',
              }}
            >
              2
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem' }}>Run 200-Seed Simulation</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--lp-text-muted)', lineHeight: 1.6 }}>
              Launch the in-browser Web Worker simulation. Scrub the timeline from T+0 to T+180 min to inspect platform crowd density (pax/m²), turnstile wait times, and bottleneck zones.
            </p>
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <button
                onClick={() => navigate('/events/evt-gt-vs-mi-2026/rehearsal')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--lp-purple)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <span>Open Rehearsal Canvas</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.75rem',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: '#15803D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.1rem',
                marginBottom: '1rem',
              }}
            >
              3
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem' }}>Optimize Tactical Levers</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--lp-text-muted)', lineHeight: 1.6 }}>
              Use the Playbook optimizer to balance Safety, Clearing Time, and Operational Budget. The engine tests 300 plans to find optimal turnstile counts, staff marshals, and train headways.
            </p>
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <button
                onClick={() => navigate('/events/evt-gt-vs-mi-2026/playbook')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#15803D',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <span>Synthesize Playbook Plans</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Step 4 */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.75rem',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(2, 132, 199, 0.12)',
                color: '#0284C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.1rem',
                marginBottom: '1rem',
              }}
            >
              4
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem' }}>Print Orders & Live Ops</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--lp-text-muted)', lineHeight: 1.6 }}>
              Dispatch printed A4 Event Orders in English, Hindi, or Gujarati. During live matches, use the Concourse Tap Pad to record passenger flow and run real-time Bayesian re-forecasting.
            </p>
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <button
                onClick={() => navigate('/events/evt-gt-vs-mi-2026/order')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0284C7',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <span>Print Trilingual Briefs</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Physics Engine & Metrics Preview */}
      <section id="metrics" className="lp-playbook-section">
        <div className="lp-section-header">
          <span className="lp-section-tag">// MATHEMATICAL RIGOR //</span>
        </div>

        <div className="lp-meta-bar">
          <span>STATION PLATFORM GEOMETRY</span>
          <span>MOTERA CAPACITY: 1,10,000 SPECTATORS</span>
          <span>SIMULATION: 10-SEC PHYSICAL TICKS</span>
        </div>

        <div className="lp-playbook-grid">
          <div className="lp-playbook-left">
            <h2 className="lp-playbook-title">
              200-Seed Monte Carlo Crowd Physics
            </h2>
            <p className="lp-playbook-desc">
              Station controllers cannot rely on static spreadsheets when managing 45,000 rapid egress passengers. MetroRehearse models ingress flow using non-linear Gamma-Poisson arrival curves, vertical stair throughput restrictions, and platform Level of Service (LoS) density boundaries.
            </p>
            <div style={{ marginTop: '2rem' }}>
              <button
                onClick={() => navigate('/assumptions')}
                className="lp-btn-purple"
                style={{ border: 'none', cursor: 'pointer' }}
              >
                <span>Inspect Calibrated Assumptions (A)</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          <div className="lp-metrics-2x2">
            <div className="lp-metric-cell">
              <div className="lp-metric-val purple">4.8</div>
              <span className="lp-metric-label">Critical Crush Density (pax/m²)</span>
            </div>

            <div className="lp-metric-cell">
              <div className="lp-metric-val orange">3.8</div>
              <span className="lp-metric-label">Concourse Metering Trigger (pax/m²)</span>
            </div>

            <div className="lp-metric-cell">
              <div className="lp-metric-val dark">28</div>
              <span className="lp-metric-label">Base Turnstile Rate (pax/min/gate)</span>
            </div>

            <div className="lp-metric-cell">
              <div className="lp-metric-val purple">180</div>
              <span className="lp-metric-label">Stair & Escalator Flow (pax/min)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Event Scenarios Dossier Grid */}
      <section id="dossier" className="lp-incidents-section">
        <div className="lp-incidents-header">
          <h2 className="lp-incidents-title">Tactical Event Scenarios</h2>
          <span className="lp-incidents-meta">INDEX: 01 TO 03 // AHMEDABAD CORRIDORS</span>
        </div>

        <div className="lp-dossier-grid">
          {/* Card 1: Cricket Night */}
          <div className="lp-dossier-card">
            <div>
              <div className="lp-card-header-art" style={{ background: 'linear-gradient(135deg, #18181B, #27272A)' }}>
                <span className="lp-dossier-num white">01</span>
              </div>
              <div className="lp-dossier-status-pill">
                <span>🔴 STADIUM EGRESS SURGE</span>
              </div>
              <h3 className="lp-dossier-title">IPL T20: Gujarat Titans vs Mumbai Indians</h3>
              <p className="lp-dossier-desc">
                High-intensity post-match egress at Narendra Modi Stadium. Over 44,000 spectators arrive within 45 minutes of the final ball, creating surge pressures at Motera Concourse Gate Line.
              </p>
            </div>

            <div>
              <div className="lp-progress-bar-wrap">
                <div className="lp-progress-bar-fill" style={{ width: '85%' }} />
              </div>
              <div className="lp-dossier-runtime">ESTIMATED METRO EGRESS: 44,100 PASSENGERS</div>
              <button
                onClick={() => navigate('/events/evt-gt-vs-mi-2026/rehearsal')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
                className="lp-dossier-action"
              >
                <span>Rehearse Egress Simulation</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Card 2: Navratri Garba */}
          <div className="lp-dossier-card">
            <div>
              <div className="lp-card-header-art" style={{ background: 'linear-gradient(135deg, #4C1D95, #6D28D9)' }}>
                <span className="lp-dossier-num white">02</span>
              </div>
              <div className="lp-dossier-status-pill">
                <span>🟣 EXTENDED FESTIVE DISPERSION</span>
              </div>
              <h3 className="lp-dossier-title">Navratri Riverfront Maha-Garba</h3>
              <p className="lp-dossier-desc">
                Late-night festive crowds departing Old High Court interchange between 23:30 and 02:00 AM. Requires staggered train extensions and cross-platform connection synchronization.
              </p>
            </div>

            <div>
              <div className="lp-progress-bar-wrap">
                <div className="lp-progress-bar-fill" style={{ width: '60%', backgroundColor: 'var(--lp-purple)' }} />
              </div>
              <div className="lp-dossier-runtime">ESTIMATED METRO EGRESS: 20,400 PASSENGERS</div>
              <button
                onClick={() => navigate('/events/evt-navratri-garba-2026/rehearsal')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  color: 'var(--lp-purple)',
                }}
                className="lp-dossier-action"
              >
                <span>Rehearse Festive Schedule</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Card 3: Backtest Replay */}
          <div className="lp-dossier-card">
            <div>
              <div className="lp-card-header-art" style={{ background: 'linear-gradient(135deg, #0F766E, #059669)' }}>
                <span className="lp-dossier-num white">03</span>
              </div>
              <div className="lp-dossier-status-pill">
                <span>🟢 HISTORICAL BENCHMARK REPLAY</span>
              </div>
              <h3 className="lp-dossier-title">IPL 2026 Final Replay</h3>
              <p className="lp-dossier-desc">
                Official backtest calibration against GMRC operational disclosures: 1,95,868 daily journeys, 62 special midnight train departures, and last rake clearing at 02:19 AM.
              </p>
            </div>

            <div>
              <div className="lp-progress-bar-wrap">
                <div className="lp-progress-bar-fill" style={{ width: '100%', backgroundColor: '#059669' }} />
              </div>
              <div className="lp-dossier-runtime">RECORD VOLUME: 1,95,868 JOURNEYS</div>
              <button
                onClick={() => navigate('/backtest')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  color: '#059669',
                }}
                className="lp-dossier-action"
              >
                <span>Review Historical Calibration</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Ribbon Marquee Banner */}
      <div className="lp-marquee-banner">
        <ConfettiBannerArt height={90} />
        <div className="lp-marquee-logo-cutout">
          <div className="lp-marquee-logo-circle">
            <Train size={36} color="#141316" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="lp-bottom-footer">
        <div className="lp-slogan">
          AHMEDABAD METRO RAIL // GUJARAT METRO RAIL CORPORATION (GMRC)
        </div>
        <p className="lp-footer-sub">
          OFFLINE-FIRST CLIENT RUNTIME • INDEXEDDB DEXIE PERSISTENCE • 100% CLIENT-SIDE EXECUTION
        </p>

        <div className="lp-footer-links">
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            className="lp-footer-link"
          >
            Events Console
          </button>
          <button
            onClick={() => navigate('/welcome')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            className="lp-footer-link"
          >
            Network Map
          </button>
          <button
            onClick={() => navigate('/assumptions')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            className="lp-footer-link"
          >
            Assumptions
          </button>
          <button
            onClick={() => navigate('/help')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            className="lp-footer-link"
          >
            Operational Manual
          </button>
          <button
            onClick={() => navigate('/backtest')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            className="lp-footer-link"
          >
            Backtest
          </button>
        </div>

        <div className="lp-footer-row">
          <span>OCTOBER 2026 EDITION</span>
          <span>•</span>
          <a href="#" className="lp-back-to-top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            Back to Top ↑
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
