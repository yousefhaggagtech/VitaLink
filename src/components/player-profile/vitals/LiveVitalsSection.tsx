'use client';

import React from 'react';
import { VitalCard, VitalId } from '@/components/player-profile/vitals/VitalCard';

// ─── Types ────────────────────────────────────────────────────────────────────
interface VitalData {
  value:   number;
  history: number[];
}

interface LiveVitalsSectionProps {
  vitals: {
    heartRate:   VitalData;
    spO2:        VitalData;
    temperature: VitalData;
    stress:      VitalData;
  };
}

// ─── Card order ───────────────────────────────────────────────────────────────
const CARD_ORDER: VitalId[] = ['heartRate', 'spO2', 'temperature', 'stress'];

// ─── Component ────────────────────────────────────────────────────────────────
export const LiveVitalsSection: React.FC<LiveVitalsSectionProps> = ({ vitals }) => {
  return (
    <section className="vl-lv" aria-labelledby="vl-lv-title">

      {/* ── Section header ── */}
      <div className="vl-lv__header">
        <div className="vl-lv__title-row">
          {/* Live pulse icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="#B6FF2E" strokeWidth="2" strokeLinecap="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          <h2 className="vl-lv__title" id="vl-lv-title">LIVE VITALS</h2>
        </div>

        {/* Live indicator */}
        <div className="vl-lv__live-badge">
          <span className="vl-lv__live-dot" aria-hidden />
          <span className="vl-lv__live-text">Live</span>
        </div>
      </div>

      {/* ── 4-column card grid ── */}
      <div className="vl-lv__grid">
        {CARD_ORDER.map(id => (
          <VitalCard
            key={id}
            id={id}
            value={vitals[id].value}
            history={vitals[id].history}
          />
        ))}
      </div>

      <style>{`
        /* ── Section ─────────────────────────── */
        .vl-lv {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* ── Header row ──────────────────────── */
        .vl-lv__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .vl-lv__title-row {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .vl-lv__title {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .12em;
          color: var(--vl-muted);
          margin: 0;
        }

        /* ── Live badge ──────────────────────── */
        .vl-lv__live-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 3px 9px;
          background: rgba(182,255,46,0.08);
          border: 0.5px solid rgba(182,255,46,0.20);
          border-radius: 9999px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .vl-lv__live-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--vl-lime);
          animation: vl-lv-pulse 2s ease-in-out infinite;
        }
        @keyframes vl-lv-pulse {
          0%,100% { opacity: 1; box-shadow: 0 0 0 0 rgba(182,255,46,0.28); }
          50%      { opacity: .72; box-shadow: 0 0 0 4px rgba(182,255,46,0); }
        }

        .vl-lv__live-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .07em;
          color: var(--vl-lime);
        }

        /* ── Cards grid ──────────────────────── */
        .vl-lv__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        /* Tablet: 2×2 */
        @media (max-width: 900px) {
          .vl-lv__grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* Mobile: 1 col */
        @media (max-width: 560px) {
          .vl-lv__grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
};
