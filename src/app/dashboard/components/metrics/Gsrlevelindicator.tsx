"use client";
 
import React, { useState } from "react";
import { Theme } from "@/domain/types/types";
 
// ── Level definitions ─────────────────────────────────────────────────
// Thresholds apply to the RAW gsr value (0–100 scale).
// • Callers using scaled values (e.g. Ohms = gsrLevel × 13)
//   should divide by 13 before passing here.
 
export type GSRLevel = "Low" | "Medium" | "Good";
 
interface LevelConfig {
  label: GSRLevel;
  color: string;       // active fill / glow color
  dimColor: string;    // inactive segment color
  range: string;       // shown in tooltip
}
 
const LEVELS: LevelConfig[] = [
  { label: "Low",    color: "#EF4444", dimColor: "#EF444430", range: "0 – 40"  },
  { label: "Medium", color: "#F59E0B", dimColor: "#F59E0B30", range: "41 – 75" },
  { label: "Good",   color: "#22C55E", dimColor: "#22C55E30", range: "76+"     },
];
 
export function getGSRLevel(rawValue: number): LevelConfig {
  if (rawValue <= 40) return LEVELS[0];
  if (rawValue <= 75) return LEVELS[1];
  return LEVELS[2];
}
 
// ── Props ─────────────────────────────────────────────────────────────
interface GSRLevelIndicatorProps {
  /** Raw GSR value on 0–100 scale. For scaled values (Ohms), divide by 13 first. */
  rawValue: number;
  theme: Theme;
  /** Show the actual numeric value in the tooltip. Default: true */
  showTooltip?: boolean;
  /** "compact" fits inside the MetricCard value area. "full" is for chart headers. */
  variant?: "compact" | "full";
}
 
// ── Component ─────────────────────────────────────────────────────────
const GSRLevelIndicator: React.FC<GSRLevelIndicatorProps> = ({
  rawValue,
  theme,
  showTooltip = true,
  variant = "compact",
}) => {
  const [hovered, setHovered] = useState(false);
  const active = getGSRLevel(rawValue);
  const activeIndex = LEVELS.findIndex(l => l.label === active.label);
 
  const isCompact = variant === "compact";
 
  return (
    <div
      style={{ position: "relative", display: "inline-flex", flexDirection: "column", gap: "6px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── 3-segment bar ───────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        {LEVELS.map((level, i) => {
          const isActive = i === activeIndex;
          return (
            <div
              key={level.label}
              style={{
                width: isCompact ? "28px" : "36px",
                height: isCompact ? "6px" : "8px",
                borderRadius: "3px",
                backgroundColor: isActive ? level.color : level.dimColor,
                boxShadow: isActive ? `0 0 8px ${level.color}99` : "none",
                transition: "background-color 0.4s ease, box-shadow 0.4s ease",
              }}
            />
          );
        })}
      </div>
 
      {/* ── Level badge ─────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {/* Glowing dot */}
        <div
          style={{
            width: isCompact ? "8px" : "10px",
            height: isCompact ? "8px" : "10px",
            borderRadius: "50%",
            backgroundColor: active.color,
            boxShadow: `0 0 ${isCompact ? "6px" : "8px"} ${active.color}`,
            flexShrink: 0,
            transition: "background-color 0.4s ease, box-shadow 0.4s ease",
            animation: "smooth-pulse 2s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontSize: isCompact ? "clamp(24px, 4vw, 36px)" : "20px",
            fontWeight: 800,
            color: active.color,
            letterSpacing: "-0.01em",
            lineHeight: 1,
            transition: "color 0.4s ease",
            textShadow: `0 0 12px ${active.color}66`,
          }}
        >
          {active.label}
        </span>
      </div>
 
      {/* ── Tooltip (shows actual value on hover) ────────────────────── */}
      {showTooltip && hovered && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: theme.background.tertiary,
            border: `1px solid ${theme.border.medium}`,
            borderRadius: "8px",
            padding: "6px 10px",
            whiteSpace: "nowrap",
            zIndex: 50,
            pointerEvents: "none",
            boxShadow: theme.shadow.soft,
          }}
        >
          <p style={{ fontSize: "11px", color: theme.text.tertiary, margin: "0 0 2px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Raw GSR Value
          </p>
          <p style={{ fontSize: "13px", color: active.color, fontWeight: 700, margin: 0 }}>
            {rawValue.toFixed(1)}
            <span style={{ color: theme.text.tertiary, fontWeight: 400, marginLeft: "4px" }}>
              / 100 — {active.range}
            </span>
          </p>
          {/* Tooltip arrow */}
          <div style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: `5px solid ${theme.border.medium}`,
          }} />
        </div>
      )}
    </div>
  );
};
 
export default GSRLevelIndicator;