"use client";

import React from "react";
import { Theme, DataMode, HealthStatus } from "@/domain/types/types";
import StatusIndicator from "@/app/dashboard/components/metrics/StatusIndicator";
import DataStreamSelector from "@/app/dashboard/components/controls/DataStreamSelector";

interface HeaderProps {
  theme: Theme;
  username: string;
  currentTheme: 'limeDark' | 'blueLight';
  setCurrentTheme: (theme: 'limeDark' | 'blueLight') => void;
  dataMode: DataMode;
  setDataMode: (mode: DataMode) => void;
  isConnected: boolean;
  overallHealthStatus: HealthStatus;
  timestamp: string;
  onClearData: () => void;
}

const Header: React.FC<HeaderProps> = ({
  theme,
  username,
  currentTheme,
  setCurrentTheme,
  dataMode,
  setDataMode,
  isConnected,
  overallHealthStatus,
  timestamp,
  onClearData,
}) => {
  return (
    <header
      className="border-b px-4 sm:px-6 md:px-8 py-8 sm:py-10"
      style={{
        borderColor: theme.border.medium,
        backgroundColor: `${theme.background.secondary}dd`,
        backdropFilter: 'blur(10px)',
        boxShadow: theme.shadow.soft,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-2"
              style={{ color: theme.text.primary, letterSpacing: '0.02em', animation: 'slide-in-fade 0.6s ease-out' }}
            >
              VitaLink Dashboard
            </h1>
            <p
              className="text-sm sm:text-base"
              style={{ color: theme.text.secondary, letterSpacing: '0.02em', animation: 'slide-in-fade 0.7s ease-out' }}
            >
              Welcome, <span style={{ color: theme.accent.primary, fontWeight: 'bold' }}>{username || "Guest"}</span> — Real-Time Biometric Monitoring
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0" style={{ zIndex: 20 }}>
            <div className="flex gap-3 justify-end items-center">
              <StatusIndicator
                label="System Status"
                status={overallHealthStatus !== 'danger' && overallHealthStatus !== 'warning'}
                details={overallHealthStatus.toUpperCase()}
                theme={theme}
              />
              <StatusIndicator
                label="Connection"
                status={dataMode === 'simulated' ? true : isConnected}
                details={dataMode === 'simulated' ? 'Simulated' : (isConnected ? "Connected" : "Disconnected")}
                theme={theme}
              />

              <button
                onClick={() => setCurrentTheme(currentTheme === 'limeDark' ? 'blueLight' : 'limeDark')}
                className="px-4 py-3 rounded-xl text-xs font-bold uppercase transition-all duration-300"
                style={{
                  backgroundColor: theme.background.tertiary,
                  color: theme.text.secondary,
                  border: `1px solid ${theme.border.medium}`,
                  boxShadow: theme.shadow.soft,
                  animation: 'bounce-in 0.6s ease-out',
                }}
              >
                {currentTheme === 'limeDark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
            </div>

            <div className="flex gap-3 justify-end items-center">
              <DataStreamSelector mode={dataMode} onChange={setDataMode} theme={theme} />

              <button
                 onClick={onClearData}
                className="px-4 py-3 rounded-xl text-xs font-bold uppercase transition-all duration-300"
                style={{
                  backgroundColor: theme.background.tertiary,
                  color: theme.text.secondary,
                  border: `1px solid ${theme.border.medium}`,
                  boxShadow: theme.shadow.soft,
                  animation: 'bounce-in 0.7s ease-out',
                }}
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>

        <div className="text-right mt-4">
          <p className="text-xs font-medium" style={{ color: theme.text.tertiary }}>
            Last Update: <span style={{ color: theme.text.secondary }}>{timestamp || 'N/A'}</span>
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
