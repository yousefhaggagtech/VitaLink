"use client";

import React from "react";
import { Theme } from "@/domain/types/types";
import { keyframes } from "@/app/dashboard/components/animations/keyframes";

const GlobalStyles: React.FC<{ theme: Theme }> = ({ theme }) => {
  const cssVariables = {
    '--bg-primary': theme.background.primary,
    '--bg-secondary': theme.background.secondary,
    '--bg-tertiary': theme.background.tertiary,
    '--text-primary': theme.text.primary,
    '--text-secondary': theme.text.secondary,
    '--text-tertiary': theme.text.tertiary,
    '--accent-primary': theme.accent.primary,
    '--accent-glow': theme.accent.glow,
    '--border-medium': theme.border.medium,
    '--status-success': theme.status.success,
    '--status-warning': theme.status.warning,
    '--status-danger': theme.status.danger,
    '--shadow-soft': theme.shadow.soft,
  };

  const styleString = Object.entries(cssVariables).map(([key, value]) => `${key}: ${value};`).join('');

  const globalOverrides = `
    * {
        background-color: var(--bg-fallback, inherit);
        border-color: var(--border-fallback, inherit);
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />
      <style>{`:root { ${styleString} }`}</style>
      <style>{globalOverrides}</style>
    </>
  );
};

export default GlobalStyles;
