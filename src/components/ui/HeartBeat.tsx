'use client';

import React, { useMemo } from 'react';

interface HeartBeatProps {
  bpm:     number;   // actual heart rate value
  size?:   number;   // icon size px (default 28)
  color?:  string;   // default red
}

/**
 * Converts BPM → CSS animation duration.
 * 60 BPM  = 1.0s per beat
 * 120 BPM = 0.5s per beat
 * 180 BPM = 0.33s per beat
 */
const bpmToDuration = (bpm: number): string => {
  const clamped = Math.max(40, Math.min(220, bpm));
  return `${(60 / clamped).toFixed(3)}s`;
};

export const HeartBeat: React.FC<HeartBeatProps> = ({
  bpm,
  size  = 28,
  color = '#FF4D6A',
}) => {
  const duration = useMemo(() => bpmToDuration(bpm), [bpm]);
  const uid      = useMemo(() => `hb-${Math.random().toString(36).slice(2, 7)}`, []);

  return (
    <div
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        width:          size + 16,
        height:         size + 16,
        position:       'relative',
      }}
    >
      {/* Pulse ring */}
      <div
        className={`${uid}-ring`}
        style={{
          position:     'absolute',
          inset:        0,
          borderRadius: '50%',
          border:       `1.5px solid ${color}`,
          opacity:      0,
          pointerEvents:'none',
        }}
      />

      {/* Heart SVG */}
      <svg
        className={`${uid}-heart`}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Filled heart */}
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          fill={color}
          opacity="0.15"
        />
        {/* Stroke heart */}
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <style>{`
        /* ── Heart beat: scale up on beat, ease back ── */
        @keyframes ${uid}-beat {
          0%   { transform: scale(1);    }
          14%  { transform: scale(1.28); }
          28%  { transform: scale(1);    }
          42%  { transform: scale(1.14); }  /* double-thump */
          56%  { transform: scale(1);    }
          100% { transform: scale(1);    }
        }

        /* ── Pulse ring expands and fades ── */
        @keyframes ${uid}-ring {
          0%   { transform: scale(0.85); opacity: 0.6; }
          100% { transform: scale(1.7);  opacity: 0;   }
        }

        .${uid}-heart {
          animation: ${uid}-beat ${duration} ease-in-out infinite;
          transform-origin: center;
          filter: drop-shadow(0 0 4px ${color}66);
        }

        .${uid}-ring {
          animation: ${uid}-ring ${duration} ease-out infinite;
          transform-origin: center;
        }
      `}</style>
    </div>
  );
};