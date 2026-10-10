import React from 'react';
import { HelpCircle, Database, ShieldCheck, Activity, Layers, FileText } from 'lucide-react';

export const Help: React.FC = () => {
  return (
    <div style={{ padding: '1.25rem', maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <HelpCircle size={22} color="var(--accent-cyan)" />
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800 }}>MetroRehearse Operational Manual</h1>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Guide for GMRC Station Controllers, Crowd Safety Officers, and Train Operations Managers.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Layers size={18} />
            <span>1. What are the (A) Assumption Flags?</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Parameters marked with an orange <span className="badge-assumed">(A)</span> pill (such as <em>Metro Modal Share</em>, <em>Gate Base Rate</em>, or <em>Train Capacity</em>) represent calibrated placeholder assumptions rather than measured physical sensor facts. You can adjust any parameter on the <strong>Assumptions</strong> screen to explore operational sensitivity.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Database size={18} />
            <span>2. Telemetry Data Levels (L0 - L3)</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            <div><strong>• Level 0 (Live Automated Feed):</strong> Streaming automated AFC turnstile gate feeds and platform sensors (simulated replay).</div>
            <div><strong>• Level 1 (Manual Concourse Counts):</strong> Manual batch counts submitted via the supervisor Tap Pad within the past 15 minutes.</div>
            <div><strong>• Level 2 (Cached Simulation):</strong> Offline 200-run Monte Carlo stochastic forecast pre-computed on device.</div>
            <div><strong>• Level 3 (Printed Event Order):</strong> Static procedural thresholds and timetable printed on paper.</div>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Activity size={18} />
            <span>3. How Live Mode Works</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            In Concourse Live Mode, station supervisors tap buttons as crowds arrive (+10 Ingress, +25 Concourse Queue, +50 Stadium Surge). The system executes a real-time Bayesian conjugate Gamma-Poisson rate update, compares observed queues against predicted curves, and alerts the controller when platform density touches the 3.8 pax/m² metering threshold.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FileText size={18} />
            <span>4. Printing the Tactical Event Order</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            The Event Order generator produces clean A4 portrait briefs in English, Hindi, and Gujarati. In-line text edits are tracked with an "Edited by Controller" tag, and the document is ready for browser printing with high-contrast formatting.
          </p>
        </div>
      </div>
    </div>
  );
};
