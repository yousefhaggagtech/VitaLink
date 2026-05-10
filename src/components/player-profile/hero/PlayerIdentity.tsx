'use client';

import React from 'react';
import { StatusType } from '@/styles/tokens/colors';

// ─── Types ────────────────────────────────────────────────────────────────────
interface PlayerIdentityProps {
  name:     string;
  position: string;
  status:   StatusType;
}

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<StatusType, {
  label: string;
  color: string;
  bg:    string;
  border:string;
}> = {
  fit: {
    label:  'FIT',
    color:  '#B6FF2E',
    bg:     'rgba(182,255,46,0.09)',
    border: 'rgba(182,255,46,0.22)',
  },
  moderate: {
    label:  'MODERATE',
    color:  '#FFB800',
    bg:     'rgba(255,184,0,0.09)',
    border: 'rgba(255,184,0,0.20)',
  },
  critical: {
    label:  'CRITICAL',
    color:  '#FF5A5F',
    bg:     'rgba(255,90,95,0.09)',
    border: 'rgba(255,90,95,0.22)',
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
export const PlayerIdentity: React.FC<PlayerIdentityProps> = ({
  name,
  position,
  status,
}) => {
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="vl-identity">

      {/* Name + status pill */}
      <div className="vl-identity__name-row">
        <h1 className="vl-identity__name">{name.toUpperCase()}</h1>

        {/* Status pill */}
        <div
          className={`vl-identity__pill${status === 'critical' ? ' is-critical' : ''}`}
          style={{
            color:       cfg.color,
            background:  cfg.bg,
            border:      `0.5px solid ${cfg.border}`,
          }}
          role="status"
          aria-label={`Player status: ${cfg.label}`}
        >
          {/* Live dot */}
          <span
            className="vl-identity__dot"
            style={{ background: cfg.color }}
            aria-hidden
          />
          <span className="vl-identity__pill-text">{cfg.label}</span>
        </div>
      </div>

      {/* Position */}
      <p className="vl-identity__position">{position.toUpperCase()}</p>

      <style>{`
        /* ── Wrapper ─────────────────────────── */
        .vl-identity {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        /* ── Name row ────────────────────────── */
        .vl-identity__name-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        /* ── Name ────────────────────────────── */
        .vl-identity__name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 38px;
          font-weight: 700;
          letter-spacing: .02em;
          color: var(--vl-text);
          line-height: 1;
          margin: 0;
        }

        @media (max-width: 560px) {
          .vl-identity__name { font-size: 32px; }
        }

        /* ── Status pill ─────────────────────── */
        .vl-identity__pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 9999px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .08em;
          flex-shrink: 0;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        /* Critical pulse animation */
        .vl-identity__pill.is-critical {
          animation: vl-id-crit 1.8s ease-in-out infinite;
        }
        @keyframes vl-id-crit {
          0%,100% { opacity: 1; }
          50%      { opacity: .65; }
        }

        /* Live indicator dot */
        .vl-identity__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 10px currentColor;
        }

        .vl-identity__pill-text {
          line-height: 1;
        }

        /* ── Position ────────────────────────── */
        .vl-identity__position {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: .14em;
          color: var(--vl-lime);
          margin: 0;
        }
      `}</style>
    </div>
  );
};
