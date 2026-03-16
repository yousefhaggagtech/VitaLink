"use client";
 
import React from "react";
import { Theme } from "@/domain/types/types";
import { DataMode, HealthStatus } from "@/domain/types/types";

 
interface DashboardHeaderProps {
  username: string;
  overallStatus: HealthStatus;
  isConnected: boolean;
  dataMode: DataMode;
  timestamp: string;
  theme: Theme;
  currentTheme: "limeDark" | "blueLight";
  onThemeToggle: () => void;
  onDataModeChange: (mode: DataMode) => void;
  onClearData: () => void;
}
 
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  username,
  overallStatus,
  isConnected,
  dataMode,
  timestamp,
  theme,
  currentTheme,
  onThemeToggle,
  onDataModeChange,
  onClearData,
}) => {
  const accent = theme.accent.primary;
  const isDark = theme.name === "Lime Dark";
 
  return (
    <header style={{ position: "relative", overflow: "hidden" }}>
      {/* ── Hero banner ───────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          backgroundColor: isDark ? "#060D08" : theme.background.secondary,
          borderBottom: `1px solid ${theme.border.medium}`,
          padding: "36px 32px 28px",
        }}
      >
        {/* Decorative particle / wave SVG */}
        <svg
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "55%",
            height: "100%",
            opacity: isDark ? 0.55 : 0.18,
            pointerEvents: "none",
          }}
          viewBox="0 0 600 140"
          preserveAspectRatio="xMaxYMid slice"
          fill="none"
        >
          <path
            d="M600,20 C500,40 440,10 360,35 C280,60 220,20 140,45 C60,70 20,50 0,55"
            stroke={accent}
            strokeWidth="0.8"
            opacity="0.6"
          />
          <path
            d="M600,45 C520,65 460,30 380,55 C300,80 240,40 160,62 C80,84 30,68 0,75"
            stroke={accent}
            strokeWidth="0.5"
            opacity="0.4"
          />
          <path
            d="M600,70 C540,85 480,55 400,75 C320,95 260,65 180,82 C100,99 45,85 0,92"
            stroke={accent}
            strokeWidth="0.4"
            opacity="0.3"
          />
          {[
            [520, 18], [470, 52], [430, 28], [390, 68], [350, 42],
            [560, 78], [500, 105], [455, 88], [415, 115], [372, 95],
            [330, 62], [295, 30], [260, 80], [580, 38],
          ].map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={i % 3 === 0 ? 1.5 : 1}
              fill={accent}
              opacity={i % 3 === 0 ? 0.6 : 0.35}
            />
          ))}
          <circle cx="490" cy="55" r="40" fill={accent} opacity="0.03" />
          <circle cx="380" cy="80" r="55" fill={accent} opacity="0.025" />
        </svg>
 
        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "1280px",
            margin: "0 auto",
          }}
        >
          <h1
            style={{
              margin: "0 0 8px",
              fontSize: "clamp(20px, 3vw, 28px)",
              fontWeight: 800,
              letterSpacing: "-0.01em",
              color: theme.text.primary,
              lineHeight: 1.2,
              maxWidth: "620px",
            }}
          >
            Precision Monitoring for Elite Health Performance
          </h1>
 
          <p
            style={{
              margin: "0 0 16px",
              fontSize: "13px",
              color: theme.text.tertiary,
              letterSpacing: "0.01em",
              maxWidth: "520px",
            }}
          >
            Track real-time biometrics with intelligent insights for optimal
            performance.
          </p>
 
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              color: theme.text.secondary,
              letterSpacing: "0.02em",
            }}
          >
            Welcome,{" "}
            <span
              style={{
                color: accent,
                fontWeight: 700,
                textShadow: isDark ? `0 0 8px ${accent}66` : "none",
              }}
            >
              {username}
            </span>{" "}
            — Real-Time Biometric Monitoring
          </p>
        </div>
      </div>
 
      {/* ── Controls bar ──────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: isDark
            ? `${theme.background.secondary}F8`
            : `${theme.background.secondary}F0`,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${theme.border.light}`,
          padding: "10px 32px",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {/* Status pills + timestamp */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <StatusPill
              dot={
                overallStatus === "optimal"
                  ? theme.status.success
                  : theme.status.warning
              }
              label={`System: ${overallStatus.toUpperCase()}`}
              theme={theme}
              pulse={overallStatus !== "optimal"}
            />
            <StatusPill
              dot={isConnected ? theme.status.success : theme.status.danger}
              label={
                dataMode === "simulated"
                  ? "Simulated"
                  : isConnected
                  ? "Connected"
                  : "Disconnected"
              }
              theme={theme}
              pulse={isConnected}
            />
            <span
              style={{
                fontSize: "11px",
                color: theme.text.tertiary,
                marginLeft: "4px",
              }}
            >
              Last update:{" "}
              <span
                style={{
                  color: theme.text.secondary,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {timestamp || "—"}
              </span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
 
// ── Status pill ────────────────────────────────────────────────────────
const StatusPill: React.FC<{
  dot: string;
  label: string;
  theme: Theme;
  pulse?: boolean;
}> = ({ dot, label, theme, pulse = false }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "6px",
      backgroundColor: theme.background.tertiary,
      border: `1px solid ${theme.border.medium}`,
      borderRadius: "999px",
      padding: "4px 11px",
      fontSize: "11px",
      fontWeight: 600,
      color: theme.text.secondary,
      whiteSpace: "nowrap",
    }}
  >
    <span
      style={{
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        backgroundColor: dot,
        boxShadow: `0 0 5px ${dot}`,
        display: "inline-block",
        flexShrink: 0,
        animation: pulse ? "smooth-pulse 2s ease-in-out infinite" : "none",
      }}
    />
    {label}
  </div>
);