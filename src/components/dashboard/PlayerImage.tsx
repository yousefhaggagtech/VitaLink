'use client';

import React from 'react';
import { colors, font, statusConfig, StatusType } from '@/styles/tokens/colors';

interface PlayerImageProps {
  name: string;
  initials: string;
  status: StatusType;
  imageUrl?: string;
}

type PlayerImageStyle = React.CSSProperties & {
  '--player-accent': string;
  '--player-accent-soft': string;
  '--player-glow': string;
};

export const PlayerImage: React.FC<PlayerImageProps> = ({
  name,
  initials,
  status,
  imageUrl,
}) => {
  const cfg = statusConfig[status];

  const cssVars: PlayerImageStyle = {
    '--player-accent': cfg.color,
    '--player-accent-soft': cfg.border,
    '--player-glow': status === 'critical' ? colors.criticalGlow : colors.athleteCard.glow,
  };

  return (
    <div className="vl-player-image" style={cssVars} aria-label={`${name} player portrait`}>

      {/* ── 3D base platform under the circle ── */}
      <div className="vl-player-image__platform">
        <div className="vl-player-image__platform-top" />
        <div className="vl-player-image__platform-side" />
      </div>

      {/* ── Ground reflection / soft drop shadow ── */}
      <div className="vl-player-image__ground-shadow" />

      {/* ── Main circular frame ── */}
      <div className="vl-player-image__frame">

        <div className="vl-player-image__bg-layers">
          <div className="layer-base" />
          <div className="layer-glow" />
          <div className="layer-pattern" />
        </div>

        <div className="vl-player-image__content">
          {imageUrl ? (
            <img
              className="vl-player-image__photo"
              src={imageUrl}
              alt={name}
              draggable={false}
            />
          ) : (
            <div className="vl-player-image__fallback">
              {initials}
            </div>
          )}
        </div>

        <div className="vl-player-image__overlay" />
      </div>

      {/* ── Decorative dots ── */}
      <div className="vl-player-image__dots" />

      {/* ── Subtle accent ring (outer) ── */}
      <div className="vl-player-image__outer-ring" />

      <style>{`
        .vl-player-image {
          position: relative;
          width: min(100%, clamp(8.75rem, 20cqw, 13.75rem));
          aspect-ratio: 1;
          z-index: 1;
          justify-self: center;
        }

        /* ── 3D platform base ──────────────────────────────── */
        .vl-player-image__platform {
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 74%;
          z-index: 0;
          pointer-events: none;
        }

        /* Elliptical "top face" of the platform */
        .vl-player-image__platform-top {
          width: 100%;
          height: 14px;
          background: radial-gradient(
            ellipse at 50% 50%,
            rgba(var(--player-accent-rgb, 103,232,120), 0.13) 0%,
            rgba(0,0,0,0) 70%
          );
          border-radius: 50%;
          filter: blur(3px);
        }

        /* Thin vertical "side face" for depth illusion */
        .vl-player-image__platform-side {
          margin-top: -2px;
          width: 100%;
          height: 6px;
          background: linear-gradient(
            180deg,
            rgba(0,0,0,0.32) 0%,
            rgba(0,0,0,0) 100%
          );
          border-radius: 0 0 50% 50%;
          filter: blur(2px);
          opacity: 0.6;
        }

        /* ── Ground shadow (soft ellipse below circle) ──── */
        .vl-player-image__ground-shadow {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 18px;
          background: radial-gradient(
            ellipse at 50% 30%,
            var(--player-glow) 0%,
            transparent 70%
          );
          border-radius: 50%;
          filter: blur(6px);
          opacity: 0.55;
          z-index: 0;
          pointer-events: none;
        }

        /* ── Outer accent ring (subtle, not glowing) ──── */
        .vl-player-image__outer-ring {
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          border: 1px solid var(--player-accent-soft);
          opacity: 0.35;
          pointer-events: none;
          z-index: 3;
        }

        /* ── Main frame ────────────────────────────────── */
        .vl-player-image__frame {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid var(--player-accent-soft);
          background: #02080f;
          /* Kept shadow tight — no wide glow spread */
          box-shadow:
            0 8px 24px rgba(0,0,0,0.55),
            inset 0 0 14px rgba(0,0,0,0.7);
          z-index: 2;
        }

        .vl-player-image__bg-layers {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .layer-base {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, #061412 0%, #02080f 100%);
        }

        /* Kept subtle — only inside the circle */
        .layer-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 50% 30%,
            var(--player-accent) 0%,
            transparent 65%
          );
          opacity: 0.10;
          filter: blur(16px);
        }

        .layer-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          background-image: radial-gradient(white 1px, transparent 1px);
          background-size: 14px 14px;
        }

        .vl-player-image__content {
          position: absolute;
          inset: 0;
          z-index: 1;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .vl-player-image__photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: contrast(1.04) brightness(1.08);
        }

        .vl-player-image__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.38) 100%);
          pointer-events: none;
          z-index: 3;
        }

        .vl-player-image__fallback {
          color: var(--player-accent);
          font-family: ${font.display};
          font-size: clamp(2rem, 8cqw, 4rem);
          font-weight: 800;
          opacity: 0.85;
        }

        .vl-player-image__dots {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 106%;
          height: 106%;
          transform: translate(-50%, -50%);
          background-image: radial-gradient(
            circle,
            var(--player-accent) 1px,
            transparent 1.2px
          );
          background-size: 7% 7%;
          opacity: 0.11;
          z-index: 1;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};
