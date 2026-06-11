'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { SensorData } from '@/domain/entities/SensorData';
import { PlayerProfileData } from '@/application/mappers/toPlayerProfile';
import { useSignalRConnection } from '@/application/hooks/useSignalRConnection';
import { extractUserFromToken } from '@/application/use-cases/extractUserFromToken';

interface UsePlayerProfileRealtimeOptions {
  beltId: string;
  initialProfileData: PlayerProfileData;
}

interface UsePlayerProfileRealtimeReturn {
  profileData: PlayerProfileData;
  isConnected: boolean;
  isConnecting: boolean;
}

/**
 * Hook for realtime vital signs streaming in PlayerProfile
 *
 * Responsibilities:
 * - Connect to SignalR hub for live sensor data
 * - Buffer last 20 readings for each vital
 * - Update ProfileData vitals: heartRate, spO2, temperature, stress
 * - Clean up connection on unmount
 *
 * Does NOT:
 * - Fetch initial player data (that's usePlayerDetail)
 * - Manage fatigue or other calculated metrics (only raw vitals)
 * - Handle analysis or AI insights
 */
export function usePlayerProfileRealtime(
  options: UsePlayerProfileRealtimeOptions
): UsePlayerProfileRealtimeReturn {
  const { beltId, initialProfileData } = options;

  const [profileData, setProfileData] = useState<PlayerProfileData>(initialProfileData);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Keep vitals history in refs to avoid re-renders while buffering
  const vitalHistoriesRef = useRef({
    heartRate: [...(initialProfileData.vitals.heartRate.history || [])],
    spO2: [...(initialProfileData.vitals.spO2.history || [])],
    temperature: [...(initialProfileData.vitals.temperature.history || [])],
    stress: [...(initialProfileData.vitals.stress.history || [])],
  });

  const username = extractUserFromToken();

  // Callback to handle incoming sensor data from SignalR
  const handleRealtimeData = useCallback((sensorData: SensorData) => {
    // Update histories, keeping last 20 readings
    const maxHistory = 20;

    if (sensorData.heartRate) {
      vitalHistoriesRef.current.heartRate = [
        ...vitalHistoriesRef.current.heartRate.slice(-(maxHistory - 1)),
        sensorData.heartRate,
      ];
    }

    if (sensorData.spo2) {
      vitalHistoriesRef.current.spO2 = [
        ...vitalHistoriesRef.current.spO2.slice(-(maxHistory - 1)),
        sensorData.spo2,
      ];
    }

    if (sensorData.temperature) {
      vitalHistoriesRef.current.temperature = [
        ...vitalHistoriesRef.current.temperature.slice(-(maxHistory - 1)),
        sensorData.temperature,
      ];
    }

    // GSR is calculated from sweat: sweat * 13
    const gsrValue = sensorData.sweat || 0;
    vitalHistoriesRef.current.stress = [
      ...vitalHistoriesRef.current.stress.slice(-(maxHistory - 1)),
      gsrValue,
    ];

    // Update ProfileData with new vital values and histories
    setProfileData((prev) => ({
      ...prev,
      vitals: {
        heartRate: {
          value: sensorData.heartRate || 0,
          history: vitalHistoriesRef.current.heartRate,
        },
        spO2: {
          value: sensorData.spo2 || 0,
          history: vitalHistoriesRef.current.spO2,
        },
        temperature: {
          value: sensorData.temperature || 0,
          history: vitalHistoriesRef.current.temperature,
        },
        stress: {
          value: gsrValue,
          history: vitalHistoriesRef.current.stress,
        },
      },
    }));
  }, []);

  // Set up SignalR connection for live data streaming
  const signalR = useSignalRConnection({
    username: username ?? '',
    dataMode: 'live',
    onDataReceived: handleRealtimeData,
    onConnectionEstablished: () => {
      console.log('[PlayerProfileRealtime] SignalR connected');
      setIsConnected(true);
    },
    onConnectionFailed: (error) => {
      console.error('[PlayerProfileRealtime] SignalR connection failed:', error);
      setIsConnected(false);
    },
  });

  useEffect(() => {
    setIsConnecting(signalR.isConnecting);
  }, [signalR.isConnecting]);

  useEffect(() => {
    setIsConnected(signalR.isConnected);
  }, [signalR.isConnected]);

  // Keep ProfileData in sync with initial data when it changes
  useEffect(() => {
    setProfileData((prev) => ({
      ...initialProfileData,
      vitals: prev.vitals, // Keep streaming vitals, only update non-realtime fields
    }));
  }, [initialProfileData.id]); // Only re-sync if player ID changes

  return {
    profileData,
    isConnected,
    isConnecting,
  };
}
