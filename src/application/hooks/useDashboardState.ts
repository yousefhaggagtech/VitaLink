"use client";
 
import { useState, useCallback, useEffect, useRef } from "react";
import { SensorData, HistoricalData } from "@/domain/entities/SensorData";
import { DashboardControlRef } from "@/domain/interfaces/DashboardControlRef";
import { DataMode } from "@/domain/types/types";
import { clearDashboardData } from "@/application/use-cases/clearDashboardData";
 
export interface UseDashboardStateReturn {
  // ── UI State ──────────────────────────────────────────────────────────────
  username: string;
  setUsername: (val: string) => void;
  currentTheme: "limeDark" | "blueLight";
  setCurrentTheme: (theme: "limeDark" | "blueLight") => void;
  dataMode: DataMode;
  setDataMode: (mode: DataMode) => void;
  timestamp: string;
  setTimestamp: (time: string) => void;
 
  // ── Data State ────────────────────────────────────────────────────────────
  sensorData: SensorData | null;
  setSensorData: (data: SensorData | null) => void;
  historicalData: HistoricalData[];
  setHistoricalData: (data: HistoricalData[]) => void;
 
  // ── Control Ref (shared with page so simulation interval can read it) ─────
  controlRef: React.MutableRefObject<DashboardControlRef>;
 
  // ── Callbacks ─────────────────────────────────────────────────────────────
  handleDataUpdate: (data: SensorData) => void;
  /**
   * Call this from the page, passing the live-stream disconnect function so
   * the use-case remains infrastructure-agnostic.
   */
  handleClearData: (disconnectLiveStream?: () => void) => void;
}
 
export function useDashboardState(): UseDashboardStateReturn {
  // ── UI State ───────────────────────────────────────────────────────────────
  const [username, setUsername] = useState<string>("");
  const [currentTheme, setCurrentTheme] =
    useState<"limeDark" | "blueLight">("limeDark");
  const [dataMode, setDataMode] = useState<DataMode>("live");
  const [timestamp, setTimestamp] = useState<string>("");
 
  // ── Data State ─────────────────────────────────────────────────────────────
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
 
  // ── Control Ref ────────────────────────────────────────────────────────────
  // A ref (not state) so every closure — simulation interval, SignalR callback —
  // always reads the live value without needing to be re-created.
  const controlRef = useRef<DashboardControlRef>({ isPaused: false });
 
  // ── handleDataUpdate ───────────────────────────────────────────────────────
  // Reads controlRef.current.isPaused directly; never goes stale.
  // useCallback dependency array is intentionally empty: the function body
  // only touches the ref (stable object) and React state setters (stable).
  const handleDataUpdate = useCallback((data: SensorData) => {
    if (controlRef.current.isPaused) return;
 
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
 
    setSensorData(data);
    setTimestamp(timeString);
    setHistoricalData((prev) => [
      ...prev.slice(-59),
      { ...data, time: timeString },
    ]);
  }, []); // stable — ref + state setters never change
 
  // ── handleClearData ────────────────────────────────────────────────────────
  // Delegates all logic to the use-case; receives disconnect as an argument
  // so this hook stays decoupled from the SignalR infrastructure hook.
  const handleClearData = useCallback(
    (disconnectLiveStream?: () => void) => {
      clearDashboardData({
        controlRef,
        setSensorData,
        setHistoricalData,
        setTimestamp,
        disconnectLiveStream,
      });
    },
    [] // stable — only touches the ref and state setters
  );
 
  // ── Mode-switch effect ─────────────────────────────────────────────────────
  // When the user switches dataMode:
  //   • Un-pause so new data flows through immediately.
  //   • Reset all data state to initial values.
  // mode is the explicit signal to resume ingestion.
  useEffect(() => {
    controlRef.current.isPaused = false;
    setSensorData(null);
    setHistoricalData([]);
    setTimestamp("");
  }, [dataMode]);
 
  return {
    // UI State
    username,
    setUsername,
    currentTheme,
    setCurrentTheme,
    dataMode,
    setDataMode,
    timestamp,
    setTimestamp,
 
    // Data State
    sensorData,
    setSensorData,
    historicalData,
    setHistoricalData,
 
    // Control Ref
    controlRef,
 
    // Callbacks
    handleDataUpdate,
    handleClearData,
  };
}