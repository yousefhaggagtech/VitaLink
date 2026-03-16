"use client";
 
import React from "react";
import { Theme } from "@/domain/types/types";
import CircularCountdown from "@/app/dashboard/components/analysis/CircularCountdown";
 
interface AIInsightPanelProps {
  counter: number;
  /** The AI analysis text returned from Gemini — useAnalysisBuffer */
  geminiResponse: string;
  isAnalyzing: boolean;
  dataPointsCollected: number;
  theme: Theme;
}
 
// ── Parse geminiResponse into bullet points (max 4) ───────────────────
const parseInsightToBullets = (
  text: string
): { icon: string; color: string; label: string; body: string }[] => {
  if (!text) return [];
 
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 4)
    .slice(0, 4);
 
  const meta = [
    { icon: "●", color: "#00FF87", label: "Vitals" },
    { icon: "▲", color: "#F5A623", label: "Alert" },
    { icon: "■", color: "#FF8C42", label: "Predictive Analysis" },
    { icon: "◆", color: "#00CFFF", label: "Insight" },
  ];
 
  return sentences.map((body, i) => ({
    ...meta[i % meta.length],
    body,
  }));
};
 
const AIInsightPanel: React.FC<AIInsightPanelProps> = ({
  counter,
  geminiResponse,
  isAnalyzing,
  dataPointsCollected,
  theme,
}) => {
  const bullets = parseInsightToBullets(geminiResponse);
  const accentGreen = theme.accent.primary;
 
  return (
    <section
      style={{
        backgroundColor: theme.background.secondary,
        border: `1px solid ${theme.border.medium}`,
        borderRadius: "16px",
        padding: "28px 32px",
        marginBottom: "2rem",
        boxShadow: theme.shadow.soft,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Faint EKG decorative line at top */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          height: "4px",
          opacity: 0.4,
        }}
        viewBox="0 0 400 4"
        preserveAspectRatio="none"
      >
        <path
          d="M0,2 L80,2 L90,0 L100,4 L110,0 L120,2 L400,2"
          stroke={accentGreen}
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
 
      {/* Title row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "24px",
        }}
      >
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
          <path
            d="M0,8 L4,8 L6,2 L8,14 L10,4 L12,10 L14,8 L22,8"
            stroke={accentGreen}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 4px ${accentGreen})` }}
          />
        </svg>
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: theme.text.primary,
            margin: 0,
          }}
        >
          AI Health Insights
        </h2>
      </div>
 
      {/* 2-column body */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px",
          alignItems: "start",
        }}
      >
        {/* Left: Bullet insights */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {!geminiResponse && !isAnalyzing && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <span style={{ fontSize: "10px", color: accentGreen, marginTop: "3px" }}>
                ●
              </span>
              <p
                style={{
                  fontSize: "13px",
                  color: theme.text.secondary,
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                Waiting for the first 10-second data cycle to complete...
              </p>
            </div>
          )}
 
          {isAnalyzing && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <span
                style={{
                  fontSize: "10px",
                  color: accentGreen,
                  marginTop: "3px",
                  animation: "smooth-pulse 1s infinite",
                }}
              >
                ●
              </span>
              <p
                style={{
                  fontSize: "13px",
                  color: accentGreen,
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                Analyzing biometric patterns...
              </p>
            </div>
          )}
 
          {bullets.map((b, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}
            >
              <span
                style={{
                  fontSize: "9px",
                  color: b.color,
                  marginTop: "4px",
                  flexShrink: 0,
                  filter: `drop-shadow(0 0 3px ${b.color})`,
                }}
              >
                {b.icon}
              </span>
              <p
                style={{
                  fontSize: "13px",
                  color: theme.text.secondary,
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                <span style={{ color: b.color, fontWeight: 700 }}>
                  {b.label}
                </span>
                {" — "}
                {b.body}
              </p>
            </div>
          ))}
        </div>
 
        {/* Right: Countdown + status mini-panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              backgroundColor: theme.background.tertiary,
              border: `1px solid ${theme.border.medium}`,
              borderRadius: "12px",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {/* CircularCountdown — Version B's component */}
            <CircularCountdown counter={counter} theme={theme} />
 
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: theme.text.tertiary,
                    margin: "0 0 3px",
                  }}
                >
                  Analysis Status
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: isAnalyzing ? theme.status.warning : accentGreen,
                    margin: 0,
                  }}
                >
                  {isAnalyzing ? "Processing..." : "Ready"}
                </p>
              </div>
 
              <div>
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: theme.text.tertiary,
                    margin: "0 0 3px",
                  }}
                >
                  Data Points
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: accentGreen,
                    margin: 0,
                  }}
                >
                  {dataPointsCollected}{" "}
                  <span style={{ color: theme.text.tertiary, fontWeight: 400 }}>
                    / 10
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
 
export default AIInsightPanel;