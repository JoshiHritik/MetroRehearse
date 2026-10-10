import React from 'react';
import { useProfiles, useActiveProfile } from '../../db/hooks';
import { useAppStore } from '../../store/appStore';
import { resetDemoData } from '../../db/reset';
import { Settings as SettingsIcon, User, Globe, Sun, Moon, RotateCcw } from 'lucide-react';
import type { SupportedLang, UserRole } from '../../domain/types';

export const Settings: React.FC = () => {
  const profiles = useProfiles();
  const activeProfile = useActiveProfile();
  const { currentLang, theme, setLanguage, setTheme, setActiveProfile } = useAppStore();

  const handleProfileChange = async (profileId: string) => {
    const prof = profiles?.find((p) => p.id === profileId);
    if (prof) {
      await setActiveProfile(prof.id, prof.role);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset all demo data and restore defaults?')) {
      await resetDemoData();
      alert('Demo data reset.');
    }
  };

  return (
    <div style={{ padding: '1.25rem', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <SettingsIcon size={22} color="var(--accent-cyan)" />
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Operator & Station Settings</h1>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Manage local device profile, language, display theme, and offline configuration.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Active Profile */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            Active Profile:
          </label>
          <select
            value={activeProfile?.id || ''}
            onChange={(e) => handleProfileChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-main)',
            }}
          >
            {profiles?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.role === 'planner' ? 'Senior Operations Planner' : 'Concourse Supervisor'})
              </option>
            ))}
          </select>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'block' }}>
            Device-level profile convenience with PBKDF2 Web Crypto PIN hashing.
          </span>
        </div>

        {/* Language Selection */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            Interface Language:
          </label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {[
              { code: 'en', label: 'English' },
              { code: 'hi', label: 'हिन्दी (Hindi)' },
              { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
            ].map((lng) => (
              <button
                key={lng.code}
                onClick={() => setLanguage(lng.code as SupportedLang)}
                className={currentLang === lng.code ? 'btn-primary' : 'btn-secondary'}
                style={{ fontSize: '0.85rem' }}
              >
                {lng.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Selection */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            Display Theme:
          </label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setTheme('dark')}
              className={theme === 'dark' ? 'btn-primary' : 'btn-secondary'}
              style={{ fontSize: '0.85rem' }}
            >
              <Moon size={15} />
              <span>Transit Control Dark (#0B1220)</span>
            </button>
            <button
              onClick={() => setTheme('light')}
              className={theme === 'light' ? 'btn-primary' : 'btn-secondary'}
              style={{ fontSize: '0.85rem' }}
            >
              <Sun size={15} />
              <span>High Contrast Light</span>
            </button>
          </div>
        </div>

        {/* Factory Reset */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Restore Factory Scenarios</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Re-seeds Motera IPL and Navratri events and default parameters.
            </div>
          </div>
          <button onClick={handleReset} className="btn-secondary" style={{ fontSize: '0.825rem' }}>
            <RotateCcw size={14} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
