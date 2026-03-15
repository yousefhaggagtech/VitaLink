"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { SensorData, AnalysisData } from "@/domain/entities/SensorData";
import { sendToOpenRouter } from "@/infrastructure/services/openRouterService";

export interface UseAnalysisBufferReturn {
  analysisArrayRef: React.MutableRefObject<AnalysisData[]>;
  analysisArrayLength: number;
  counter: number;
  geminiResponse: string;
  isAnalyzing: boolean;
  isCountdownActive: boolean;
  addAnalysisData: (data: SensorData) => void;
  resetAnalysis: () => void;
  startCountdown: () => void;
  stopCountdown: () => void;
}

/**
 * Manages analysis data buffering and countdown cycle
 * - Collects sensor data into buffer with timestamps
 * - Manages 10-second countdown cycle independently
 * - Triggers OpenRouter API calls when counter reaches 0
 * - Does NOT interact with SignalR directly
 * - Encapsulates entire analysis state machine
 */
export function useAnalysisBuffer(): UseAnalysisBufferReturn {
  // Analysis buffer and state
  const analysisArrayRef = useRef<AnalysisData[]>([]);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isAnalyzingRef = useRef(false);

  // UI state
  const [analysisArrayLength, setAnalysisArrayLength] = useState(0);
  const [counter, setCounter] = useState(10);
  const [geminiResponse, setGeminiResponse] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCountdownActive, setIsCountdownActive] = useState(false);

  /**
   * Add sensor data to analysis buffer with ISO timestamp
   * Includes safety guard: max 100 items to prevent unbounded growth
   */
  const addAnalysisData = useCallback((data: SensorData) => {
    const newAnalysisData: AnalysisData = {
      ...data,
      time: new Date().toISOString(),
    };

    analysisArrayRef.current = [...analysisArrayRef.current, newAnalysisData];

    // Safety guard: prevent unbounded buffer growth
    if (analysisArrayRef.current.length > 100) {
      analysisArrayRef.current = analysisArrayRef.current.slice(-100);
      console.warn(
        "⚠️ Analysis buffer exceeded max size; trimmed to last 100 items"
      );
    }

    setAnalysisArrayLength(analysisArrayRef.current.length);
  }, []);

  /**
   * Callback invoked after OpenRouter API response is complete
   * Resets analysis state and restarts countdown cycle
   */
  const handleResponseComplete = useCallback(() => {
    console.log("✅ Analysis response received. Resetting buffer...");
    setIsAnalyzing(false);
    isAnalyzingRef.current = false;
    analysisArrayRef.current = [];
    setAnalysisArrayLength(0);
    setCounter(10);
  }, []);

  /**
   * Start the 10-second countdown and analysis cycle
   * Noop if already active (prevent duplicate intervals)
   */
  const startCountdown = useCallback(() => {
    if (isCountdownActive) {
      console.log("⚠️ Countdown already active");
      return;
    }

    // Clean up any existing interval
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    console.log("🔄 Starting countdown cycle...");
    setIsCountdownActive(true);

    countdownIntervalRef.current = setInterval(() => {
      setCounter((prevCounter) => {
        const newCounter = prevCounter - 1;

        // Trigger analysis when counter reaches 0 and buffer has data
        if (
          newCounter === 0 &&
          !isAnalyzingRef.current &&
          analysisArrayRef.current.length > 0
        ) {
          console.log(
            "📊 Sending data to OpenRouter:",
            analysisArrayRef.current.length,
            "points"
          );

          isAnalyzingRef.current = true;
          setIsAnalyzing(true);

          // Call OpenRouter API (internal state machine - parent doesn't orchestrate this)
          sendToOpenRouter(
            analysisArrayRef.current,
            setGeminiResponse,
            handleResponseComplete
          );

          return 10; // Reset counter
        }

        return newCounter;
      });
    }, 1000);
  }, [isCountdownActive, handleResponseComplete]);

  /**
   * Stop the countdown cycle and cleanup interval
   */
  const stopCountdown = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
      setIsCountdownActive(false);
      console.log("⏹️ Countdown stopped");
    }
  }, []);

  /**
   * Reset entire analysis state (used when mode changes or on cleanup)
   */
  const resetAnalysis = useCallback(() => {
    stopCountdown();
    analysisArrayRef.current = [];
    setAnalysisArrayLength(0);
    setCounter(10);
    setGeminiResponse("");
    setIsAnalyzing(false);
    isAnalyzingRef.current = false;
    console.log("🔄 Analysis buffer reset");
  }, [stopCountdown]);

  /**
   * Cleanup interval on unmount
   */
  useEffect(() => {
    return () => {
      stopCountdown();
    };
  }, [stopCountdown]);

  return {
    analysisArrayRef,
    analysisArrayLength,
    counter,
    geminiResponse,
    isAnalyzing,
    isCountdownActive,
    addAnalysisData,
    resetAnalysis,
    startCountdown,
    stopCountdown,
  };
}
