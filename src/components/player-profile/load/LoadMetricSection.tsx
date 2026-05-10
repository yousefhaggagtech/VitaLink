'use client';

import React from 'react';
import { LoadMetricBar } from '@/components/player-profile/load/LoadMetricBar';
import { AthleteHologram } from '@/components/player-profile/load/AthleteHologram';
import { Zap, Brain } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface LoadMetricsSectionProps {
  fatigue:    number;   // 0–100
  stressLoad: number;   // 0–100
}

// ─── Insight helpers ──────────────────────────────────────────────────────────
const fatigueInsight = (v: number) =>
  v > 80 ? 'Replace Now' : v > 60 ? 'Watch Closely' : v > 40 ? 'Building Up' : 'Good Shape';

const stressInsight = (v: number) =>
  v > 75 ? 'High Load' : v > 50 ? 'Elevated' : v > 30 ? 'Manageable' : 'Calm';

const metricColor = (v: number, high: number, mid: number, low: string, midColor: string, highColor: string) =>
  v > high ? highColor : v > mid ? midColor : low;

// ─── Component ────────────────────────────────────────────────────────────────
export const LoadMetricsSection: React.FC<LoadMetricsSectionProps> = ({
  fatigue,
  stressLoad,
}) => {
  const fatigueColor = metricColor(fatigue,    80, 55, '#B6FF2E', '#FFB800', '#FF5A5F');
  const stressColor  = metricColor(stressLoad, 75, 50, '#8B5CF6', '#FFB800', '#FF5A5F');

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
            label="Fatigue"
            value={fatigue}
            insight={fatigueInsight(fatigue)}
            color={fatigueColor}
            icon={<Zap size={14} fill="currentColor" strokeWidth={1.5} />}
          />
          <LoadMetricBar
            label="Stress"
            value={stressLoad}
            insight={stressInsight(stressLoad)}
            color={stressColor}
            icon={<Brain size={14} strokeWidth={1.8} />}
          />
        </div>

        {/* ── Hologram ── */}
        <div className="vl-load__holo">
          <AthleteHologram fatigueLevel={fatigue} size={130} />
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
