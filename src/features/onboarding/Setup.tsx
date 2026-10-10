import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../db/schema';
import { seedDemoData } from '../../db/seed';
import { CheckCircle, Train, Shield, ArrowRight } from 'lucide-react';

export const Setup: React.FC = () => {
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(false);

  const handleCompleteSetup = async () => {
    setIsInitializing(true);
    await seedDemoData(false);
    await db.settings.put({ key: 'setupComplete', value: true });
    setIsInitializing(false);
    navigate('/');
  };

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '580px', margin: '2rem auto' }}>
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #E11D48, #0284C7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)',
          }}
        >
          <Train size={28} color="#FFFFFF" />
        </div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: 900 }}>Welcome to MetroRehearse</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.5 }}>
          First-run initialization: setting up client-only IndexedDB tables, caching simulation geometry for Motera Stadium, and registering service workers for offline airplane mode.
        </p>

        <div
          style={{
            margin: '1.75rem 0',
            textAlign: 'left',
            padding: '1rem',
            backgroundColor: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
            fontSize: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981' }}>
            <CheckCircle size={16} />
            <span>IndexedDB 8-Table Schema Ready</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981' }}>
            <CheckCircle size={16} />
            <span>Ahmedabad Metro (GMRC) Network Geometries</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981' }}>
            <CheckCircle size={16} />
            <span>200-Seed Monte Carlo Web Worker Calibrated</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981' }}>
            <CheckCircle size={16} />
            <span>Trilingual Dictionaries (English, हिन्दी, ગુજરાતી)</span>
          </div>
        </div>

        <button
          onClick={handleCompleteSetup}
          disabled={isInitializing}
          className="btn-primary"
          style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
        >
          <span>{isInitializing ? 'Configuring System...' : 'Initialize & Launch Operations'}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
