'use client';

import React from 'react';
import { WellnessRing } from '@/components/player-profile/wellness/WellnessRing';
import { Info } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface WellnessScoreProps {
  score:         number;   // 0–100
  onViewDetails?: () => void;
}

// ─── Score config ─────────────────────────────────────────────────────────────
const getScoreConfig = (v: number) => {
  if (v >= 80) return {
    label:       'GOOD',
    labelColor:  '#B6FF2E',
    description: 'Recovery and mood are in good range.',
  };
  if (v >= 60) return {
    label:       'MODERATE',
    labelColor:  '#FFB800',
    description: 'Some recovery indicators need attention.',
  };
  return {
    label:       'LOW',
    labelColor:  '#FF5A5F',
    description: 'Recovery is below optimal. Monitor closely.',
  };
};

// ─── Component ────────────────────────────────────────────────────────────────
export const WellnessScore: React.FC<WellnessScoreProps> = ({
  score,
  onViewDetails,
}) => {
  const cfg = getScoreConfig(score);

  return (
    <div className="vl-ws">

      {/* ── Header ── */}
      <div className="vl-ws__header">
        <h2 className="vl-ws__title">WELLNESS SCORE</h2>
        <button className="vl-ws__info" aria-label="Wellness score info">
          <Info size={13} />
        </button>
      </div>

      {/* ── Body: ring + right text ── */}
      <div className="vl-ws__body">

        <WellnessRing value={score} size={110} stroke={9} />

        <div className="vl-ws__text">
          <span
            className="vl-ws__label"
            style={{ color: cfg.labelColor }}
          >
            {cfg.label}
          </span>
          <p className="vl-ws__desc">{cfg.description}</p>
        </div>
      </div>

      {/* ── CTA ── */}
      <button
        className="vl-ws__btn"
        onClick={onViewDetails}
        aria-label="View wellness details"
      >
        VIEW DETAILS
      </button>

      <style>{`
        /* ── Card ────────────────────────────── */
        .vl-ws {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 14px;
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

        .vl-ws::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, rgba(255,255,255,0.08), transparent 28%);
          opacity: .45;
          pointer-events: none;
        }

        .vl-ws > * {
          position: relative;
          z-index: 1;
        }

        /* ── Header ──────────────────────────── */
        .vl-ws__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .vl-ws__title {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .12em;
          color: var(--vl-muted);
          margin: 0;
        }

        .vl-ws__info {
          background: transparent;
          border: none;
          color: var(--vl-muted-deep);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 2px;
          transition: color .15s;
        }
        .vl-ws__info:hover { color: var(--vl-muted); }

        /* ── Body ────────────────────────────── */
        .vl-ws__body {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        /* ── Text block ──────────────────────── */
        .vl-ws__text {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
          min-width: 0;
        }

        .vl-ws__label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: .04em;
          line-height: 1;
        }

        .vl-ws__desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: var(--vl-text-soft);
          line-height: 1.5;
          margin: 0;
        }

        /* ── CTA ─────────────────────────────── */
        .vl-ws__btn {
          width: 100%;
          padding: 9px;
          border-radius: 13px;
          background:
            linear-gradient(180deg, rgba(182,255,46,0.12), rgba(182,255,46,0.045)),
            rgba(11,18,32,0.68);
          border: 0.5px solid rgba(182,255,46,0.22);
          color: var(--vl-lime);
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .08em;
          cursor: pointer;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.09), 0 10px 28px rgba(0,0,0,0.18);
          transition: background .18s, border-color .18s, box-shadow .18s, transform .18s;
        }
        .vl-ws__btn:hover {
          background:
            linear-gradient(180deg, rgba(182,255,46,0.15), rgba(182,255,46,0.06)),
            rgba(11,18,32,0.78);
          border-color: rgba(182,255,46,0.32);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.11), 0 14px 32px rgba(0,0,0,0.24), 0 0 18px rgba(182,255,46,0.07);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};
