'use client';

import React, { useMemo } from 'react';

interface HydrationDropProps {
  value:   number;   // SpO2 % (0–100)
  size?:   number;   // px (default 28)
  color?:  string;
}

export const HydrationDrop: React.FC<HydrationDropProps> = ({
  value,
  size  = 28,
  color = '#37C7F1',
}) => {
  const uid = useMemo(() => `drop-${Math.random().toString(36).slice(2, 7)}`, []);

  // Fill level — map SpO2 to vertical fill inside the drop shape
  // 100% SpO2 = full, 90% = half, <90% = low
  const fillPercent = Math.max(0, Math.min(100, value));

  return (
    <div
      style={{
        position:        'relative',
        width:           size + 16,
        height:          size + 16,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Clip to the drop shape */}
          <clipPath id={`${uid}-clip`}>
            <path d="M12 2 C12 2 4 10.5 4 15 A8 8 0 0 0 20 15 C20 10.5 12 2 12 2 Z" />
          </clipPath>

          {/* Gradient for the fill */}
          <linearGradient id={`${uid}-fill-grad`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={color} stopOpacity="0.55" />
          </linearGradient>
        </defs>

        {/* ── Stroke outline ── */}
        <path
          d="M12 2 C12 2 4 10.5 4 15 A8 8 0 0 0 20 15 C20 10.5 12 2 12 2 Z"
          stroke={color}
          strokeWidth="1.6"
          strokeLinejoin="round"
          fill="none"
          opacity="0.6"
        />

        {/* ── Animated water fill (clipped inside the drop) ── */}
        <g clipPath={`url(#${uid}-clip)`}>
          {/* Static fill rect — height driven by fillPercent */}
          <rect
            className={`${uid}-fill`}
            x="4"
            y={23 - (19 * fillPercent) / 100}   // 19 = usable fill height
            width="16"
            height="20"
            fill={`url(#${uid}-fill-grad)`}
          />

          {/* Wave overlay — subtle sine-wave motion */}
          <path
            className={`${uid}-wave`}
            fill={color}
            fillOpacity="0.18"
            d="M2 15 Q6 13 10 15 Q14 17 18 15 Q22 13 26 15 L26 24 L2 24 Z"
          />
        </g>

        {/* ── Specular highlight (top-right shine dot) ── */}
        <circle
          cx="14.5"
          cy="8"
          r="1.2"
          fill="white"
          opacity="0.35"
        />
      </svg>

      <style>{`
        /* Wave moves left → right slowly */
        @keyframes ${uid}-wave {
          0%   { transform: translateX(-8px); }
          100% { transform: translateX(8px);  }
        }

        /* Fill breathes very slightly */
        @keyframes ${uid}-breathe {
          0%, 100% { transform: translateY(0);   }
          50%       { transform: translateY(-1px); }
        }

        .${uid}-wave {
          animation: ${uid}-wave 2.4s ease-in-out infinite alternate;
          transform-origin: center;
        }

        .${uid}-fill {
          animation: ${uid}-breathe 3s ease-in-out infinite;
          transform-origin: bottom;
          transition: y 0.8s ease, height 0.8s ease;
        }
      `}</style>
    </div>
  );
};