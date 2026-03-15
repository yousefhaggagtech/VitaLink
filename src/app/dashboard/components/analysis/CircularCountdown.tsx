"use client";

import React from "react";
import { CircularCountdownProps } from "@/domain/types/types";

const CircularCountdown: React.FC<CircularCountdownProps> = ({ counter, theme }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (counter / 10) * circumference;

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div style={{ position: 'relative', width: '120px', height: '120px' }}>
        <svg
          width="120"
          height="120"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'rotate(-90deg)',
          }}
        >
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={theme.border.medium}
            strokeWidth="2"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={theme.accent.primary}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.5s ease-in-out',
              filter: `drop-shadow(0 0 8px ${theme.accent.primary})`,
            }}
          />
        </svg>

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}
        >
          <span
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: theme.accent.primary,
              lineHeight: '1',
            }}
          >
            {Math.max(0, counter)}
          </span>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 'bold',
              color: theme.text.tertiary,
              letterSpacing: '0.05em',
            }}
          >
            SECONDS
          </span>
        </div>
      </div>
    </div>
  );
};

export default CircularCountdown;
