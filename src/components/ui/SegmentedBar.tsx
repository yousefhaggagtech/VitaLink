import React from 'react';
import { colors } from '@/styles/tokens/colors';

interface SegmentedBarProps {
  value: number;
  total?: number;
  activeColor?: string;
  inactiveColor?: string;
  height?: number | string;
  gap?: number | string;
  rounded?: number | string;
  showGlow?: boolean;
}

export const SegmentedBar: React.FC<SegmentedBarProps> = ({
  value,
  total = 15,
  activeColor,
  inactiveColor = 'rgba(255,255,255,0.08)',
  height = 10,
  gap = 3,
  rounded = 3,
  showGlow = false,
}) => {
  const filled = Math.round((value / 100) * total);

  const resolvedColor = activeColor ?? (
    value > 80 ? colors.fatigueHigh :
    value > 55 ? colors.fatigueMed :
    colors.fatigue
  );

  return (
    <div style={{
      display: 'flex',
      gap,
      alignItems: 'center',
    }}>
      {Array.from({ length: total }).map((_, i) => {
        const isFilled = i < filled;

        return (
          <div
            key={i}
            style={{
              flex: 1,
              height,
              minWidth: 0,
              borderRadius: rounded,
              background: isFilled
                ? `linear-gradient(180deg, rgba(255,255,255,0.22), transparent 48%), ${resolvedColor}`
                : `linear-gradient(180deg, rgba(255,255,255,0.08), transparent 52%), ${inactiveColor}`,
              boxShadow: isFilled && showGlow
                ? `0 0 16px ${resolvedColor}66, inset 0 1px 0 rgba(255,255,255,0.18)`
                : 'inset 0 1px 0 rgba(255,255,255,0.06)',
              transition: 'background 0.4s ease, box-shadow 0.4s ease',
            }}
          />
        );
      })}
    </div>
  );
};
