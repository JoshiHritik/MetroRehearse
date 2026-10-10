import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../db/schema';
import { useEvent } from '../../db/hooks';
import presetsData from '../../data/presets.json';
import defaultAssumptions from '../../data/assumptions.default.json';
import { CalendarDays, Save, ArrowLeft, Info } from 'lucide-react';
import type { EventRecord, Plan } from '../../domain/types';

export const PlanEvent: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const existingEvent = useEvent(id);

  const [presetId, setPresetId] = useState<string>('cricket-night');
  const [name, setName] = useState<string>('Cricket Match at Motera Stadium');
  const [stationId, setStationId] = useState<string>('motera-stadium');
  const [attendance, setAttendance] = useState<number>(100000);
  const [metroShare, setMetroShare] = useState<number>(0.42);
  const [staffAvailable, setStaffAvailable] = useState<number>(35);
  const [endTimeStr, setEndTimeStr] = useState<string>('23:30');

  // Handle preset selection
  const handlePresetChange = (pId: string) => {
    setPresetId(pId);
    const p = presetsData.find((item) => item.id === pId);
    if (p) {
      setName(p.name);
      setStationId(p.stationId);
      setAttendance(p.defaultAttendance);
      setMetroShare(p.defaultMetroShare);
      setStaffAvailable(p.defaultStaffAvailable);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const [hours, mins] = endTimeStr.split(':').map(Number);
    const endTarget = new Date();
    endTarget.setHours(hours || 23, mins || 30, 0, 0);

    const eventId = id || `evt-${Date.now()}`;
    const newEvent: EventRecord = {
      id: eventId,
      name,
      stationId,
      preset: presetId,
      attendance,
      metroShare, // (A)
      endsAt: endTarget.getTime(),
      staffAvailable,
      status: 'draft',
      paramsId: defaultAssumptions.id,
      createdAt: Date.now(),
    };

    await db.events.put(newEvent);

    // Create baseline plan
    const baselinePlan: Plan = {
      id: `plan-base-${eventId}`,
      eventId,
      name: 'Timetable Baseline (4 Gates, 5-min Headway)',
      gatesOpen: 4,
      metering: { on: false, limit: 3.8 },
      headwayMin: 5,
      lastTrainExtMin: 0,
      staff: Math.min(20, staffAvailable),
      holdMin: 0,
    };
    await db.plans.put(baselinePlan);

    navigate(`/events/${eventId}/rehearsal`);
  };

  const currentPreset = presetsData.find((p) => p.id === presetId);

  return (
    <div style={{ padding: '1.25rem', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <button onClick={() => navigate('/')} className="btn-secondary" style={{ alignSelf: 'flex-start', fontSize: '0.825rem' }}>
        <ArrowLeft size={14} />
        <span>Back to Events</span>
      </button>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <CalendarDays size={22} color="var(--accent-cyan)" />
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Plan Tactical Event Operation</h1>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Configure stadium crowd parameters, modal split assumptions, and timetable limits.
        </p>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Preset Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Crowd Profile Preset:
            </label>
            <select
              value={presetId}
              onChange={(e) => handlePresetChange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-main)',
              }}
            >
              {presetsData.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {currentPreset && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                <Info size={13} color="var(--accent-cyan)" />
                <span>{currentPreset.description}</span>
              </div>
            )}
          </div>

          {/* Event Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Event Title:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.65rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-main)',
              }}
            />
          </div>

          {/* Stadium Attendance */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                Expected Attendance:
              </label>
              <input
                type="number"
                value={attendance}
                onChange={(e) => setAttendance(Number(e.target.value))}
                min={1000}
                max={150000}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-main)',
                }}
              />
            </div>

            {/* Metro Modal Share (A) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  Metro Modal Share:
                </label>
                <span className="badge-assumed">(A)</span>
              </div>
              <input
                type="number"
                step="0.01"
                min="0.05"
                max="0.90"
                value={metroShare}
                onChange={(e) => setMetroShare(Number(e.target.value))}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-main)',
                }}
              />
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                {Math.round(attendance * metroShare).toLocaleString()} estimated egress passengers
              </span>
            </div>
          </div>

          {/* Staff Available and Scheduled End Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                Staff Available for Deployment:
              </label>
              <input
                type="number"
                value={staffAvailable}
                onChange={(e) => setStaffAvailable(Number(e.target.value))}
                min={5}
                max={100}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-main)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                Scheduled Event End Time:
              </label>
              <input
                type="time"
                value={endTimeStr}
                onChange={(e) => setEndTimeStr(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-main)',
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={() => navigate('/')} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Save size={15} />
              <span>Save & Launch Rehearsal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
