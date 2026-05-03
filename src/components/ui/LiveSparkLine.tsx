'use client';

import React, { useRef, useState, useCallback } from 'react';

interface LiveSparklineProps {
  /** Initial history — oldest first, newest last */
  data:        number[];
  width?:      number;
  height?:     number;
  strokeWidth?: number;
  color?:      string;
  /** How many points to keep in the window */
  maxPoints?:  number;
}

export const LiveSparkline: React.FC<LiveSparklineProps> = ({
  data,
  width      = 88,
  height     = 32,
  strokeWidth = 2,
  color      = '#FF4D6A',
  maxPoints  = 20,
}) => {
  const [points, setPoints] = useState<number[]>(() =>
    data.slice(-maxPoints)
  );

  // Build SVG path from points array
  const buildPath = useCallback((pts: number[]) => {
    if (pts.length < 2) return { line: '', fill: '' };

    const min   = Math.min(...pts);
    const max   = Math.max(...pts);
    const range = max - min || 1;
    const pad   = 2;

    const coords = pts.map((v, i) => {
      const x = (i / (pts.length - 1)) * width;
      const y = height - pad - ((v - min) / range) * (height - pad * 2);
      return [+x.toFixed(1), +y.toFixed(1)] as [number, number];
    });

    // Smooth curve using cubic bezier
    const line = coords.reduce((acc, [x, y], i) => {
      if (i === 0) return `M ${x} ${y}`;
      const [px, py] = coords[i - 1];
      const cpx = (px + x) / 2;
      return `${acc} C ${cpx} ${py}, ${cpx} ${y}, ${x} ${y}`;
    }, '');

    const last  = coords[coords.length - 1];
    const first = coords[0];
    const fill  = `${line} L ${last[0]} ${height} L ${first[0]} ${height} Z`;

    return { line, fill };
  }, [width, height]);

  const { line, fill } = buildPath(points);
  const gradId = useRef(`spark-grad-${Math.random().toString(36).slice(2,7)}`).current;
  const clipId = useRef(`spark-clip-${Math.random().toString(36).slice(2,7)}`).current;
  const aniId  = useRef(`spark-scroll-${Math.random().toString(36).slice(2,7)}`).current;

  // Live dot position — last point
  const lastPt = (() => {
    const pts = points;
    if (pts.length < 2) return null;
    const min   = Math.min(...pts);
    const max   = Math.max(...pts);
    const range = max - min || 1;
    const pad   = 2;
    const x     = width;
    const y     = height - pad - ((pts[pts.length-1] - min) / range) * (height - pad * 2);
    return { x: +x.toFixed(1), y: +y.toFixed(1) };
  })();

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ overflow: 'visible' }}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0"    />
        </linearGradient>
        <clipPath id={clipId}>
          <rect x="0" y="0" width={width} height={height} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        {/* Fill */}
        <path d={fill} fill={`url(#${gradId})`} />

        {/* Line */}
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Live dot at rightmost point */}
      {lastPt && (
        <circle cx={lastPt.x} cy={lastPt.y} r="2.5" fill={color}>
          <animate
            attributeName="r"
            values="2;3.5;2"
            dur="0.8s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0.4;1"
            dur="0.8s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* Soft glow on line — subtle filter, not spread */}
      <style>{`
        @keyframes ${aniId} {
          from { transform: translateX(0); }
          to   { transform: translateX(-4px); }
        }
      `}</style>
    </svg>
  );
};