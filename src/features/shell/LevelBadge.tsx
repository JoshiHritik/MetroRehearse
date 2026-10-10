import React, { useState } from 'react';
import { DATA_LEVELS, type DataLevel } from '../../domain/levels';
import { Database, Info, X } from 'lucide-react';

interface Props {
  currentLevel: DataLevel;
}

export const LevelBadge: React.FC<Props> = ({ currentLevel }) => {
  const [showModal, setShowModal] = useState(false);
  const info = DATA_LEVELS[currentLevel];

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="level-badge-btn"
        title="Telemetry Data Level - Click for Tier Architecture"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.65rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.75rem',
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
          backgroundColor: info.badgeBg,
          color: info.badgeColor,
          border: `1px solid ${info.badgeColor}40`,
        }}
      >
        <Database size={13} />
        <span>{info.code}</span>
      </button>

      {showModal && (
        <div
          className="modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '520px',
              width: '100%',
              padding: '1.5rem',
              backgroundColor: 'var(--bg-surface)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Info size={18} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Telemetry Data Tiers (L0 - L3)</h3>
              </div>
              <button onClick={() => setShowModal(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              MetroRehearse dynamically selects the highest operational fidelity level available on the station device.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {([0, 1, 2, 3] as DataLevel[]).map((lvl) => {
                const item = DATA_LEVELS[lvl];
                const isActive = lvl === currentLevel;
                return (
                  <div
                    key={lvl}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${isActive ? item.badgeColor : 'var(--border-subtle)'}`,
                      backgroundColor: isActive ? item.badgeBg : 'var(--bg-surface-elevated)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: item.badgeColor }}>
                        {item.name}
                      </span>
                      {isActive && (
                        <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: item.badgeColor, color: '#000', fontWeight: 800 }}>
                          ACTIVE TIER
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.description}</p>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
              <button className="btn-primary" onClick={() => setShowModal(false)} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
