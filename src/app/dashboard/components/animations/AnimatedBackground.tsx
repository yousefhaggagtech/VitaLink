"use client";

import React from "react";
import { Theme } from "@/domain/types/types";

const AnimatedBackground: React.FC<{ theme: Theme }> = ({ theme }) => {
  const isDark = theme.name === 'Lime Dark';
  const color1 = isDark ? '#1A1A1A' : '#F1F5F9';
  const color2 = theme.background.primary;
  const color3 = isDark ? '#121212' : '#E2E8F0';

  return (
    <div
      className="fixed top-0 left-0 w-full h-full overflow-hidden"
      style={{
        zIndex: 0,
        backgroundColor: color2,
        backgroundImage: `linear-gradient(270deg, ${color1}, ${color2}, ${color3})`,
        backgroundSize: '400% 400%',
        animation: `${isDark ? 'gradient-shift-dark' : 'gradient-shift-light'} 30s ease infinite`,
        transition: 'background-color 0.5s',
      }}
    />
  );
};

export default AnimatedBackground;
