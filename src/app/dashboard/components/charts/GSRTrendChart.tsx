"use client";

import React, { useState, useEffect } from "react";
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

const GSRTrendChart: React.FC<HealthStatusChartProps> = ({ historicalData, theme }) => {
  const [isClient, setIsClient] = useState(false);
  const gsrColor = "#00FFFF";

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <ChartWrapper title="GSR (GALVANIC SKIN RESPONSE) TREND" theme={theme}>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={historicalData}
          margin={{ top: 30, right: 30, left: 5, bottom: 30 }}
        >
          <defs>
            <linearGradient id="colorGSR" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={gsrColor} stopOpacity={0.8} />
              <stop offset="95%" stopColor={gsrColor} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.border.light} horizontal={true} vertical={false} />
          <XAxis dataKey="time" stroke={theme.text.tertiary} style={{ fontSize: '0.75rem' }} />
          <YAxis stroke={theme.text.tertiary} style={{ fontSize: '0.75rem' }} />
          <Tooltip
            contentStyle={{ backgroundColor: theme.background.secondary, border: `1px solid ${theme.border.medium}`, borderRadius: '8px', color: theme.text.primary }}
            labelStyle={{ color: theme.text.primary }}
          />
          <Area
            type="monotone"
            dataKey="sweat"
            stroke={gsrColor}
            fillOpacity={1}
            fill="url(#colorGSR)"
            strokeWidth={3}
            name="GSR (Ohms)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default GSRTrendChart;
