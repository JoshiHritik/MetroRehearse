import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEvent, useParams as useDbParams, useRuns, usePlans } from '../../db/hooks';
import { db } from '../../db/schema';
import { useAppStore } from '../../store/appStore';
import { runSimulationAsync } from '../../sim/client';
import { StationCanvas } from './StationCanvas';
import { BandChart } from './BandChart';
import { RiskCard } from './RiskCard';
import { Scrubber } from './Scrubber';
import { Play, RotateCw, CheckCircle, ShieldAlert } from 'lucide-react';
import defaultAssumptions from '../../data/assumptions.default.json';

export const Rehearsal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const eventId = id || 'evt-gt-vs-mi-2026';
  const event = useEvent(eventId);
  const dbParams = useDbParams(event?.paramsId || defaultAssumptions.id);
  const runs = useRuns(eventId);
  const plans = usePlans(eventId);

  const { timeScrubberMin, setTimeScrubberMin } = useAppStore();
  const [selectedPlanId, setSelectedPlanId] = useState<string>('applied');
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  // Identify plans
  const baselinePlan = plans?.find((p) => p.id.includes('baseline')) || null;
  const appliedPlan = plans?.find((p) => p.id === event?.appliedPlanId) || plans?.[1] || null;
  const activePlan = selectedPlanId === 'baseline' ? baselinePlan : appliedPlan;

  // Identify runs
  const baselineRun = runs?.find((r) => r.planId === 'baseline') || null;
  const appliedRun = runs?.find((r) => r.planId !== 'baseline') || null;
  const activeRun = selectedPlanId === 'baseline' ? baselineRun : appliedRun;

  // Derive state at currentMinute from activeRun bands
  const currentMinute = timeScrubberMin;
  const bandPoint = activeRun?.bands?.find((b) => b.t === currentMinute) || activeRun?.bands?.[Math.floor(currentMinute / 5)] || {
    t: currentMinute,
    q10: 0.5,
    q50: 1.2,
    q90: 2.1,
  };
  const currentDensity = bandPoint.q50;

  // Metering status at current time
  const meteringLimit = activePlan?.metering?.limit ?? 3.5;
  const isMeteringOn = Boolean(activePlan?.metering?.on && currentDensity >= meteringLimit);
  const gatesOpen = activePlan?.gatesOpen ?? 4;
  const trainAtPlatform = currentMinute % Math.round(activePlan?.headwayMin || 5) === 0;

  const handleRunSimulation = async () => {
    if (!event) return;
    setIsSimulating(true);
    setProgress({ done: 0, total: 200 });

    try {
      const seeds = Array.from({ length: 200 }, (_, i) => i + 1);
      const params = dbParams || {
        id: defaultAssumptions.id,
        label: defaultAssumptions.label,
        values: defaultAssumptions.values,
      };

      const planToSim = activePlan || 'baseline';
      const summary = await runSimulationAsync(
        {
          event,
          params,
          plan: planToSim,
          seeds,
          stepSec: 10,
          horizonMin: 180,
        },
        (done, total) => {
          setProgress({ done, total });
        }
      );

      // Save summary in Dexie
      await db.runs.put(summary);
      await db.events.update(event.id, { status: 'rehearsed' });
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimulating(false);
      setProgress(null);
    }
  };

  if (!event) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading event details...
      </div>
    );
  }

  return (
    <div style={{ padding: '1.25rem', maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Tactical Crowd Rehearsal</h1>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                color: 'var(--accent-cyan)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
              }}
            >
              {event.name}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            200-seed Monte Carlo stochastic crowd model • 10-second physical steps • Motera Stadium Gateway
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Plan Switcher */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              padding: '0.2rem',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <button
              onClick={() => setSelectedPlanId('applied')}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: selectedPlanId === 'applied' ? 'var(--accent-blue)' : 'transparent',
                color: selectedPlanId === 'applied' ? '#FFFFFF' : 'var(--text-muted)',
              }}
            >
              Tactical Plan
            </button>
            <button
              onClick={() => setSelectedPlanId('baseline')}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: selectedPlanId === 'baseline' ? 'var(--accent-blue)' : 'transparent',
                color: selectedPlanId === 'baseline' ? '#FFFFFF' : 'var(--text-muted)',
              }}
            >
              Baseline Timetable
            </button>
          </div>

          {/* Run Sim Button */}
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="btn-primary"
            style={{ fontSize: '0.875rem' }}
          >
            {isSimulating ? (
              <>
                <RotateCw size={15} className="animate-spin" />
                <span>Simulating ({progress?.done || 0}/200)...</span>
              </>
            ) : (
              <>
                <Play size={15} />
                <span>Run Simulation (200 Seeds)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Risk Metrics Cards */}
      <RiskCard summary={activeRun} baselineSummary={selectedPlanId === 'applied' ? baselineRun : undefined} />

      {/* Main Grid: 2D Canvas + Quantile Sparkline */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
        <StationCanvas
          currentMinute={currentMinute}
          density={currentDensity}
          gateQueue={Math.round(currentDensity * 350)}
          gatesOpen={gatesOpen}
          meteringActive={isMeteringOn}
          trainAtPlatform={trainAtPlatform}
          plan={activePlan}
        />

        {/* Quantile Band SVG Chart */}
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Platform Density Forecast Band (Q10 - Q50 - Q90)</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Click anywhere along chart timeline to scrub
            </span>
          </div>
          <BandChart
            bands={activeRun?.bands || []}
            currentMinute={currentMinute}
            onSeek={setTimeScrubberMin}
          />
        </div>
      </div>

      {/* Scrubber Strip */}
      <Scrubber
        currentMinute={currentMinute}
        onMinuteChange={setTimeScrubberMin}
        eventEndEpoch={event.endsAt}
      />
    </div>
  );
};
