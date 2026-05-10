'use client';

import React, { useMemo } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface MiniSparklineProps {
  data:        number[];
  color?:      string;
  width?:      number;
  height?:     number;
  strokeWidth?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildPath(
  data: number[],
  w: number,
  h: number,
): { line: string; fill: string } {
  if (data.length < 2) return { line: '', fill: '' };

  const min   = Math.min(...data);
  const max   = Math.max(...data);
  const range = max - min || 1;
  const pad   = 2;

  const coords: [number, number][] = data.map((v, i) => [
    +((i / (data.length - 1)) * w).toFixed(1),
    +(h - pad - ((v - min) / range) * (h - pad * 2)).toFixed(1),
  ]);

  // Smooth bezier line
  const line = coords.reduce((acc, [x, y], i) => {
    if (i === 0) return `M ${x} ${y}`;
    const [px, py] = coords[i - 1];
    const cpx = (px + x) / 2;
    return `${acc} C ${cpx} ${py}, ${cpx} ${y}, ${x} ${y}`;
  }, '');

  const [lx, ly] = coords[coords.length - 1];
  const [fx]     = coords[0];
  const fill = `${line} L ${lx} ${h} L ${fx} ${h} Z`;

  return { line, fill };
}

// ─── Component ────────────────────────────────────────────────────────────────
export const MiniSparkline: React.FC<MiniSparklineProps> = ({
  data,
  color       = '#D4607A',
  width       = 100,
  height      = 36,
  strokeWidth = 1.6,
}) => {
  const { line, fill } = useMemo(
    () => buildPath(data, width, height),
    [data, width, height],
  );

  // Unique IDs to avoid SVG defs collision across multiple instances
  const uid = useMemo(
    () => `sp-${Math.random().toString(36).slice(2, 7)}`,
    [],
  );

  // Live dot — last point
  const lastPt = useMemo(() => {
    if (data.length < 2) return null;
    const min   = Math.min(...data);
    const max   = Math.max(...data);
    const range = max - min || 1;
    const pad   = 2;
    const x = width;
    const y = height - pad - ((data[data.length - 1] - min) / range) * (height - pad * 2);
    return { x: +x.toFixed(1), y: +y.toFixed(1) };
  }, [data, width, height]);

  if (!line) return null;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ overflow: 'visible', display: 'block' }}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${uid}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.20" />
          <stop offset="100%" stopColor={color} stopOpacity="0"    />
        </linearGradient>
        <linearGradient id={`${uid}-line`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.55" />
          <stop offset="48%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0.78" />
        </linearGradient>
        <filter id={`${uid}-soft`} x="-20%" y="-70%" width="140%" height="240%">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
        <clipPath id={`${uid}-c`}>
          <rect x="0" y="0" width={width} height={height} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${uid}-c)`}>
        {/* Area fill */}
        <path d={fill} fill={`url(#${uid}-g)`} />

        {/* Line */}
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth + 2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.16"
          filter={`url(#${uid}-soft)`}
        />
        <path
          d={line}
          fill="none"
          stroke={`url(#${uid}-line)`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </g>

      {/* Animated live dot */}
      {lastPt && (
        <>
          <circle cx={lastPt.x} cy={lastPt.y} r="4.4" fill={color} opacity="0.08" />
          <circle cx={lastPt.x} cy={lastPt.y} r="2.2" fill={color}>
            <animate attributeName="r"       values="2;3.2;2" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </svg>
  );
};
