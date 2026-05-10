'use client';

import React from 'react';
import { PlayerAvatar }      from './PlayerAvatar';
import { PlayerIdentity }    from './PlayerIdentity';
import { PlayerBioStats }    from './PlayerBioStats';
import { StatusType }        from '@/styles/tokens/colors';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlayerHeroProps {
  // Identity
  name:         string;
  initials:     string;
  position:     string;
  jerseyNumber: number;
  status:       StatusType;
  imageUrl?:    string;

  // Bio
  age:       number;
  weight:    number;
  height:    number;
  foot:      string;
  bloodType: string;
  beltId:    string;
  lastSession?: {
    date: string;
    duration: number;
    opponent: string;
    id: string;
  };

}

// ─── Component ────────────────────────────────────────────────────────────────
export const PlayerHero: React.FC<PlayerHeroProps> = ({
  name,
  initials,
  position,
  jerseyNumber,
  status,
  imageUrl,
  age,
  weight,
  height,
  foot,
  bloodType,
  beltId,
}) => {
  return (
    <section className="vl-hero" aria-label={`${name} profile header`}>

      {/* ── Left: avatar ── */}
      <div className="vl-hero__avatar-col">
        <PlayerAvatar
          name={name}
          initials={initials}
          jerseyNumber={jerseyNumber}
          status={status}
          imageUrl={imageUrl}
          size={96}
        />
      </div>

      {/* ── Center: identity + bio ── */}
      <div className="vl-hero__info-col">
        <PlayerIdentity
          name={name}
          position={position}
          status={status}
        />

        {/* Thin divider */}
        <div className="vl-hero__divider" />

        <PlayerBioStats
          age={age}
          weight={weight}
          height={height}
          foot={foot}
          bloodType={bloodType}
          beltId={beltId}
        />
      </div>

      <style>{`
        /* ── Section container ───────────────── */
        .vl-hero {
          position: relative;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 20px;
          padding: 20px 24px;
          background:
            linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.015) 42%, rgba(255,255,255,0.008)),
            rgba(11,18,32,0.78);
          border: 0.5px solid var(--vl-border);
          border-radius: 28px;
          backdrop-filter: blur(18px) saturate(128%);
          -webkit-backdrop-filter: blur(18px) saturate(128%);
          box-shadow: var(--vl-shadow-card);
          margin-bottom: 20px;
          max-width: 77%;
          overflow: hidden;
        }

        .vl-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(120deg, rgba(255,255,255,0.08), transparent 26%);
          opacity: .45;
          pointer-events: none;
        }

        .vl-hero::after {
          content: '';
          position: absolute;
          left: 18px;
          right: 18px;
          top: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.32), transparent);
          pointer-events: none;
        }

        /* ── Avatar column ───────────────────── */
        .vl-hero__avatar-col {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }

        /* ── Info column ─────────────────────── */
        .vl-hero__info-col {
          display: flex;
          flex-direction: column;
          gap: 0;
          min-width: 0;
          position: relative;
          z-index: 1;
        }

        /* Thin separator between identity and bio */
        .vl-hero__divider {
          width: 60%;
          height: 0.5px;
          background: linear-gradient(90deg, rgba(255,255,255,0.10), rgba(255,255,255,0.05), transparent);
          margin: 12px 0;
        }

        /* ── Session column ──────────────────── */

        /* ── Tablet: stack identity + bio ────── */
        @media (max-width: 860px) {
          .vl-hero {
            grid-template-columns: auto 1fr;
            grid-template-rows: auto auto;
            max-width: 100%;
          }
          
        }

        /* ── Mobile ──────────────────────────── */
        @media (max-width: 560px) {
          .vl-hero {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .vl-hero__avatar-col { justify-content: center; }  
        }
      `}</style>
    </section>
  );
};
