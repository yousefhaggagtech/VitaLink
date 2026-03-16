"use client";
 
import React, { useState, useEffect } from "react";
import { HealthStatusChartProps } from "@/domain/types/types";
import ChartWrapper from "@/app/dashboard/components/Charts/ChartWrapper";
import GSRLevelIndicator from "@/app/dashboard/components/metrics/Gsrlevelindicator";
import dynamic from "next/dynamic";
 
const AreaChart = dynamic(() => import("recharts").then(mod => mod.AreaChart), { ssr: false });
const XAxis = dynamic(() => import("recharts").then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then(mod => mod.ResponsiveContainer), { ssr: false });
const Area = dynamic(() => import("recharts").then(mod => mod.Area), { ssr: false });
 
const GSRTrendChart: React.FC<HealthStatusChartProps> = ({ historicalData, theme }) => {
  // ──  SSR guard ─────────────────────────────────────────────
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);
 
  // ── accent color ──────────────────────────────────────────
  const color  = theme.accent.primary;
  const latest = historicalData[historicalData.length - 1];
 
  if (!isClient) return null;
 
  return (
    // ──  ChartWrapper keeps the export button ─────────────────
    <ChartWrapper title="GSR Level (μS)" theme={theme}>
 
      {/* header — level indicator replaces raw numeric value */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "16px",
      }}>
        <span style={{
          fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase", color: theme.text.tertiary,
        }}>
          Galvanic Skin Response
        </span>
        {latest && (
          /*
            latest.sweat is the raw sensor value (0–100 scale).
            Pass it directly — thresholds (0–40 / 41–75 / 76+) apply at this scale.
          */
          <GSRLevelIndicator
            rawValue={latest.sweat}
            theme={theme}
            variant="full"
            showTooltip={true}
          />
        )}
      </div>
 
      {/* chart visuals,  dataKey (sweat) ✓ matches both */}
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={historicalData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradGSR" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
 
          <CartesianGrid strokeDasharray="2 6" stroke={theme.border.light} vertical={false} />
          <XAxis
            dataKey="time"
            stroke="transparent"
            tick={{ fill: theme.text.tertiary, fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="transparent"
            tick={{ fill: theme.text.tertiary, fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.background.tertiary,
              border: `1px solid ${theme.border.medium}`,
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: theme.text.secondary }}
            itemStyle={{ color }}
          />
 
         
          <Area
            type="monotone"
            dataKey="sweat"
            stroke={color}
            strokeWidth={2}
            fill="url(#gradGSR)"
            dot={false}
            name="GSR (μS)"
            style={{ filter: `drop-shadow(0 0 4px ${color})` }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};
 
export default GSRTrendChart;