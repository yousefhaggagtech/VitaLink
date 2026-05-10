'use client';

import React from 'react';
import { InsightBadge } from './InsightBadge';

// ─── Types ────────────────────────────────────────────────────────────────────
interface GeminiInsightsPanelProps {
  summary:     string;             // main paragraph
  highlight?:  string;             // bold substring inside summary
  subDetail?:  string;             // second bullet
  readiness:   'High' | 'Medium' | 'Low';
  isLive?:     boolean;
}

const READINESS_COLOR: Record<string, string> = {
  High:   '#B6FF2E',
  Medium: '#FFB800',
  Low:    '#FF5A5F',
};

// ─── Component ────────────────────────────────────────────────────────────────
export const GeminiInsightsPanel: React.FC<GeminiInsightsPanelProps> = ({
  summary,
  highlight,
  subDetail,
  readiness,
  isLive = true,
}) => {
  const readinessColor = READINESS_COLOR[readiness] ?? 'var(--vl-muted)';

  return (
    <section className="vl-gem" aria-labelledby="vl-gem-title">

      {/* ── Header ── */}
      <div className="vl-gem__header">
        <div className="vl-gem__title-row">
          {/* Gemini star icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <h2 className="vl-gem__title" id="vl-gem-title">GEMINI AI</h2>

          {/* Live dot */}
          {isLive && (
            <div className="vl-gem__live">
              <span className="vl-gem__live-dot" aria-hidden />
              <span className="vl-gem__live-text">LIVE INSIGHTS</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Summary paragraph ── */}
      <p className="vl-gem__summary">
        {highlight ? renderHighlight(summary, highlight) : summary}
      </p>

      {/* ── Insight bullets ── */}
      <div className="vl-gem__bullets" role="list">

        {/* Sub-detail bullet */}
        {subDetail && (
          <InsightBadge
            text={subDetail}
            variant="default"
          />
        )}

        {/* Readiness bullet */}
        <InsightBadge
          text={`Readiness for next match: ${readiness}`}
          variant={
            readiness === 'High'   ? 'success'   :
            readiness === 'Medium' ? 'warning'   : 'default'
          }
          highlight={readiness}
          highlightColor={readinessColor}
        />
      </div>

      <style>{`
        /* ── Card ────────────────────────────── */
        .vl-gem {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 18px 20px;
          background:
            linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.015) 46%),
            rgba(11,18,32,0.78);
          border: 0.5px solid var(--vl-border);
          border-radius: 28px;
          backdrop-filter: blur(18px) saturate(125%);
          -webkit-backdrop-filter: blur(18px) saturate(125%);
          box-shadow: var(--vl-shadow-card);
          overflow: hidden;
        }

        .vl-gem::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, rgba(255,255,255,0.08), transparent 30%);
          opacity: .42;
          pointer-events: none;
        }

        .vl-gem > * {
          position: relative;
          z-index: 1;
        }

        /* ── Header ──────────────────────────── */
        .vl-gem__header { display: flex; align-items: center; }

        .vl-gem__title-row {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .vl-gem__title {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .12em;
          color: #A855F7;
          margin: 0;
        }

        /* Live badge */
        .vl-gem__live {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 2px 8px;
          background: rgba(139,92,246,0.10);
          border: 0.5px solid rgba(168,85,247,0.22);
          border-radius: 9999px;
        }

        .vl-gem__live-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #A855F7;
          animation: vl-gem-pulse 2s ease-in-out infinite;
        }
        @keyframes vl-gem-pulse {
          0%,100% { opacity:1; }
          50%      { opacity:.35; }
        }

        .vl-gem__live-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .1em;
          color: #A855F7;
        }

        /* ── Summary ─────────────────────────── */
        .vl-gem__summary {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 400;
          color: var(--vl-text-soft);
          line-height: 1.6;
          margin: 0;
        }

        /* ── Bullets ─────────────────────────── */
        .vl-gem__bullets {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
      `}</style>
    </section>
  );
};

// ─── Highlight helper ─────────────────────────────────────────────────────────
function renderHighlight(text: string, phrase: string) {
  const idx = text.toLowerCase().indexOf(phrase.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <strong style={{ color: '#B6FF2E', fontWeight: 700 }}>
        {text.slice(idx, idx + phrase.length)}
      </strong>
      {text.slice(idx + phrase.length)}
    </>
  );
}
