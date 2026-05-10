'use client';

import React, { useState } from 'react';
import { Calendar, RefreshCw, SlidersHorizontal, MoreHorizontal, ChevronDown } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface PlayerTopBarProps {
  date?:          string;
  onCompare?:     () => void;
  onFilter?:      () => void;
  onMore?:        () => void;
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
  onCompare,
  onFilter,
  onMore,
}) => {
  const [dateOpen, setDateOpen] = useState(false);
  const label = `Today, ${formatDate(date)}`;

  return (
    <header className="vl-topbar">

      {/* Spacer — keeps buttons right-aligned */}
      <div style={{ flex: 1 }} />

      {/* ── Date picker ── */}
      <button
        className="vl-topbar__btn vl-topbar__btn--date"
        onClick={() => setDateOpen(o => !o)}
        aria-expanded={dateOpen}
        aria-label="Select date"
      >
        <Calendar size={13} style={{ color: 'var(--vl-muted)', flexShrink: 0 }} />
        <span className="vl-topbar__date-text">{label}</span>
        <ChevronDown size={11} style={{
          color: 'var(--vl-muted-deep)',
          transform: dateOpen ? 'rotate(180deg)' : 'none',
          transition: 'transform .2s',
        }}/>
      </button>

      {/* ── Compare ── */}
      <button
        className="vl-topbar__btn vl-topbar__btn--compare"
        onClick={onCompare}
        aria-label="Compare sessions"
      >
        <RefreshCw size={13} style={{ flexShrink: 0 }} />
        <span>Compare</span>
      </button>

      {/* ── Filter ── */}
      <button
        className="vl-topbar__btn vl-topbar__btn--icon"
        onClick={onFilter}
        aria-label="Filter"
        title="Filter"
      >
        <SlidersHorizontal size={14} />
      </button>

      {/* ── More ── */}
      <button
        className="vl-topbar__btn vl-topbar__btn--icon"
        onClick={onMore}
        aria-label="More options"
        title="More options"
      >
        <MoreHorizontal size={14} />
      </button>

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
          cursor: pointer;
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

        /* Compare — brand yellow accent */
        .vl-topbar__btn--compare {
          color: #CCFF00;
          background:
            linear-gradient(180deg, rgba(204,255,0,0.12), rgba(204,255,0,0.04)),
            rgba(11,18,32,0.68);
          border-color: rgba(204,255,0,0.2);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 28px rgba(0,0,0,0.20), 0 0 12px rgba(204,255,0,0.05);
        }
        .vl-topbar__btn--compare:hover {
          background:
            linear-gradient(180deg, rgba(204,255,0,0.15), rgba(204,255,0,0.06)),
            rgba(11,18,32,0.78);
          border-color: rgba(204,255,0,0.3);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 14px 32px rgba(0,0,0,0.24), 0 0 16px rgba(204,255,0,0.08);
        }

        /* Icon-only buttons */
        .vl-topbar__btn--icon {
          padding: 7px 9px;
          color: var(--vl-muted-deep);
        }
        .vl-topbar__btn--icon:hover { color: var(--vl-muted); }
      `}</style>
    </header>
  );
};
