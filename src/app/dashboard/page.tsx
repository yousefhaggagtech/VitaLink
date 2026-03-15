"use client";

import { useEffect, useRef } from "react";
import GlobalStyles from "@/app/dashboard/components/layout/GlobalStyles";
import AnimatedBackground from "@/app/dashboard/components/animations/AnimatedBackground";
import Header from "@/app/dashboard/components/layout/Header";
import MetricsGrid from "@/app/dashboard/components/metrics/MetricsGrid";
import AIHealthInsight from "@/app/dashboard/components/analysis/AIHealthInsight";
import ChartsGrid from "@/app/dashboard/components/charts/ChartsGrid";
import Footer from "@/app/dashboard/components/layout/Footer";

import { THEMES } from "@/domain/constants";
import { useDashboardState } from "@/application/hooks/useDashboardState";
import { useSignalRConnection } from "@/application/hooks/useSignalRConnection";
import { useAnalysisBuffer } from "@/application/hooks/useAnalysisBuffer";
import { useHealthTracking } from "@/application/hooks/useHealthTracking";
import { extractUserFromToken } from "@/application/use-cases/extractUserFromToken";
import { generateSimulatedData } from "@/infrastructure/services/dataGeneratorService";

export default function DashboardPage() {
  // ── Core hooks ────────────────────────────────────────────────────────────
  const dashboard = useDashboardState();
  const { 
    setUsername, 
    dataMode, 
    username, 
    handleDataUpdate, 
    sensorData, 
    currentTheme, 
    setCurrentTheme, 
    setDataMode, 
    timestamp, 
    historicalData,
    handleClearData: dashboardClearData 
  } = dashboard;

  const connection = useSignalRConnection({
    username: username,
    dataMode: dataMode,
    onDataReceived: handleDataUpdate,
    onConnectionEstablished: () => console.log("✅ SignalR Connected"),
    onConnectionFailed: (error) =>
      console.error("❌ SignalR Connection failed:", error),
  });
  const { disconnect, isConnected } = connection;

  const analysis = useAnalysisBuffer();
  const { 
    startCountdown, 
    stopCountdown, 
    addAnalysisData, 
    counter, 
    geminiResponse, 
    isAnalyzing, 
    analysisArrayLength 
  } = analysis;

  // ── Derived state ───────────────────────────────────────────────────────────
  const theme = THEMES[currentTheme];
  const healthTracking = useHealthTracking(sensorData);

  // Simulation interval ref
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ── Effect 1: Extract username on mount ─────────────────────────────────────
  useEffect(() => {
    const extractedUser = extractUserFromToken();
    setUsername(extractedUser);
  }, [setUsername]);

  // ── Effect 2: Mode-switch / startup effect ──────────────────────────────────
  useEffect(() => {
    const setupMode = async () => {
      // Stop any previous simulation first
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = null;
      }

      // Disconnect any previous live stream
      disconnect();

      const useSimulatedMode =
        dataMode === "simulated" ||
        (!username && dataMode !== "live");

      if (useSimulatedMode) {
        console.log("🔄 Starting simulated data mode...");
        startCountdown();

        simulationIntervalRef.current = setInterval(() => {
          const data = generateSimulatedData();
          handleDataUpdate(data);
        }, 1000);
      } else {
        console.log("🔄 Starting live data mode...");
        startCountdown();
      }
    };

    setupMode();

    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = null;
      }
      stopCountdown();
      disconnect();
    };
  }, [dataMode, username, disconnect, startCountdown, stopCountdown, handleDataUpdate]);

  // ── Effect 3: Wire sensor data → analysis buffer ─────────────────────────────
  useEffect(() => {
    if (sensorData) {
      addAnalysisData(sensorData);
    }
  }, [sensorData, addAnalysisData]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleClearData = () => {
    dashboardClearData(
      dataMode === "live" ? disconnect : undefined
    );
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="relative" style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <GlobalStyles theme={theme} />

      <AnimatedBackground theme={theme} />

      <div
        className="relative z-10"
        style={{ backgroundColor: theme.background.primary }}
      >
        <Header
          theme={theme}
          username={username}
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
          dataMode={dataMode}
          setDataMode={setDataMode}
          isConnected={isConnected}
          overallHealthStatus={healthTracking.overallHealthStatus}
          timestamp={timestamp}
          onClearData={handleClearData}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-12">
          <MetricsGrid
            theme={theme}
            sensorData={sensorData}
            statuses={{
              heartRateStatus: healthTracking.heartRateStatus,
              spo2Status: healthTracking.spo2Status,
              tempStatus: healthTracking.tempStatus,
              gsrStatus: healthTracking.gsrStatus,
              gsrValue: healthTracking.gsrValue,
            }}
          />

          <AIHealthInsight
            theme={theme}
            counter={counter}
            geminiResponse={geminiResponse}
            isAnalyzing={isAnalyzing}
            analysisArrayLength={analysisArrayLength}
          />

          <ChartsGrid
            theme={theme}
            historicalData={historicalData}
          />
        </main>

        <Footer theme={theme} />
      </div>
    </div>
  );
}