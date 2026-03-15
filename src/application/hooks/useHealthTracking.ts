"use client";

import { useMemo } from "react";
import { SensorData } from '@/domain/entities/SensorData';
import { HealthStatus } from '@/domain/types/types';
import { getHealthStatus, getOverallHealthStatus } from '@/infrastructure/adapters/healthStatusAdapter';
import { HEALTH_THRESHOLDS } from '@/domain/constants';

export function useHealthTracking(sensorData: SensorData | null) {
  const heartRateStatus = useMemo(() =>
    getHealthStatus(sensorData?.heartRate ?? 0, HEALTH_THRESHOLDS.HR_MIN, HEALTH_THRESHOLDS.HR_MAX),
    [sensorData?.heartRate]
  );

  const spo2Status = useMemo(() =>
    getHealthStatus(sensorData?.spo2 ?? 0, HEALTH_THRESHOLDS.SPO2_MIN, HEALTH_THRESHOLDS.SPO2_MAX),
    [sensorData?.spo2]
  );

  const tempStatus = useMemo(() =>
    getHealthStatus(sensorData?.temperature ?? 0, HEALTH_THRESHOLDS.TEMP_MIN, HEALTH_THRESHOLDS.TEMP_MAX),
    [sensorData?.temperature]
  );

  const gsrValue = useMemo(() => sensorData ? sensorData.sweat * 13 : 0, [sensorData]);

  const gsrStatus = useMemo<HealthStatus>(() =>
    gsrValue > HEALTH_THRESHOLDS.GSR_MAX ? 'warning' : 'optimal',
    [gsrValue]
  );

  const overallHealthStatus = useMemo(() => {
    const statuses = [heartRateStatus, spo2Status, tempStatus, gsrStatus];
    return getOverallHealthStatus(...statuses);
  }, [heartRateStatus, spo2Status, tempStatus, gsrStatus]);

  return {
    heartRateStatus,
    spo2Status,
    tempStatus,
    gsrStatus,
    gsrValue,
    overallHealthStatus,
  };
}
