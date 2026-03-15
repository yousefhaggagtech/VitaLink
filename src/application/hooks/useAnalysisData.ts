"use client";

import { useCallback, useRef } from "react";
import { AnalysisData } from '@/domain/entities/SensorData';
import { sendToOpenRouter } from '@/infrastructure/services/openRouterService';

export function useAnalysisData(
  isAnalyzing: boolean,
  setCounter: (val: number | ((prev: number) => number)) => void,
  setIsAnalyzing: (val: boolean) => void,
  setGeminiResponse: (val: string) => void,
  setAnalysisArrayLength: (val: number) => void,
  analysisArrayRef: React.MutableRefObject<AnalysisData[]>
) {
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Callback to restart the cycle AFTER OpenRouter response is received
  const handleResponseComplete = useCallback(() => {
    console.log("✅ Response received. Restarting cycle...");
    setIsAnalyzing(false);
    analysisArrayRef.current = [];
    setAnalysisArrayLength(0);
    setCounter(10);
  }, [setIsAnalyzing, setAnalysisArrayLength, setCounter, analysisArrayRef]);

  // Start the 10-second countdown and analysis cycle
  const startCountdownCycle = useCallback(() => {
    console.log("🔄 Starting countdown cycle...");

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    countdownIntervalRef.current = setInterval(() => {
      setCounter(prev => {
        const newCounter = prev - 1;

        if (newCounter === 0 && !isAnalyzing && analysisArrayRef.current.length > 0) {
          console.log("📊 Sending data to OpenRouter:", analysisArrayRef.current.length, "points");
          setIsAnalyzing(true);
          sendToOpenRouter(analysisArrayRef.current, setGeminiResponse, handleResponseComplete);
          return 10;
        }

        return newCounter;
      });
    }, 1000);
  }, [setCounter, setIsAnalyzing, setGeminiResponse, handleResponseComplete, analysisArrayRef , isAnalyzing]);

  return {
    countdownIntervalRef,
    startCountdownCycle,
    handleResponseComplete,
  };
}
