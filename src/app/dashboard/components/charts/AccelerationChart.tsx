"use client";
 
import React, { useState, useEffect } from "react";
import { HealthStatusChartProps } from "@/domain/types/types";
import ChartWrapper from "@/app/dashboard/components/Charts/ChartWrapper";
import dynamic from "next/dynamic";
 
const AreaChart = dynamic(() => import("recharts").then(mod => mod.AreaChart), { ssr: false });
const XAxis = dynamic(() => import("recharts").then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then(mod => mod.ResponsiveContainer), { ssr: false });
const Area = dynamic(() => import("recharts").then(mod => mod.Area), { ssr: false });
 
const AccelerationChart: React.FC<HealthStatusChartProps> = ({ historicalData, theme }) => {
  // ──  SSR guard ─────────────────────────────────────────────
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);
 
  // ──  per-axis neon colors ──────────────────────────────────
  const colorX = theme.accent.primary; // neon green
  const colorY = "#F5A623";            // orange-yellow
  const colorZ = theme.status.info;    // teal/blue
 
  if (!isClient) return null;
 
  return (
    // ──  ChartWrapper keeps the export button ─────────────────
    <ChartWrapper title="3D Acceleration (ms²)" theme={theme}>
 
      {/*  header with inline axis legend */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px",
      }}>
        <span style={{
          fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase", color: theme.text.tertiary,
        }}>
          X · Y · Z axes
        </span>
 
        {/*  colored line legend */}
        <div style={{ display: "flex", gap: "12px" }}>
          {[
            { label: "X.Axis", color: colorX },
            { label: "Y.Axis", color: colorY },
            { label: "Z.Axis", color: colorZ },
          ].map(({ label, color }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{
                width: "10px", height: "2px",
                backgroundColor: color,
                boxShadow: `0 0 4px ${color}`,
                borderRadius: "1px",
              }} />
              <span style={{ fontSize: "10px", color: theme.text.tertiary }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
 
      {/*  chart visuals,  dataKeys (accX, accY, accZ) ✓ */}
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={historicalData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradAccX" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={colorX} stopOpacity={0.25} />
              <stop offset="100%" stopColor={colorX} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradAccY" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={colorY} stopOpacity={0.25} />
              <stop offset="100%" stopColor={colorY} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradAccZ" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={colorZ} stopOpacity={0.15} />
              <stop offset="100%" stopColor={colorZ} stopOpacity={0} />
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
          />
 
          {/* accX, accY, accZ ✓ same in both versions */}
          <Area
            type="monotone"
            dataKey="accX"
            stroke={colorX}
            strokeWidth={1.8}
            fill="url(#gradAccX)"
            dot={false}
            name="X.Axis"
            style={{ filter: `drop-shadow(0 0 3px ${colorX})` }}
          />
          <Area
            type="monotone"
            dataKey="accY"
            stroke={colorY}
            strokeWidth={1.8}
            fill="url(#gradAccY)"
            dot={false}
            name="Y.Axis"
            style={{ filter: `drop-shadow(0 0 3px ${colorY})` }}
          />
          <Area
            type="monotone"
            dataKey="accZ"
            stroke={colorZ}
            strokeWidth={1.5}
            fill="url(#gradAccZ)"
            dot={false}
            name="Z.Axis"
            opacity={0.7}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};
 
export default AccelerationChart;