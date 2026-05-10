'use client';

import React from 'react';
import { StatItem, StatLevel } from './StatItem';

// ─── Types ────────────────────────────────────────────────────────────────────
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

// ─── Icon components ──────────────────────────────────────────────────────────
const IconShoe = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 18l2-6h16l2 6H2z"/><path d="M4 12l2-6h8l2 6"/>
  </svg>
);

const IconBolt = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const IconRun = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13" cy="4" r="1.5"/>
    <path d="M9 20l2-5 3 3 2-8"/>
    <path d="M6 12l3-1 2 4"/>
    <path d="M15 8l2 4-4 1"/>
  </svg>
);

const IconAccel = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
);

const IconFire = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A3.5 3.5 0 0 0 12 18c4 0 6-3 6-6 0-5-3-8-6-10 0 4-3 5-3.5 8.5z"/>
    <path d="M12 18c0 1.657-1.343 3-3 3S6 19.657 6 18c0-2 1.5-3.5 3-4 .5 1.5 3 2 3 4z"/>
  </svg>
);

// ─── Level helpers ────────────────────────────────────────────────────────────
const distLevel  = (v: number): StatLevel => v >= 8  ? 'HIGH' : v >= 4  ? 'NORMAL' : 'LOW';
const speedLevel = (v: number): StatLevel => v >= 25 ? 'HIGH' : v >= 15 ? 'NORMAL' : 'LOW';
const sprintLevel= (v: number): StatLevel => v >= 15 ? 'HIGH' : v >= 8  ? 'NORMAL' : 'LOW';
const accelLevel = (v: number): StatLevel => v >= 20 ? 'HIGH' : v >= 10 ? 'NORMAL' : 'LOW';
const calLevel   = (v: number): StatLevel => v >= 700? 'HIGH' : v >= 400? 'NORMAL' : 'LOW';

// ─── Divider ──────────────────────────────────────────────────────────────────
const Divider = () => (
  <div style={{
    width: '0.5px', alignSelf: 'stretch',
    background: 'linear-gradient(to bottom, transparent, var(--vl-border), transparent)',
    flexShrink: 0,
  }} aria-hidden />
);

// ─── Component ────────────────────────────────────────────────────────────────
export const BottomStatsBar: React.FC<BottomStatsBarProps> = ({ stats }) => {
  const items = [
    {
      label: 'Total Distance',
      value: stats.distance,
      unit:  'km',
      level: distLevel(stats.distance),
      icon:  <IconShoe />,
    },
    {
      label: 'Top Speed',
      value: stats.topSpeed,
      unit:  'km/h',
      level: speedLevel(stats.topSpeed),
      icon:  <IconBolt />,
    },
    {
      label: 'Sprints',
      value: stats.sprints,
      level: sprintLevel(stats.sprints),
      icon:  <IconRun />,
    },
    {
      label: 'Accelerations',
      value: stats.accelerations,
      level: accelLevel(stats.accelerations),
      icon:  <IconAccel />,
    },
    {
      label: 'Calories',
      value: stats.calories,
      unit:  'kcal',
      level: calLevel(stats.calories),
      icon:  <IconFire />,
    },
  ];

  return (
    <section className="vl-bsb" aria-label="Session statistics">
      {items.map((item, i) => (
        <React.Fragment key={item.label}>
          <StatItem
            label={item.label}
            value={item.value}
            unit={item.unit}
            level={item.level as StatLevel}
            icon={item.icon}
          />
          {i < items.length - 1 && <Divider />}
        </React.Fragment>
      ))}

      <style>{`
        .vl-bsb {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0;
          padding: 16px 20px;
          background:
            linear-gradient(145deg, rgba(255,255,255,0.075), rgba(255,255,255,0.024) 50%),
            rgba(11,18,32,0.72);
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

        /* Space the items evenly */
        .vl-bsb > .vl-si {
          flex: 1;
          min-width: 100px;
          padding: 0 16px;
        }
        .vl-bsb > .vl-si:first-child { padding-left: 0; }
        .vl-bsb > .vl-si:last-child  { padding-right: 0; }

        @media (max-width: 700px) {
          .vl-bsb > .vl-si { min-width: 80px; padding: 0 10px; }
        }
      `}</style>
    </section>
  );
};
