import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEvent, useLiveCounts, usePlan, useRuns } from '../../db/hooks';
import { db } from '../../db/schema';
import { useAppStore } from '../../store/appStore';
import { updateBayesianArrivalRate } from '../../domain/bayes';
import { getDensityColor, formatPax, formatRiskPercent } from '../../domain/format';
import {
  Activity,
  PlusCircle,
  RotateCcw,
  Sun,
  ShieldAlert,
  Train,
  Megaphone,
  Radio,
  Clock,
  Sparkles,
} from 'lucide-react';

export const LiveMode: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const eventId = id || 'evt-gt-vs-mi-2026';
  const event = useEvent(eventId);
  const plan = usePlan(event?.appliedPlanId || 'plan-gt-opt-1');
  const liveCounts = useLiveCounts(eventId);
  const runs = useRuns(eventId);

  const {
    wakeLockActive,
    toggleWakeLock,
    csvStreamActive,
    toggleCsvStream,
  } = useAppStore();

  // Next train countdown (seconds)
  const headwaySec = (plan?.headwayMin || 4) * 60;
  const [secondsToNextTrain, setSecondsToNextTrain] = useState(140);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsToNextTrain((prev) => (prev <= 1 ? headwaySec : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [headwaySec]);

  // Aggregate live counts
  let totalArrivalsObserved = 0;
  let currentConcourseQueue = 0;
  let lastCountRow = liveCounts && liveCounts.length > 0 ? liveCounts[0] : null;

  if (liveCounts) {
    for (const c of liveCounts) {
      if (c.kind === 'arrivals') {
        totalArrivalsObserved += c.delta;
      } else {
        currentConcourseQueue += c.delta;
      }
    }
  }

  // Calculate Bayesian arrival rate update
  // Prior: calibrated from event attendance and baseline 180 min horizon
  const priorAlpha = 150;
  const priorBeta = 30; // 150 pax / 30 min = 5 pax/min base rate
  const elapsedMinutes = 25; // operational progress window

  const bayesUpdate = updateBayesianArrivalRate(
    { alpha: priorAlpha, beta: priorBeta },
    {
      observedPax: totalArrivalsObserved,
      windowMinutes: elapsedMinutes,
      observedQueue: currentConcourseQueue > 0 ? currentConcourseQueue : undefined,
      predictedQueue: 280,
    }
  );

  // Live platform density estimate based on posterior rate
  const liveEstimatedDensity = Math.min(
    5.2,
    Number((2.4 + (bayesUpdate.rateMultiplier - 1) * 1.2).toFixed(2))
  );

  // Trigger rules check
  const meteringThreshold = plan?.metering?.limit ?? 3.5;
  const isMeteringTriggered = liveEstimatedDensity >= meteringThreshold;
  const isCrushCritical = liveEstimatedDensity >= 4.5;

  const handleTap = async (kind: 'arrivals' | 'queueShort' | 'queueLong', delta: number) => {
    if (!event) return;
    const now = Date.now();
    await db.liveCounts.add({
      id: `lc-${now}-${Math.random().toString(36).substring(2, 6)}`,
      eventId: event.id,
      gateId: 'GATE-LINE-1',
      ts: now,
      kind,
      delta,
    });
  };

  const handleUndo = async () => {
    if (!lastCountRow || !event) return;
    const now = Date.now();
    await db.liveCounts.add({
      id: `lc-undo-${now}`,
      eventId: event.id,
      gateId: lastCountRow.gateId,
      ts: now,
      kind: lastCountRow.kind,
      delta: -lastCountRow.delta,
      undoOf: lastCountRow.id,
    });
  };

  if (!event) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading event telemetry...
      </div>
    );
  }

  return (
    <div style={{ padding: '1.25rem', maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header telemetry strip */}
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
            <Activity size={22} color="#EF4444" className="animate-pulse-subtle" />
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Concourse Live Operations & Re-Forecast</h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Touch-first manual ingress counts with live conjugate Bayesian rate re-estimation.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Mock CSV Stream toggle */}
          <button
            onClick={toggleCsvStream}
            className="btn-secondary"
            style={{
              fontSize: '0.75rem',
              padding: '0.4rem 0.75rem',
              color: csvStreamActive ? 'var(--status-safe)' : 'var(--text-muted)',
              borderColor: csvStreamActive ? 'var(--status-safe)' : undefined,
            }}
            title="Toggle Simulated L0 AFC Stream Replay"
          >
            <Radio size={13} className={csvStreamActive ? 'animate-spin' : undefined} />
            <span>{csvStreamActive ? 'L0 Stream ON' : 'Mock L0 Feed'}</span>
          </button>

          {/* Wake Lock Toggle */}
          <button
            onClick={toggleWakeLock}
            className="btn-secondary"
            style={{
              fontSize: '0.75rem',
              padding: '0.4rem 0.75rem',
              color: wakeLockActive ? '#FBBF24' : 'var(--text-muted)',
              borderColor: wakeLockActive ? '#FBBF24' : undefined,
            }}
          >
            <Sun size={13} />
            <span>{wakeLockActive ? 'Wake Lock ON' : 'Wake Lock OFF'}</span>
          </button>
        </div>
      </div>

      {/* Trigger Rule Warning Banner */}
      {isMeteringTriggered && (
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: isCrushCritical ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
            border: `2px solid ${isCrushCritical ? '#EF4444' : '#F59E0B'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={20} color={isCrushCritical ? '#EF4444' : '#F59E0B'} />
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: isCrushCritical ? '#EF4444' : '#FBBF24' }}>
              {isCrushCritical
                ? 'CRITICAL TRIGGER: CONCOURSE GATE HOLD MANDATORY'
                : `TACTICAL TRIGGER ACTIVATED: INITIATE CONCOURSE METERING (Threshold: ${meteringThreshold} pax/m²)`}
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
            Live platform density estimate ({liveEstimatedDensity} pax/m²) has exceeded safety threshold. Throttling AFC turnstiles to 50% flow.
          </p>
          <div
            style={{
              padding: '0.6rem 0.85rem',
              backgroundColor: 'var(--bg-canvas)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.825rem',
              fontStyle: 'italic',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Megaphone size={15} color="var(--accent-cyan)" />
            <span>
              PA Script: "Attention passengers, for your safety, platform entry is temporarily metered. Please wait behind the concourse barrier."
            </span>
          </div>
        </div>
      )}

      {/* Primary Telemetry Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {/* Next train countdown */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Next Southbound Rake
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.4rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
              {Math.floor(secondsToNextTrain / 60)}:{(secondsToNextTrain % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Train size={14} />
            <span>Target Headway: {plan?.headwayMin || 4} min</span>
          </div>
        </div>

        {/* Live Estimated Platform Density */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Live Platform Load
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.4rem' }}>
            <span
              style={{
                fontSize: '2.2rem',
                fontWeight: 800,
                color: getDensityColor(liveEstimatedDensity),
                fontFamily: 'var(--font-mono)',
              }}
            >
              {liveEstimatedDensity.toFixed(2)}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>pax/m²</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: getDensityColor(liveEstimatedDensity), fontWeight: 600, marginTop: '0.3rem' }}>
            {liveEstimatedDensity >= 4.5 ? 'CRITICAL DENSITY' : liveEstimatedDensity >= 3.0 ? 'METERING THRESHOLD' : 'NORMAL CIRCULATION'}
          </div>
        </div>

        {/* Bayesian Ingress Rate */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Bayesian Ingress Rate
            </span>
            <span className="badge-assumed">(A)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.4rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FBBF24', fontFamily: 'var(--font-mono)' }}>
              {bayesUpdate.posteriorMeanRate}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>pax/min</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            Multiplier: <strong>{bayesUpdate.rateMultiplier}x</strong> ({bayesUpdate.source === 'gamma-poisson' ? 'Conjugate Gamma-Poisson' : 'Queue Ratio Fallback'})
          </div>
        </div>

        {/* Observed Cumulative Pax */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Recorded Manual Count
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.4rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
              {formatPax(totalArrivalsObserved)}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>pax ingress</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            Active Gate Queue: {currentConcourseQueue} pax
          </div>
        </div>
      </div>

      {/* OPERATOR TAP PAD (Oversized touch targets ≥ 56px height) */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Concourse Tap Pad (Supervisor Input)</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Tap as passenger batches pass through the entry gate line.
            </p>
          </div>

          {lastCountRow && (
            <button
              onClick={handleUndo}
              className="btn-danger"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              title="Undo last recorded batch"
            >
              <RotateCcw size={14} />
              <span>Undo Last ({lastCountRow.delta > 0 ? `+${lastCountRow.delta}` : lastCountRow.delta})</span>
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {/* Tap +10 */}
          <button
            onClick={() => handleTap('arrivals', 10)}
            className="touch-target"
            style={{
              height: '68px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '2px solid var(--accent-blue)',
              borderRadius: 'var(--radius-lg)',
              color: '#FFFFFF',
              fontSize: '1.1rem',
              fontWeight: 800,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              transition: 'transform 0.1s ease, background-color 0.1s ease',
            }}
          >
            <span>+10 Pax Ingress</span>
            <span style={{ fontSize: '0.725rem', fontWeight: 500, color: 'var(--accent-cyan)' }}>Regular Turnstile Flow</span>
          </button>

          {/* Tap +25 */}
          <button
            onClick={() => handleTap('queueShort', 25)}
            className="touch-target"
            style={{
              height: '68px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '2px solid #F59E0B',
              borderRadius: 'var(--radius-lg)',
              color: '#FBBF24',
              fontSize: '1.1rem',
              fontWeight: 800,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)',
            }}
          >
            <span>+25 Concourse Queue</span>
            <span style={{ fontSize: '0.725rem', fontWeight: 500, color: 'var(--text-muted)' }}>Ticket Lobby Backup</span>
          </button>

          {/* Tap +50 */}
          <button
            onClick={() => handleTap('queueLong', 50)}
            className="touch-target"
            style={{
              height: '68px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '2px solid #EF4444',
              borderRadius: 'var(--radius-lg)',
              color: '#EF4444',
              fontSize: '1.1rem',
              fontWeight: 800,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
            }}
          >
            <span>+50 Stadium Surge</span>
            <span style={{ fontSize: '0.725rem', fontWeight: 500, color: 'var(--text-muted)' }}>Plaza Rapid Wave</span>
          </button>
        </div>
      </div>
    </div>
  );
};
