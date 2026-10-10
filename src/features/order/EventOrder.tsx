import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEvent, useBriefing, usePlan } from '../../db/hooks';
import { db } from '../../db/schema';
import { useAppStore } from '../../store/appStore';
import { generateBriefingFromPlan } from '../../domain/briefing';
import { Printer, Edit3, Check, Globe, AlertCircle, FileText } from 'lucide-react';
import type { SupportedLang, BriefingBlock, Plan } from '../../domain/types';

export const EventOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const eventId = id || 'evt-gt-vs-mi-2026';
  const event = useEvent(eventId);
  const { currentLang, setLanguage } = useAppStore();
  const [activeLang, setActiveLang] = useState<SupportedLang>(currentLang);

  const appliedPlanId = event?.appliedPlanId || 'plan-gt-opt-1';
  const plan = usePlan(appliedPlanId);
  const briefing = useBriefing(eventId, activeLang);

  useEffect(() => {
    async function ensureBriefing() {
      if (event && !briefing) {
        const fallbackPlan: Plan = plan || {
          id: `plan-base-${event.id}`,
          eventId: event.id,
          name: 'Standard Baseline',
          gatesOpen: 4,
          metering: { on: false, limit: 3.8 },
          headwayMin: 5,
          lastTrainExtMin: 0,
          staff: Math.min(20, event.staffAvailable),
          holdMin: 0,
        };
        const newBriefing = generateBriefingFromPlan(event, fallbackPlan, activeLang);
        await db.briefings.put(newBriefing);
      }
    }
    ensureBriefing();
  }, [event, briefing, plan, activeLang]);

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');

  const handleStartEdit = (block: BriefingBlock) => {
    setEditingKey(block.key);
    setEditText(block.text);
  };

  const handleSaveEdit = async (blockKey: string) => {
    if (!briefing) return;
    const updatedBlocks = briefing.blocks.map((b) =>
      b.key === blockKey ? { ...b, text: editText, edited: true } : b
    );
    await db.briefings.update(briefing.id, { blocks: updatedBlocks });
    setEditingKey(null);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!event || !briefing) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading briefing documentation...
      </div>
    );
  }

  return (
    <div style={{ padding: '1.25rem', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Screen Control Bar (Hidden in Print) */}
      <div
        className="glass-panel no-print"
        style={{
          padding: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="var(--accent-cyan)" />
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Tactical Event Order & Briefing</h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Official operational dispatch order for station controllers, security marshals, and train operators.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Language selector */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              padding: '0.2rem',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {(['en', 'hi', 'gu'] as SupportedLang[]).map((lng) => (
              <button
                key={lng}
                onClick={() => setActiveLang(lng)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: activeLang === lng ? 700 : 500,
                  backgroundColor: activeLang === lng ? 'var(--accent-blue)' : 'transparent',
                  color: activeLang === lng ? '#FFFFFF' : 'var(--text-muted)',
                }}
              >
                {lng === 'en' ? 'English' : lng === 'hi' ? 'हिन्दी' : 'ગુજરાતી'}
              </button>
            ))}
          </div>

          <button onClick={handlePrint} className="btn-primary" style={{ fontSize: '0.85rem' }}>
            <Printer size={15} />
            <span>Print Event Order (A4)</span>
          </button>
        </div>
      </div>

      {/* Printable Document Container */}
      <div
        className="print-container glass-panel"
        style={{
          padding: '2rem',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        {/* Printable Header */}
        <div className="print-header" style={{ borderBottom: '2px solid var(--border-medium)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--line-north-south)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                GUJARAT METRO RAIL CORPORATION (GMRC) — STATION OPERATIONS
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--text-main)' }}>
                TACTICAL EVENT ORDER: {event.name}
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Gateway Station: <strong>Motera Stadium</strong> (Sabarmati Corridor) • Date: <strong>{new Date(event.endsAt).toLocaleDateString()}</strong>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                DISPATCH ID: EO-{event.id.toUpperCase()}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Language: <strong>{activeLang === 'en' ? 'English' : activeLang === 'hi' ? 'Hindi' : 'Gujarati'}</strong>
              </div>
              <div style={{ marginTop: '0.25rem' }}>
                <span className="badge-assumed">(A) Tactical Plan Model</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Box */}
        <div
          className="print-disclaimer"
          style={{
            padding: '0.65rem 1rem',
            backgroundColor: 'var(--tag-assumed-bg)',
            border: '1px solid var(--tag-assumed-border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            color: 'var(--tag-assumed-text)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <AlertCircle size={15} />
          <span>
            NOTICE: Operating parameters marked (A) are calibrated assumptions. Gate Marshals and Train Operators must maintain visual situational awareness.
          </span>
        </div>

        {/* Section Blocks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {briefing.blocks.map((block) => (
            <div
              key={block.key}
              className="print-section"
              style={{
                padding: '1.25rem',
                backgroundColor: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  {block.title || block.key.toUpperCase()}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="no-print">
                  {block.edited && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '0.1rem 0.4rem',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(56, 189, 248, 0.2)',
                        color: 'var(--accent-cyan)',
                      }}
                    >
                      Edited by Controller
                    </span>
                  )}
                  {editingKey !== block.key ? (
                    <button
                      onClick={() => handleStartEdit(block)}
                      className="btn-secondary"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      title="Edit section text"
                    >
                      <Edit3 size={12} />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSaveEdit(block.key)}
                      className="btn-primary"
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                    >
                      <Check size={12} />
                      <span>Save</span>
                    </button>
                  )}
                </div>
              </div>

              {editingKey === block.key ? (
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-canvas)',
                    border: '1px solid var(--border-focus)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)',
                    fontSize: '0.875rem',
                    lineHeight: activeLang !== 'en' ? '1.7' : '1.5',
                  }}
                />
              ) : (
                <div
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-main)',
                    lineHeight: activeLang !== 'en' ? '1.7' : '1.6',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {block.text}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
