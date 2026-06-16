'use client';

import React from 'react';

interface SessionStats {
  distance:      number;    // km
  topSpeed:      number;    // km/h
  sprints:       number;    // count
  accelerations: number;    // count
  calories:      number;    // kcal
}

interface BottomStatsBarProps {
  stats: SessionStats;
}

const IconUsers = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

export const BottomStatsBar: React.FC<BottomStatsBarProps> = ({ stats }) => {
  void stats;

  return (
    <section className="vl-bsb" aria-label="Session statistics">
      <div className="vl-bsb-banner">
        <div className="vl-bsb-icon" aria-hidden>
          <IconUsers />
        </div>
        <p className="vl-bsb-copy">
          Trusted by <span>10,000+</span> athletes and coaches worldwide using VitaLink to monitor performance in real time.
        </p>
      </div>

      <style>{`
        .vl-bsb {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0;
          padding: 16px 20px;
          background:
            linear-gradient(145deg, rgba(255,255,255,0.075), rgba(255,255,255,0.024) 50%),
            rgba(11,14,20,0.72);
          border: 0.5px solid var(--vl-border);
          border-radius: 28px;
          backdrop-filter: blur(18px) saturate(128%);
          -webkit-backdrop-filter: blur(18px) saturate(128%);
          box-shadow: var(--vl-shadow-card);
          overflow-x: auto;
        }
        .vl-bsb::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, rgba(255,255,255,0.10), transparent 26%);
          opacity: .52;
          pointer-events: none;
        }
        .vl-bsb::-webkit-scrollbar { display: none; }

        .vl-bsb-banner {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          width: 100%;
          min-width: 100%;
        }
        .vl-bsb-icon {
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          flex: 0 0 36px;
          color: #CCFF00;
          background: rgba(204,255,0,0.10);
          border: 0.5px solid rgba(204,255,0,0.34);
          border-radius: 18px;
          box-shadow: 0 0 18px rgba(204,255,0,0.10);
        }
        .vl-bsb-copy {
          margin: 0;
          color: rgba(255,255,255,0.84);
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          line-height: 1.4;
          text-align: center;
          min-width: 0;
        }
        .vl-bsb-copy span {
          color: #CCFF00;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0;
        }

        @media (max-width: 700px) {
          .vl-bsb-banner {
            justify-content: center;
            min-width: 100%;
          }
        }
      `}</style>
    </section>
  );
};
