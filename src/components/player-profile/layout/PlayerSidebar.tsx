'use client';

import React, { useState } from 'react';
import {
  Download, Settings, ChevronDown,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface PlayerSidebarProps {
  coachName:       string;
  coachRole?:      string;
  avatarInitials?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export const PlayerSidebar: React.FC<PlayerSidebarProps> = ({
  coachName,
  coachRole      = 'Performance Staff',
  avatarInitials,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);

  const initials = avatarInitials
    ?? coachName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <aside className="vl-sb">

      {/* Logo */}
      <div className="vl-sb__logo">
        <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
          <polyline points="1,14 5,6 9,16 13,4 17,12 21,8"
            stroke="#CCFF00" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="vl-sb__logo-text">VitaLink</span>
      </div>

      {/* Divider */}
      <div className="vl-sb__divider" />

      {/* Bottom utilities */}
      <div className="vl-sb__utils">
        {[
          { label: 'Export Report', icon: <Download size={15}/> },
          { label: 'Settings',      icon: <Settings size={15}/> },
        ].map(({ label, icon }) => (
          <button key={label} className="vl-sb__util-btn">
            <span className="vl-sb__icon">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Coach profile */}
      <button
        className="vl-sb__coach"
        onClick={() => setProfileOpen(o => !o)}
        aria-expanded={profileOpen}
      >
        <div className="vl-sb__coach-av">{initials}</div>
        <div className="vl-sb__coach-info">
          <span className="vl-sb__coach-name">{coachName}</span>
          <span className="vl-sb__coach-role">{coachRole}</span>
        </div>
        <ChevronDown size={13} style={{
          color: 'var(--vl-muted-deep)',
          transform: profileOpen ? 'rotate(180deg)' : 'none',
          transition: 'transform .2s',
          flexShrink: 0,
        }}/>
      </button>

      <style>{`
        /* ── Shell ───────────────────────────── */
        .vl-sb {
          position: fixed; left: 0; top: 0; bottom: 0;
          width: 200px;
          display: flex; flex-direction: column;
          padding: 18px 10px 14px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.028), transparent 18%),
            rgba(5,8,22,0.86);
          border-right: 0.5px solid var(--vl-border);
          box-shadow:
            24px 0 48px rgba(0,0,0,0.42),
            inset 0 1px 0 rgba(255,255,255,0.05),
            inset -2px 0 8px rgba(0,0,0,0.24);
          backdrop-filter: blur(18px) saturate(120%);
          -webkit-backdrop-filter: blur(18px) saturate(120%);
          z-index: 50;
          overflow-y: auto;
          gap: 2px;
        }
        .vl-sb::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 1px;
          height: 100%;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.04), transparent);
          opacity: 1;
          pointer-events: none;
        }
        .vl-sb::-webkit-scrollbar { display: none; }

        /* ── Logo ────────────────────────────── */
        .vl-sb__logo {
          display: flex; align-items: center; gap: 8px;
          padding: 0 8px 18px;
          position: relative;
        }
        .vl-sb__logo-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px; font-weight: 700;
          letter-spacing: .14em; color: var(--vl-text);
        }

        .vl-sb__icon {
          display: flex; align-items: center; flex-shrink: 0;
        }

        /* ── Divider ─────────────────────────── */
        .vl-sb__divider {
          height: 0.5px;
          background: linear-gradient(90deg, transparent, var(--vl-border), transparent);
          margin: 6px 0;
        }

        /* ── Utils ───────────────────────────── */
        .vl-sb__utils {
          display: flex;
          flex-direction: column;
          gap: 1px;
          margin-top: auto;
        }

        .vl-sb__util-btn {
          display: flex; align-items: center; gap: 9px;
          padding: 7px 10px;
          border-radius: 9px;
          background: transparent; border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 500;
          color: var(--vl-muted-deep);
          cursor: pointer; width: 100%; text-align: left;
          transition: color .18s, background .18s, border-color .18s;
          border: 0.5px solid transparent;
        }
        .vl-sb__util-btn:hover {
          color: var(--vl-muted);
          background: rgba(255,255,255,0.035);
          border-color: rgba(255,255,255,0.06);
        }

        /* ── Coach profile ───────────────────── */
        .vl-sb__coach {
          display: flex; align-items: center; gap: 9px;
          padding: 9px 10px;
          margin-top: 6px;
          border-radius: 10px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025)),
            rgba(11,18,32,0.70);
          border: 0.5px solid var(--vl-border);
          cursor: pointer; width: 100%; text-align: left;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 12px 30px rgba(0,0,0,0.18);
          transition: background .2s, border-color .2s, box-shadow .2s;
        }
        .vl-sb__coach:hover {
          background:
            linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.035)),
            rgba(11,18,32,0.78);
          border-color: var(--vl-border-strong);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.10), 0 16px 36px rgba(0,0,0,0.24);
        }

        .vl-sb__coach-av {
          width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
          background:
            radial-gradient(circle at 35% 28%, rgba(255,255,255,0.18), transparent 36%),
            rgba(182,255,46,0.10);
          border: 0.5px solid rgba(182,255,46,0.26);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700; color: var(--vl-lime);
          box-shadow: 0 0 12px rgba(182,255,46,0.12);
        }

        .vl-sb__coach-info {
          display: flex; flex-direction: column; gap: 1px;
          flex: 1; min-width: 0;
        }
        .vl-sb__coach-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 600; color: var(--vl-text);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .vl-sb__coach-role {
          font-size: 10px; color: var(--vl-muted-deep);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
      `}</style>
    </aside>
  );
};
