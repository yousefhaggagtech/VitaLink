"use client";

import React from "react";
import { StatusIndicatorProps } from "@/domain/types/types";

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ label, status, details, theme }) => {
  const statusColor = status ? theme.status.success : theme.status.danger;

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300"
      style={{
        backgroundColor: `${theme.background.secondary}dd`,
        borderColor: theme.border.medium,
        boxShadow: theme.shadow.soft,
        backdropFilter: 'blur(10px)',
        animation: 'slide-in-fade 0.5s ease-out',
      }}
    >
      <div
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{
          backgroundColor: statusColor,
          animation: 'smooth-pulse 2s ease-in-out infinite',
        }}
      />
      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: theme.text.secondary, letterSpacing: '0.05em' }}
        >
          {label}
        </p>
        {details && (
          <p
            className="text-xs mt-0.5"
            style={{ color: theme.text.tertiary }}
          >
            {details}
          </p>
        )}
      </div>
      <span
        className="text-xs font-bold uppercase tracking-wider flex-shrink-0"
        style={{
          color: statusColor,
          letterSpacing: '0.05em',
        }}
      >
        {status ? 'ACTIVE' : 'OFFLINE'}
      </span>
    </div>
  );
};

export default StatusIndicator;
