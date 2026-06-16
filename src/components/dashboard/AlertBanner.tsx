'use client';

import React, { useState } from 'react';
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
      background:    'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.015) 46%, rgba(255,90,95,0.035)), rgba(11,18,32,0.78)',
      border:        `0.5px solid rgba(255,90,95,0.22)`,
      borderRadius:  '28px',
      padding:       '14px 18px',
      marginBottom:  '20px',
      display:       'flex',
      alignItems:    'center',
      gap:           '14px',
      backdropFilter:'blur(18px) saturate(128%)',
      WebkitBackdropFilter:'blur(18px) saturate(128%)',
      boxShadow: '0 24px 70px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(255,255,255,0.025), 0 0 20px rgba(255,90,95,0.055)',
      overflow:      'hidden',
    }}>

      {/* Left accent stripe */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: '2px',
        background: `linear-gradient(180deg, transparent, #FF5A5F, transparent)`,
      }}/>

      {/* Icon */}
      <div style={{
        width: '38px', height: '38px', flexShrink: 0,
        borderRadius: '13px',
        background: 'rgba(255,90,95,0.10)',
        border: `0.5px solid rgba(255,90,95,0.22)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 0 12px rgba(255,90,95,0.10)',
      }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
          stroke="#FF5A5F" strokeWidth="2" strokeLinecap="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '9px', fontWeight: 700, color: '#FF5A5F',
          letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '3px',
        }}>
          Critical Player Condition
        </div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#F8FAFC', marginBottom: '5px' }}>
          {primary.name} requires immediate attention
        </div>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          {[
            { l: 'Fatigue',       v: `${primary.fatigue}%`       },
            { l: 'HR',            v: `${primary.heartRate} BPM`  },
            { l: 'Recovery risk', v: 'HIGH'                       },
          ].map(({ l, v }) => (
            <span key={l} style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)' }}>
              {l}: <span style={{ color: '#FF5A5F', fontWeight: 700 }}>{v}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Right context */}
      <div style={{
        fontSize: '11px', color: 'rgba(255,255,255,0.70)',
        maxWidth: '165px', lineHeight: 1.5, flexShrink: 0,
      }}>
        High fatigue and elevated heart rate. Consider substitution immediately.
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
        <button
          onClick={() => onSubstitute?.(primary)}
          style={{
            background: 'linear-gradient(180deg, rgba(255,90,95,0.16), rgba(255,90,95,0.07)), rgba(11,18,32,0.70)',
            border: '0.5px solid rgba(255,90,95,0.28)',
            color: '#FF5A5F',
            fontSize: '11px', fontWeight: 700, padding: '8px 14px',
            borderRadius: '13px', cursor: 'pointer',
            letterSpacing: '.05em', whiteSpace: 'nowrap',
            display: 'flex', alignItems: 'center', gap: '5px',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.09), 0 10px 28px rgba(0,0,0,0.18), 0 0 12px rgba(255,90,95,0.06)',
          }}
        >
          Substitute Player
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M2 6 L10 6 M7 3 L10 6 L7 9"/>
          </svg>
        </button>

        <button
          onClick={() => setDismissed(p => new Set([...p, primary.id]))}
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.018)), rgba(11,18,32,0.52)',
            border: `0.5px solid rgba(255,255,255,0.08)`,
            color: 'rgba(255,255,255,0.45)',
            fontSize: '10px', padding: '6px 12px',
            borderRadius: '13px', cursor: 'pointer',
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
