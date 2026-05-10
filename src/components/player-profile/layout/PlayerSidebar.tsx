'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, TrendingUp, History, Activity,
  BarChart3, Heart, FileText, Target,
  Download, Settings, ChevronDown,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavItem {
  label: string;
  icon:  React.ReactNode;
  href:  string;
}

interface PlayerSidebarProps {
  playerId:        string;
  coachName:       string;
  coachRole?:      string;
  avatarInitials?: string;
}

// ─── Nav items factory ────────────────────────────────────────────────────────
const buildNavItems = (id: string): NavItem[] => [
  { label: 'Overview',        icon: <LayoutDashboard size={16}/>, href: `/player/${id}` },
  { label: 'Trends',          icon: <TrendingUp      size={16}/>, href: `/player/${id}/trends` },
  { label: 'Session History', icon: <History         size={16}/>, href: `/player/${id}/sessions` },
  { label: 'Biometrics',      icon: <Activity        size={16}/>, href: `/player/${id}/biometrics` },
  { label: 'Training Load',   icon: <BarChart3       size={16}/>, href: `/player/${id}/load` },
  { label: 'Wellness',        icon: <Heart           size={16}/>, href: `/player/${id}/wellness` },
  { label: 'Reports',         icon: <FileText        size={16}/>, href: `/player/${id}/reports` },
  { label: 'Goals',           icon: <Target          size={16}/>, href: `/player/${id}/goals` },
];

// ─── Component ────────────────────────────────────────────────────────────────
export const PlayerSidebar: React.FC<PlayerSidebarProps> = ({
  playerId,
  coachName,
  coachRole      = 'Performance Staff',
  avatarInitials,
}) => {
  const pathname = usePathname();
  const navItems = buildNavItems(playerId);
  const [profileOpen, setProfileOpen] = useState(false);

  const initials = avatarInitials
    ?? coachName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const isActive = (href: string) =>
    href === `/player/${playerId}`
      ? pathname === href
      : pathname.startsWith(href);

  return (
    <aside className="vl-sb">

      {/* Logo */}
      <div className="vl-sb__logo">
        <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
          <polyline points="1,14 5,6 9,16 13,4 17,12 21,8"
            stroke="#B6FF2E" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="vl-sb__logo-text">PERFORM</span>
      </div>

      {/* Primary nav */}
      <nav className="vl-sb__nav" aria-label="Player navigation">
        {navItems.map(item => (
          <Link
            key={item.label}
            href={item.href}
            className={`vl-sb__link${isActive(item.href) ? ' active' : ''}`}
            aria-current={isActive(item.href) ? 'page' : undefined}
          >
            {isActive(item.href) && <span className="vl-sb__bar" aria-hidden />}
            <span className="vl-sb__icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

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

        /* ── Nav ─────────────────────────────── */
        .vl-sb__nav {
          display: flex; flex-direction: column;
          gap: 1px; flex: 1;
        }

        .vl-sb__link {
          position: relative;
          display: flex; align-items: center; gap: 9px;
          padding: 8px 10px;
          border-radius: 9px;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          color: var(--vl-muted);
          border: 0.5px solid transparent;
          transition: color .18s ease, background .18s ease, border-color .18s ease, box-shadow .18s ease, transform .18s ease;
          white-space: nowrap;
        }
        .vl-sb__link:hover {
          color: var(--vl-text);
          background: rgba(255,255,255,0.045);
          border-color: rgba(255,255,255,0.08);
          transform: translateX(1px);
        }
        .vl-sb__link.active {
          color: var(--vl-lime);
          background:
            linear-gradient(90deg, rgba(182,255,46,0.12), rgba(182,255,46,0.045));
          border-color: rgba(182,255,46,0.17);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.07),
            0 8px 22px rgba(0,0,0,0.18);
          font-weight: 600;
        }

        /* Active left indicator */
        .vl-sb__bar {
          position: absolute; left: 0; top: 20%; bottom: 20%;
          width: 2px; border-radius: 0 2px 2px 0;
          background: var(--vl-lime);
          box-shadow: 0 0 10px rgba(182,255,46,0.24);
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
        .vl-sb__utils { display: flex; flex-direction: column; gap: 1px; }

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
