"use client";

import React from "react";
import { Theme, HealthStatus } from "@/domain/types/types";
import { SensorData } from "@/domain/entities/SensorData";
import { HEALTH_THRESHOLDS } from "@/domain/constants";
import MetricCard from "@/app/dashboard/components/metrics/MetricCard";

interface MetricsGridProps {
  theme: Theme;
  sensorData: SensorData | null;
  statuses: {
    heartRateStatus: HealthStatus;
    spo2Status: HealthStatus;
    tempStatus: HealthStatus;
    gsrStatus: HealthStatus;
    gsrValue: number;
  };
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ theme, sensorData, statuses }) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <MetricCard
        label="Heart Rate"
        value={sensorData?.heartRate ?? 0}
        unit="BPM"
        status={statuses.heartRateStatus}
        theme={theme}
        min={HEALTH_THRESHOLDS.HR_MIN}
        max={HEALTH_THRESHOLDS.HR_MAX}
      />
      <MetricCard
        label="Blood Oxygen"
        value={sensorData?.spo2 ?? 0}
        unit="%"
        status={statuses.spo2Status}
        theme={theme}
        min={HEALTH_THRESHOLDS.SPO2_MIN}
        max={HEALTH_THRESHOLDS.SPO2_MAX}
      />
      <MetricCard
        label="Body Temperature"
        value={sensorData?.temperature ?? 0}
        unit="°C"
        status={statuses.tempStatus}
        theme={theme}
        min={HEALTH_THRESHOLDS.TEMP_MIN}
        max={HEALTH_THRESHOLDS.TEMP_MAX}
      />
      <MetricCard
        label="GSR Level"
        value={statuses.gsrValue}
        unit="Ohms"
        status={statuses.gsrStatus}
        theme={theme}
        min={0}
        max={HEALTH_THRESHOLDS.GSR_MAX}
      />
    </section>
  );
};

export default MetricsGrid;
