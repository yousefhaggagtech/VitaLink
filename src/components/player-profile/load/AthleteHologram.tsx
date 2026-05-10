'use client';

import React from 'react';
import Image from 'next/image';

interface AthleteHologramProps {
  fatigueLevel?: number;
  size?: number;
}

const getLoadCopy = (value: number) => {
  if (value > 80) return 'HIGH LOAD';
  if (value > 55) return 'MOD LOAD';
  return 'OPTIMAL';
};

export const AthleteHologram: React.FC<AthleteHologramProps> = ({
  fatigueLevel = 30,
  size = 140,
}) => {
  const load = Math.max(0, Math.min(100, Math.round(fatigueLevel)));

  const accentColor =
    load > 80 ? '#FF5A5F' :
    load > 55 ? '#FFB800' :
    '#B6FF2E';

  const accentRgb =
    load > 80 ? '255,90,95' :
    load > 55 ? '255,184,0' :
    '182,255,46';

  return (
    <div
      className="vl-holo"
      style={{
        '--holo-size': `${size}px`,
        '--accent': accentColor,
        '--accent-rgb': accentRgb,
      } as React.CSSProperties}
      aria-hidden
    >
      <div className="vl-holo__card">
        <div className="vl-holo__ambient" />
        <div className="vl-holo__scan" />

        <Image
          className="vl-holo__athlete"
          src="/athlete.png"
          alt=""
          width={1024}
          height={1024}
          draggable={false}
          decoding="async"
        />

        <div className="vl-holo__platform" />
        <div className="vl-holo__floor-glow" />

        <div className="vl-holo__readout">
          <span className="vl-holo__label">AI LOAD</span>
          <span className="vl-holo__value">
            {load}
            <small>%</small>
          </span>
          <span className="vl-holo__state">{getLoadCopy(load)}</span>
        </div>
      </div>

      <style>{`
        .vl-holo {
          --panel-height: calc(var(--holo-size) * 1.08);
          position: relative;
          width: var(--holo-size);
          flex-shrink: 0;
          isolation: isolate;
          perspective: 720px;
        }

        .vl-holo__card {
          position: relative;
          height: var(--panel-height);
          margin-top: calc(var(--holo-size) * 0.34);
          overflow: visible;
          border: 1px solid rgba(255, 255, 255, 0.10);
          border-radius: 22px;
          background:
            linear-gradient(150deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03) 42%, rgba(4, 9, 22, 0.88));
          box-shadow:
            0 20px 42px rgba(0, 0, 0, 0.38),
            inset 0 1px 0 rgba(255, 255, 255, 0.14),
            inset 0 -22px 36px rgba(0, 0, 0, 0.28);
          backdrop-filter: blur(18px) saturate(124%);
          -webkit-backdrop-filter: blur(18px) saturate(124%);
          transform: rotateX(3deg) rotateY(-4deg);
          transform-style: preserve-3d;
        }

        .vl-holo__card::before {
          content: '';
          position: absolute;
          inset: 1px;
          z-index: 0;
          border-radius: 21px;
          background:
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px);
          background-size: 22px 22px;
          mask-image: linear-gradient(to bottom, transparent 0%, #000 32%, #000 100%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 32%, #000 100%);
          opacity: 0.18;
          pointer-events: none;
        }

        .vl-holo__card::after {
          content: '';
          position: absolute;
          left: 14%;
          right: 14%;
          bottom: -1px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent);
        }

        .vl-holo__ambient {
          position: absolute;
          top: -28%;
          left: 16%;
          z-index: 0;
          width: 68%;
          height: 52%;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(0,0,0,0.12), transparent 68%);
          filter: blur(12px);
          pointer-events: none;
        }

        .vl-holo__scan {
          position: absolute;
          inset: 9px;
          z-index: 1;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.045), transparent 34%);
          pointer-events: none;
        }

        .vl-holo__athlete {
          position: absolute;
          top: calc(var(--holo-size) * -0.42);
          left: 50%;
          z-index: 4;
          width: 122%;
          max-width: none;
          height: auto;
          user-select: none;
          pointer-events: none;
          transform-origin: 50% 86%;
          transform-style: preserve-3d;
          filter:
            drop-shadow(0 22px 14px rgba(0, 0, 0, 0.34))
            drop-shadow(0 0 10px rgba(var(--accent-rgb), 0.13));
          animation: vl-holo-athlete 4.8s ease-in-out infinite;
        }

        .vl-holo__platform {
          position: absolute;
          left: 50%;
          bottom: 39px;
          z-index: 3;
          width: 76%;
          height: 24px;
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 999px;
          background:
            radial-gradient(ellipse at 50% 42%, rgba(255,255,255,0.28), transparent 20%),
            radial-gradient(ellipse at 50% 54%, rgba(0,0,0,0.08), rgba(0,0,0,0.04) 46%, transparent 72%),
            linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent);
          box-shadow:
            inset 0 0 8px rgba(0,0,0,0.12);
          transform: translateX(-50%) rotateX(68deg);
          transform-style: preserve-3d;
        }

        .vl-holo__platform::before,
        .vl-holo__platform::after {
          content: '';
          position: absolute;
          inset: 4px 9px;
          border-radius: inherit;
          border: 1px solid rgba(255, 255, 255, 0.22);
        }

        .vl-holo__platform::after {
          inset: -6px -10px;
          border-color: rgba(255,255,255,0.08);
          filter: blur(1px);
        }

        .vl-holo__floor-glow {
          position: absolute;
          left: 50%;
          bottom: 28px;
          z-index: 2;
          width: 82%;
          height: 18px;
          border-radius: 999px;
          background: radial-gradient(ellipse, rgba(0,0,0,0.08), transparent 72%);
          filter: blur(7px);
          transform: translateX(-50%);
        }

        .vl-holo__readout {
          position: absolute;
          left: 11px;
          right: 11px;
          bottom: 10px;
          z-index: 5;
          display: grid;
          grid-template-columns: 1fr auto;
          grid-template-areas:
            "label value"
            "state value";
          align-items: end;
          column-gap: 8px;
        }

        .vl-holo__label,
        .vl-holo__state {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.1em;
        }

        .vl-holo__label {
          grid-area: label;
          color: var(--vl-text-soft);
          font-size: 9px;
          font-weight: 800;
        }

        .vl-holo__state {
          grid-area: state;
          color: var(--accent);
          font-size: 8px;
          font-weight: 700;
        }

        .vl-holo__value {
          grid-area: value;
          color: var(--vl-text);
          font-family: 'JetBrains Mono', monospace;
          font-size: 21px;
          font-weight: 800;
          line-height: 0.9;
          font-variant-numeric: tabular-nums;
        }

        .vl-holo__value small {
          color: var(--accent);
          font-size: 10px;
          font-weight: 800;
        }

        @keyframes vl-holo-athlete {
          0%, 100% {
            transform: translate3d(-50%, 0, 34px) perspective(420px) rotateX(6deg) rotateY(-18deg) rotateZ(-6deg) skewX(-7deg) skewY(1.6deg) scale(1.035);
          }
          50% {
            transform: translate3d(-50%, -3px, 42px) perspective(420px) rotateX(5deg) rotateY(-16deg) rotateZ(-5deg) skewX(-6deg) skewY(1.2deg) scale(1.04);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vl-holo__athlete {
            animation: none;
            transform: translate3d(-50%, 0, 34px) perspective(420px) rotateX(7deg) rotateY(-20deg) rotateZ(-7deg) skewX(-8deg) skewY(2deg) scale(1.04);
          }
        }
      `}</style>
    </div>
  );
};
