'use client';

import React from 'react';

export type StatLevel = 'HIGH' | 'NORMAL' | 'LOW';

export interface StatItemProps {
  label:  string;
  value:  string | number;
  unit?:  string;
  level?: StatLevel;
  icon:   React.ReactNode;
}

const LEVEL_COLOR: Record<StatLevel, string> = {
  HIGH:   '#B6FF2E',
  NORMAL: '#38BDF8',
  LOW:    '#FF5A5F',
};

export const StatItem: React.FC<StatItemProps> = ({
  label,
  value,
  unit,
  level = 'NORMAL',
  icon,
}) => {
  const color = LEVEL_COLOR[level];

  return (
    <div className="vl-si">
      <div className="vl-si__icon" style={{ color }} aria-hidden>{icon}</div>
      <div className="vl-si__body">
        <div className="vl-si__row">
          <span className="vl-si__val">{value}</span>
          {unit && <span className="vl-si__unit">{unit}</span>}
          <span className="vl-si__lvl" style={{ color }}>{level}</span>
        </div>
        <span className="vl-si__label">{label.toUpperCase()}</span>
      </div>

      <style>{`
        .vl-si {
          display: flex; align-items: center; gap: 10px; min-width: 0;
          position: relative;
          z-index: 1;
        }
        .vl-si__icon {
          display: flex; align-items: center; justify-content: center;
          width: 32px; height: 32px; border-radius: 11px; flex-shrink: 0;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.025)),
            rgba(11,18,32,0.64);
          border: 0.5px solid var(--vl-border);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 20px rgba(0,0,0,0.18);
        }
        .vl-si__body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .vl-si__row  { display: flex; align-items: baseline; gap: 4px; flex-wrap: wrap; }
        .vl-si__val  {
          font-family: 'JetBrains Mono', monospace;
          font-size: 16px; font-weight: 700; color: var(--vl-text); line-height: 1;
          font-variant-numeric: tabular-nums;
        }
        .vl-si__unit {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 500; color: var(--vl-muted);
        }
        .vl-si__lvl {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: .06em;
        }
        .vl-si__label {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px; font-weight: 600;
          letter-spacing: .09em; color: var(--vl-muted-deep);
        }
      `}</style>
    </div>
  );
};
