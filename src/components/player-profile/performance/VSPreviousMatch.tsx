'use client';

import React, { useMemo } from 'react';
import type { ProfileComparisonMetric, ProfileAIVisualState } from '@/application/mappers/toPlayerProfile';

interface ComparisonMetric {
  label: string;
  value: number | null;
  delta: number | null;
  color: string;
  stateLabel: string;
}

interface VSPreviousMatchProps {
  fatigue: ProfileComparisonMetric;
  load: ProfileComparisonMetric;
  stress: ProfileComparisonMetric;
  matchLabel?: string;
  visualState?: ProfileAIVisualState;
}

interface ComparisonRingProps {
  metric: ComparisonMetric;
  size?: number;
  stroke?: number;
}

const ComparisonRing: React.FC<ComparisonRingProps> = ({
  metric,
  size = 68,
  stroke = 6,
}) => {
  const uid = useMemo(() => `cmp-${Math.random().toString(36).slice(2, 6)}`, []);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const safeValue = metric.value === null ? 0 : Math.min(100, Math.max(0, metric.value));
  const off = c - (safeValue / 100) * c;

  const hasDelta = metric.delta !== null;
  const deltaValue = metric.delta ?? 0;
  const deltaPositive = hasDelta && deltaValue > 0;
  const deltaColor = deltaPositive ? '#FF5A5F' : '#B6FF2E';
  const deltaSign = !hasDelta ? '' : deltaValue > 0 ? '+' : deltaValue < 0 ? '-' : '';

  return (
    <div className="vl-cmp">
      <div className="vl-cmp__ring-wrap" style={{ width: size, height: size }}>
        <svg
          width={size} height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(-90deg)' }}
          aria-hidden
        >
          <defs>
            <linearGradient id={`${uid}-g`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={metric.color} stopOpacity="0.9" />
              <stop offset="100%" stopColor={metric.color} stopOpacity="0.55" />
            </linearGradient>
          </defs>

          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={stroke}
          />

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

        <div className="vl-cmp__center">
          <span className="vl-cmp__pct" style={{ color: metric.color }}>
            {metric.value === null ? '--' : `${Math.round(metric.value)}%`}
          </span>
        </div>
      </div>

      <span className="vl-cmp__label">{metric.label}</span>

      {hasDelta ? (
        <div
          className="vl-cmp__delta"
          style={{ color: deltaColor }}
          aria-label={`${deltaValue > 0 ? 'up' : 'down'} ${Math.abs(deltaValue)}% from latest AI baseline`}
        >
          <span className="vl-cmp__delta-sign">{deltaSign}</span>
          <span className="vl-cmp__delta-val">{Math.abs(deltaValue)}%</span>
        </div>
      ) : (
        <div
          className="vl-cmp__delta"
          style={{ color: 'var(--vl-muted-deep)' }}
          aria-label={`${metric.label} ${metric.stateLabel.toLowerCase()} from latest AI`}
        >
          <span className="vl-cmp__delta-val">{metric.stateLabel}</span>
        </div>
      )}

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
        .vl-cmp__delta-val { font-family: 'JetBrains Mono', monospace; font-size: 10px; }
      `}</style>
    </div>
  );
};

export const VSPreviousMatch: React.FC<VSPreviousMatchProps> = ({
  fatigue,
  load,
  stress,
  matchLabel = 'latest AI metrics',
  visualState = 'live',
}) => {
  const pendingColor =
    visualState === 'stale' ? '#FFB800' :
    visualState === 'warmup' ? '#60A5FA' :
    visualState === 'mismatch' || visualState === 'error' ? '#FF5A5F' :
    '#8B5CF6';
  const stateLabel =
    visualState === 'stale' ? 'STALE' :
    visualState === 'warmup' ? 'WARM' :
    visualState === 'mismatch' ? 'BELT' :
    visualState === 'error' ? 'OFF' :
    visualState === 'no-data' || visualState === 'loading' ? 'PEND' :
    'LIVE';
  const metrics: ComparisonMetric[] = [
    { label: 'Cramp', value: fatigue.value, delta: fatigue.delta, color: fatigue.value === null ? pendingColor : '#FACC15', stateLabel },
    { label: 'Power', value: load.value, delta: load.delta, color: load.value === null ? pendingColor : '#38BDF8', stateLabel },
    { label: 'Momentum', value: stress.value, delta: stress.delta, color: stress.value === null ? pendingColor : '#8B5CF6', stateLabel },
  ];

  return (
    <section className="vl-vs" aria-labelledby="vl-vs-title">
      <h2 className="vl-vs__title" id="vl-vs-title">
        {matchLabel.toUpperCase()}
      </h2>

      <div className="vl-vs__grid" role="list">
        {metrics.map(metric => (
          <div key={metric.label} role="listitem">
            <ComparisonRing metric={metric} />
          </div>
        ))}
      </div>

      <style>{`
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

        .vl-vs__title {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .12em;
          color: var(--vl-muted);
          margin: 0;
        }

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
