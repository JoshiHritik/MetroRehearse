import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../../db/hooks';
import { resetDemoData } from '../../db/reset';
import { formatPax } from '../../domain/format';
import {
  CalendarDays,
  Plus,
  PlayCircle,
  Sliders,
  FileText,
  Activity,
  RotateCcw,
  Clock,
  MapPin,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Compass,
} from 'lucide-react';
import type { EventRecord } from '../../domain/types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const events = useEvents();
  const [showGuide, setShowGuide] = useState(true);

  const handleReset = async () => {
    if (window.confirm('Reset all demo data to default Ahmedabad Metro scenarios?')) {
      await resetDemoData();
    }
  };

  const getStatusBadge = (status: EventRecord['status']) => {
    switch (status) {
      case 'live':
        return { label: 'Live In Progress', bg: 'var(--status-critical-bg)', color: 'var(--status-critical)', dot: '#DC2626', border: 'var(--status-critical-border)' };
      case 'briefed':
        return { label: 'Briefed & Approved', bg: 'var(--status-safe-bg)', color: 'var(--status-safe)', dot: '#10B981', border: 'var(--status-safe-border)' };
      case 'rehearsed':
        return { label: 'Rehearsed', bg: 'rgba(107, 56, 251, 0.1)', color: 'var(--accent-purple)', dot: '#6B38FB', border: 'rgba(107, 56, 251, 0.3)' };
      case 'completed':
        return { label: 'Completed', bg: '#F1F5F9', color: '#64748B', dot: '#94A3B8', border: 'rgba(15, 23, 42, 0.1)' };
      default:
        return { label: 'Draft', bg: 'var(--status-caution-bg)', color: 'var(--status-caution)', dot: '#F97316', border: 'var(--status-caution-border)' };
    }
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <CalendarDays size={24} color="var(--accent-purple)" />
            <h1 className="hero-title" style={{ fontSize: '1.5rem' }}>Scheduled Event Operations</h1>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Pre-event crowd simulation rehearsals and operational tactical playbooks for GMRC metro stations.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Guide Toggle Button */}
          <button
            onClick={() => setShowGuide((prev) => !prev)}
            className="btn-secondary"
            style={{ fontSize: '0.825rem', gap: '0.45rem' }}
            title="Toggle Operator Walkthrough Guide"
          >
            <HelpCircle size={15} color="var(--accent-purple)" />
            <span>{showGuide ? 'Hide Operator Guide' : 'How to Operate'}</span>
            {showGuide ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          <button onClick={handleReset} className="btn-secondary" style={{ fontSize: '0.825rem' }} title="Reset demo database">
            <RotateCcw size={14} />
            <span>Reset Demo Data</span>
          </button>

          <button
            onClick={() => navigate('/events/new')}
            className="btn-primary"
            style={{ fontSize: '0.85rem' }}
          >
            <Plus size={16} />
            <span>Schedule New Event</span>
          </button>
        </div>
      </div>

      {/* Operator Workflow Guide Banner - Blueprint Architecture */}
      {showGuide && (
        <div
          className="glass-panel"
          style={{
            padding: '1.5rem',
            border: '1px solid rgba(107, 56, 251, 0.25)',
            backgroundColor: '#FFFFFF',
            boxShadow: 'var(--shadow-sm)',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(107, 56, 251, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-purple)',
                }}
              >
                <Compass size={16} />
              </div>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                Quick Guide: How to Operate MetroRehearse in 4 Steps
              </h2>
            </div>
            <span className="meta-eyebrow" style={{ color: 'var(--text-muted)' }}>
              Station Controller & Safety Marshal Workflow
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {/* Step 1 */}
            <div
              style={{
                backgroundColor: 'var(--bg-canvas)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-purple)' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--accent-purple)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>1</span>
                <span>Select or Plan Event</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Choose an event from the list below or click <strong>Schedule New Event</strong>. Configure spectator attendance and modal split <em>(A)</em>.
              </p>
            </div>

            {/* Step 2 */}
            <div
              style={{
                backgroundColor: 'var(--bg-canvas)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-blue)' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--accent-blue)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>2</span>
                <span>Run Rehearsal</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Click <strong>Open Rehearsal →</strong> to run the 200-seed Monte Carlo physics engine. Scrub the timeline to watch crowd density across the station.
              </p>
            </div>

            {/* Step 3 */}
            <div
              style={{
                backgroundColor: 'var(--bg-canvas)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--status-safe)' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--status-safe)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>3</span>
                <span>Playbook & Plans</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Click <strong>Playbook & Plans</strong> to optimize levers. Adjust weights (Safety, Time, Budget) to generate and apply optimal operational plans.
              </p>
            </div>

            {/* Step 4 */}
            <div
              style={{
                backgroundColor: 'var(--bg-canvas)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--status-caution)' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--status-caution)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>4</span>
                <span>Dispatch Order & Live Ops</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Click <strong>Event Order</strong> to print bilingual A4 briefing sheets. On match day, open <strong>Live Concourse Mode</strong> for supervisor Tap-Pad telemetry.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Events List - Wide Horizontal Panels with Actions Left & Tabular Right */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {events && events.length > 0 ? (
          events.map((evt) => {
            const statusInfo = getStatusBadge(evt.status);
            const metroPax = Math.round(evt.attendance * evt.metroShare);

            return (
              <div
                key={evt.id}
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                        {evt.name}
                      </h3>
                      <span
                        className="status-pill"
                        style={{
                          backgroundColor: statusInfo.bg,
                          color: statusInfo.color,
                          border: `1px solid ${statusInfo.border}`,
                        }}
                      >
                        <span className="status-dot" style={{ backgroundColor: statusInfo.dot }} />
                        <span>{statusInfo.label}</span>
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <MapPin size={15} color="var(--line-north-south)" />
                        <span style={{ fontWeight: 500 }}>Motera Stadium Gateway</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Clock size={15} />
                        <span>Ends at {new Date(evt.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Metrics Chips: Modular Grid with Thin Dividers */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ padding: '0.65rem 1.15rem', borderRight: '1px solid var(--border-subtle)' }}>
                      <div className="meta-eyebrow">ATTENDANCE</div>
                      <div className="tabular-nums" style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                        {formatPax(evt.attendance)}
                      </div>
                    </div>

                    <div style={{ padding: '0.65rem 1.15rem', borderRight: '1px solid var(--border-subtle)' }}>
                      <div className="meta-eyebrow">
                        METRO SPLIT <span className="badge-assumed">(A)</span>
                      </div>
                      <div className="tabular-nums" style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--accent-blue)', marginTop: '0.15rem' }}>
                        {Math.round(evt.metroShare * 100)}% <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>({formatPax(metroPax)})</span>
                      </div>
                    </div>

                    <div style={{ padding: '0.65rem 1.15rem' }}>
                      <div className="meta-eyebrow">STAFF DEPLOYED</div>
                      <div className="tabular-nums" style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                        {evt.staffAvailable} marshals
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Links: Aligned Left with Deep Purple Primary CTA */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)', alignItems: 'center' }}>
                  <button
                    onClick={() => navigate(`/events/${evt.id}/rehearsal`)}
                    className="btn-primary"
                    style={{ fontSize: '0.825rem', padding: '0.55rem 1rem' }}
                    title="Step 2: Run 200-Seed Monte Carlo simulation & check platform crowd density"
                  >
                    <PlayCircle size={15} />
                    <span>Open Rehearsal</span>
                    <ArrowRight size={14} />
                  </button>

                  <button
                    onClick={() => navigate(`/events/${evt.id}/playbook`)}
                    className="btn-secondary"
                    style={{ fontSize: '0.825rem', padding: '0.55rem 1rem' }}
                    title="Step 3: Balance Safety vs. Time vs. Cost to find optimal gates and train headways"
                  >
                    <Sliders size={14} />
                    <span>Playbook & Plans</span>
                  </button>

                  <button
                    onClick={() => navigate(`/events/${evt.id}/order`)}
                    className="btn-secondary"
                    style={{ fontSize: '0.825rem', padding: '0.55rem 1rem' }}
                    title="Step 4: Dispatch standardized A4 operational briefing in English, Hindi, or Gujarati"
                  >
                    <FileText size={14} />
                    <span>Event Order</span>
                  </button>

                  <button
                    onClick={() => navigate(`/events/${evt.id}/live`)}
                    className="btn-secondary"
                    style={{
                      fontSize: '0.825rem',
                      padding: '0.55rem 1rem',
                      color: 'var(--status-critical)',
                      borderColor: 'var(--status-critical-border)',
                      backgroundColor: 'var(--status-critical-bg)',
                    }}
                    title="Step 5: Record real-time passenger arrivals using supervisor Tap Pad during live event"
                  >
                    <Activity size={14} />
                    <span>Live Concourse Mode</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: '#FFFFFF' }}>
            No events scheduled. Click "Schedule New Event" or "Reset Demo Data".
          </div>
        )}
      </div>
    </div>
  );
};
