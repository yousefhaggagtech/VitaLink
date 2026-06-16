'use client';

import React from 'react';
import { LoadMetricBar } from '@/components/player-profile/load/LoadMetricBar';
import { AthleteHologram } from '@/components/player-profile/load/AthleteHologram';
import { Zap, Brain } from 'lucide-react';
import type { ProfileAIVisualState } from '@/application/mappers/toPlayerProfile';

// ─── Types ────────────────────────────────────────────────────────────────────
interface LoadMetricsSectionProps {
  fatigue:    number | null;   // cramp risk from latest AI
  stressLoad: number | null;   // momentum from latest AI
  visualState?: ProfileAIVisualState;
}

// ─── Insight helpers ──────────────────────────────────────────────────────────
const pendingInsight = (visualState: ProfileAIVisualState) => {
  if (visualState === 'stale') return 'Stale Data';
  if (visualState === 'warmup') return 'Warming Up';
  if (visualState === 'mismatch') return 'Check Belt';
  if (visualState === 'error') return 'Unavailable';
  return 'Analyzing';
};

const stateColor = (visualState: ProfileAIVisualState) => {
  if (visualState === 'stale') return '#FFB800';
  if (visualState === 'warmup') return '#60A5FA';
  if (visualState === 'mismatch' || visualState === 'error') return '#FF5A5F';
  return '#8B5CF6';
};

const crampRiskInsight = (v: number | null, visualState: ProfileAIVisualState) =>
  v === null ? pendingInsight(visualState) :
  v > 70 ? 'High Risk' : v > 40 ? 'Elevated' : v > 0 ? 'Low Risk' : 'Pending';

const momentumInsight = (v: number | null, visualState: ProfileAIVisualState) =>
  v === null ? pendingInsight(visualState) :
  v > 70 ? 'Surging' : v > 50 ? 'Stable' : v > 30 ? 'Dropping' : 'Fading';

const metricColor = (
  v: number | null,
  visualState: ProfileAIVisualState,
  high: number,
  mid: number,
  low: string,
  midColor: string,
  highColor: string
) =>
  v === null ? stateColor(visualState) : v > high ? highColor : v > mid ? midColor : low;

// ─── Component ────────────────────────────────────────────────────────────────
export const LoadMetricsSection: React.FC<LoadMetricsSectionProps> = ({
  fatigue,
  stressLoad,
  visualState = 'no-data',
}) => {
  const fatigueColor = metricColor(fatigue, visualState, 70, 40, '#B6FF2E', '#FFB800', '#FF5A5F');
  const stressColor =
    stressLoad === null ? stateColor(visualState) :
    stressLoad > 70 ? '#B6FF2E' : stressLoad > 50 ? '#8B5CF6' : stressLoad > 30 ? '#FFB800' : '#FF5A5F';

  return (
    <section className="vl-load" aria-labelledby="vl-load-title">

      {/* Section header */}
      <div className="vl-load__header">
        <h2 className="vl-load__title" id="vl-load-title">LOAD METRICS</h2>
      </div>

      {/* Content: bars left, hologram right */}
      <div className="vl-load__body">

        {/* ── Bars ── */}
        <div className="vl-load__bars">
          <LoadMetricBar
            label="Cramp Risk"
            value={fatigue}
            insight={crampRiskInsight(fatigue, visualState)}
            color={fatigueColor}
            icon={<Zap size={14} fill="currentColor" strokeWidth={1.5} />}
          />
          <LoadMetricBar
            label="Momentum"
            value={stressLoad}
            insight={momentumInsight(stressLoad, visualState)}
            color={stressColor}
            icon={<Brain size={14} strokeWidth={1.8} />}
          />
        </div>

        {/* ── Hologram ── */}
        <div className="vl-load__holo">
          <AthleteHologram fatigueLevel={fatigue} visualState={visualState} size={130} />
        </div>

      </div>

      <style>{`
        /* ── Section ─────────────────────────── */
        .vl-load {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 18px 20px;
          background:
            linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.015) 48%),
            rgba(11,18,32,0.78);
          border: 0.5px solid var(--vl-border);
          border-radius: 28px;
          backdrop-filter: blur(18px) saturate(125%);
          -webkit-backdrop-filter: blur(18px) saturate(125%);
          box-shadow: var(--vl-shadow-card);
          overflow: hidden;
        }

        .vl-load::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, rgba(255,255,255,0.08), transparent 28%);
          opacity: .45;
          pointer-events: none;
        }

        .vl-load > * {
          position: relative;
          z-index: 1;
        }

        /* ── Header ──────────────────────────── */
        .vl-load__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .vl-load__title {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .12em;
          color: var(--vl-muted);
          margin: 0;
        }

        /* ── Body: bars + hologram ───────────── */
        .vl-load__body {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .vl-load__bars {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 18px;
          min-width: 0;
        }

        .vl-load__holo {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 560px) {
          .vl-load__holo { display: none; }
        }
      `}</style>
    </section>
  );
};
