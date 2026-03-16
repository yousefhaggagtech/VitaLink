"use client";
 
import React from "react";
import { MetricCardProps } from "@/domain/types/types";
import { getStatusColor } from "@/infrastructure/adapters/healthStatusAdapter";
import { icons } from "@/domain/constants";
import GSRLevelIndicator from "@/app/dashboard/components/metrics/Gsrlevelindicator";
 

const CardIcons: Record<string, React.FC<{ color: string }>> = {
  "Heart Rate": ({ color }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"
        fill={color}
        opacity="0.9"
      />
    </svg>
  ),
  "Blood Oxygen": ({ color }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M12 6v6l4 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2" fill={color} />
    </svg>
  ),
  "Body Temperature": ({ color }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="11.5" cy="18.5" r="2.5" fill={color} opacity="0.8" />
    </svg>
  ),
  "GSR Level": ({ color }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M2 12h3l3-8 4 16 3-11 2 3h5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),
};
 

const Sparkline: React.FC<{ color: string }> = ({ color }) => {
  const id = `spark-${color.replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg width="100%" height="28" viewBox="0 0 120 28" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,20 C10,18 15,10 25,12 C35,14 40,8 50,10 C60,12 65,6 75,8 C85,10 90,4 100,6 C110,8 115,12 120,10"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        style={{ filter: `drop-shadow(0 0 3px ${color})` }}
      />
      <path
        d="M0,20 C10,18 15,10 25,12 C35,14 40,8 50,10 C60,12 65,6 75,8 C85,10 90,4 100,6 C110,8 115,12 120,10 L120,28 L0,28 Z"
        fill={`url(#${id})`}
      />
    </svg>
  );
};
 
const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  status,
  theme,
  min,
  max,
}) => {
 
  const statusColor = getStatusColor(status, theme);
  const isOptimal = status === "optimal";
 
  // Normalised % within range for the progress bar
  const pct = Math.min(
    100,
    Math.max(0, ((value - min) / (max - min)) * 100)
  );
 
 
  const InlineSvgIcon = CardIcons[label];
 
  return (
    <div
      style={{
        backgroundColor: theme.background.secondary,
        border: `1px solid ${isOptimal ? theme.border.medium : statusColor}`,
        borderRadius: "14px",
        padding: "18px 20px 14px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        boxShadow: isOptimal
          ? theme.shadow.soft
          : `${theme.shadow.soft}, 0 0 20px ${statusColor}33`,
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
      }}
    >
      {/* Accent glow strip at top  */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${statusColor}, transparent)`,
          opacity: 0.6,
        }}
      />
 
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {InlineSvgIcon ? (
            <InlineSvgIcon color={statusColor} />
          ) : (
            <span style={{ fontSize: "1.1em" }}>{icons[label]}</span>
          )}
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: theme.text.tertiary,
            }}
          >
            {label}
          </span>
        </div>
 
        {/* Status dot */}
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: statusColor,
            boxShadow: `0 0 6px ${statusColor}`,
            animation: !isOptimal
              ? "pulse-ring 1.5s infinite"
              : "smooth-pulse 3s infinite",
          }}
        />
      </div>
 
      {/* ── Value section — GSR gets a level indicator, others get numeric ── */}
      {label === "Effort level" ? (
        <>
          {/* GSR: level-based visual — no raw number shown */}
          <div style={{ marginTop: "6px", marginBottom: "4px" }}>
            {/*
              value is gsrValue = gsrLevel × 13 (Ohms, 0–1300).
              Divide by 13 to recover the raw 0–100 scale the
              level thresholds (0–40 / 41–75 / 76+) are designed for.
            */}
            <GSRLevelIndicator
              rawValue={value / 13}
              theme={theme}
              variant="compact"
              showTooltip={true}
            />
          </div>
 
          {/* Decorative sparkline with level-aware color */}
          <div style={{ marginTop: "4px", opacity: 0.7 }}>
            <Sparkline color={statusColor} />
          </div>
 
          {/* Footer: show level range instead of numeric range */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "10px", color: theme.text.tertiary }}>
              Low · Medium · Good
            </span>
            <span style={{
              fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em",
              color: statusColor, textTransform: "uppercase",
            }}>
              {isOptimal ? "Optimal" : "Warning"}
            </span>
          </div>
        </>
      ) : (
        <>
          {/* All other metrics: standard numeric display */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginTop: "4px" }}>
            <span style={{
              fontSize: "clamp(36px, 5vw, 48px)",
              fontWeight: 800,
              color: theme.text.primary,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}>
              {value.toFixed(1)}
            </span>
            <span style={{ fontSize: "14px", fontWeight: 600, color: theme.text.tertiary }}>
              {unit}
            </span>
          </div>
 
          {/* Range progress bar */}
          <div style={{
            height: "3px", borderRadius: "2px",
            backgroundColor: theme.border.light, marginTop: "4px",
          }}>
            <div style={{
              height: "100%", width: `${pct}%`, borderRadius: "2px",
              background: `linear-gradient(90deg, ${statusColor}88, ${statusColor})`,
              transition: "width 0.6s ease",
            }} />
          </div>
 
          {/* Decorative sparkline */}
          <div style={{ marginTop: "4px", opacity: 0.7 }}>
            <Sparkline color={statusColor} />
          </div>
 
          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "10px", color: theme.text.tertiary }}>
              Range: {min.toFixed(1)} – {max.toFixed(1)} {unit}
            </span>
            <span style={{
              fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em",
              color: statusColor, textTransform: "uppercase",
            }}>
              {isOptimal ? "Optimal" : "Warning"}
            </span>
          </div>
        </>
      )}
    </div>
  );
};
 
export default MetricCard;
 