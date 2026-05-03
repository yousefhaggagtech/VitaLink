'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { font } from '@/styles/tokens/colors';
import { Player } from '@/domain/entities/player';

interface StatsRowProps { players: Player[]; }

interface StatCardProps {
  label: string;
  value: number;
  sub: string;
  icon: React.ReactNode;
  index: number;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    light: string;
  };
}

const colorSchemes = [
  {
    primary: '#64748B',
    secondary: '#334155',
    accent: '#94A3B8',
    light: 'rgba(148, 163, 184, 0.08)',
  },
  {
    primary: '#10B981',
    secondary: '#059669',
    accent: '#6EE7B7',
    light: 'rgba(16, 185, 129, 0.08)',
  },
  {
    primary: '#F97316',
    secondary: '#EA580C',
    accent: '#FDBA74',
    light: 'rgba(249, 115, 22, 0.08)',
  },
  {
    primary: '#EF4444',
    secondary: '#DC2626',
    accent: '#FCA5A5',
    light: 'rgba(239, 68, 68, 0.08)',
  },
];

const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  sub, 
  icon, 
  index,
  colorScheme,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = (e.clientX - rect.left - centerX) / 10;
    const y = (e.clientY - rect.top - centerY) / 10;
    
    setTiltX(y);
    setTiltY(x);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTiltX(0);
    setTiltY(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100,
        damping: 12,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1200px',
      }}
      className="group relative"
    >
      <motion.div
        animate={{
          rotateX: isHovered ? tiltX : 0,
          rotateY: isHovered ? tiltY : 0,
          z: isHovered ? 100 : 0,
        }}
        transition={{ duration: 0.2 }}
        style={{
          transformStyle: 'preserve-3d',
        }}
        className="relative h-full w-full"
      >
        <div
          className="absolute inset-0 rounded-2xl blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10"
          style={{
            background: `radial-gradient(circle, ${colorScheme.primary}15, transparent 70%)`,
          }}
        />

        <div
          className="relative overflow-hidden rounded-2xl border backdrop-blur-md transition-all duration-300"
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderColor: isHovered ? `${colorScheme.primary}40` : `${colorScheme.primary}20`,
            borderWidth: '1px',
            boxShadow: isHovered
              ? `
                0 0 15px ${colorScheme.primary}25,
                0 8px 24px rgba(0, 0, 0, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.05)
              `
              : `
                0 0 8px ${colorScheme.primary}15,
                0 4px 12px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.03)
              `,
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative z-10 p-5">
            <div
              className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at top right, ${colorScheme.primary}, transparent)`,
              }}
            />

            <div className="flex items-center justify-between mb-4 relative z-20">
              <motion.span
                animate={{
                  color: isHovered ? colorScheme.primary : colorScheme.accent,
                }}
                transition={{ duration: 0.3 }}
                className="text-xs font-semibold tracking-wide uppercase"
                style={{ fontFamily: font.body, letterSpacing: '0.05em' }}
              >
                {label}
              </motion.span>

              <motion.div
                animate={{
                  scale: isHovered ? 1.05 : 1,
                  boxShadow: isHovered
                    ? `0 0 12px ${colorScheme.primary}30, inset 0 0 8px ${colorScheme.primary}15`
                    : `0 0 4px ${colorScheme.primary}20`,
                }}
                transition={{ duration: 0.3 }}
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: colorScheme.light,
                  border: `1.5px solid ${colorScheme.primary}30`,
                  color: colorScheme.primary,
                }}
              >
                {icon}
              </motion.div>
            </div>

            <motion.div
              animate={{
                textShadow: isHovered
                  ? `0 0 12px ${colorScheme.primary}30`
                  : `0 0 0px transparent`,
                color: isHovered ? '#F8FAFC' : '#E2E8F0',
              }}
              transition={{ duration: 0.3 }}
              className="text-4xl font-bold mb-2 relative z-20"
              style={{ fontFamily: font.display, lineHeight: 1 }}
            >
              {value}
            </motion.div>

            <div className="text-xs text-slate-400 mb-3 relative z-20 group-hover:text-slate-300 transition-colors duration-300">
              {sub}
            </div>
          </div>

          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent, ${colorScheme.primary}40, transparent)`,
              opacity: isHovered ? 1 : 0,
            }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export const StatsRow: React.FC<StatsRowProps> = ({ players }) => {
  const fit = players.filter(p => p.status === 'fit').length;
  const moderate = players.filter(p => p.status === 'moderate').length;
  const critical = players.filter(p => p.status === 'critical').length;

  const stats = [
    {
      label: 'Active Players',
      value: players.length,
      sub: 'players tracked',
      colorScheme: colorSchemes[0],
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: 'Fit to Play',
      value: fit,
      sub: 'ready to play',
      colorScheme: colorSchemes[1],
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
    {
      label: 'Moderate Risk',
      value: moderate,
      sub: 'monitor closely',
      colorScheme: colorSchemes[2],
      icon: (
<svg
  width="18"
  height="18"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
  <circle cx="12" cy="12" r="3" />
</svg>
      ),
    },
    {
      label: 'Critical',
      value: critical,
      sub: 'needs attention',
      colorScheme: colorSchemes[3],
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
    >
      {stats.map((stat, index) => (
        <StatCard key={stat.label} {...stat} index={index} />
      ))}
    </motion.div>
  );
};