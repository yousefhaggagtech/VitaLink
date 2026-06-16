'use client';

import React from 'react';
import { WellnessRing } from '@/components/player-profile/wellness/WellnessRing';
import { Info } from 'lucide-react';
import type { ProfileAIVisualState } from '@/application/mappers/toPlayerProfile';

// ─── Types ────────────────────────────────────────────────────────────────────
interface WellnessScoreProps {
  score:         number | null;   // recovery readiness from latest AI
  onViewDetails?: () => void;
  visualState?: ProfileAIVisualState;
  recoveryTimeMin?: number | null;
  freshnessLabel?: string;
}

// ─── Score config ─────────────────────────────────────────────────────────────
const getScoreConfig = (
  v: number | null,
  visualState: ProfileAIVisualState,
  recoveryTimeMin?: number | null,
  freshnessLabel?: string
) => {
  if (visualState === 'mismatch') return {
    label: 'CHECK BELT',
    labelColor: '#FF5A5F',
    description: 'AI recovery snapshot belongs to another belt.',
  };
  if (visualState === 'stale') return {
    label: 'STALE',
    labelColor: '#FFB800',
    description: freshnessLabel ?? 'Recovery analysis is outdated.',
  };
  if (visualState === 'warmup') return {
    label: 'WARMUP',
    labelColor: '#60A5FA',
    description: 'Recovery readiness is still warming up.',
  };
  if (visualState === 'loading' || visualState === 'no-data' || v === null) return {
    label: 'ANALYZING',
    labelColor: '#8B5CF6',
    description: 'Waiting for AI recovery estimate.',
  };
  const recoveryCopy = recoveryTimeMin === null || recoveryTimeMin === undefined
    ? ''
    : ` Recovery estimate: ${Math.round(recoveryTimeMin)} min.`;
  if (v >= 80) return {
    label:       'GOOD',
    labelColor:  '#B6FF2E',
    description: `Recovery readiness is in good range.${recoveryCopy}`,
  };
  if (v >= 60) return {
    label:       'MODERATE',
    labelColor:  '#FFB800',
    description: `Some recovery indicators need attention.${recoveryCopy}`,
  };
  return {
    label:       'LOW',
    labelColor:  '#FF5A5F',
    description: `Recovery is below optimal. Monitor closely.${recoveryCopy}`,
  };
};

// ─── Component ────────────────────────────────────────────────────────────────
export const WellnessScore: React.FC<WellnessScoreProps> = ({
  score,
  onViewDetails,
  visualState = 'no-data',
  recoveryTimeMin,
  freshnessLabel,
}) => {
  const cfg = getScoreConfig(score, visualState, recoveryTimeMin, freshnessLabel);

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
            linear-gradient(180deg, rgba(204,255,0,0.12), rgba(204,255,0,0.045)),
            rgba(11,18,32,0.68);
          border: 0.5px solid rgba(204,255,0,0.22);
          color: #CCFF00;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .08em;
          cursor: pointer;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.09), 0 10px 28px rgba(0,0,0,0.18), 0 0 12px rgba(204,255,0,0.05);
          transition: background .18s, border-color .18s, box-shadow .18s, transform .18s;
        }
        .vl-ws__btn:hover {
          background:
            linear-gradient(180deg, rgba(204,255,0,0.15), rgba(204,255,0,0.06)),
            rgba(11,18,32,0.78);
          border-color: rgba(204,255,0,0.32);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.11), 0 14px 32px rgba(0,0,0,0.24), 0 0 18px rgba(204,255,0,0.1);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};
