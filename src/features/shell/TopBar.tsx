import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { LevelBadge } from './LevelBadge';
import { determineActiveDataLevel } from '../../domain/levels';
import { useRuns, useLiveCounts, useBriefing, useActiveProfile } from '../../db/hooks';
import type { SupportedLang, UserRole } from '../../domain/types';
import {
  Train,
  ShieldCheck,
  User,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  Globe,
  Radio,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentLang,
    theme,
    isOnline,
    activeRole,
    csvStreamActive,
    activeEventId,
    setLanguage,
    setTheme,
    setActiveProfile,
  } = useAppStore();

  const runs = useRuns(activeEventId || undefined);
  const liveCounts = useLiveCounts(activeEventId || undefined);
  const briefing = useBriefing(activeEventId || undefined, currentLang);
  const activeProfile = useActiveProfile();

  // Resolve telemetry level
  const lastCountTs = liveCounts && liveCounts.length > 0 ? liveCounts[0].ts : undefined;
  const hasCachedRun = Boolean(runs && runs.length > 0);
  const hasBriefing = Boolean(briefing);

  const levelInfo = determineActiveDataLevel({
    hasCsvStream: csvStreamActive,
    lastManualCountTs: lastCountTs,
    hasCachedRun,
    hasBriefing,
  });

  const handleRoleToggle = async () => {
    const nextRole: UserRole = activeRole === 'planner' ? 'supervisor' : 'planner';
    const nextProfileId =
      nextRole === 'planner' ? 'profile-planner-ashwin' : 'profile-supervisor-meera';
    await setActiveProfile(nextProfileId, nextRole);
  };

  return (
    <header
      className="top-bar"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.6rem 1.25rem',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Brand & Station Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => navigate('/landing')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            textAlign: 'left',
          }}
          title="Visit Public Showcase Landing Page"
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #E11D48, #0284C7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(225, 29, 72, 0.4)',
            }}
          >
            <Train size={18} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                MetroRehearse
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '0.1rem 0.35rem',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  color: 'var(--accent-cyan)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                }}
              >
                GMRC 2026
              </span>
            </div>
          </div>
        </button>

        {/* Quick Guide access */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => navigate('/help')}
            className="btn-secondary"
            style={{
              fontSize: '0.725rem',
              padding: '0.25rem 0.6rem',
              gap: '0.35rem',
            }}
            title="How to Operate Platform Guide"
          >
            <HelpCircle size={12} color="var(--accent-cyan)" />
            <span>User Guide</span>
          </button>
        </div>

        {/* Station indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.6rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8rem',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--line-north-south)',
              boxShadow: '0 0 8px var(--line-north-south)',
            }}
          />
          <span style={{ fontWeight: 600 }}>Motera Stadium</span>
          <span style={{ color: 'var(--text-subtle)', fontSize: '0.725rem' }}>(NS Line)</span>
        </div>
      </div>

      {/* Center / Telemetry Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <LevelBadge currentLevel={levelInfo.level} />

        {csvStreamActive && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.75rem',
              color: 'var(--status-safe)',
              fontWeight: 600,
              padding: '0.2rem 0.5rem',
              backgroundColor: 'var(--status-safe-bg)',
              borderRadius: '4px',
            }}
          >
            <Radio size={12} className="animate-spin" />
            <span>Sim Feed Active</span>
          </div>
        )}
      </div>

      {/* Right Controls: Role, Lang, Theme, Airplane status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        {/* Role Toggle Switch */}
        <button
          onClick={handleRoleToggle}
          title={`Switch Role (Current: ${activeRole})`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.65rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            fontSize: '0.775rem',
            fontWeight: 600,
            color: activeRole === 'planner' ? 'var(--accent-cyan)' : '#10B981',
          }}
        >
          {activeRole === 'planner' ? <ShieldCheck size={14} /> : <User size={14} />}
          <span>{activeRole === 'planner' ? 'Planner' : 'Supervisor'}</span>
        </button>

        {/* Language Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', backgroundColor: 'var(--bg-surface-elevated)', padding: '0.15rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
          {(['en', 'hi', 'gu'] as SupportedLang[]).map((lng) => (
            <button
              key={lng}
              onClick={() => setLanguage(lng)}
              style={{
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: currentLang === lng ? 800 : 500,
                backgroundColor: currentLang === lng ? 'var(--accent-purple)' : 'transparent',
                color: currentLang === lng ? '#FFFFFF' : 'var(--text-muted)',
              }}
            >
              {lng === 'en' ? 'EN' : lng === 'hi' ? 'हि' : 'ગુ'}
            </button>
          ))}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle Light / Dark Transit Theme"
          style={{
            padding: '0.4rem',
            borderRadius: '6px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Offline / Airplane Ready Status */}
        <div
          title={isOnline ? 'Online (Precached for Offline)' : 'Offline / Airplane Mode Ready'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.725rem',
            fontWeight: 600,
            padding: '0.3rem 0.55rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: isOnline ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.15)',
            color: isOnline ? 'var(--status-safe)' : 'var(--tag-assumed-text)',
            border: `1px solid ${isOnline ? 'rgba(16, 185, 129, 0.3)' : 'var(--tag-assumed-border)'}`,
          }}
        >
          {isOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
          <span>{isOnline ? 'Offline Ready' : 'Airplane Mode'}</span>
        </div>
      </div>
    </header>
  );
};
