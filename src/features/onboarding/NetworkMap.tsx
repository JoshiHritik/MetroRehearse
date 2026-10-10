import React, { useState } from 'react';
import networkData from '../../data/network.json';

interface Props {
  selectedStationId?: string;
  onSelectStation?: (stationId: string) => void;
}

export const NetworkMap: React.FC<Props> = ({
  selectedStationId = 'motera-stadium',
  onSelectStation,
}) => {
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);

  const activeStation = networkData.stations.find(
    (s) => s.id === (hoveredStation || selectedStationId)
  );

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>GMRC Ahmedabad Metro Network</h3>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            Interactive schematic network. Click any station to inspect transit gateway details.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <div style={{ width: '12px', height: '4px', backgroundColor: '#E11D48', borderRadius: '2px' }} />
            <span>North-South Line</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <div style={{ width: '12px', height: '4px', backgroundColor: '#0284C7', borderRadius: '2px' }} />
            <span>East-West Line</span>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox="0 0 600 680"
          style={{ width: '100%', maxWidth: '600px', height: 'auto', display: 'block', margin: '0 auto', background: '#0B1220', borderRadius: '8px' }}
        >
          {/* Grid lines background */}
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            </pattern>
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#E11D48" />
            </filter>
            <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#0284C7" />
            </filter>
          </defs>
          <rect width="600" height="680" fill="url(#grid)" />

          {/* North-South Line Route (Vertical) */}
          <line
            x1="280"
            y1="60"
            x2="280"
            y2="610"
            stroke="#E11D48"
            strokeWidth="8"
            strokeLinecap="round"
            filter="url(#glow-red)"
          />

          {/* East-West Line Route (Horizontal) */}
          <line
            x1="60"
            y1="360"
            x2="520"
            y2="360"
            stroke="#0284C7"
            strokeWidth="8"
            strokeLinecap="round"
            filter="url(#glow-blue)"
          />

          {/* Stations */}
          {networkData.stations.map((st) => {
            const isSelected = st.id === selectedStationId;
            const isHovered = st.id === hoveredStation;
            const isTerminal = st.id === 'motera-stadium';

            return (
              <g
                key={st.id}
                onClick={() => onSelectStation?.(st.id)}
                onMouseEnter={() => setHoveredStation(st.id)}
                onMouseLeave={() => setHoveredStation(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Station circle */}
                <circle
                  cx={st.x}
                  cy={st.y}
                  r={isTerminal ? 11 : st.isInterchange ? 9 : 6}
                  fill={isSelected ? '#38BDF8' : '#0B1220'}
                  stroke={isTerminal ? '#FACC15' : st.isInterchange ? '#FFFFFF' : st.lineIds.includes('ns-red') ? '#E11D48' : '#0284C7'}
                  strokeWidth={isTerminal ? 3.5 : 3}
                />

                {/* Pulsing ring for Motera Stadium */}
                {isTerminal && (
                  <circle
                    cx={st.x}
                    cy={st.y}
                    r="16"
                    fill="none"
                    stroke="#FACC15"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.7"
                  />
                )}

                {/* Station label */}
                <text
                  x={
                    st.lineIds.includes('ew-blue') && !st.isInterchange
                      ? st.x
                      : st.x + (st.x > 300 ? -16 : 18)
                  }
                  y={
                    st.isInterchange
                      ? st.y - 16
                      : st.lineIds.includes('ew-blue')
                      ? (st.x === 130 || st.x === 440 ? st.y + 24 : st.y - 14)
                      : st.y + 4
                  }
                  textAnchor={
                    st.isInterchange
                      ? 'middle'
                      : st.lineIds.includes('ew-blue')
                      ? 'middle'
                      : st.x > 300
                      ? 'end'
                      : 'start'
                  }
                  fill={isSelected || isHovered ? '#38BDF8' : '#F1F5F9'}
                  fontSize={isTerminal ? '12' : st.isInterchange ? '11' : '10'}
                  fontWeight={isTerminal || st.isInterchange ? '800' : '500'}
                  fontFamily="system-ui"
                >
                  {st.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Station Info Footer */}
      {activeStation && (
        <div
          style={{
            marginTop: '0.75rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                {activeStation.name}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {activeStation.nameGu}
              </span>
              {activeStation.isInterchange && (
                <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', backgroundColor: 'var(--accent-blue)', color: '#FFF' }}>
                  Central Interchange
                </span>
              )}
            </div>
            {activeStation.description && (
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {activeStation.description}
              </p>
            )}
          </div>
          <span className="badge-assumed">(A) Verified GMRC Map</span>
        </div>
      )}
    </div>
  );
};
