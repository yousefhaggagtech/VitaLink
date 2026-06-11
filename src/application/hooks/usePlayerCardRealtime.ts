'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { SensorData } from '@/domain/entities/SensorData';
import { Player } from '@/domain/entities/player';
import { useSignalRConnection } from '@/application/hooks/useSignalRConnection';
import { extractUserFromToken } from '@/application/use-cases/extractUserFromToken';

interface UsePlayerCardRealtimeOptions {
  player: Player;
  beltId?: string | null;
}

interface UsePlayerCardRealtimeReturn {
  livePlayer: Player;
  isConnected: boolean;
  isConnecting: boolean;
}

/**
 * Hook for realtime vital signs streaming in PlayerCard
 *
 * Responsibilities:
 * - Connect to SignalR hub for live sensor data via beltId
 * - Buffer last 20 heart rate readings for sparkline
 * - Update Player vitals: heartRate, spO2
 * - Clean up connection on unmount or when beltId changes
 *
 * Does NOT:
 * - Fetch initial player data (that comes from useCoachPlayers)
 * - Manage fatigue or other calculated metrics (only raw vitals)
 * - Handle analysis or AI insights
 *
 * Design:
 * - Each PlayerCard gets its own SignalR connection per beltId
 * - Connection uses coach's username to authenticate
 * - Hub filters data by beltId server-side
 * - No duplicate connections (one per unique beltId)
 */
export function usePlayerCardRealtime(
  options: UsePlayerCardRealtimeOptions
): UsePlayerCardRealtimeReturn {
  const { player, beltId } = options;

  const [livePlayer, setLivePlayer] = useState<Player>(player);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Keep heart rate history in a ref to avoid re-renders while buffering
  const hrHistoryRef = useRef<number[]>([...(player.hrHistory || [])]);

  const username = extractUserFromToken();

  // Callback to handle incoming sensor data from SignalR
  const handleRealtimeData = useCallback((sensorData: SensorData) => {
    // Update heart rate history, keeping last 20 readings
    const maxHistory = 20;

    if (sensorData.heartRate !== undefined && sensorData.heartRate !== null) {
      hrHistoryRef.current = [
        ...hrHistoryRef.current.slice(-(maxHistory - 1)),
        sensorData.heartRate,
      ];
    }

    // Update the livePlayer with new vital values and history
    setLivePlayer((prev) => ({
      ...prev,
      heartRate: sensorData.heartRate ?? prev.heartRate,
      spO2: sensorData.spo2 ?? prev.spO2,
      temperature: sensorData.temperature ?? prev.temperature,
      hrHistory: hrHistoryRef.current,
    }));
  }, []);

  // Set up SignalR connection for live data streaming
  const signalR = useSignalRConnection({
    username: username ?? '',
    dataMode: 'live',
    onDataReceived: handleRealtimeData,
    onConnectionEstablished: () => {
      console.log(`[PlayerCardRealtime] SignalR connected for beltId: ${beltId}`);
      setIsConnected(true);
    },
    onConnectionFailed: (error) => {
      console.error(
        `[PlayerCardRealtime] SignalR connection failed for beltId: ${beltId}`,
        error
      );
      setIsConnected(false);
    },
  });

  useEffect(() => {
    setIsConnecting(signalR.isConnecting);
  }, [signalR.isConnecting]);

  useEffect(() => {
    setIsConnected(signalR.isConnected);
  }, [signalR.isConnected]);

  // Keep livePlayer in sync with initial player data when it changes
  // but preserve the streaming vitals
  useEffect(() => {
    setLivePlayer((prev) => ({
      ...player,
      heartRate: prev.heartRate, // Keep streamed heart rate
      spO2: prev.spO2, // Keep streamed spO2
      temperature: prev.temperature, // Keep streamed temperature
      hrHistory: prev.hrHistory, // Keep streamed history
    }));
  }, [player.id]); // Only re-sync if player ID changes

  return {
    livePlayer,
    isConnected,
    isConnecting,
  };
}
