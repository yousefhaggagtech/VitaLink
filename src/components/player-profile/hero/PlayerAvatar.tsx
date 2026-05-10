'use client';

import React from 'react';
import { StatusType } from '@/styles/tokens/colors';

// ─── Types ────────────────────────────────────────────────────────────────────
interface PlayerAvatarProps {
  name:         string;
  initials:     string;
  jerseyNumber: number;
  imageUrl?:    string;
  status:       StatusType;
  size?:        number;   // px — default 96
}

// ─── Status ring color ────────────────────────────────────────────────────────
const ringColor: Record<StatusType, string> = {
  fit:      '#B6FF2E',
  moderate: '#FFB800',
  critical: '#FF5A5F',
};

// ─── Component ────────────────────────────────────────────────────────────────
export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  name,
  initials,
  jerseyNumber,
  imageUrl,
  status,
  size = 96,
}) => {
  const ring   = ringColor[status];
  const inner  = size - 10;           // image circle inset from ring
  const uid    = `av-${jerseyNumber}`;

  return (
    <div
      className="vl-avatar"
      style={{
        width:  size,
        height: size,
        '--ring':  ring,
        '--glow':  status === 'fit'
          ? 'rgba(182,255,46,0.16)'
          : status === 'critical'
          ? 'rgba(255,90,95,0.16)'
          : 'rgba(255,184,0,0.14)',
        '--inner': `${inner}px`,
      } as React.CSSProperties}
      aria-label={`${name} avatar`}
    >
      {/* ── SVG ring (with rotation animation) ── */}
      <svg
        className="vl-avatar__ring-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden
      >
        <defs>
          {/* Gradient around the ring */}
          <linearGradient id={`${uid}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={ring}  stopOpacity="1"   />
            <stop offset="50%"  stopColor={ring}  stopOpacity="0.4" />
            <stop offset="100%" stopColor={ring}  stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2}
          r={(size - 5) / 2}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="3"
        />

        {/* Animated arc */}
        <circle
          cx={size / 2} cy={size / 2}
          r={(size - 5) / 2}
          fill="none"
          stroke={`url(#${uid}-grad)`}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * ((size - 5) / 2) * 0.78} ${2 * Math.PI * ((size - 5) / 2)}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="vl-avatar__arc"
        />
      </svg>

      {/* ── Photo / fallback ── */}
      <div className="vl-avatar__photo-wrap">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="vl-avatar__photo"
            draggable={false}
          />
        ) : (
          <span className="vl-avatar__initials">{initials}</span>
        )}
        {/* Inner gradient overlay */}
        <div className="vl-avatar__overlay" aria-hidden />
      </div>

      {/* ── Jersey badge ── */}
      <div className="vl-avatar__jersey" aria-label={`Jersey #${jerseyNumber}`}>
        #{jerseyNumber}
      </div>

      <style>{`
        /* ── Shell ───────────────────────────── */
        .vl-avatar {
          position: relative;
          flex-shrink: 0;
          isolation: isolate;
        }

        /* ── Outer glow ──────────────────────── */
        .vl-avatar::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--glow), transparent 72%);
          filter: blur(8px);
          pointer-events: none;
          z-index: 0;
        }

        .vl-avatar::after {
          content: '';
          position: absolute;
          inset: 7px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.08);
          background:
            linear-gradient(115deg, rgba(255,255,255,0.08), transparent 34%);
          pointer-events: none;
          z-index: 2;
        }

        /* ── Rotating SVG ring ───────────────── */
        .vl-avatar__ring-svg {
          position: absolute;
          inset: 0;
          z-index: 2;
          animation: vl-av-spin 14s linear infinite;
          transform-origin: center;
        }
        @keyframes vl-av-spin {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }

        /* ── Photo circle ────────────────────── */
        .vl-avatar__photo-wrap {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: var(--inner);
          height: var(--inner);
          border-radius: 50%;
          overflow: hidden;
          background:
            radial-gradient(circle at 38% 22%, rgba(255,255,255,0.12), transparent 34%),
            #07111F;
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.16),
            inset 0 -18px 26px rgba(0,0,0,0.36),
            0 16px 34px rgba(0,0,0,0.34);
          z-index: 1;
        }

        .vl-avatar__photo {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: 58% 18%;
          filter: saturate(0.96) contrast(1.06) brightness(1.02);
        }

        .vl-avatar__initials {
          display: flex;
          align-items: center; justify-content: center;
          width: 100%; height: 100%;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: var(--ring);
          opacity: .85;
        }

        .vl-avatar__overlay {
          position: absolute; inset: 0;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.08), transparent 34%),
            linear-gradient(to bottom, transparent 48%, rgba(0,0,0,0.42) 100%);
          pointer-events: none;
        }

        /* ── Jersey badge ────────────────────── */
        .vl-avatar__jersey {
          position: absolute;
          bottom: 2px; left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .04em;
          color: var(--ring);
          background: rgba(5,8,22,0.82);
          border: 0.5px solid var(--ring);
          border-radius: 9999px;
          padding: 1px 7px;
          white-space: nowrap;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 0 10px var(--glow), inset 0 1px 0 rgba(255,255,255,0.10);
          opacity: .9;
        }
      `}</style>
    </div>
  );
};
