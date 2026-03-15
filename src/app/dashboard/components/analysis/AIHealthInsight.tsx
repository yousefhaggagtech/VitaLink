"use client";

import React from "react";
import { Theme } from "@/domain/types/types";
import CircularCountdown from "@/app/dashboard/components/analysis/CircularCountdown";

interface AIHealthInsightProps {
  theme: Theme;
  counter: number;
  geminiResponse: string;
  isAnalyzing: boolean;
  analysisArrayLength: number;
}

const AIHealthInsight: React.FC<AIHealthInsightProps> = ({
  theme,
  counter,
  geminiResponse,
  isAnalyzing,
  analysisArrayLength,
}) => {
  return (
    <section
      className="rounded-xl p-8 sm:p-10 border mb-12"
      style={{
        backgroundColor: `${theme.background.secondary}dd`,
        backdropFilter: 'blur(10px)',
        borderColor: theme.border.medium,
        boxShadow: theme.shadow.soft,
        animation: 'slide-in-fade 0.8s ease-out',
      }}
    >
      <h2
        className="text-2xl sm:text-3xl font-bold mb-8 tracking-tight"
        style={{
          color: theme.text.primary,
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
        }}
      >
        AI Health Insight
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="flex justify-center md:justify-start">
          <CircularCountdown counter={counter} theme={theme} />
        </div>

        <div className="md:col-span-1">
          <p
            className="text-base sm:text-lg leading-relaxed"
            style={{
              color: theme.text.secondary,
              lineHeight: '1.8',
              minHeight: '120px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {geminiResponse || "Analyzing biometric patterns... Waiting for the first 10-second data cycle to complete."}
          </p>
        </div>

        <div className="flex flex-col justify-center gap-4">
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: theme.background.tertiary,
              border: `1px solid ${theme.border.medium}`,
            }}
          >
            <p className="text-xs font-bold uppercase" style={{ color: theme.text.tertiary, marginBottom: '8px' }}>
              Analysis Status
            </p>
            <p style={{ color: theme.accent.primary, fontSize: '14px', fontWeight: 'bold' }}>
              {isAnalyzing ? 'Processing...' : 'Ready'}
            </p>
          </div>
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: theme.background.tertiary,
              border: `1px solid ${theme.border.medium}`,
            }}
          >
            <p className="text-xs font-bold uppercase" style={{ color: theme.text.tertiary, marginBottom: '8px' }}>
              Data Points Collected
            </p>
            <p style={{ color: theme.accent.primary, fontSize: '14px', fontWeight: 'bold' }}>
              {analysisArrayLength} / 10
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIHealthInsight;
