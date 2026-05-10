'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface KeyInsightsProps {
  points:           string[];
  onViewAnalysis?:  () => void;
}

// ─── Check icon ───────────────────────────────────────────────────────────────
const CheckIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg
    width="14" height="14"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden
    style={{ flexShrink: 0, marginTop: '1px' }}
  >
    <circle cx="8" cy="8" r="7" fill={color} fillOpacity="0.14"
      stroke={color} strokeWidth="0.8" strokeOpacity="0.4"/>
    <path d="M5 8 L7 10 L11 6"
      stroke={color} strokeWidth="1.4"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────
export const KeyInsights: React.FC<KeyInsightsProps> = ({
  points,
  onViewAnalysis,
}) => {
  return (
    <section className="vl-ki" aria-labelledby="vl-ki-title">

      {/* ── Header ── */}
      <h2 className="vl-ki__title" id="vl-ki-title">KEY INSIGHTS</h2>

      {/* ── Points list ── */}
      <ul className="vl-ki__list" role="list">
        {points.map((point, i) => (
          <li key={i} className="vl-ki__item" role="listitem">
            <CheckIcon color="#B6FF2E" />
            <span className="vl-ki__text">{point}</span>
          </li>
        ))}
      </ul>

      {/* ── CTA ── */}
      <button
        className="vl-ki__btn"
        onClick={onViewAnalysis}
        aria-label="View full player analysis"
      >
        <span>VIEW FULL ANALYSIS</span>
        <ArrowRight size={13} style={{ flexShrink: 0 }} />
      </button>

      <style>{`
        /* ── Card ────────────────────────────── */
        .vl-ki {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 18px 20px;
          background:
            linear-gradient(145deg, rgba(255,255,255,0.075), rgba(255,255,255,0.024) 48%),
            rgba(11,18,32,0.72);
          border: 0.5px solid var(--vl-border);
          border-radius: 28px;
          backdrop-filter: blur(18px) saturate(128%);
          -webkit-backdrop-filter: blur(18px) saturate(128%);
          box-shadow: var(--vl-shadow-card);
          overflow: hidden;
        }

        .vl-ki::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, rgba(255,255,255,0.10), transparent 28%);
          opacity: .56;
          pointer-events: none;
        }

        .vl-ki > * {
          position: relative;
          z-index: 1;
        }

        /* ── Title ───────────────────────────── */
        .vl-ki__title {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .12em;
          color: var(--vl-muted);
          margin: 0;
        }

        /* ── List ────────────────────────────── */
        .vl-ki__list {
          display: flex;
          flex-direction: column;
          gap: 9px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        /* ── Item ────────────────────────────── */
        .vl-ki__item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .vl-ki__text {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 400;
          color: var(--vl-text-soft);
          line-height: 1.55;
        }

        /* ── CTA button ──────────────────────── */
        .vl-ki__btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          width: 100%;
          padding: 10px;
          margin-top: 2px;
          border-radius: 13px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.025)),
            rgba(11,18,32,0.68);
          border: 0.5px solid var(--vl-border-strong);
          color: var(--vl-text);
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .08em;
          cursor: pointer;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 28px rgba(0,0,0,0.18);
          transition: background .18s, border-color .18s, box-shadow .18s, transform .18s;
        }
        .vl-ki__btn:hover {
          background:
            linear-gradient(180deg, rgba(255,255,255,0.095), rgba(255,255,255,0.035)),
            rgba(11,18,32,0.78);
          border-color: rgba(182,255,46,0.24);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.11), 0 14px 32px rgba(0,0,0,0.24);
          transform: translateY(-1px);
        }
      `}</style>
    </section>
  );
};
