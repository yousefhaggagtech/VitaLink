'use client';

import React, { useMemo } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface WellnessRingProps {
  value:  number;   // 0–100
  size?:  number;   // px (default 110)
  stroke?: number;  // stroke width (default 9)
}

// ─── Component ────────────────────────────────────────────────────────────────
export const WellnessRing: React.FC<WellnessRingProps> = ({
  value,
  size   = 110,
  stroke = 9,
}) => {
  const uid = useMemo(() => `wr-${Math.random().toString(36).slice(2, 6)}`, []);
  const r   = (size - stroke) / 2;
  const c   = 2 * Math.PI * r;
  const off = c - (value / 100) * c;

  return (
    <div className="vl-wr" style={{ width: size, height: size }}>
      <svg
        width={size} height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
        aria-hidden
      >
        <defs>
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

        {/* Inner bevel highlight */}
        <circle
          cx={size / 2} cy={size / 2} r={r - stroke / 2 - 1}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
        />
      </svg>

      {/* Center text (not rotated) */}
      <div className="vl-wr__center">
        <span className="vl-wr__score">{Math.round(value)}</span>
        <span className="vl-wr__denom">/100</span>
      </div>

      <style>{`
        .vl-wr {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .vl-wr__center {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }

        .vl-wr__score {
          font-family: 'JetBrains Mono', monospace;
          font-size: 28px;
          font-weight: 700;
          color: var(--vl-text);
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }

        .vl-wr__denom {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          color: var(--vl-muted-deep);
        }
      `}</style>
    </div>
  );
};
