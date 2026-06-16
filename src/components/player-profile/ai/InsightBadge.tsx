'use client';

import React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
export type InsightVariant = 'default' | 'highlight' | 'warning' | 'success' | 'danger' | 'info';

interface InsightBadgeProps {
  text:      string;
  variant?:  InsightVariant;
  /** bold/colored portion inside the text — wraps matched substring */
  highlight?: string;
  highlightColor?: string;
}

// ─── Variant config ───────────────────────────────────────────────────────────
const VARIANT_CONFIG: Record<InsightVariant, {
  dotColor:   string;
  bg:         string;
  border:     string;
}> = {
  default: {
    dotColor: '#8B5CF6',
    bg:       'rgba(139,92,246,0.07)',
    border:   'rgba(139,92,246,0.15)',
  },
  highlight: {
    dotColor: '#B6FF2E',
    bg:       'rgba(182,255,46,0.055)',
    border:   'rgba(182,255,46,0.15)',
  },
  warning: {
    dotColor: '#FFB800',
    bg:       'rgba(255,184,0,0.065)',
    border:   'rgba(255,184,0,0.17)',
  },
  success: {
    dotColor: '#B6FF2E',
    bg:       'rgba(182,255,46,0.055)',
    border:   'rgba(182,255,46,0.16)',
  },
  danger: {
    dotColor: '#FF5A5F',
    bg:       'rgba(255,90,95,0.07)',
    border:   'rgba(255,90,95,0.18)',
  },
  info: {
    dotColor: '#60A5FA',
    bg:       'rgba(96,165,250,0.07)',
    border:   'rgba(96,165,250,0.18)',
  },
};

// ─── Highlight helper ─────────────────────────────────────────────────────────
// Splits text and wraps matching substring in a colored span
function renderText(text: string, highlight?: string, dotColor?: string) {
  if (!highlight) return text;

  const idx = text.toLowerCase().indexOf(highlight.toLowerCase());
  if (idx === -1) return text;

  return (
    <>
      {text.slice(0, idx)}
      <strong style={{ color: dotColor, fontWeight: 700 }}>
        {text.slice(idx, idx + highlight.length)}
      </strong>
      {text.slice(idx + highlight.length)}
    </>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export const InsightBadge: React.FC<InsightBadgeProps> = ({
  text,
  variant   = 'default',
  highlight,
  highlightColor,
}) => {
  const cfg = VARIANT_CONFIG[variant];
  const strongColor = highlightColor ?? cfg.dotColor;

  return (
    <div
      className="vl-ib"
      style={{
        background: cfg.bg,
        border:     `0.5px solid ${cfg.border}`,
      }}
      role="listitem"
    >
      {/* Dot */}
      <span
        className="vl-ib__dot"
        style={{ background: cfg.dotColor, color: cfg.dotColor }}
        aria-hidden
      />

      {/* Text */}
      <span className="vl-ib__text">
        {renderText(text, highlight, strongColor)}
      </span>

      <style>{`
        .vl-ib {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 8px 11px;
          border-radius: 13px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .vl-ib__dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 5px;
          box-shadow: 0 0 8px currentColor;
        }

        .vl-ib__text {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 400;
          color: var(--vl-text-soft);
          line-height: 1.55;
        }
      `}</style>
    </div>
  );
};
