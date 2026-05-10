'use client';

import React from 'react';
import { MiniSparkline } from '@/components/player-profile/vitals/MiniSparkLine';

// ─── Types ────────────────────────────────────────────────────────────────────
export type VitalId = 'heartRate' | 'spO2' | 'temperature' | 'stress';

export interface VitalCardProps {
  id:      VitalId;
  value:   number;
  history: number[];
}

// ─── Vital config ─────────────────────────────────────────────────────────────
interface VitalConfig {
  label:           string;
  unit:            string;
  color:           string;
  rgb:             string;
  icon:            React.ReactNode;
  getInsight:      (v: number) => string;
  getInsightColor: (v: number) => string;
}

const VITAL_CONFIG: Record<VitalId, VitalConfig> = {
  heartRate: {
    label: 'HEART RATE',
    unit:  'BPM',
    color: '#FF5A5F',
    rgb:   '255,90,95',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    getInsight:      (v) => v > 185 ? 'Max Zone'    : v > 165 ? 'High Zone'   : v > 140 ? 'Active Zone' : 'Recovery',
    getInsightColor: (v) => v > 185 ? '#FF5A5F'     : v > 165 ? '#FF6B35'     : '#B6FF2E',
  },

  spO2: {
    label: 'SPO2',
    unit:  '%',
    color: '#38BDF8',
    rgb:   '56,189,248',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 2 C12 2 4 10 4 14.5 A8 8 0 0 0 20 14.5 C20 10 12 2 12 2Z"/>
      </svg>
    ),
    getInsight:      (v) => v >= 97 ? 'Optimal'  : v >= 94 ? 'Acceptable' : 'Low - Act',
    getInsightColor: (v) => v >= 97 ? '#B6FF2E'  : v >= 94 ? '#FFB800'    : '#FF5A5F',
  },

  temperature: {
    label: 'TEMPERATURE',
    unit:  '°C',
    color: '#FACC15',
    rgb:   '250,204,21',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
      </svg>
    ),
    getInsight:      (v) => v > 38.5 ? 'Heat Alert' : v > 37.8 ? 'Elevated' : v > 36.5 ? 'Normal' : 'Low',
    getInsightColor: (v) => v > 38.5 ? '#FF5A5F'    : v > 37.8 ? '#FFB800'  : '#B6FF2E',
  },

  stress: {
    label: 'GSR / STRESS',
    unit:  '%',
    color: '#8B5CF6',
    rgb:   '139,92,246',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    getInsight:      (v) => v > 75 ? 'High Load'  : v > 50 ? 'Elevated'   : v > 30 ? 'Manageable' : 'Calm',
    getInsightColor: (v) => v > 75 ? '#FF5A5F'    : v > 50 ? '#FFB800'    : '#B6FF2E',
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
export const VitalCard: React.FC<VitalCardProps> = ({ id, value, history }) => {
  const cfg          = VITAL_CONFIG[id];
  const insight      = cfg.getInsight(value);
  const insightColor = cfg.getInsightColor(value);

  const displayValue = id === 'temperature'
    ? value.toFixed(1)
    : Math.round(value);

  return (
    <div
      className="vl-vital"
      style={{ '--vital-color': cfg.color, '--vital-rgb': cfg.rgb } as React.CSSProperties}
    >
      {/* ── Header ── */}
      <div className="vl-vital__header">
        <span className="vl-vital__icon" style={{ color: cfg.color }}>{cfg.icon}</span>
        <span className="vl-vital__label">{cfg.label}</span>
      </div>

      {/* ── Value ── */}
      <div className="vl-vital__value-row">
        <span className="vl-vital__value" style={{ color: cfg.color }}>{displayValue}</span>
        <span className="vl-vital__unit">{cfg.unit}</span>
      </div>

      {/* ── Insight ── */}
      <span className="vl-vital__insight" style={{ color: insightColor }}>{insight}</span>

      {/* ── Sparkline — width fills card, only height passed ── */}
      <div className="vl-vital__chart">
        <MiniSparkline
          data={history}
          color={cfg.color}
          height={36}
          strokeWidth={1.6}
        />
      </div>

      <style>{`
        .vl-vital {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 14px 16px;
          background:
            linear-gradient(145deg, rgba(255,255,255,0.075), rgba(255,255,255,0.025) 45%, rgba(var(--vital-rgb),0.025)),
            rgba(11,18,32,0.72);
          border: 0.5px solid var(--vl-border);
          border-radius: 24px;
          backdrop-filter: blur(18px) saturate(130%);
          -webkit-backdrop-filter: blur(18px) saturate(130%);
          box-shadow: var(--vl-shadow-card);
          transition: border-color .22s ease, background .22s ease, box-shadow .22s ease, transform .22s ease;
          min-width: 0;
          overflow: hidden;
        }
        .vl-vital::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(120deg, rgba(255,255,255,0.08), transparent 30%);
          opacity: .55; pointer-events: none;
        }
        .vl-vital::after {
          content: '';
          position: absolute; left: 16px; right: 16px; top: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          pointer-events: none;
        }
        .vl-vital:hover {
          background:
            linear-gradient(145deg, rgba(255,255,255,0.085), rgba(255,255,255,0.034) 45%, rgba(var(--vital-rgb),0.035)),
            rgba(11,18,32,0.78);
          border-color: rgba(255,255,255,0.13);
          box-shadow: var(--vl-shadow-hover), 0 0 20px rgba(var(--vital-rgb),0.055);
          transform: translateY(-1px);
        }

        .vl-vital__header {
          display: flex; align-items: center; gap: 6px;
          position: relative; z-index: 1;
        }

        .vl-vital__icon {
          display: flex; align-items: center; justify-content: center;
          width: 24px; height: 24px; border-radius: 9px; flex-shrink: 0;
          background: rgba(var(--vital-rgb),0.08);
          border: 0.5px solid rgba(var(--vital-rgb),0.18);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 0 12px rgba(var(--vital-rgb),0.10);
        }

        .vl-vital__label {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
          color: var(--vl-muted);
        }

        .vl-vital__value-row {
          display: flex; align-items: baseline; gap: 4px; line-height: 1;
          position: relative; z-index: 1;
        }

        .vl-vital__value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 30px; font-weight: 700; line-height: 1;
          font-variant-numeric: tabular-nums;
        }

        .vl-vital__unit {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 500;
          color: var(--vl-muted); padding-bottom: 2px;
        }

        .vl-vital__insight {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 700;
          letter-spacing: .07em; text-transform: uppercase;
          position: relative; z-index: 1;
        }

        /* Chart fills full card width */
        .vl-vital__chart {
          margin-top: 4px;
          width: 100%;
          overflow: hidden;
          position: relative; z-index: 1;
          padding-top: 2px;
        }
      `}</style>
    </div>
  );
};