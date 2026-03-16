"use client";
 
import React, { useState, useEffect, useMemo } from "react";
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
 
const HealthStatusChart: React.FC<HealthStatusChartProps> = ({ historicalData, theme }) => {
  // ──  SSR guard ─────────────────────────────────────────────
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);
  const t = useMemo(() => theme, [theme]);
 
  // ──  accent colors ─────────────────────────────────────────
  const green = t.accent.primary;
  const teal  = t.status.info;
 
  // Latest value for the live readout (Version A UI)
  const latest = historicalData[historicalData.length - 1];
 
  if (!isClient) return null;
 
  return (
    // ──  ChartWrapper keeps the export button ─────────────────
    <ChartWrapper title="Heart Rate (BPM)" theme={t}>
 
      {/*  live value readout in header area */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "16px",
      }}>
        <span style={{
          fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase", color: t.text.tertiary,
        }}>
          Heart Rate + SpO₂
        </span>
        {latest && (
          <span style={{
            fontSize: "24px", fontWeight: 800, color: green,
            filter: `drop-shadow(0 0 6px ${green})`, lineHeight: 1,
          }}>
            {latest.heartRate.toFixed(0)}
            <span style={{ fontSize: "11px", fontWeight: 600, color: t.text.tertiary, marginLeft: "4px" }}>
              BPM
            </span>
          </span>
        )}
      </div>
 
      {/*  chart visuals,  dataKeys (spo2 not bloodOxygen) */}
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={historicalData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradHr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={green} stopOpacity={0.35} />
              <stop offset="100%" stopColor={green} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradSpo2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={teal} stopOpacity={0.25} />
              <stop offset="100%" stopColor={teal} stopOpacity={0} />
            </linearGradient>
          </defs>
 
          {/*  airy "2 6" dash pattern, no vertical lines, transparent axes */}
          <CartesianGrid strokeDasharray="2 6" stroke={t.border.light} vertical={false} />
          <XAxis
            dataKey="time"
            stroke="transparent"
            tick={{ fill: t.text.tertiary, fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="transparent"
            tick={{ fill: t.text.tertiary, fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: t.background.tertiary,
              border: `1px solid ${t.border.medium}`,
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: t.text.secondary }}
            itemStyle={{ color: green }}
          />
 
          {/* Version B dataKey: heartRate ✓ */}
          <Area
            type="monotone"
            dataKey="heartRate"
            stroke={green}
            strokeWidth={2}
            fill="url(#gradHr)"
            dot={false}
            name="Heart Rate"
            style={{ filter: `drop-shadow(0 0 4px ${green})` }}
          />
          {/* Version B dataKey: spo2 (NOT bloodOxygen from A) */}
          <Area
            type="monotone"
            dataKey="spo2"
            stroke={teal}
            strokeWidth={1.5}
            fill="url(#gradSpo2)"
            dot={false}
            name="SpO₂ (%)"
            style={{ filter: `drop-shadow(0 0 3px ${teal})` }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};
 
export default HealthStatusChart;