import React from 'react';

export const RehearseSvgTitle: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '1300px', margin: '0 auto' }}>
      <svg
        viewBox="0 0 1200 240"
        style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        aria-label="REHEARSE"
      >
        <defs>
          {/* Mask containing the giant word REHEARSE */}
          <mask id="rehearseMask">
            <rect width="1200" height="240" fill="#000000" />
            <text
              x="50%"
              y="205"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="230"
              fontWeight="950"
              fontFamily="'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
              letterSpacing="-0.04em"
            >
              REHEARSE
            </text>
          </mask>

          {/* Glowing filters for transit tracks */}
          <filter id="trackGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Crowd dot pattern */}
          <pattern id="crowdDots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="2" fill="#F97316" opacity="0.65" />
            <circle cx="15" cy="8" r="2.5" fill="#EC4899" opacity="0.7" />
            <circle cx="10" cy="16" r="1.8" fill="#A855F7" opacity="0.8" />
            <circle cx="18" cy="17" r="1.5" fill="#FBBF24" opacity="0.75" />
          </pattern>
        </defs>

        {/* Content visible inside REHEARSE letterforms via mask */}
        <g mask="url(#rehearseMask)">
          {/* Deep transit purple base background */}
          <rect width="1200" height="240" fill="#200E3D" />

          {/* Dense crowd dots cluster in background */}
          <rect width="1200" height="240" fill="url(#crowdDots)" />

          {/* Background darker route corridors */}
          <path
            d="M 20 60 L 1180 60"
            stroke="#3B1768"
            strokeWidth="18"
            fill="none"
          />
          <path
            d="M 20 180 L 1180 180"
            stroke="#3B1768"
            strokeWidth="18"
            fill="none"
          />
          <path
            d="M 120 0 L 120 240 M 340 0 L 340 240 M 520 0 L 520 240 M 740 0 L 740 240 M 920 0 L 920 240 M 1100 0 L 1100 240"
            stroke="#3B1768"
            strokeWidth="18"
            fill="none"
          />

          {/* MAIN TRANSIT NETWORK LINES (Identical to Image 1) */}
          {/* 1. Vibrant Magenta / Pink Line */}
          <path
            d="M 50 140 C 180 140, 220 70, 340 70 C 460 70, 500 160, 620 160 C 740 160, 800 50, 930 50 C 1040 50, 1080 140, 1160 140"
            stroke="#EC4899"
            strokeWidth="11"
            fill="none"
            strokeLinecap="round"
            filter="url(#trackGlow)"
          />

          {/* 2. Bold Orange Red Line */}
          <path
            d="M 80 200 C 160 200, 210 110, 310 110 C 420 110, 470 210, 580 210 C 690 210, 750 100, 860 100 C 970 100, 1020 180, 1140 180"
            stroke="#F97316"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            filter="url(#trackGlow)"
          />

          {/* 3. Deep Indigo / Purple Line */}
          <path
            d="M 30 90 C 150 90, 240 180, 360 180 C 480 180, 540 80, 670 80 C 790 80, 870 190, 990 190 C 1070 190, 1120 110, 1180 110"
            stroke="#A855F7"
            strokeWidth="11"
            fill="none"
            strokeLinecap="round"
          />

          {/* 4. Sapphire Blue / Cyan Line */}
          <path
            d="M 40 40 L 400 40 C 460 40, 510 120, 580 120 L 850 120 C 910 120, 960 40, 1040 40 L 1170 40"
            stroke="#38BDF8"
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
          />

          {/* Vertical / Diagonal Transit Chords */}
          <path
            d="M 280 10 L 280 230 M 460 10 L 460 230 M 710 10 L 710 230 M 890 10 L 890 230"
            stroke="#F97316"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 180 230 C 230 180, 230 100, 320 50 M 640 230 C 700 160, 760 120, 840 40"
            stroke="#EC4899"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />

          {/* Stations & Hub Circles */}
          {[
            { cx: 120, cy: 140, r: 8, fill: '#FFFFFF', s: '#F97316' },
            { cx: 280, cy: 110, r: 10, fill: '#FFFFFF', s: '#EC4899' },
            { cx: 340, cy: 70, r: 8, fill: '#FBBF24', s: '#F97316' },
            { cx: 460, cy: 110, r: 10, fill: '#FFFFFF', s: '#38BDF8' },
            { cx: 580, cy: 120, r: 9, fill: '#FFFFFF', s: '#F97316' },
            { cx: 710, cy: 160, r: 9, fill: '#FBBF24', s: '#A855F7' },
            { cx: 860, cy: 100, r: 11, fill: '#FFFFFF', s: '#F97316' },
            { cx: 990, cy: 190, r: 8, fill: '#FFFFFF', s: '#EC4899' },
            { cx: 1040, cy: 40, r: 9, fill: '#FBBF24', s: '#38BDF8' },
          ].map((st, i) => (
            <g key={i}>
              <circle cx={st.cx} cy={st.cy} r={st.r + 4} fill="none" stroke={st.s} strokeWidth="2.5" />
              <circle cx={st.cx} cy={st.cy} r={st.r} fill={st.fill} />
            </g>
          ))}

          {/* Crowd Passenger Clusters */}
          {Array.from({ length: 90 }).map((_, idx) => {
            const x = 50 + (idx * 37) % 1100;
            const y = 30 + (idx * 23) % 180;
            const colors = ['#F97316', '#FBBF24', '#EC4899', '#A855F7', '#FFFFFF'];
            const fill = colors[idx % colors.length];
            return (
              <circle
                key={idx}
                cx={x}
                cy={y}
                r={2.5 + (idx % 3)}
                fill={fill}
                opacity={0.8}
              />
            );
          })}
        </g>

        {/* Technical registration marks in corners */}
        <text x="15" y="30" fill="rgba(0,0,0,0.25)" fontSize="16" fontFamily="monospace">⌜</text>
        <text x="1170" y="30" fill="rgba(0,0,0,0.25)" fontSize="16" fontFamily="monospace">⌝</text>
        <text x="15" y="235" fill="rgba(0,0,0,0.25)" fontSize="16" fontFamily="monospace">⌞</text>
        <text x="1170" y="235" fill="rgba(0,0,0,0.25)" fontSize="16" fontFamily="monospace">⌟</text>
        <text x="400" y="25" fill="rgba(0,0,0,0.25)" fontSize="14" fontFamily="monospace">+</text>
        <text x="800" y="25" fill="rgba(0,0,0,0.25)" fontSize="14" fontFamily="monospace">+</text>

        {/* Connecting decorative arcs below REHEARSE linking to #1,95,868 */}
        <path
          d="M 580 20 C 520 120, 460 210, 440 260"
          stroke="rgba(109, 40, 217, 0.35)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 600 0 C 510 140, 480 220, 470 270"
          stroke="rgba(234, 88, 12, 0.4)"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>

      {/* Physical Signal Head Graphic hovering on right of E */}
      <div className="lp-signal-head">
        <div className="lp-signal-light top" />
        <div className="lp-signal-light mid" />
        <div className="lp-signal-light bot" />
        <span style={{ fontSize: '7px', color: '#71717A', fontFamily: 'monospace', marginTop: '2px' }}>
          C9090
        </span>
        <div className="lp-signal-badge">
          CROWD<br />RUN
        </div>
      </div>
    </div>
  );
};

export const ConfettiBannerArt: React.FC<{ height?: number; title?: string }> = ({
  height = 90,
  title,
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: `${height}px`,
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #EA580C, #C2410C)',
      }}
    >
      <svg
        viewBox="0 0 1400 90"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          <radialGradient id="bubbleGrad1" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#EA580C" />
          </radialGradient>
          <radialGradient id="bubbleGrad2" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#7E22CE" />
          </radialGradient>
          <radialGradient id="bubbleGrad3" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FED7AA" />
            <stop offset="100%" stopColor="#C2410C" />
          </radialGradient>
        </defs>

        {/* Hundreds of festive crowd bubbles in warm orange, magenta, violet */}
        {Array.from({ length: 140 }).map((_, i) => {
          const cx = (i * 23) % 1400;
          const cy = (i * 17) % 90;
          const r = 5 + (i % 7) * 3;
          const fill = i % 3 === 0 ? 'url(#bubbleGrad1)' : i % 3 === 1 ? 'url(#bubbleGrad2)' : 'url(#bubbleGrad3)';
          const opacity = 0.5 + (i % 5) * 0.1;
          return <circle key={i} cx={cx} cy={cy} r={r} fill={fill} opacity={opacity} />;
        })}
      </svg>
    </div>
  );
};
