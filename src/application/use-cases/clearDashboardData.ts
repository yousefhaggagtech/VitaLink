import { MutableRefObject } from "react";
import { HistoricalData } from "@/domain/entities/SensorData";
import { DashboardControlRef } from "@/domain/interfaces/DashboardControlRef";
 
export interface ClearDashboardDataParams {
  /** Mutable ref that gates handleDataUpdate — set to true to pause ingestion */
  controlRef: MutableRefObject<DashboardControlRef>;
 
  /** State setters — called after the ref is flipped so no tick slips through */
  setSensorData: (data: null) => void;
  setHistoricalData: (data: HistoricalData[]) => void;
  setTimestamp: (time: string) => void;
 
 
  disconnectLiveStream?: () => void;
}
 
/**
 * clearDashboardData
 *
 * Execution order is deliberate:
 *   1. Pause the ref FIRST — any in-flight interval tick that fires between
 *      step 1 and step 2 will be silently dropped by handleDataUpdate.
 *   2. Reset React state — UI clears to blank.
 *   3. Disconnect live stream if one is active.
 */
export function clearDashboardData({
  controlRef,
  setSensorData,
  setHistoricalData,
  setTimestamp,
  disconnectLiveStream,
}: ClearDashboardDataParams): void {
  // ── 1. Pause ingestion immediately (ref mutation, no re-render needed) ──
  controlRef.current.isPaused = true;
 
  // ── 2. Wipe React state ──
  setSensorData(null);
  setHistoricalData([]);
  setTimestamp("");
 
  // ── 3. Tear down live stream if present ──
  disconnectLiveStream?.();
}