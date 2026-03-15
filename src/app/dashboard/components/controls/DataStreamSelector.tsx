"use client";

import React from "react";
import { DataStreamSelectorProps } from "@/domain/types/types";

const DataStreamSelector: React.FC<DataStreamSelectorProps> = ({ mode, onChange, theme }) => {
  return (
    <div
      className="flex gap-2 p-1 rounded-xl"
      style={{
        backgroundColor: theme.background.tertiary,
        border: `1px solid ${theme.border.medium}`,
        boxShadow: theme.shadow.soft,
        animation: 'bounce-in 0.6s ease-out',
      }}
    >
      {(['live', 'simulated'] as const).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className="px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all duration-300"
          style={{
            backgroundColor: mode === m ? theme.accent.primary : 'transparent',
            color: mode === m ? theme.background.primary : theme.text.secondary,
            border: `1px solid ${mode === m ? theme.accent.primary : 'transparent'}`,
            animation: mode === m ? 'bounce-in 0.4s ease-out' : 'none',
          }}
        >
          {m === 'live' ? '🔴 Live Stream' : '📊 Simulated'}
        </button>
      ))}
    </div>
  );
};

export default DataStreamSelector;
