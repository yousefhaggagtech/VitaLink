'use client';

import React from 'react';
import { PlayerSidebar } from '@/components/player-profile/layout/PlayerSidebar';
import { PlayerTopBar }  from '@/components/player-profile/layout/PlayerTopBar';

// ─── Types ─────────────────────────────────────────────────────────────────
interface PlayerProfileLayoutProps {
  playerId:   string;
  coachName:  string;
  children:   React.ReactNode;
  date?:      string;
  onCompare?: () => void;
  onFilter?:  () => void;
}

// ─── Component ─────────────────────────────────────────────────────────────
export const PlayerProfileLayout: React.FC<PlayerProfileLayoutProps> = ({
  playerId,
  coachName,
  children,
  date,
  onCompare,
  onFilter,
}) => {
  return (
    <div className="vl-layout">

      {/* Fixed left sidebar */}
      <PlayerSidebar
        playerId={playerId}
        coachName={coachName}
      />

      {/* Scrollable right area */}
      <div className="vl-layout__main">
        <PlayerTopBar
          date={date}
          onCompare={onCompare}
          onFilter={onFilter}
        />

        {/* Page content */}
        <div className="vl-layout__content">
          {children}
        </div>
      </div>

      <style>{`
        /* ── Root ────────────────────────────── */
        .vl-layout {
          --vl-bg-0: #050816;
          --vl-bg-1: #07111F;
          --vl-bg-2: #0A1324;
          --vl-panel: rgba(11,18,32,0.72);
          --vl-panel-strong: rgba(13,22,38,0.84);
          --vl-panel-soft: rgba(255,255,255,0.045);
          --vl-border: rgba(255,255,255,0.08);
          --vl-border-strong: rgba(255,255,255,0.14);
          --vl-highlight: rgba(255,255,255,0.14);
          --vl-text: #F8FAFC;
          --vl-text-soft: rgba(255,255,255,0.70);
          --vl-muted: rgba(255,255,255,0.45);
          --vl-muted-deep: rgba(255,255,255,0.28);
          --vl-lime: #B6FF2E;
          --vl-green: #4ADE80;
          --vl-cyan: #38BDF8;
          --vl-violet: #8B5CF6;
          --vl-shadow-card: 0 24px 70px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(255,255,255,0.025);
          --vl-shadow-hover: 0 30px 84px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.11);
          display: flex;
          min-height: 100vh;
          position: relative;
          isolation: isolate;
          overflow-x: hidden;
          background:
            linear-gradient(135deg, var(--vl-bg-0) 0%, var(--vl-bg-1) 48%, var(--vl-bg-2) 100%);
          color: var(--vl-text);
          font-family: 'DM Sans', sans-serif;
        }

        .vl-layout::before,
        .vl-layout::after {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .vl-layout::before {
          background:
            linear-gradient(rgba(255,255,255,0.013) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.013) 1px, transparent 1px);
          background-size: 100% 7px, 92px 100%;
          opacity: 0.15;
          mask-image: linear-gradient(to bottom, transparent 0%, #000 14%, #000 78%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 14%, #000 78%, transparent 100%);
        }

        .vl-layout::after {
          background:
            radial-gradient(circle at 50% -10%, transparent 0 40%, rgba(0,0,0,0.18) 72%, rgba(0,0,0,0.48) 100%),
            linear-gradient(90deg, rgba(0,0,0,0.28), transparent 20%, transparent 76%, rgba(0,0,0,0.34));
        }

        /* ── Main area (right of sidebar) ────── */
        .vl-layout__main {
          flex: 1;
          margin-left: 200px;        /* sidebar width */
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          overflow-x: hidden;
          position: relative;
          z-index: 1;
        }

        /* ── Scrollable content ───────────────── */
        .vl-layout__content {
          flex: 1;
          padding: 0 24px 40px;
          position: relative;
          z-index: 1;
        }

        /* ── Scrollbar ────────────────────────── */
        .vl-layout__main::-webkit-scrollbar { width: 3px; }
        .vl-layout__main::-webkit-scrollbar-track { background: transparent; }
        .vl-layout__main::-webkit-scrollbar-thumb {
          background: rgba(182,255,46,0.22);
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};
