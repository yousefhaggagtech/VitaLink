import React, { useId } from 'react';

interface DonutRingProps {
  value:     number;   // 0–100
  size?:     number;   // px (default 52)
  stroke?:   number;   // stroke width (default 5)
  color?:    string;
  secondaryColor?: string;
  trackColor?: string;
  showGlow?: boolean;
}

export const DonutRing: React.FC<DonutRingProps> = ({
  value,
  size     = 52,
  stroke   = 5,
  color,
  secondaryColor,
  trackColor = 'rgba(255,255,255,0.08)',
  showGlow = false,
}) => {
  const gradientId = useId().replace(/:/g, '');
  const glowId = `${gradientId}-glow`;
  const r         = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset    = circumference - (value / 100) * circumference;

  // Color based on value if not passed
  const resolvedColor = color ?? (
    value >= 97 ? '#00E87A' :
    value >= 94 ? '#FFB800' :
    '#FF4D4D'
  );
  const gradientEnd = secondaryColor ?? resolvedColor;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={resolvedColor} />
          <stop offset="100%" stopColor={gradientEnd} />
        </linearGradient>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={trackColor}
        strokeWidth={stroke}
      />
      {/* Progress */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        filter={showGlow ? `url(#${glowId})` : undefined}
        style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.3s ease' }}
      />
    </svg>
  );
};
