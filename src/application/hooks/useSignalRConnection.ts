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

  const {
    username,
    dataMode,
    onDataReceived,
    onConnectionEstablished,
    onConnectionFailed,
    onReconnected,
  } = options;

  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);

  const hubServiceRef = useRef(new SensorHubService());

  const connect = useCallback(async () => {
    if (dataMode === "simulated") {
      setIsConnected(false);
      return;
    }

    if (!username) {
      const error = new Error("Username required for live mode");
      setLastError(error);
      setIsConnected(false);
      onConnectionFailed?.(error);
      return;
    }

    if (isConnecting || isConnected) {
      return;
    }

    try {
      setIsConnecting(true);
      setLastError(null);

      const hub = await hubServiceRef.current.connectToHub(
        username,
        onDataReceived,
        onReconnected || null
      );

      setConnection(hub);
      setIsConnected(true);
      onConnectionEstablished?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Connection failed");
      setLastError(err);
      setIsConnected(false);
      onConnectionFailed?.(err);
      console.error("SignalR connection failed:", err);
    } finally {
      setIsConnecting(false);
    }
  }, [
    dataMode,
    username,
    onDataReceived,
    onReconnected,
    onConnectionEstablished,
    onConnectionFailed,
    isConnecting,
    isConnected,
  ]);

  const disconnect = useCallback(() => {
    if (connection) {
      hubServiceRef.current.disconnectHub(connection);
      setConnection(null);
      setIsConnected(false);
    }
  }, [connection]);

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