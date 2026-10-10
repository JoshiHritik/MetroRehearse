import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEvent, useRuns } from '../../db/hooks';
import { db } from '../../db/schema';
import { CheckSquare, Save, Check } from 'lucide-react';
import type { Review as ReviewRecord } from '../../domain/types';

export const Review: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const eventId = id || 'evt-gt-vs-mi-2026';
  const event = useEvent(eventId);
  const runs = useRuns(eventId);

  const appliedRun = runs?.find((r) => r.planId !== 'baseline') || runs?.[0];

  const [actualQueue, setActualQueue] = useState<number>(380);
  const [actualClearMin, setActualClearMin] = useState<number>(92);
  const [actualExtraTrains, setActualExtraTrains] = useState<number>(14);
  const [saved, setSaved] = useState(false);

  const predictedClearMin = appliedRun?.clearMinP50 || 88;
  const clearTimeErrorPct = Math.round(
    (Math.abs(actualClearMin - predictedClearMin) / Math.max(1, predictedClearMin)) * 100
  );

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    const reviewRecord: ReviewRecord = {
      id: `rev-${event.id}`,
      eventId: event.id,
      actual: {
        peakQueue: actualQueue,
        clearMin: actualClearMin,
        extraTrains: actualExtraTrains,
      },
      error: {
        clearTimeErrorPct,
      },
    };

    await db.reviews.put(reviewRecord);
    await db.events.update(event.id, { status: 'completed' });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!event) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading event review...
      </div>
    );
  }

  return (
    <div style={{ padding: '1.25rem', maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <CheckSquare size={22} color="var(--accent-cyan)" />
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Post-Event Operational Review</h1>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Record actual crowd observations for <strong>{event.name}</strong> to benchmark model accuracy and recalibrate assumptions.
        </p>
      </div>

      {/* Actuals Input Form */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <form onSubmit={handleSaveReview} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                Actual Peak Queue:
              </label>
              <input
                type="number"
                value={actualQueue}
                onChange={(e) => setActualQueue(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-main)',
                  fontFamily: 'var(--font-mono)',
                }}
              />
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Concourse count</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                Actual Clearance Time:
              </label>
              <input
                type="number"
                value={actualClearMin}
                onChange={(e) => setActualClearMin(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-main)',
                  fontFamily: 'var(--font-mono)',
                }}
              />
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Minutes to clear</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                Extra Trains Operated:
              </label>
              <input
                type="number"
                value={actualExtraTrains}
                onChange={(e) => setActualExtraTrains(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-main)',
                  fontFamily: 'var(--font-mono)',
                }}
              />
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Special rake runs</span>
            </div>
          </div>

          {/* Model Accuracy Comparison */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Clearance Time Forecast Error
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: clearTimeErrorPct <= 10 ? '#10B981' : '#F59E0B', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                {clearTimeErrorPct}% Variance
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Observed: {actualClearMin} min vs Predicted P50: {predictedClearMin} min
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ fontSize: '0.85rem' }}>
              {saved ? <Check size={15} /> : <Save size={15} />}
              <span>{saved ? 'Review Saved' : 'Save Review & Archive'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
