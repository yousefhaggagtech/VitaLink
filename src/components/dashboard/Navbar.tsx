'use client';

import React from 'react';
import { colors, radius } from '@/styles/tokens/colors';
import { useAuth } from '@/app/features/auth/hooks/useAuth';

interface NavbarProps {
  coachName: string;
  latency?:  number;
}

export const Navbar: React.FC<NavbarProps> = ({ coachName, latency = 32 }) => {
  const { logout } = useAuth();

  const latencyColor = latency < 50 ? colors.fit : latency < 120 ? colors.moderate : colors.critical;

  return (
    <nav className="vl2-nav">

      {/* ── Left: Brand ── */}
      <div className="vl2-nav__brand">
        <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
          <polyline points="1,14 5,6 9,16 13,4 17,12 21,8"
            stroke="#CCFF00" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div>
          <div style={{
            fontSize: '14px', fontWeight: 700, color: '#FFFFFF',
            letterSpacing: '.14em',
            fontFamily: "'Barlow Condensed', sans-serif",
          }}>VITALINK</div>
          <div style={{ fontSize: '8px', color: colors.textMuted, letterSpacing: '.07em', textTransform: 'uppercase' }}>
            Performance Intelligence
          </div>
        </div>
      </div>

      {/* ── Center: Live stream pill ── */}
      <div className="vl2-nav__live">
        <div className="vl2-live-dot" />
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '.08em', textTransform: 'uppercase' }}>
          Live Biometric Stream
        </span>
        <span style={{ fontSize: '10px', color: colors.textSecondary }}>
          Latency: <span style={{ color: latencyColor, fontWeight: 600 }}>{latency}ms</span>
        </span>
      </div>

      {/* ── Right: Actions + Coach ── */}
      <div className="vl2-nav__actions">

        {/* Icon buttons */}
        {[
          { title: 'Analytics', d: 'M3 12L3 20M8 8L8 20M13 14L13 20M18 4L18 20' },
          { title: 'Settings',  d: 'M12 15A3 3 0 1 0 12 9A3 3 0 0 0 12 15ZM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' },
        ].map(({ title, d }) => (
          <button key={title} title={title} className="vl2-icon-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke={colors.textSecondary} strokeWidth="1.8" strokeLinecap="round">
              <path d={d}/>
            </svg>
          </button>
        ))}

        <div className="vl2-nav__sep" />

        {/* Coach card */}
        <div className="vl2-coach-card">
          <div className="vl2-coach-av">
            {coachName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
          </div>
          <div className="vl2-coach-meta">
            <div style={{ fontSize: '12px', fontWeight: 500, color: colors.text }}>{coachName}</div>
            <div style={{ fontSize: '9px', color: colors.textMuted }}>Head Coach</div>
          </div>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
            stroke={colors.textMuted} strokeWidth="1.5" strokeLinecap="round">
            <path d="M2 4 L5 7 L8 4"/>
          </svg>
        </div>

        <button onClick={logout} className="vl2-logout-btn">Logout</button>
      </div>

      <style>{`
        .vl2-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          min-height: 58px;
          padding: 10px 20px;
          background: rgba(11,14,20,0.85);
          border-bottom: 0.5px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          position: sticky; top: 0; z-index: 100;
        }

        .vl2-nav__brand {
          display: flex; align-items: center; gap: 10px;
          flex-shrink: 0;
        }

        .vl2-nav__live {
          display: flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(255,255,255,0.09);
          border-radius: ${radius.full};
          padding: 6px 14px;
          backdrop-filter: blur(12px);
          flex-shrink: 0;
        }

        .vl2-live-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: ${colors.fit};
          animation: vl2-live 2.2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes vl2-live {
          0%,100% { opacity:1; box-shadow: 0 0 0 0 rgba(77,184,122,0.4); }
          50%      { opacity:.75; box-shadow: 0 0 0 5px rgba(77,184,122,0); }
        }

        .vl2-nav__actions {
          display: flex; align-items: center; gap: 8px;
          flex-shrink: 0;
        }

        .vl2-icon-btn {
          width: 32px; height: 32px;
          border-radius: ${radius.sm};
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(255,255,255,0.09);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: border-color .2s, background .2s;
        }
        .vl2-icon-btn:hover {
          border-color: rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.07);
        }

        .vl2-nav__sep {
          width: 0.5px; height: 26px;
          background: rgba(255,255,255,0.10);
        }

        .vl2-coach-card {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(255,255,255,0.09);
          border-radius: ${radius.md};
          padding: 5px 10px 5px 6px;
          cursor: pointer;
          transition: border-color .2s;
        }
        .vl2-coach-card:hover { border-color: rgba(255,255,255,0.18); }

        .vl2-coach-av {
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(204,255,0,0.10);
          border: 0.5px solid rgba(204,255,0,0.22);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700; color: #CCFF00;
          flex-shrink: 0;
        }

        .vl2-coach-meta { display: none; }

        .vl2-logout-btn {
          background: transparent;
          border: 0.5px solid rgba(255,255,255,0.10);
          color: ${colors.textMuted};
          font-size: '10px'; padding: 5px 10px;
          border-radius: ${radius.sm};
          cursor: pointer;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .05em;
          transition: border-color .2s, color .2s;
        }
        .vl2-logout-btn:hover {
          border-color: rgba(255,255,255,0.20);
          color: ${colors.textSecondary};
        }

        @media (min-width: 640px) {
          .vl2-nav { flex-wrap: nowrap; padding: 0 20px; gap: 16px; }
        }
        @media (min-width: 900px) {
          .vl2-coach-meta { display: block; }
        }
      `}</style>
    </nav>
  );
};