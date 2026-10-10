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
  Users,
  MapPin,
  CheckCircle,
  Sparkles,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
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
        return { label: 'Live In Progress', bg: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: '#EF4444' };
      case 'briefed':
        return { label: 'Briefed & Approved', bg: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '#10B981' };
      case 'rehearsed':
        return { label: 'Rehearsed', bg: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-cyan)', border: 'var(--accent-cyan)' };
      case 'completed':
        return { label: 'Completed', bg: 'rgba(148, 163, 184, 0.15)', color: '#94A3B8', border: '#94A3B8' };
      default:
        return { label: 'Draft', bg: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', border: '#FBBF24' };
    }
  };

  return (
    <div style={{ padding: '1.25rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CalendarDays size={22} color="var(--accent-cyan)" />
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Scheduled Event Operations</h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Pre-event simulation rehearsals and operational tactical playbooks for GMRC metro stations.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Guide Toggle Button */}
          <button
            onClick={() => setShowGuide((prev) => !prev)}
            className="btn-secondary"
            style={{ fontSize: '0.825rem', gap: '0.4rem' }}
            title="Toggle Operator Walkthrough Guide"
          >
            <HelpCircle size={14} color="var(--accent-cyan)" />
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

      {/* Operator Workflow Guide Banner */}
      {showGuide && (
        <div
          className="glass-panel"
          style={{
            padding: '1.25rem',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            background: 'linear-gradient(135deg, rgba(17, 28, 51, 0.85), rgba(24, 39, 71, 0.75))',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(56, 189, 248, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-cyan)',
                }}
              >
                <Compass size={14} />
              </div>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.02em' }}>
                Quick Guide: How to Operate MetroRehearse in 4 Steps
              </h2>
            </div>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              Station Controller & Safety Marshal Workflow
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
            {/* Step 1 */}
            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'rgba(56, 189, 248, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>1</span>
                <span>Select or Plan Event</span>
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', lineHeight: 1.45, margin: 0 }}>
                Choose an event from the list below or click <strong>Schedule New Event</strong>. Configure spectator attendance and modal split <em>(A)</em>.
              </p>
            </div>

            {/* Step 2 */}
            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: '#38BDF8' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'rgba(56, 189, 248, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>2</span>
                <span>Run Rehearsal</span>
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', lineHeight: 1.45, margin: 0 }}>
                Click <strong>Open Rehearsal</strong> to run the 200-seed Monte Carlo physics engine. Scrub the timeline to watch crowd density across the station.
              </p>
            </div>

            {/* Step 3 */}
            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: '#10B981' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>3</span>
                <span>Playbook & Plans</span>
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', lineHeight: 1.45, margin: 0 }}>
                Click <strong>Playbook & Plans</strong> to optimize levers. Adjust weights (Safety, Time, Budget) to generate and apply optimal operational plans.
              </p>
            </div>

            {/* Step 4 */}
            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: '#F59E0B' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'rgba(245, 158, 11, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>4</span>
                <span>Dispatch Order & Live Ops</span>
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', lineHeight: 1.45, margin: 0 }}>
                Click <strong>Event Order</strong> to print bilingual A4 briefing sheets. On match day, open <strong>Live Concourse Mode</strong> for supervisor Tap-Pad telemetry.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Events List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {events && events.length > 0 ? (
          events.map((evt) => {
            const statusInfo = getStatusBadge(evt.status);
            const metroPax = Math.round(evt.attendance * evt.metroShare);

            return (
              <div
                key={evt.id}
                className="glass-panel"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{evt.name}</h3>
                      <span
                        style={{
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          backgroundColor: statusInfo.bg,
                          color: statusInfo.color,
                          border: `1px solid ${statusInfo.border}40`,
                        }}
                      >
                        {statusInfo.label}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.35rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MapPin size={14} color="var(--line-north-south)" />
                        <span>Motera Stadium Gateway</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={14} />
                        <span>Ends at {new Date(evt.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Metrics Chips */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', backgroundColor: 'var(--bg-surface-elevated)', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Attendance</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{formatPax(evt.attendance)}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Metro Split <span className="badge-assumed">(A)</span>
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                        {Math.round(evt.metroShare * 100)}% ({formatPax(metroPax)})
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Staff Deployed</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{evt.staffAvailable} marshals</div>
                    </div>
                  </div>
                </div>

                {/* Action Links */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', alignItems: 'center' }}>
                  <button
                    onClick={() => navigate(`/events/${evt.id}/rehearsal`)}
                    className="btn-primary"
                    style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                    title="Step 2: Run 200-Seed Monte Carlo simulation & check platform crowd density"
                  >
                    <PlayCircle size={14} />
                    <span>Open Rehearsal</span>
                  </button>

                  <button
                    onClick={() => navigate(`/events/${evt.id}/playbook`)}
                    className="btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                    title="Step 3: Balance Safety vs. Time vs. Cost to find optimal gates and train headways"
                  >
                    <Sliders size={14} />
                    <span>Playbook & Plans</span>
                  </button>

                  <button
                    onClick={() => navigate(`/events/${evt.id}/order`)}
                    className="btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                    title="Step 4: Dispatch standardized A4 operational briefing in English, Hindi, or Gujarati"
                  >
                    <FileText size={14} />
                    <span>Event Order</span>
                  </button>

                  <button
                    onClick={() => navigate(`/events/${evt.id}/live`)}
                    className="btn-secondary"
                    style={{
                      fontSize: '0.8rem',
                      padding: '0.45rem 0.85rem',
                      color: '#EF4444',
                      borderColor: 'rgba(239, 68, 68, 0.4)',
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
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No events scheduled. Click "Schedule New Event" or "Reset Demo Data".
          </div>
        )}
      </div>
    </div>
  );
};
