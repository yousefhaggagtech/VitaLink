"use client";

import React, { useState, useEffect, useMemo } from "react";
import { HealthStatusChartProps } from "@/domain/types/types";
import ChartWrapper from "@/app/dashboard/components/charts/ChartWrapper";
import dynamic from "next/dynamic";

const AreaChart = dynamic(() => import("recharts").then(mod => mod.AreaChart), { ssr: false });
const XAxis = dynamic(() => import("recharts").then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then(mod => mod.ResponsiveContainer), { ssr: false });
const Area = dynamic(() => import("recharts").then(mod => mod.Area), { ssr: false });

const HealthStatusChart: React.FC<HealthStatusChartProps> = ({ historicalData, theme }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []); // Empty dependency array - runs only once on mount

  // Memoize theme to prevent unnecessary re-renders
  const memoizedTheme = useMemo(() => theme, [theme]);

  if (!isClient) return null;

  return (
    <ChartWrapper title="VITAL SIGNS TREND (STACKED)" theme={memoizedTheme}>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={historicalData}
          margin={{ top: 30, right: 30, left: 5, bottom: 30 }}
        >
          <defs>
            <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={memoizedTheme.status.danger} stopOpacity={0.8} />
              <stop offset="95%" stopColor={memoizedTheme.status.danger} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorSpo2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={memoizedTheme.status.success} stopOpacity={0.8} />
              <stop offset="95%" stopColor={memoizedTheme.status.success} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={memoizedTheme.border.light} horizontal={true} vertical={false} />
          <XAxis dataKey="time" stroke={memoizedTheme.text.tertiary} style={{ fontSize: '0.75rem' }} />
          <YAxis stroke={memoizedTheme.text.tertiary} style={{ fontSize: '0.75rem' }} />
          <Tooltip
            contentStyle={{ backgroundColor: memoizedTheme.background.secondary, border: `1px solid ${memoizedTheme.border.medium}`, borderRadius: '8px', color: memoizedTheme.text.primary }}
            labelStyle={{ color: memoizedTheme.text.primary }}
          />
          <Area
            type="monotone"
            dataKey="heartRate"
            stackId="vitals"
            stroke={memoizedTheme.status.danger}
            fillOpacity={1}
            fill="url(#colorHr)"
            name="Heart Rate (bpm)"
            strokeWidth={3}
          />
          <Area
            type="monotone"
            dataKey="spo2"
            stackId="vitals"
            stroke={memoizedTheme.status.success}
            fillOpacity={1}
            fill="url(#colorSpo2)"
            name="SpO2 (%)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default HealthStatusChart;