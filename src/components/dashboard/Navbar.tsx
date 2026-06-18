'use client';

import React, { useState } from 'react';
import { useAuth } from '@/app/features/auth/hooks/useAuth';
import {
  CoachSettings,
  CoachSettingsModal,
} from '@/components/dashboard/CoachSettingsModal';

interface NavbarProps {
  coachName: string;
  latency?:  number;
}

export const Navbar: React.FC<NavbarProps> = ({ coachName, latency = 32 }) => {
  const { logout } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [coachSettings, setCoachSettings] = useState<CoachSettings>({
    notificationsEnabled: true,
    syncSystemTheme: true,
    defaultTeamView: 'all-athletes',
  });

  const latencyColor = latency < 50 ? '#B6FF2E' : latency < 120 ? '#FFB800' : '#FF5A5F';

  return (
    <>
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
          <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.28)', letterSpacing: '.07em', textTransform: 'uppercase' }}>
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
        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)' }}>
          Latency: <span style={{ color: latencyColor, fontWeight: 600 }}>{latency}ms</span>
        </span>
      </div>

      {/* ── Right: Actions + Coach ── */}
      <div className="vl2-nav__actions">

        {/* Coach card */}
        <button
          type="button"
          className="vl2-coach-card"
          onClick={() => setIsSettingsOpen(true)}
          aria-label={`Open settings for ${coachName}`}
          aria-haspopup="dialog"
        >
          <div className="vl2-coach-av">
            {coachName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
          </div>
          <div className="vl2-coach-meta">
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#F8FAFC' }}>{coachName}</div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.28)' }}>Head Coach</div>
          </div>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
            stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeLinecap="round">
            <path d="M2 4 L5 7 L8 4"/>
          </svg>
        </button>

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
          background:
            linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015)),
            rgba(5,8,22,0.86);
          border-bottom: 0.5px solid var(--vl-border, rgba(255,255,255,0.08));
          box-shadow:
            0 18px 48px rgba(0,0,0,0.32),
            inset 0 1px 0 rgba(255,255,255,0.05),
            inset 0 -1px 0 rgba(255,255,255,0.025);
          backdrop-filter: blur(18px) saturate(120%);
          -webkit-backdrop-filter: blur(18px) saturate(120%);
          position: sticky; top: 0; z-index: 100;
        }

        .vl2-nav__brand {
          display: flex; align-items: center; gap: 10px;
          flex-shrink: 0;
        }

        .vl2-nav__live {
          display: flex; align-items: center; gap: 10px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.025)),
            rgba(11,18,32,0.62);
          border: 0.5px solid var(--vl-border, rgba(255,255,255,0.08));
          border-radius: 9999px;
          padding: 6px 14px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 26px rgba(0,0,0,0.18);
          backdrop-filter: blur(18px) saturate(128%);
          -webkit-backdrop-filter: blur(18px) saturate(128%);
          flex-shrink: 0;
        }

        .vl2-live-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #B6FF2E;
          animation: vl2-live 2.2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes vl2-live {
          0%,100% { opacity:1; box-shadow: 0 0 0 0 rgba(182,255,46,0.28); }
          50%      { opacity:.72; box-shadow: 0 0 0 5px rgba(182,255,46,0); }
        }

        .vl2-nav__actions {
          display: flex; align-items: center; gap: 8px;
          flex-shrink: 0;
        }

        .vl2-coach-card {
          display: flex; align-items: center; gap: 8px;
          font-family: inherit;
          text-align: left;
          color: inherit;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025)),
            rgba(11,18,32,0.70);
          border: 0.5px solid var(--vl-border, rgba(255,255,255,0.08));
          border-radius: 10px;
          padding: 5px 10px 5px 6px;
          cursor: pointer;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 12px 30px rgba(0,0,0,0.18);
          transition: background .2s, border-color .2s, box-shadow .2s;
        }
        .vl2-coach-card:hover {
          background:
            linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.035)),
            rgba(11,18,32,0.78);
          border-color: var(--vl-border-strong, rgba(255,255,255,0.14));
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.10), 0 16px 36px rgba(0,0,0,0.24);
        }
        .vl2-coach-card:focus-visible {
          outline: 2px solid rgba(182,255,46,0.72);
          outline-offset: 2px;
        }

        .vl2-coach-av {
          width: 28px; height: 28px; border-radius: 50%;
          background:
            radial-gradient(circle at 35% 28%, rgba(255,255,255,0.18), transparent 36%),
            rgba(182,255,46,0.10);
          border: 0.5px solid rgba(182,255,46,0.26);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700; color: #B6FF2E;
          box-shadow: 0 0 12px rgba(182,255,46,0.12);
          flex-shrink: 0;
        }

        .vl2-coach-meta { display: none; }

        .vl2-logout-btn {
          background:
            linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.018)),
            rgba(11,18,32,0.52);
          border: 0.5px solid var(--vl-border, rgba(255,255,255,0.08));
          color: var(--vl-muted-deep, rgba(255,255,255,0.28));
          font-size: '10px'; padding: 5px 10px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .05em;
          transition: border-color .18s, color .18s, background .18s;
        }
        .vl2-logout-btn:hover {
          border-color: var(--vl-border-strong, rgba(255,255,255,0.14));
          color: var(--vl-muted, rgba(255,255,255,0.45));
          background:
            linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.025)),
            rgba(11,18,32,0.68);
        }

        @media (min-width: 640px) {
          .vl2-nav { flex-wrap: nowrap; padding: 0 20px; gap: 16px; }
        }
        @media (min-width: 900px) {
          .vl2-coach-meta { display: block; }
        }
      `}</style>
      </nav>

      <CoachSettingsModal
        isOpen={isSettingsOpen}
        coachName={coachName}
        initialSettings={coachSettings}
        onClose={() => setIsSettingsOpen(false)}
        onSave={setCoachSettings}
      />
    </>
  );
};
