import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';

interface Props {
  currentMinute: number;
  onMinuteChange: (min: number) => void;
  maxMinute?: number;
  eventEndEpoch?: number;
}

export const Scrubber: React.FC<Props> = ({
  currentMinute,
  onMinuteChange,
  maxMinute = 180,
  eventEndEpoch,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 2>(1);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      onMinuteChange(currentMinute >= maxMinute ? 0 : currentMinute + 1);
    }, 400 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, currentMinute, maxMinute, speed, onMinuteChange]);

  const calcWallClock = (min: number) => {
    if (!eventEndEpoch) return `T+${min}m`;
    const target = new Date(eventEndEpoch + min * 60000);
    return target.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
      }}
    >
      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="btn-primary"
          style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%' }}
          title={isPlaying ? 'Pause Simulation Timeline' : 'Play Timeline'}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <button
          onClick={() => {
            setIsPlaying(false);
            onMinuteChange(0);
          }}
          className="btn-secondary"
          style={{ width: '34px', height: '34px', padding: 0, borderRadius: '50%' }}
          title="Reset to T+00"
        >
          <RotateCcw size={14} />
        </button>

        <button
          onClick={() => setSpeed(speed === 1 ? 2 : 1)}
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            backgroundColor: speed === 2 ? 'var(--accent-blue)' : 'var(--bg-surface-elevated)',
            color: speed === 2 ? '#FFFFFF' : 'var(--text-muted)',
            border: '1px solid var(--border-subtle)',
          }}
          title="Playback Speed"
        >
          {speed}x
        </button>
      </div>

      {/* Clock Display */}
      <div style={{ minWidth: '110px' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Time Elapsed
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
          T+{currentMinute}m <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>({calcWallClock(currentMinute)})</span>
        </div>
      </div>

      {/* Slider Bar */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-subtle)' }}>0m</span>
        <input
          type="range"
          min={0}
          max={maxMinute}
          step={1}
          value={currentMinute}
          onChange={(e) => onMinuteChange(Number(e.target.value))}
          style={{
            flex: 1,
            accentColor: 'var(--accent-cyan)',
            cursor: 'pointer',
            height: '6px',
          }}
        />
        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-subtle)' }}>{maxMinute}m</span>
      </div>
    </div>
  );
};
