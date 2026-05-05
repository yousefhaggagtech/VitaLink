"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { SensorData } from "@/domain/entities/SensorData";
import { DataMode } from "@/domain/types/types";
import { SensorHubService } from "@/infrastructure/services/signalRService";

export interface UseSignalRConnectionOptions {
  username: string;
  dataMode: DataMode;
  onDataReceived: (data: SensorData) => void;
  onConnectionEstablished?: () => void;
  onConnectionFailed?: (error: Error) => void;
  onReconnected?: () => void;
}

export interface UseSignalRConnectionReturn {
  connection: signalR.HubConnection | null;
  isConnected: boolean;
  isConnecting: boolean;
  lastError: Error | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  manualCleanup: () => void;
}

export function useSignalRConnection(
  options: UseSignalRConnectionOptions
): UseSignalRConnectionReturn {

  const { username, dataMode } = options;

  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);

  const latestOptionsRef = useRef(options);
  const hubServiceRef = useRef(new SensorHubService());
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const isConnectingRef = useRef(false);
  const connectionRunRef = useRef(0);

  latestOptionsRef.current = options;

  const connect = useCallback(async () => {
    const currentOptions = latestOptionsRef.current;

    if (currentOptions.dataMode !== "live") {
      return;
    }

    if (!currentOptions.username) {
      const error = new Error("Username required for live mode");
      setLastError(error);
      setIsConnected(false);
      currentOptions.onConnectionFailed?.(error);
      return;
    }

    const currentConnection = connectionRef.current;
    if (
      isConnectingRef.current ||
      currentConnection?.state === signalR.HubConnectionState.Connected ||
      currentConnection?.state === signalR.HubConnectionState.Connecting ||
      currentConnection?.state === signalR.HubConnectionState.Reconnecting
    ) {
      return;
    }

    const runId = connectionRunRef.current + 1;
    connectionRunRef.current = runId;
    isConnectingRef.current = true;

    let hub: signalR.HubConnection | null = null;

    try {
      setIsConnecting(true);
      setLastError(null);

      
      console.log("ENV:", process.env.NEXT_PUBLIC_SIGNALR_HUB_URL);

      hub = hubServiceRef.current.createHubConnection(currentOptions.username, {
        onReceiveUpdate: (data) => {
          latestOptionsRef.current.onDataReceived(data);
        },
        onReconnecting: () => {
          if (connectionRef.current !== hub) return;
          isConnectingRef.current = true;
          setIsConnected(false);
          setIsConnecting(true);
        },
        onReconnected: () => {
          if (connectionRef.current !== hub) return;
          isConnectingRef.current = false;
          setIsConnecting(false);
          setIsConnected(true);
          latestOptionsRef.current.onReconnected?.();
        },
        onClosed: (error) => {
          if (connectionRef.current !== hub) return;
          connectionRef.current = null;
          isConnectingRef.current = false;
          setConnection(null);
          setIsConnecting(false);
          setIsConnected(false);
          if (error) {
            setLastError(error);
          }
        },
      });

      connectionRef.current = hub;
      setConnection(hub);

      await hubServiceRef.current.startHub(hub, currentOptions.username);

      if (connectionRunRef.current !== runId || connectionRef.current !== hub) {
        hubServiceRef.current.disconnectHub(hub);
        return;
      }

      isConnectingRef.current = false;
      setIsConnecting(false);
      setIsConnected(true);
      latestOptionsRef.current.onConnectionEstablished?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Connection failed");

      if (connectionRunRef.current === runId && connectionRef.current === hub) {
        connectionRef.current = null;
        isConnectingRef.current = false;
        setConnection(null);
        setIsConnecting(false);
        setIsConnected(false);
        setLastError(err);
        latestOptionsRef.current.onConnectionFailed?.(err);
      }

      console.error("SignalR connection failed:", err);
    }
  }, []);

  const disconnect = useCallback(() => {
    connectionRunRef.current += 1;
    isConnectingRef.current = false;

    const hub = connectionRef.current;
    connectionRef.current = null;

    setConnection(null);
    setIsConnecting(false);
    setIsConnected(false);

    if (hub) {
      hubServiceRef.current.disconnectHub(hub);
    }
  }, []);

  const manualCleanup = useCallback(() => {
    disconnect();
  }, [disconnect]);

  useEffect(() => {
    if (username && dataMode === "live") {
      connect();
    } else {
      disconnect();
    }

    return () => {
      manualCleanup();
    };
  }, [username, dataMode, connect, disconnect, manualCleanup]);

  return {
    connection,
    isConnected,
    isConnecting,
    lastError,
    connect,
    disconnect,
    manualCleanup,
  };
}
