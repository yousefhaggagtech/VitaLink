'use client';

import React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface LoadMetricBarProps {
  label:   string;
  value:   number | null;    // 0-100, or null while AI is not ready
  insight: string;    // e.g. "Good Shape" | "Calm"
  color:   string;
  icon:    React.ReactNode;
  total?:  number;    // segments count (default 14)
}

// ─── Component ────────────────────────────────────────────────────────────────
export const LoadMetricBar: React.FC<LoadMetricBarProps> = ({
  label,
  value,
  insight,
  color,
  icon,
  total = 14,
}) => {
  const safeValue = value === null ? 0 : Math.min(100, Math.max(0, value));
  const filled = Math.round((safeValue / 100) * total);
  const displayValue = value === null ? '--' : `${Math.round(value)}%`;

  return (
    <div
      className="vl-lmb"
      style={{ '--bar-color': color } as React.CSSProperties}
    >

      {/* ── Top row: icon + label + insight + value ── */}
      <div className="vl-lmb__header">
        <div className="vl-lmb__left">
          <span className="vl-lmb__icon" style={{ color }}>
            {icon}
          </span>
          <span className="vl-lmb__label">{label.toUpperCase()}</span>
          <span className="vl-lmb__insight" style={{ color }}>
            {insight}
          </span>
        </div>
        <span className="vl-lmb__value" style={{ color }}>
          {displayValue}
        </span>
      </div>

      {/* ── Segmented bar ── */}
      <div className="vl-lmb__track" role="progressbar"
        aria-valuenow={value ?? undefined} aria-valuemin={0} aria-valuemax={100}
        aria-label={value === null ? `${label} pending` : `${label} ${value}%`}
      >
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="vl-lmb__seg"
            style={{
              background: i < filled
                ? `linear-gradient(180deg, rgba(255,255,255,0.18), transparent 55%), ${color}`
                : 'rgba(255,255,255,0.06)',
            }}
          />
        ))}
      </div>

      <style>{`
        .vl-lmb {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
        }

        /* Header */
        .vl-lmb__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .vl-lmb__left {
          display: flex;
          align-items: center;
          gap: 7px;
          min-width: 0;
        }

        .vl-lmb__icon {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          justify-content: center;
          width: 25px;
          height: 25px;
          border-radius: 9px;
          background: rgba(255,255,255,0.045);
          border: 0.5px solid rgba(255,255,255,0.08);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .vl-lmb__label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .08em;
          color: var(--vl-text);
        }

        .vl-lmb__insight {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .04em;
          opacity: .85;
          white-space: nowrap;
        }

        .vl-lmb__value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          flex-shrink: 0;
        }

        /* Segmented bar */
        .vl-lmb__track {
          display: flex;
          gap: 3px;
          align-items: center;
          padding: 3px;
          border-radius: 8px;
          background: rgba(255,255,255,0.035);
          border: 0.5px solid rgba(255,255,255,0.06);
        }

        .vl-lmb__seg {
          flex: 1;
          height: 9px;
          border-radius: 3px;
          border: 0.5px solid rgba(255,255,255,0.04);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
          transition: background .35s ease, box-shadow .35s ease;
        }
      `}</style>
    </div>
  );
};
