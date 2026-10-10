import React, { useState, useEffect } from 'react';
import { useParams as useDbParams } from '../../db/hooks';
import { db } from '../../db/schema';
import defaultAssumptions from '../../data/assumptions.default.json';
import { Layers, Save, RotateCcw, Check, AlertTriangle } from 'lucide-react';
import type { Params, ParamValue } from '../../domain/types';

const PARAM_LABELS: Record<string, string> = {
  metroShare: 'Metro Modal Split',
  gateBaseRate: 'Turnstile Base Rate',
  gateStaffBonus: 'Gate Marshal Assistance Bonus',
  maxStaffGateBonus: 'Max Gate Marshal Bonus',
  platformAreaM2: 'Clear Platform Usable Area',
  safeDensity: 'Safe Holding Density (LoS D)',
  meteringDensityTrigger: 'Metering Hold Trigger (LoS E)',
  criticalDensity: 'Critical Crush Density (LoS F)',
  trainCapacity: 'Trainset Nominal Capacity',
  freeShareOnArrival: 'Train Vacancy on Arrival',
  stairEscalatorRate: 'Stairs & Escalator Throughput',
  concourseDwellSec: 'Mean Concourse Dwell Time',
};

const formatParamLabel = (k: string) =>
  PARAM_LABELS[k] || k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());

export const AssumptionsEditor: React.FC = () => {
  const currentParams = useDbParams(defaultAssumptions.id);
  const [paramsState, setParamsState] = useState<Record<string, ParamValue>>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (currentParams?.values) {
      setParamsState(currentParams.values);
    } else {
      setParamsState(defaultAssumptions.values);
    }
  }, [currentParams]);

  const handleChangeValue = (key: string, val: number) => {
    setParamsState((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value: val,
      },
    }));
    setSavedSuccess(false);
  };

  const handleSave = async () => {
    const updated: Params = {
      id: defaultAssumptions.id,
      label: defaultAssumptions.label,
      values: paramsState,
    };
    await db.params.put(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = async () => {
    if (window.confirm('Reset all parameters to default GMRC calibrated baseline assumptions?')) {
      await db.params.put({
        id: defaultAssumptions.id,
        label: defaultAssumptions.label,
        values: defaultAssumptions.values,
      });
      setParamsState(defaultAssumptions.values);
      setSavedSuccess(true);
    }
  };

  return (
    <div style={{ padding: '1.25rem', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
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
            <Layers size={22} color="var(--accent-cyan)" />
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Model Assumptions & Station Geometry</h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Numbers marked <span className="badge-assumed">(A)</span> are editable placeholder assumptions, not measured sensor facts.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={handleReset} className="btn-secondary" style={{ fontSize: '0.825rem' }}>
            <RotateCcw size={14} />
            <span>Reset to Baseline</span>
          </button>

          <button onClick={handleSave} className="btn-primary" style={{ fontSize: '0.85rem' }}>
            {savedSuccess ? <Check size={15} /> : <Save size={15} />}
            <span>{savedSuccess ? 'Saved' : 'Save Parameters'}</span>
          </button>
        </div>
      </div>

      {/* Assumptions Table Panel */}
      <div className="glass-panel" style={{ padding: '1.25rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-medium)', textAlign: 'left', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.6rem 0.75rem' }}>Parameter</th>
              <th style={{ padding: '0.6rem 0.75rem', width: '120px' }}>Value</th>
              <th style={{ padding: '0.6rem 0.75rem', width: '100px' }}>Unit</th>
              <th style={{ padding: '0.6rem 0.75rem', width: '60px' }}>Flag</th>
              <th style={{ padding: '0.6rem 0.75rem' }}>Operational Rationale / Note</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(paramsState).map(([key, item]) => (
              <tr key={key} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  <div>{formatParamLabel(key)}</div>
                  <div style={{ fontSize: '0.725rem', fontFamily: 'var(--font-mono)', color: 'var(--text-subtle)', fontWeight: 400 }}>
                    {key}
                  </div>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <input
                    type="number"
                    step="any"
                    value={item.value}
                    onChange={(e) => handleChangeValue(key, Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '0.35rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--accent-cyan)',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                    }}
                  />
                </td>
                <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                  {item.unit}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  {item.assumed && <span className="badge-assumed">(A)</span>}
                </td>
                <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {item.note || 'Calibrated transit assumption.'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
