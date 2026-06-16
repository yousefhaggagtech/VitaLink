'use client';

import React from 'react';
import { PerformanceRing } from '@/components/player-profile/performance/PerformanceRing';
import { Info } from 'lucide-react';
import type { ProfileAIVisualState } from '@/application/mappers/toPlayerProfile';

// ─── Types ────────────────────────────────────────────────────────────────────
interface PerformanceScoreProps {
  score:          number | null;    // latest AI power mapped to 0-100
  delta?:         number | null;
  deltaLabel?:    string;
  onInfo?:        () => void;
  visualState?:   ProfileAIVisualState;
  alertLevel?:    string | null;
  isUrgent?:      boolean;
  freshnessLabel?: string;
}

// ─── Score config ─────────────────────────────────────────────────────────────
const getConfig = (
  v: number | null,
  visualState: ProfileAIVisualState,
  isUrgent?: boolean,
  freshnessLabel?: string
) => {
  if (visualState === 'mismatch') return { label: 'CHECK BELT', color: '#FF5A5F', desc: 'AI snapshot does not match this belt.' };
  if (visualState === 'stale') return { label: 'STALE', color: '#FFB800', desc: freshnessLabel ?? 'Waiting for fresh AI power.' };
  if (visualState === 'warmup') return { label: 'WARMUP', color: '#60A5FA', desc: 'Power analysis is still warming up.' };
  if (visualState === 'loading' || visualState === 'no-data') return { label: 'ANALYZING', color: '#8B5CF6', desc: 'Waiting for latest AI power.' };
  if (visualState === 'error') return { label: 'UNAVAILABLE', color: '#FF5A5F', desc: 'AI power is temporarily unavailable.' };
  if (v === null) return { label: 'ANALYZING', color: '#8B5CF6', desc: 'Power metric has not arrived yet.' };
  if (isUrgent) return { label: 'URGENT', color: '#FF5A5F', desc: 'Coach attention is recommended now.' };
  if (v >= 80) return { label: 'EXCELLENT', color: '#B6FF2E', desc: 'Peak performance today.' };
  if (v >= 65) return { label: 'GOOD',      color: '#4ADE80', desc: 'Consistent performance today.' };
  if (v >= 50) return { label: 'MODERATE',  color: '#FFB800', desc: 'Below average output today.' };
  return             { label: 'LOW',        color: '#FF5A5F', desc: 'Performance needs attention.' };
};

// ─── Component ────────────────────────────────────────────────────────────────
export const PerformanceScore: React.FC<PerformanceScoreProps> = ({
  score,
  delta,
  deltaLabel = 'from latest AI',
  onInfo,
  visualState = 'no-data',
  isUrgent,
  freshnessLabel,
}) => {
  const cfg = getConfig(score, visualState, isUrgent, freshnessLabel);

  const hasDelta = delta !== undefined && delta !== null;
  const deltaValue = delta ?? 0;
  const deltaColor = !hasDelta ? 'var(--vl-muted-deep)'
    : deltaValue > 0 ? '#B6FF2E'
    : deltaValue < 0 ? '#FF5A5F'
    : 'var(--vl-muted-deep)';

  const deltaSign = !hasDelta ? '' : deltaValue > 0 ? '+' : deltaValue < 0 ? '-' : '';

  return (
    <section className="vl-ps" aria-labelledby="vl-ps-title">

      {/* ── Header ── */}
      <div className="vl-ps__header">
        <h2 className="vl-ps__title" id="vl-ps-title">PERFORMANCE SCORE</h2>
        <button
          className="vl-ps__info-btn"
          onClick={onInfo}
          aria-label="Performance score info"
        >
          <Info size={13} />
        </button>
      </div>

      {/* ── Body: ring + text ── */}
      <div className="vl-ps__body">

        <PerformanceRing value={score} size={100} stroke={10} />

        <div className="vl-ps__text">
          {/* Score label */}
          <span className="vl-ps__label" style={{ color: cfg.color }}>
            {cfg.label}
          </span>

          {/* Description */}
          <p className="vl-ps__desc">{cfg.desc}</p>

          {/* Delta badge */}
          {hasDelta && (
            <div className="vl-ps__delta" style={{ color: deltaColor }}>
              <span className="vl-ps__delta-arrow">{deltaSign}</span>
              <span className="vl-ps__delta-val">{Math.abs(deltaValue)}</span>
              <span className="vl-ps__delta-label">{deltaLabel}</span>
            </div>
          )}
        </div>
      </div>

      <style>{`
        /* ── Card ────────────────────────────── */
        .vl-ps {
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

        .vl-ps::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, rgba(255,255,255,0.08), transparent 28%);
          opacity: .45;
          pointer-events: none;
        }

        .vl-ps > * {
          position: relative;
          z-index: 1;
        }

        /* ── Header ──────────────────────────── */
        .vl-ps__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .vl-ps__title {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .12em;
          color: var(--vl-muted);
          margin: 0;
        }

        .vl-ps__info-btn {
          background: transparent;
          border: none;
          color: var(--vl-muted-deep);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 2px;
          transition: color .15s;
        }
        .vl-ps__info-btn:hover { color: var(--vl-muted); }

        /* ── Body ────────────────────────────── */
        .vl-ps__body {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        /* ── Text block ──────────────────────── */
        .vl-ps__text {
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-width: 0;
        }

        .vl-ps__label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: .04em;
          line-height: 1;
        }

        .vl-ps__desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: var(--vl-text-soft);
          line-height: 1.5;
          margin: 0;
        }

        /* ── Delta badge ─────────────────────── */
        .vl-ps__delta {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-top: 4px;
          padding: 3px 9px;
          border-radius: 9999px;
          background: rgba(255,255,255,0.055);
          border: 0.5px solid var(--vl-border);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.07);
          width: fit-content;
        }

        .vl-ps__delta-arrow {
          font-size: 11px;
          font-weight: 700;
          line-height: 1;
        }

        .vl-ps__delta-val {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 700;
        }

        .vl-ps__delta-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          color: var(--vl-muted-deep);
        }
      `}</style>
    </section>
  );
};
