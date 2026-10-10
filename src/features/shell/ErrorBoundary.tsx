import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { resetDemoData } from '../../db/reset';

export const RouteErrorBoundary: React.FC = () => {
  const error: any = useRouteError();
  const navigate = useNavigate();

  const errorMessage = error?.statusText || error?.message || 'Unknown operational error';

  const handleResetData = async () => {
    if (window.confirm('Reset local demo database and reload the page?')) {
      await resetDemoData();
      window.location.href = '/';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '75vh',
        padding: '2rem 1rem',
      }}
    >
      <div
        className="glass-panel"
        style={{
          maxWidth: '560px',
          width: '100%',
          padding: '2rem',
          textAlign: 'center',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          backgroundColor: 'rgba(17, 28, 51, 0.95)',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            color: '#EF4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}
        >
          <AlertTriangle size={28} />
        </div>

        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Operational Interface Alert
        </h1>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          An error occurred in the operational telemetry subsystem:
        </p>

        <div
          style={{
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid var(--border-subtle)',
            color: '#F87171',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            textAlign: 'left',
            overflowX: 'auto',
            marginBottom: '1.5rem',
            whiteSpace: 'pre-wrap',
          }}
        >
          {errorMessage}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
            style={{ fontSize: '0.85rem' }}
          >
            <Home size={15} />
            <span>Return to Events</span>
          </button>

          <button
            onClick={handleResetData}
            className="btn-secondary"
            style={{ fontSize: '0.85rem' }}
          >
            <RotateCcw size={15} />
            <span>Reset Demo DB & Reload</span>
          </button>
        </div>
      </div>
    </div>
  );
};
