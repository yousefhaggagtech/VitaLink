'use client';

import React, { useState } from 'react';
import { colors, radius } from '@/styles/tokens/colors';
import { Player } from '@/domain/entities/player';

interface AlertBannerProps {
  players:       Player[];
  onSubstitute?: (player: Player) => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ players, onSubstitute }) => {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const visible = players.filter(p => !dismissed.has(p.id));
  if (visible.length === 0) return null;

  const primary = [...visible].sort((a, b) => b.fatigue - a.fatigue)[0];

  return (
    <div style={{
      position:      'relative',
      background:    'rgba(200,75,90,0.07)',
      border:        `0.5px solid ${colors.criticalBorder}`,
      borderRadius:  radius.lg,
      padding:       '14px 18px',
      marginBottom:  '20px',
      display:       'flex',
      alignItems:    'center',
      gap:           '14px',
      backdropFilter:'blur(20px)',
      overflow:      'hidden',
    }}>

      {/* Left accent stripe */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: '2px',
        background: `linear-gradient(180deg, transparent, ${colors.critical}, transparent)`,
      }}/>

      {/* Icon */}
      <div style={{
        width: '38px', height: '38px', flexShrink: 0,
        borderRadius: radius.md,
        background: 'rgba(200,75,90,0.12)',
        border: `0.5px solid ${colors.criticalBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
          stroke={colors.critical} strokeWidth="2" strokeLinecap="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '9px', fontWeight: 700, color: colors.critical,
          letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '3px',
        }}>
          Critical Player Condition
        </div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: colors.text, marginBottom: '5px' }}>
          {primary.name} requires immediate attention
        </div>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          {[
            { l: 'Fatigue',       v: `${primary.fatigue}%`       },
            { l: 'HR',            v: `${primary.heartRate} BPM`  },
            { l: 'Recovery risk', v: 'HIGH'                       },
          ].map(({ l, v }) => (
            <span key={l} style={{ fontSize: '10px', color: colors.textSecondary }}>
              {l}: <span style={{ color: colors.critical, fontWeight: 700 }}>{v}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Right context */}
      <div style={{
        fontSize: '11px', color: colors.textSecondary,
        maxWidth: '165px', lineHeight: 1.5, flexShrink: 0,
      }}>
        High fatigue and elevated heart rate. Consider substitution immediately.
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
        <button
          onClick={() => onSubstitute?.(primary)}
          style={{
            background: colors.critical, border: 'none', color: '#fff',
            fontSize: '11px', fontWeight: 700, padding: '8px 14px',
            borderRadius: radius.md, cursor: 'pointer',
            letterSpacing: '.05em', whiteSpace: 'nowrap',
            display: 'flex', alignItems: 'center', gap: '5px',
          }}
        >
          Substitute Player
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
            stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M2 6 L10 6 M7 3 L10 6 L7 9"/>
          </svg>
        </button>

        <button
          onClick={() => setDismissed(p => new Set([...p, primary.id]))}
          style={{
            background: 'transparent',
            border: `0.5px solid rgba(255,255,255,0.12)`,
            color: colors.textSecondary,
            fontSize: '10px', padding: '6px 12px',
            borderRadius: radius.md, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
          }}
        >
          Dismiss
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M2 2 L8 8 M8 2 L2 8"/>
          </svg>
        </button>
      </div>
    </div>
  );
};