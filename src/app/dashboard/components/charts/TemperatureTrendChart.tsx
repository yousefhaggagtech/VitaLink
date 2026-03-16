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
 
const TemperatureTrendChart: React.FC<HealthStatusChartProps> = ({ historicalData, theme }) => {
  // ──  SSR guard ─────────────────────────────────────────────
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);
 
  // ──  accent color ──────────────────────────────────────────
  const color  = theme.accent.primary;
  const latest = historicalData[historicalData.length - 1];
 
  if (!isClient) return null;
 
  return (
    //  ChartWrapper keeps the export button ─────────────────
    <ChartWrapper title="Temperature (°C)" theme={theme}>
 
      {/*  live value readout */}
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
          Body Temperature
        </span>
        {latest && (
          <span style={{
            fontSize: "24px", fontWeight: 800, color,
            filter: `drop-shadow(0 0 6px ${color})`, lineHeight: 1,
          }}>
            {latest.temperature.toFixed(1)}
            <span style={{ fontSize: "11px", fontWeight: 600, color: theme.text.tertiary, marginLeft: "4px" }}>
              °C
            </span>
          </span>
        )}
      </div>
 
      {/*  chart visuals,  dataKey (temperature not bodyTemperature) */}
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={historicalData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradTemp" x1="0" y1="0" x2="0" y2="1">
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
            domain={["auto", "auto"]}
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
 
          {/*  temperature (NOT bodyTemperature from A) */}
          <Area
            type="monotone"
            dataKey="temperature"
            stroke={color}
            strokeWidth={2}
            fill="url(#gradTemp)"
            dot={false}
            name="Temp (°C)"
            style={{ filter: `drop-shadow(0 0 4px ${color})` }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};
 
export default TemperatureTrendChart;