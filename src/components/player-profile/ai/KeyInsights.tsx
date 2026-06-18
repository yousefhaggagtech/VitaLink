'use client';

import React from 'react';
import type { ProfileAIVisualState } from '@/application/mappers/toPlayerProfile';

// ─── Types ────────────────────────────────────────────────────────────────────
interface KeyInsightsProps {
  points:           string[];
  visualState?: ProfileAIVisualState;
  isUrgent?: boolean;
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

export const KeyInsights: React.FC<KeyInsightsProps> = ({
  points,
  visualState = 'live',
  isUrgent = false,
}) => {
  const telemetry = getTelemetryStatus(visualState);
  const iconColor =
    isUrgent || visualState === 'mismatch' || visualState === 'error' ? '#FF5A5F' :
    visualState === 'stale' ? '#FFB800' :
    visualState === 'warmup' ? '#60A5FA' :
    '#B6FF2E';

  return (
    <section className="vl-ki" aria-labelledby="vl-ki-title">

      {/* ── Header ── */}
      <h2 className="vl-ki__title" id="vl-ki-title">KEY INSIGHTS</h2>

      {/* ── Points list ── */}
      <ul className="vl-ki__list" role="list">
        {points.map((point, i) => (
          <li key={i} className="vl-ki__item" role="listitem">
            <CheckIcon color={iconColor} />
            <span className="vl-ki__text">{point}</span>
          </li>
        ))}
      </ul>

      {/* ── Live AI telemetry ── */}
      <div
        className="vl-ki__telemetry"
        data-state={telemetry.state}
        role="status"
        aria-live="polite"
      >
        <div
          className="vl-ki__telemetry-track"
          role="progressbar"
          aria-label="Live AI insights telemetry"
          aria-valuetext={telemetry.label}
        >
          <span className="vl-ki__telemetry-flow" />
        </div>
        <span className="vl-ki__telemetry-label">{telemetry.label}</span>
      </div>

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

        /* ── Live AI telemetry ───────────────── */
        .vl-ki__telemetry {
          box-sizing: border-box;
          width: 100%;
          min-height: 32px;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 8px 10px;
          margin-top: 2px;
          border-radius: 12px;
          background: rgba(5, 12, 23, 0.52);
          border: 0.5px solid rgba(56, 189, 248, 0.12);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.035);
          transition: border-color .2s ease, background .2s ease, box-shadow .2s ease;
        }

        .vl-ki__telemetry:hover {
          background: rgba(5, 12, 23, 0.7);
          border-color: rgba(74, 222, 128, 0.22);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.05),
            0 0 18px rgba(56, 189, 248, 0.05);
        }

        .vl-ki__telemetry-track {
          position: relative;
          flex: 1;
          min-width: 42px;
          height: 4px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(148, 163, 184, 0.12);
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.45);
        }

        .vl-ki__telemetry-flow {
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
          animation: vl-ki-telemetry-flow 1.75s cubic-bezier(.4,0,.2,1) infinite;
        }

        .vl-ki__telemetry-flow::after {
          content: '';
          position: absolute;
          top: -2px;
          right: 18%;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(182,255,46,0.72);
          box-shadow: 0 0 10px rgba(74,222,128,0.72);
          animation: vl-ki-telemetry-pulse 1.2s ease-in-out infinite;
        }

        .vl-ki__telemetry-label {
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

        .vl-ki__telemetry[data-state='live'] .vl-ki__telemetry-label {
          color: rgba(134, 239, 172, 0.78);
        }

        .vl-ki__telemetry[data-state='waiting'] .vl-ki__telemetry-flow {
          opacity: .62;
          animation-duration: 2.6s;
        }

        .vl-ki__telemetry[data-state='offline'] {
          border-color: rgba(148, 163, 184, 0.1);
        }

        .vl-ki__telemetry[data-state='offline'] .vl-ki__telemetry-flow {
          width: 100%;
          opacity: .24;
          animation: vl-ki-telemetry-pulse 1.8s ease-in-out infinite;
        }

        .vl-ki__telemetry[data-state='offline'] .vl-ki__telemetry-label {
          color: rgba(148, 163, 184, 0.58);
        }

        @keyframes vl-ki-telemetry-flow {
          0% { transform: translateX(-105%); opacity: .45; }
          45% { opacity: 1; }
          100% { transform: translateX(180%); opacity: .45; }
        }

        @keyframes vl-ki-telemetry-pulse {
          0%, 100% { opacity: .35; transform: scale(.78); }
          50% { opacity: 1; transform: scale(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .vl-ki__telemetry-flow,
          .vl-ki__telemetry-flow::after {
            animation: none !important;
          }

          .vl-ki__telemetry-flow {
            width: 100%;
            opacity: .7;
          }
        }
      `}</style>
    </section>
  );
};
