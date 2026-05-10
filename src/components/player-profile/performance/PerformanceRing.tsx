'use client';

import React, { useMemo } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface PerformanceRingProps {
  value:   number;    // 0–100
  size?:   number;    // px default 100
  stroke?: number;    // default 10
}

// ─── Component ────────────────────────────────────────────────────────────────
export const PerformanceRing: React.FC<PerformanceRingProps> = ({
  value,
  size   = 100,
  stroke = 10,
}) => {
  const uid = useMemo(() => `pfr-${Math.random().toString(36).slice(2, 6)}`, []);
  const r   = (size - stroke) / 2;
  const c   = 2 * Math.PI * r;
  const off = c - (value / 100) * c;

  return (
    <div className="vl-pfr" style={{ width: size, height: size }}>
      <svg
        width={size} height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
        aria-hidden
      >
        <defs>
          {/* Lime → green gradient matching design spec */}
          <linearGradient id={`${uid}-g`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#B6FF2E" />
            <stop offset="55%"  stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
          <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={stroke}
        />

        {/* Progress arc */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={`url(#${uid}-g)`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          opacity="0.18"
          filter={`url(#${uid}-soft)`}
          style={{ transition: 'stroke-dashoffset .8s ease' }}
        />

        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={`url(#${uid}-g)`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          style={{ transition: 'stroke-dashoffset .8s ease' }}
        />

        {/* Inner depth bevel */}
        <circle
          cx={size / 2} cy={size / 2}
          r={r - stroke / 2 - 1}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
        />
      </svg>

      {/* Center label */}
      <div className="vl-pfr__center">
        <span className="vl-pfr__score">{Math.round(value)}</span>
        <span className="vl-pfr__denom">/100</span>
      </div>

      <style>{`
        .vl-pfr {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .vl-pfr__center {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: none;
        }

        .vl-pfr__score {
          font-family: 'JetBrains Mono', monospace;
          font-size: 26px;
          font-weight: 700;
          color: var(--vl-text);
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }

        .vl-pfr__denom {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          color: var(--vl-muted-deep);
          margin-top: 1px;
        }
      `}</style>
    </div>
  );
};
