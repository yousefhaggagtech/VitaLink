"use client";

import React from "react";
import { Theme } from "@/domain/types/types";
import { HistoricalData } from "@/domain/entities/SensorData";
import HealthStatusChart from "@/app/dashboard/components/charts/HealthStatusChart";
import TemperatureTrendChart from "@/app/dashboard/components/charts/TemperatureTrendChart";
import GSRTrendChart from "@/app/dashboard/components/charts/GSRTrendChart";
import AccelerationChart from "@/app/dashboard/components/charts/AccelerationChart";

interface ChartsGridProps {
  theme: Theme;
  historicalData: HistoricalData[];
}

const ChartsGrid: React.FC<ChartsGridProps> = ({ theme, historicalData }) => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <HealthStatusChart historicalData={historicalData} theme={theme} />
      <TemperatureTrendChart historicalData={historicalData} theme={theme} />
      <GSRTrendChart historicalData={historicalData} theme={theme} />
      <AccelerationChart historicalData={historicalData} theme={theme} />
    </section>
  );
};

export default ChartsGrid;
