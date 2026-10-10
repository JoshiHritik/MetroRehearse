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

      // Clear Canvas
      ctx.fillStyle = '#0B1220';
      ctx.fillRect(0, 0, width, height);

      // Grid background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
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
      ctx.fillStyle = 'rgba(30, 41, 59, 0.6)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.roundRect(20, forecourtY, width - 40, forecourtH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#94A3B8';
      ctx.font = '600 11px system-ui';
      ctx.fillText('STADIUM FORECOURT & SECURITY CHECK', 32, forecourtY + 22);

      // Draw forecourt crowd particles
      const forecourtPaxCount = Math.min(60, Math.max(5, Math.round(gateQueue / 40)));
      for (let i = 0; i < forecourtPaxCount; i++) {
        const px = 40 + ((i * 37 + particleOffset * 2) % (width - 100));
        const py = forecourtY + 30 + ((i * 19) % 25);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- ZONE 2: CONCOURSE & AFC FARE GATES ---
      const concourseY = 95;
      const concourseH = 95;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.roundRect(20, concourseY, width - 40, concourseH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#94A3B8';
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

        // Gate frame
        ctx.fillStyle = isOpen
          ? isThrottled
            ? 'rgba(245, 158, 11, 0.2)'
            : 'rgba(16, 185, 129, 0.2)'
          : 'rgba(239, 68, 68, 0.15)';
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
        ctx.fillStyle = isOpen ? (isThrottled ? '#FBBF24' : '#34D399') : '#F87171';
        ctx.font = '700 9px monospace';
        ctx.fillText(`G${g + 1}`, gx + 8, gy + 15);

        ctx.font = '600 8px system-ui';
        ctx.fillText(
          isOpen ? (isThrottled ? 'HOLD' : 'OPEN') : 'CLOSED',
          gx + 6,
          gy + 27
        );

        // Flowing particles through open gates
        if (isOpen && !isThrottled) {
          const flowPy = gy + 8 + ((particleOffset * 2) % 20);
          ctx.fillStyle = '#38BDF8';
          ctx.beginPath();
          ctx.arc(gx + gateWidth / 2, flowPy, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // --- ZONE 3: STAIRS & ESCALATORS ---
      const stairsY = 205;
      const stairsH = 45;
      ctx.fillStyle = 'rgba(30, 41, 59, 0.5)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.roundRect(width / 2 - 120, stairsY, 240, stairsH, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#64748B';
      ctx.font = '600 10px system-ui';
      ctx.fillText('STAIRS & ESCALATORS (DOWN TO PLATFORM)', width / 2 - 105, stairsY + 16);

      // Escalator chevrons
      const chevronY = stairsY + 28;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
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
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 11px system-ui';
      ctx.fillText('PLATFORM 1 — SOUTHBOUND (APMC / OLD HIGH COURT)', 32, platY + 22);

      // Real-time density pill
      ctx.fillStyle = densityColor;
      ctx.font = '700 12px monospace';
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
        ctx.fillStyle = densityColor;
        ctx.beginPath();
        ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Platform Edge tactile yellow line
      ctx.strokeStyle = '#FACC15';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(25, platY + platH - 6);
      ctx.lineTo(width - 25, platY + platH - 6);
      ctx.stroke();
      ctx.setLineDash([]);

      // --- ZONE 5: METRO TRACK & TRAIN ---
      const trackY = platY + platH + 12;
      const trackH = 40;

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
        ctx.fillStyle = '#1E293B';
        ctx.strokeStyle = 'var(--line-north-south)';
        ctx.lineWidth = 2;
        ctx.roundRect(60, trackY + 4, width - 120, trackH - 8, 6);
        ctx.fill();
        ctx.stroke();

        // Train livery red stripe
        ctx.fillStyle = '#E11D48';
        ctx.fillRect(60, trackY + 14, width - 120, 6);

        // Open doors
        ctx.fillStyle = '#10B981';
        for (let d = 0; d < 6; d++) {
          const dx = 100 + d * ((width - 200) / 5);
          ctx.fillRect(dx, trackY + 6, 18, trackH - 12);
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '700 10px system-ui';
        ctx.fillText('3-CAR RAKE DOCKED — PASSENGERS BOARDING', width / 2 - 110, trackY + 22);
      } else {
        ctx.fillStyle = '#64748B';
        ctx.font = '500 10px system-ui';
        ctx.fillText('TRACK 1 CLEAR — NEXT SOUTHBOUND RAKE EN ROUTE', width / 2 - 120, trackY + 24);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [currentMinute, density, gateQueue, gatesOpen, meteringActive, trainAtPlatform]);

  return (
    <div className="glass-panel" style={{ padding: '1rem', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent-cyan)' }} />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Motera Stadium Concourse & Platform 2D</h3>
        </div>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.775rem' }}>
          <span style={{ color: '#10B981' }}>● Safe &lt;3.0</span>
          <span style={{ color: '#F59E0B' }}>● Caution 3.0-4.5</span>
          <span style={{ color: '#EF4444' }}>● Critical &gt;4.5 pax/m²</span>
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
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        />
      </div>
    </div>
  );
};
