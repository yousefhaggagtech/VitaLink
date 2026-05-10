'use client';

import React, { useMemo } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ComparisonMetric {
  label: string;
  value: number;    // 0–100 (ring fill)
  delta: number;    // positive = up vs prev
  color: string;
}

interface VSPreviousMatchProps {
  fatigue: { value: number; delta: number };
  load:    { value: number; delta: number };
  stress:  { value: number; delta: number };
  matchLabel?: string;
}

// ─── Single comparison ring ───────────────────────────────────────────────────
interface ComparisonRingProps {
  metric: ComparisonMetric;
  size?:  number;
  stroke?: number;
}

const ComparisonRing: React.FC<ComparisonRingProps> = ({
  metric,
  size   = 68,
  stroke = 6,
}) => {
  const uid = useMemo(() => `cmp-${Math.random().toString(36).slice(2, 6)}`, []);
  const r   = (size - stroke) / 2;
  const c   = 2 * Math.PI * r;
  const off = c - (metric.value / 100) * c;

  const deltaPositive = metric.delta > 0;
  const deltaColor    = deltaPositive ? '#FF5A5F' : '#B6FF2E'; // up fatigue = bad
  const deltaSign     = metric.delta > 0 ? '+' : metric.delta < 0 ? '-' : '0';

  return (
    <div className="vl-cmp">
      {/* Ring */}
      <div className="vl-cmp__ring-wrap" style={{ width: size, height: size }}>
        <svg
          width={size} height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(-90deg)' }}
          aria-hidden
        >
          <defs>
            <linearGradient id={`${uid}-g`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor={metric.color} stopOpacity="0.9" />
              <stop offset="100%" stopColor={metric.color} stopOpacity="0.55" />
            </linearGradient>
          </defs>

          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={stroke}
          />

          {/* Arc */}
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke={`url(#${uid}-g)`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={off}
            style={{ transition: 'stroke-dashoffset .7s ease' }}
          />
        </svg>

        {/* Center % */}
        <div className="vl-cmp__center">
          <span className="vl-cmp__pct" style={{ color: metric.color }}>
            {metric.value}%
          </span>
        </div>
      </div>

      {/* Label */}
      <span className="vl-cmp__label">{metric.label}</span>

      {/* Delta */}
      <div
        className="vl-cmp__delta"
        style={{ color: deltaColor }}
        aria-label={`${metric.delta > 0 ? 'up' : 'down'} ${Math.abs(metric.delta)}% vs previous match`}
      >
        <span className="vl-cmp__delta-sign">{deltaSign}</span>
        <span className="vl-cmp__delta-val">{Math.abs(metric.delta)}%</span>
      </div>

      <style>{`
        .vl-cmp {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .vl-cmp__ring-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .vl-cmp__center {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .vl-cmp__pct {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          font-weight: 700;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }

        .vl-cmp__label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .07em;
          text-transform: uppercase;
          color: var(--vl-muted);
        }

        .vl-cmp__delta {
          display: flex;
          align-items: center;
          gap: 2px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
        }

        .vl-cmp__delta-sign { font-size: 12px; }
        .vl-cmp__delta-val  { font-family: 'JetBrains Mono', monospace; font-size: 10px; }
      `}</style>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export const VSPreviousMatch: React.FC<VSPreviousMatchProps> = ({
  fatigue,
  load,
  stress,
  matchLabel = 'vs previous match',
}) => {
  const metrics: ComparisonMetric[] = [
    { label: 'Fatigue', value: fatigue.value, delta: fatigue.delta, color: '#FACC15' },
    { label: 'Load',    value: load.value,    delta: load.delta,    color: '#38BDF8' },
    { label: 'Stress',  value: stress.value,  delta: stress.delta,  color: '#8B5CF6' },
  ];

  return (
    <section className="vl-vs" aria-labelledby="vl-vs-title">

      {/* Header */}
      <h2 className="vl-vs__title" id="vl-vs-title">
        {matchLabel.toUpperCase()}
      </h2>

      {/* Rings row */}
      <div className="vl-vs__grid" role="list">
        {metrics.map(metric => (
          <div key={metric.label} role="listitem">
            <ComparisonRing metric={metric} />
          </div>
        ))}
      </div>

      <style>{`
        /* ── Card ────────────────────────────── */
        .vl-vs {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 18px 20px;
          background:
            linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.026) 46%),
            rgba(11,18,32,0.72);
          border: 0.5px solid var(--vl-border);
          border-radius: 28px;
          backdrop-filter: blur(18px) saturate(130%);
          -webkit-backdrop-filter: blur(18px) saturate(130%);
          box-shadow: var(--vl-shadow-card);
          overflow: hidden;
        }

        .vl-vs::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, rgba(255,255,255,0.10), transparent 28%);
          opacity: .58;
          pointer-events: none;
        }

        .vl-vs > * {
          position: relative;
          z-index: 1;
        }

        /* ── Title ───────────────────────────── */
        .vl-vs__title {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .12em;
          color: var(--vl-muted);
          margin: 0;
        }

        /* ── Rings grid ──────────────────────── */
        .vl-vs__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          justify-items: center;
        }
      `}</style>
    </section>
  );
};
