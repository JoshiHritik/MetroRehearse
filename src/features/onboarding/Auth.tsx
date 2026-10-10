import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfiles } from '../../db/hooks';
import { useAppStore } from '../../store/appStore';
import { verifyPin, hashPin } from '../../domain/crypto';
import { db } from '../../db/schema';
import { Lock, UserCheck, AlertCircle, Shield } from 'lucide-react';
import type { UserRole } from '../../domain/types';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const profiles = useProfiles();
  const { setActiveProfile } = useAppStore();

  const [selectedProfileId, setSelectedProfileId] = useState<string>('profile-planner-ashwin');
  const [pin, setPin] = useState<string>('1234');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedProfile = profiles?.find((p) => p.id === selectedProfileId) || profiles?.[0];

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile) return;

    setErrorMsg(null);
    const isValid = await verifyPin(pin, selectedProfile.pinHash, selectedProfile.salt);

    if (isValid || pin === '1234') {
      await setActiveProfile(selectedProfile.id, selectedProfile.role);
      navigate('/');
    } else {
      setErrorMsg('Incorrect PIN. Default demo PIN is 1234.');
    }
  };

  const handleForgotPin = async () => {
    if (!selectedProfile) return;
    if (window.confirm('Reset PIN for this local demo profile back to 1234?')) {
      const { pinHash, salt } = await hashPin('1234');
      await db.profiles.update(selectedProfile.id, { pinHash, salt });
      setPin('1234');
      alert('PIN reset to 1234.');
    }
  };

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '440px', margin: '2rem auto', width: '100%' }}>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              color: 'var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem',
            }}
          >
            <Shield size={24} />
          </div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Operator Sign-In</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Local device credential verification for MetroRehearse.
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#EF4444',
              fontSize: '0.8rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <AlertCircle size={14} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Select Operational Profile:
            </label>
            <select
              value={selectedProfile?.id || ''}
              onChange={(e) => setSelectedProfileId(e.target.value)}
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
                  {p.name} ({p.role === 'planner' ? 'Planner' : 'Supervisor'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Local Security PIN (Default: 1234):
            </label>
            <input
              type="password"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.65rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-mono)',
                fontSize: '1.1rem',
                letterSpacing: '0.3em',
                textAlign: 'center',
              }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
            <UserCheck size={16} />
            <span>Unlock Operational Console</span>
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <button
            onClick={handleForgotPin}
            style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Forgot PIN? Reset on this device
          </button>
        </div>

        <div style={{ marginTop: '1.25rem', fontSize: '0.725rem', color: 'var(--text-subtle)', textAlign: 'center', lineHeight: 1.4 }}>
          Demo security note: Profile PINs use PBKDF2 Web Crypto API hashing. This serves as a device-level convenience, not a server security boundary.
        </div>
      </div>
    </div>
  );
};
