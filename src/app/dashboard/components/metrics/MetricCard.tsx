"use client";

import React from "react";
import { MetricCardProps } from "@/domain/types/types";
import { getStatusColor } from "@/infrastructure/adapters/healthStatusAdapter";
import { icons } from "@/domain/constants";

const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, status, theme, min, max }) => {
  const statusColor = getStatusColor(status, theme);
  const isOptimal = status === 'optimal';

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300 h-full hover:shadow-xl"
      style={{
        backgroundColor: `${theme.background.secondary}dd`,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${theme.border.medium}`,
        boxShadow: isOptimal
          ? theme.shadow.soft
          : `${theme.shadow.soft}, 0 0 25px ${theme.accent.glow}`,
        animation: 'slide-in-fade 0.6s ease-out',
      }}
    >
      <div className="p-5 sm:p-6 h-full flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2 mb-4">
          <p
            className="text-xs font-semibold uppercase tracking-widest flex items-center gap-2"
            style={{ color: theme.text.tertiary, letterSpacing: '0.1em' }}
          >
            <span style={{ fontSize: '1.1em' }}>{icons[label]}</span>
            {label}
          </p>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{
                backgroundColor: statusColor,
                boxShadow: `0 0 0 0 ${statusColor}`,
                animation: !isOptimal ? 'pulse-ring 1.5s infinite' : 'none',
              }}
            />
            <span
              className="text-xs font-bold uppercase whitespace-nowrap"
              style={{ color: statusColor }}
            >
              {isOptimal ? 'OPTIMAL' : 'WARNING'}
            </span>
          </div>
        </div>

        <div className="flex items-baseline gap-1.5">
          <span
            className="text-5xl sm:text-6xl font-extrabold leading-none"
            style={{ color: theme.accent.primary, transition: 'color 0.3s' }}
          >
            {value.toFixed(1)}
          </span>
          <span
            className="text-lg font-semibold"
            style={{ color: theme.text.secondary }}
          >
            {unit}
          </span>
        </div>

        <div className="mt-2">
          <p className="text-xs" style={{ color: theme.text.tertiary }}>
            Range: {min.toFixed(1)} - {max.toFixed(1)} {unit}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
