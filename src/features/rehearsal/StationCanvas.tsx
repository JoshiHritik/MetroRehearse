import React, { useEffect, useRef } from 'react';
import type { Plan } from '../../domain/types';
import { getDensityColor } from '../../domain/format';

interface Props {
  currentMinute: number;
  density: number;
  gateQueue: number;
  gatesOpen: number;
  meteringActive: boolean;
  trainAtPlatform: boolean;
  plan?: Plan | null;
}

export const StationCanvas: React.FC<Props> = ({
  currentMinute,
  density,
  gateQueue,
  gatesOpen,
  meteringActive,
  trainAtPlatform,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particleOffset = 0;

    const render = () => {
      particleOffset = (particleOffset + 1) % 100;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Radar Midnight Canvas Base
      ctx.fillStyle = '#080E1A';
      ctx.fillRect(0, 0, width, height);

      // 2. Blueprint / Radar Structural Grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // --- ZONE 1: STADIUM APPROACH & FORECOURT ---
      const forecourtY = 15;
      const forecourtH = 65;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = 1;
      ctx.roundRect(20, forecourtY, width - 40, forecourtH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38BDF8';
      ctx.font = '700 11px system-ui';
      ctx.fillText('STADIUM FORECOURT & SECURITY CHECK', 32, forecourtY + 22);

      // Draw forecourt crowd particles
      const forecourtPaxCount = Math.min(60, Math.max(5, Math.round(gateQueue / 40)));
      for (let i = 0; i < forecourtPaxCount; i++) {
        const px = 40 + ((i * 37 + particleOffset * 2) % (width - 100));
        const py = forecourtY + 32 + ((i * 19) % 22);
        ctx.beginPath();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- ZONE 2: CONCOURSE & AFC FARE GATES ---
      const concourseY = 95;
      const concourseH = 95;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 1;
      ctx.roundRect(20, concourseY, width - 40, concourseH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38BDF8';
      ctx.font = '700 11px system-ui';
      ctx.fillText('CONCOURSE TICKETING & AFC TURNSTILES', 32, concourseY + 20);

      // Gate Line representation (8 turnstiles)
      const totalGates = 8;
      const gateWidth = 44;
      const gateGap = 14;
      const gateStartX = (width - (totalGates * gateWidth + (totalGates - 1) * gateGap)) / 2;

      for (let g = 0; g < totalGates; g++) {
        const gx = gateStartX + g * (gateWidth + gateGap);
        const gy = concourseY + 36;
        const isOpen = g < gatesOpen;
        const isThrottled = isOpen && meteringActive;

        // Gate frame - beginPath avoids compounding path bug
        ctx.beginPath();
        ctx.fillStyle = isOpen
          ? isThrottled
            ? 'rgba(245, 158, 11, 0.15)'
            : 'rgba(16, 185, 129, 0.15)'
          : 'rgba(239, 68, 68, 0.12)';
        ctx.strokeStyle = isOpen
          ? isThrottled
            ? '#F59E0B'
            : '#10B981'
          : '#EF4444';
        ctx.lineWidth = 1.5;
        ctx.roundRect(gx, gy, gateWidth, 34, 4);
        ctx.fill();
        ctx.stroke();

        // Gate label & indicator
        ctx.fillStyle = isOpen ? (isThrottled ? '#FCD34D' : '#34D399') : '#F87171';
        ctx.font = '800 10px monospace';
        ctx.fillText(`G${g + 1}`, gx + 8, gy + 15);

        ctx.font = '700 8.5px monospace';
        ctx.fillText(
          isOpen ? (isThrottled ? 'HOLD' : 'OPEN') : 'CLOSED',
          gx + 6,
          gy + 27
        );

        // Flowing particles through open gates
        if (isOpen && !isThrottled) {
          const flowPy = gy + 8 + ((particleOffset * 2) % 20);
          ctx.beginPath();
          ctx.fillStyle = '#38BDF8';
          ctx.arc(gx + gateWidth / 2, flowPy, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // --- ZONE 3: STAIRS & ESCALATORS ---
      const stairsY = 205;
      const stairsH = 45;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 1;
      ctx.roundRect(width / 2 - 120, stairsY, 240, stairsH, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#94A3B8';
      ctx.font = '700 10px system-ui';
      ctx.fillText('STAIRS & ESCALATORS (DOWN TO PLATFORM)', width / 2 - 105, stairsY + 16);

      // Escalator chevrons
      const chevronY = stairsY + 28;
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      for (let c = 0; c < 5; c++) {
        const cx = width / 2 - 50 + c * 25;
        const cy = chevronY + ((particleOffset + c * 8) % 12);
        ctx.beginPath();
        ctx.moveTo(cx - 6, cy - 4);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx + 6, cy - 4);
        ctx.stroke();
      }

      // --- ZONE 4: ISLAND PLATFORM 1 (SOUTHBOUND) ---
      const platY = 265;
      const platH = 100;
      const densityColor = getDensityColor(density);

      // Platform floor with density color glow
      ctx.beginPath();
      const platGrad = ctx.createLinearGradient(0, platY, 0, platY + platH);
      platGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
      platGrad.addColorStop(1, `${densityColor}22`);

      ctx.fillStyle = platGrad;
      ctx.strokeStyle = densityColor;
      ctx.lineWidth = 2;
      ctx.roundRect(20, platY, width - 40, platH, 8);
      ctx.fill();
      ctx.stroke();

      // Platform header & density meter
      ctx.fillStyle = '#F8FAFC';
      ctx.font = '800 11px system-ui';
      ctx.fillText('PLATFORM 1 — SOUTHBOUND (APMC / OLD HIGH COURT)', 32, platY + 22);

      // Real-time density pill
      ctx.fillStyle = densityColor;
      ctx.font = '800 12px monospace';
      ctx.fillText(
        `${density.toFixed(2)} pax/m² ${density > 4.5 ? 'CRITICAL CRUSH' : density > 3.0 ? 'CAUTION' : 'SAFE'}`,
        width - 240,
        platY + 22
      );

      // Platform crowd distribution dots
      const numPlatformDots = Math.min(180, Math.round(density * 30));
      for (let i = 0; i < numPlatformDots; i++) {
        const dx = 40 + ((i * 47) % (width - 80));
        const dy = platY + 36 + ((i * 29) % (platH - 45));
        ctx.beginPath();
        ctx.fillStyle = densityColor;
        ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Platform Edge tactile yellow line
      ctx.beginPath();
      ctx.strokeStyle = '#FACC15';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 6]);
      ctx.moveTo(25, platY + platH - 6);
      ctx.lineTo(width - 25, platY + platH - 6);
      ctx.stroke();
      ctx.setLineDash([]);

      // --- ZONE 5: METRO TRACK & TRAIN ---
      const trackY = platY + platH + 12;

      // Track rails
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(10, trackY + 12);
      ctx.lineTo(width - 10, trackY + 12);
      ctx.moveTo(10, trackY + 28);
      ctx.lineTo(width - 10, trackY + 28);
      ctx.stroke();

      // Train car if at platform
      if (trainAtPlatform) {
        ctx.beginPath();
        ctx.fillStyle = '#1E293B';
        ctx.strokeStyle = '#0284C7';
        ctx.lineWidth = 2;
        ctx.roundRect(40, trackY + 6, width - 80, 28, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#38BDF8';
        ctx.font = '800 10px monospace';
        ctx.fillText('GMRC 4-CAR RAKE DOCKED — BOARDING IN PROGRESS', width / 2 - 135, trackY + 23);
      } else {
        ctx.fillStyle = '#64748B';
        ctx.font = '600 9px monospace';
        ctx.fillText('TRACK 1 CLEAR — NEXT SOUTHBOUND RAKE EN ROUTE', width / 2 - 125, trackY + 23);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [currentMinute, density, gateQueue, gatesOpen, meteringActive, trainAtPlatform]);

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.25rem',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent-purple)', boxShadow: '0 0 8px var(--accent-purple)' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
            Motera Stadium Concourse & Platform 2D
          </h3>
        </div>
        <div style={{ display: 'flex', gap: '0.65rem', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
          <span className="status-pill" style={{ backgroundColor: 'var(--status-safe-bg)', color: 'var(--status-safe)', border: '1px solid var(--status-safe-border)' }}>
            <span className="status-dot" style={{ backgroundColor: '#10B981' }} />
            Safe &lt;3.0
          </span>
          <span className="status-pill" style={{ backgroundColor: 'var(--status-caution-bg)', color: 'var(--status-caution)', border: '1px solid var(--status-caution-border)' }}>
            <span className="status-dot" style={{ backgroundColor: '#F97316' }} />
            Caution 3.0-4.5
          </span>
          <span className="status-pill" style={{ backgroundColor: 'var(--status-critical-bg)', color: 'var(--status-critical)', border: '1px solid var(--status-critical-border)' }}>
            <span className="status-dot" style={{ backgroundColor: '#DC2626' }} />
            Critical &gt;4.5 pax/m²
          </span>
        </div>
      </div>

      <div style={{ width: '100%', overflowX: 'auto' }}>
        <canvas
          ref={canvasRef}
          width={760}
          height={435}
          style={{
            width: '100%',
            maxWidth: '760px',
            height: 'auto',
            display: 'block',
            margin: '0 auto',
            borderRadius: '10px',
            border: '1px solid #1E293B',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
          }}
        />
      </div>
    </div>
  );
};
