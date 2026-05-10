'use client';

import React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface PlayerBioStatsProps {
  age:       number;
  weight:    number;       // kg
  height:    number;       // cm
  foot:      'Right' | 'Left' | string;
  bloodType: string;
  beltId:    string;
}

interface StatItemProps {
  label: string;
  value: string | number;
  unit?: string;
}

// ─── Single stat cell ─────────────────────────────────────────────────────────
const StatCell: React.FC<StatItemProps> = ({ label, value, unit }) => (
  <div className="vl-bio__cell">
    <span className="vl-bio__label">{label}</span>
    <span className="vl-bio__value">
      {value}
      {unit && <span className="vl-bio__unit"> {unit}</span>}
    </span>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────
export const PlayerBioStats: React.FC<PlayerBioStatsProps> = ({
  age,
  weight,
  height,
  foot,
  bloodType,
  beltId,
}) => {
  const stats: StatItemProps[] = [
    { label: 'AGE',    value: age },
    { label: 'WEIGHT', value: weight, unit: 'kg'  },
    { label: 'HEIGHT', value: height, unit: 'cm'  },
    { label: 'FOOT',   value: foot  },
    { label: 'BLOOD',  value: bloodType },
    { label: 'BELT',   value: beltId },
  ];

  return (
    <div className="vl-bio">
      {stats.map((s, i) => (
        <React.Fragment key={s.label}>
          <StatCell {...s} />
          {/* Vertical divider between cells — not after last */}
          {i < stats.length - 1 && (
            <div className="vl-bio__sep" aria-hidden />
          )}
        </React.Fragment>
      ))}

      <style>{`
        /* ── Row ─────────────────────────────── */
        .vl-bio {
          display: flex;
          align-items: center;
          gap: 0;
          flex-wrap: wrap;
          row-gap: 10px;
        }

        /* ── Cell ────────────────────────────── */
        .vl-bio__cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 0 16px;
        }
        /* First cell no left padding */
        .vl-bio__cell:first-child { padding-left: 0; }

        /* ── Label ───────────────────────────── */
        .vl-bio__label {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--vl-muted-deep);
          white-space: nowrap;
        }

        /* ── Value ───────────────────────────── */
        .vl-bio__value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          font-weight: 600;
          color: var(--vl-text);
          white-space: nowrap;
        }

        /* ── Unit suffix ─────────────────────── */
        .vl-bio__unit {
          font-size: 11px;
          font-weight: 400;
          color: var(--vl-muted);
        }

        /* ── Vertical separator ──────────────── */
        .vl-bio__sep {
          width: 0.5px;
          height: 28px;
          background: linear-gradient(to bottom, transparent, var(--vl-border), transparent);
          flex-shrink: 0;
          align-self: center;
        }
      `}</style>
    </div>
  );
};
