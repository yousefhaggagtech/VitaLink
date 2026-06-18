'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface PlayerTopBarProps {
  date?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (d?: string) => {
  if (d) return d;
  return new Intl.DateTimeFormat('en-US', {
    month: 'long', day: 'numeric',
  }).format(new Date());
};

// ─── Component ────────────────────────────────────────────────────────────────
export const PlayerTopBar: React.FC<PlayerTopBarProps> = ({
  date,
}) => {
  const label = `Today, ${formatDate(date)}`;

  return (
    <header className="vl-topbar">

      {/* Spacer — keeps buttons right-aligned */}
      <div style={{ flex: 1 }} />

      {/* ── Date ── */}
      <div
        className="vl-topbar__btn vl-topbar__btn--date"
      >
        <Calendar size={13} style={{ color: 'var(--vl-muted)', flexShrink: 0 }} />
        <span className="vl-topbar__date-text">{label}</span>
      </div>

      <style>{`
        /* ── Bar ─────────────────────────────── */
        .vl-topbar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          padding: 14px 24px;
          background: transparent;
          position: relative;
          z-index: 2;
        }

        /* ── Base button ─────────────────────── */
        .vl-topbar__btn {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 500;
          color: var(--vl-muted);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.025)),
            rgba(11,18,32,0.62);
          border: 0.5px solid var(--vl-border);
          border-radius: 12px;
          padding: 7px 12px;
          cursor: default;
          white-space: nowrap;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 26px rgba(0,0,0,0.18);
          backdrop-filter: blur(18px) saturate(128%);
          -webkit-backdrop-filter: blur(18px) saturate(128%);
          transition: color .18s, background .18s, border-color .18s, box-shadow .18s, transform .18s;
        }
        .vl-topbar__btn:hover {
          color: var(--vl-text);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.095), rgba(255,255,255,0.035)),
            rgba(11,18,32,0.76);
          border-color: var(--vl-border-strong);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.11), 0 14px 32px rgba(0,0,0,0.24);
          transform: translateY(-1px);
        }

        /* Date pill */
        .vl-topbar__btn--date { padding: 7px 12px; }
        .vl-topbar__date-text {
          font-weight: 500; color: var(--vl-text);
        }

      `}</style>
    </header>
  );
};
