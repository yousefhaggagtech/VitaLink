'use client';

import React from 'react';
import { WellnessRing } from '@/components/player-profile/wellness/WellnessRing';
import { Info } from 'lucide-react';
import type { ProfileAIVisualState } from '@/application/mappers/toPlayerProfile';

// ─── Types ────────────────────────────────────────────────────────────────────
interface WellnessScoreProps {
  score:         number | null;   // recovery readiness from latest AI
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
const getTelemetryStatus = (visualState: ProfileAIVisualState) => {
  switch (visualState) {
    case 'live':
      return { label: 'Live telemetry connected', state: 'live' };
    case 'updating':
      return { label: 'Refreshing AI insights...', state: 'active' };
    case 'warmup':
      return { label: 'Calibrating device stream...', state: 'active' };
    case 'stale':
      return { label: 'Waiting for device stream...', state: 'waiting' };
    case 'error':
      return { label: 'Device stream unavailable', state: 'offline' };
    case 'mismatch':
      return { label: 'Verifying device stream...', state: 'waiting' };
    case 'loading':
    case 'no-data':
    default:
      return { label: 'Fetching live telemetry...', state: 'active' };
  }
};

export const WellnessScore: React.FC<WellnessScoreProps> = ({
  score,
  visualState = 'no-data',
  recoveryTimeMin,
  freshnessLabel,
}) => {
  const cfg = getScoreConfig(score, visualState, recoveryTimeMin, freshnessLabel);
  const telemetry = getTelemetryStatus(visualState);

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

      {/* ── Live AI telemetry ── */}
      <div
        className="vl-ws__telemetry"
        data-state={telemetry.state}
        role="status"
        aria-live="polite"
      >
        <div
          className="vl-ws__telemetry-track"
          role="progressbar"
          aria-label="Live AI insights telemetry"
          aria-valuetext={telemetry.label}
        >
          <span className="vl-ws__telemetry-flow" />
        </div>
        <span className="vl-ws__telemetry-label">{telemetry.label}</span>
      </div>

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

        /* ── Live AI telemetry ───────────────── */
        .vl-ws__telemetry {
          box-sizing: border-box;
          width: 100%;
          min-height: 32px;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 8px 10px;
          border-radius: 12px;
          background: rgba(5, 12, 23, 0.52);
          border: 0.5px solid rgba(56, 189, 248, 0.12);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.035);
          transition: border-color .2s ease, background .2s ease, box-shadow .2s ease;
        }

        .vl-ws__telemetry:hover {
          background: rgba(5, 12, 23, 0.7);
          border-color: rgba(74, 222, 128, 0.22);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.05),
            0 0 18px rgba(56, 189, 248, 0.05);
        }

        .vl-ws__telemetry-track {
          position: relative;
          flex: 1;
          min-width: 42px;
          height: 4px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(148, 163, 184, 0.12);
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.45);
        }

        .vl-ws__telemetry-flow {
          position: absolute;
          inset: 0;
          width: 58%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            rgba(56,189,248,0) 0%,
            rgba(56,189,248,0.78) 35%,
            rgba(74,222,128,0.95) 70%,
            rgba(182,255,46,0) 100%
          );
          filter: drop-shadow(0 0 4px rgba(56,189,248,0.4));
          animation: vl-ws-telemetry-flow 1.75s cubic-bezier(.4,0,.2,1) infinite;
        }

        .vl-ws__telemetry-flow::after {
          content: '';
          position: absolute;
          top: -2px;
          right: 18%;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(182,255,46,0.72);
          box-shadow: 0 0 10px rgba(74,222,128,0.72);
          animation: vl-ws-telemetry-pulse 1.2s ease-in-out infinite;
        }

        .vl-ws__telemetry-label {
          flex: 0 0 auto;
          max-width: 54%;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          line-height: 1.2;
          letter-spacing: .015em;
          color: rgba(226, 232, 240, 0.68);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .vl-ws__telemetry[data-state='live'] .vl-ws__telemetry-label {
          color: rgba(134, 239, 172, 0.78);
        }

        .vl-ws__telemetry[data-state='waiting'] .vl-ws__telemetry-flow {
          opacity: .62;
          animation-duration: 2.6s;
        }

        .vl-ws__telemetry[data-state='offline'] {
          border-color: rgba(148, 163, 184, 0.1);
        }

        .vl-ws__telemetry[data-state='offline'] .vl-ws__telemetry-flow {
          width: 100%;
          opacity: .24;
          animation: vl-ws-telemetry-pulse 1.8s ease-in-out infinite;
        }

        .vl-ws__telemetry[data-state='offline'] .vl-ws__telemetry-label {
          color: rgba(148, 163, 184, 0.58);
        }

        @keyframes vl-ws-telemetry-flow {
          0% { transform: translateX(-105%); opacity: .45; }
          45% { opacity: 1; }
          100% { transform: translateX(180%); opacity: .45; }
        }

        @keyframes vl-ws-telemetry-pulse {
          0%, 100% { opacity: .35; transform: scale(.78); }
          50% { opacity: 1; transform: scale(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .vl-ws__telemetry-flow,
          .vl-ws__telemetry-flow::after {
            animation: none !important;
          }

          .vl-ws__telemetry-flow {
            width: 100%;
            opacity: .7;
          }
        }
      `}</style>
    </div>
  );
};
