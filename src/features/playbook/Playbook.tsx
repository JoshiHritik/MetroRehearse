import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvent, useParams as useDbParams, usePlans, useRuns } from '../../db/hooks';
import { db } from '../../db/schema';
import { runOptimizationAsync } from '../../sim/client';
import { generateBriefingFromPlan } from '../../domain/briefing';
import { PlanCard } from './PlanCard';
import { Sliders, Sparkles, RotateCw, ArrowRight } from 'lucide-react';
import defaultAssumptions from '../../data/assumptions.default.json';
import type { Plan } from '../../domain/types';

export const Playbook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const eventId = id || 'evt-gt-vs-mi-2026';
  const event = useEvent(eventId);
  const dbParams = useDbParams(event?.paramsId || defaultAssumptions.id);
  const plans = usePlans(eventId);
  const runs = useRuns(eventId);

  // Weights state
  const [safetyWeight, setSafetyWeight] = useState(50);
  const [timeWeight, setTimeWeight] = useState(30);
  const [costWeight, setCostWeight] = useState(20);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Find baseline
  const baselinePlan = plans?.find((p) => p.id.includes('baseline')) || plans?.[0];
  const baselineRun = runs?.find((r) => r.planId === 'baseline') || runs?.[0];

  // Candidates
  const candidatePlans = plans?.filter((p) => !p.id.includes('baseline')) || [];

  const handleOptimize = async () => {
    if (!event) return;
    setIsOptimizing(true);

    try {
      const totalW = safetyWeight + timeWeight + costWeight || 1;
      const weights = {
        safety: safetyWeight / totalW,
        time: timeWeight / totalW,
        cost: costWeight / totalW,
      };

      const params = dbParams || {
        id: defaultAssumptions.id,
        label: defaultAssumptions.label,
        values: defaultAssumptions.values,
      };

      const results = await runOptimizationAsync(
        event,
        params,
        weights,
        { candidates: 200, refine: 5, seedCount: 50 }
      );

      // Save top plans and run summaries to Dexie
      for (const res of results) {
        await db.plans.put(res.plan);
        await db.runs.put(res.summary);
      }
    } catch (err) {
      console.error('Optimization error:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleApplyPlan = async (plan: Plan) => {
    if (!event) return;
    await db.events.update(event.id, {
      appliedPlanId: plan.id,
      status: 'briefed',
    });

    // Generate or update briefings in all 3 languages
    const brfEn = generateBriefingFromPlan(event, plan, 'en');
    const brfHi = generateBriefingFromPlan(event, plan, 'hi');
    const brfGu = generateBriefingFromPlan(event, plan, 'gu');

    await db.briefings.bulkPut([brfEn, brfHi, brfGu]);
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
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sliders size={20} color="var(--accent-cyan)" />
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Tactical Playbook & Action Optimizer</h1>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Multi-lever Pareto exploration: searches 300 gate, headway, metering, and service extension candidates.
            </p>
          </div>

          <button
            onClick={() => navigate(`/events/${event.id}/order`)}
            className="btn-secondary"
            style={{ fontSize: '0.85rem' }}
          >
            <span>Proceed to Event Order</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Priority Weight Sliders */}
        <div
          style={{
            marginTop: '1.25rem',
            padding: '1rem',
            backgroundColor: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
            Operational Objective Weighting:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {/* Safety */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.25rem' }}>
                <span style={{ color: '#10B981', fontWeight: 600 }}>Crowd Safety & Crush Prevention</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{safetyWeight}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={safetyWeight}
                onChange={(e) => setSafetyWeight(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#10B981' }}
              />
            </div>

            {/* Clearance Time */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Egress Clearance Speed</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{timeWeight}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={timeWeight}
                onChange={(e) => setTimeWeight(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
              />
            </div>

            {/* Cost */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.25rem' }}>
                <span style={{ color: '#FBBF24', fontWeight: 600 }}>Budget & Fleet Efficiency</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{costWeight}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={costWeight}
                onChange={(e) => setCostWeight(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#FBBF24' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="btn-primary"
              style={{ fontSize: '0.85rem' }}
            >
              {isOptimizing ? (
                <>
                  <RotateCw size={15} className="animate-spin" />
                  <span>Searching Pareto Frontier (300 candidates)...</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>Synthesize Optimal Action Plans</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Plan Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
          Ranked Tactical Interventions for {event.name}
        </h2>

        {candidatePlans.map((plan, idx) => {
          const run = runs?.find((r) => r.planId === plan.id) || baselineRun;
          if (!run || !baselineRun) return null;

          return (
            <PlanCard
              key={plan.id}
              plan={plan}
              summary={run}
              baselineSummary={baselineRun}
              costBreakdown={{
                extraTrains: Math.round(plan.lastTrainExtMin / (plan.headwayMin || 5)),
                staffHours: plan.staff * 3,
                costScore: plan.cost ?? 15,
              }}
              isApplied={event.appliedPlanId === plan.id}
              onApply={handleApplyPlan}
              rankIndex={idx}
            />
          );
        })}
      </div>
    </div>
  );
};
