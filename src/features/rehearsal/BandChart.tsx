import React from 'react';
import type { DensityBandPoint } from '../../domain/types';

interface Props {
  bands: DensityBandPoint[];
  currentMinute: number;
  onSeek: (minute: number) => void;
  criticalThreshold?: number;
  safeThreshold?: number;
}

export const BandChart: React.FC<Props> = ({
  bands,
  currentMinute,
  onSeek,
  criticalThreshold = 4.5,
  safeThreshold = 3.0,
}) => {
  if (!bands || bands.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No simulation band data available. Run simulation to populate.
      </div>
    );
  }

  const width = 760;
  const height = 220;
  const padLeft = 45;
  const padRight = 25;
  const padTop = 20;
  const padBottom = 30;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const maxT = 180;
  const maxDensity = 6.0;

  const getX = (t: number) => padLeft + (t / maxT) * chartW;
  const getY = (d: number) => padTop + chartH - (Math.min(maxDensity, Math.max(0, d)) / maxDensity) * chartH;

  // Build SVG polygon for q10 to q90 uncertainty band
  const bandPointsTop: string[] = [];
  const bandPointsBottom: string[] = [];
  const medianPoints: string[] = [];

  for (const pt of bands) {
    const x = getX(pt.t);
    const yTop = getY(pt.q90);
    const yBottom = getY(pt.q10);
    const yMed = getY(pt.q50);

    bandPointsTop.push(`${x},${yTop}`);
    bandPointsBottom.unshift(`${x},${yBottom}`);
    medianPoints.push(`${x},${yMed}`);
  }

  const bandPolygon = [...bandPointsTop, ...bandPointsBottom].join(' ');
  const medianPath = `M ${medianPoints.join(' L ')}`;

  // Scrubber vertical line X
  const scrubberX = getX(currentMinute);

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = (clickX - padLeft) / chartW;
    const minute = Math.round(Math.max(0, Math.min(maxT, ratio * maxT)));
    onSeek(minute);
  };

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block', cursor: 'crosshair', userSelect: 'none' }}
        onClick={handleSvgClick}
      >
        {/* Background */}
        <rect x="0" y="0" width={width} height={height} fill="transparent" />

        {/* Grid lines */}
        {[1.0, 2.0, 3.0, 4.0, 5.0].map((d) => {
          const y = getY(d);
          return (
            <g key={d}>
              <line x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="3 3" />
              <text x={padLeft - 8} y={y + 4} fill="#64748B" fontSize="10" textAnchor="end" fontFamily="monospace">
                {d.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* Time X-axis ticks */}
        {[0, 30, 60, 90, 120, 150, 180].map((t) => {
          const x = getX(t);
          return (
            <g key={t}>
              <line x1={x} y1={padTop} x2={x} y2={height - padBottom} stroke="rgba(255, 255, 255, 0.04)" />
              <text x={x} y={height - padBottom + 16} fill="#64748B" fontSize="10" textAnchor="middle" fontFamily="monospace">
                T+{t}m
              </text>
            </g>
          );
        })}

        {/* Critical Threshold Line (4.5) */}
        <line
          x1={padLeft}
          y1={getY(criticalThreshold)}
          x2={width - padRight}
          y2={getY(criticalThreshold)}
          stroke="#EF4444"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <text x={width - padRight} y={getY(criticalThreshold) - 4} fill="#EF4444" fontSize="9" fontWeight="bold" textAnchor="end">
          CRUSH THRESHOLD (4.5)
        </text>

        {/* Safe Threshold Line (3.0) */}
        <line
          x1={padLeft}
          y1={getY(safeThreshold)}
          x2={width - padRight}
          y2={getY(safeThreshold)}
          stroke="#10B981"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <text x={width - padRight} y={getY(safeThreshold) - 4} fill="#10B981" fontSize="9" fontWeight="bold" textAnchor="end">
          SAFE LIMIT (3.0)
        </text>

        {/* Uncertainty Band (q10 to q90) */}
        <polygon points={bandPolygon} fill="rgba(56, 189, 248, 0.15)" stroke="none" />

        {/* Median Line (q50) */}
        <path d={medianPath} fill="none" stroke="#38BDF8" strokeWidth="2.5" />

        {/* Scrubber vertical bar */}
        <line
          x1={scrubberX}
          y1={padTop}
          x2={scrubberX}
          y2={height - padBottom}
          stroke="#FBBF24"
          strokeWidth="2"
        />
        <circle cx={scrubberX} cy={padTop + 4} r="4" fill="#FBBF24" />
      </svg>
    </div>
  );
};
