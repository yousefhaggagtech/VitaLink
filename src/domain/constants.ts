import { Theme } from '@/domain/types/types';

// Theme Definitions
export const THEMES: Record<string, Theme> = {
  limeDark: {
    name: 'Lime Dark',
    background: { primary: '#0A0A0A', secondary: '#121212', tertiary: '#1A1A1A', hover: '#252525' },
    text: { primary: '#FFFFFF', secondary: '#D0D0D0', tertiary: '#909090', disabled: '#505050' },
    accent: { primary: '#CCFF00', light: 'rgba(204, 255, 0, 0.08)', medium: 'rgba(204, 255, 0, 0.15)', dark: 'rgba(204, 255, 0, 0.05)', glow: 'rgba(204, 255, 0, 0.25)' },
    border: { light: 'rgba(204, 255, 0, 0.06)', medium: 'rgba(204, 255, 0, 0.12)', strong: 'rgba(204, 255, 0, 0.25)' },
    status: { success: '#10B981', warning: '#F59E0B', danger: '#EF4444', info: '#CCFF00' },
    shadow: { soft: '0 10px 20px rgba(0, 0, 0, 0.6), 0 5px 10px rgba(0, 0, 0, 0.3)', strong: '0 15px 40px rgba(204, 255, 0, 0.15), 0 5px 15px rgba(204, 255, 0, 0.05)' },
  },
  blueLight: {
    name: 'Blue Light',
    background: { primary: '#F8FAFC', secondary: '#FFFFFF', tertiary: '#F1F5F9', hover: '#E2E8F0' },
    text: { primary: '#1E293B', secondary: '#475569', tertiary: '#94A3B8', disabled: '#CBD5E1' },
    accent: { primary: '#3B82F6', light: 'rgba(59, 130, 246, 0.08)', medium: 'rgba(59, 130, 246, 0.15)', dark: 'rgba(59, 130, 246, 0.05)', glow: 'rgba(59, 130, 246, 0.25)' },
    border: { light: 'rgba(59, 130, 246, 0.08)', medium: 'rgba(59, 130, 246, 0.15)', strong: 'rgba(59, 130, 246, 0.25)' },
    status: { success: '#059669', warning: '#F59E0B', danger: '#DC2626', info: '#3B82F6' },
    shadow: { soft: '0 4px 12px rgba(0, 0, 0, 0.1)', strong: '0 8px 30px rgba(59, 130, 246, 0.08)' },
  }
};

// Icon Mapping
export const icons = {
  'Heart Rate': '❤️',
  'Blood Oxygen': '🫧',
  'Body Temperature': '🌡️',
  'Effort level': '💧',
} as const;

// OpenRouter Configuration
export const OPENROUTER_API_KEY = "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";
export const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Health Thresholds
export const HEALTH_THRESHOLDS = {
  HR_MIN: 60,
  HR_MAX: 100,
  SPO2_MIN: 95,
  SPO2_MAX: 100,
  TEMP_MIN: 36.5,
  TEMP_MAX: 37.5,
  GSR_MAX: 1300,
} as const;

// Analysis Cycle Configuration
export const ANALYSIS_CYCLE = {
  COUNTDOWN_SECONDS: 10,
  DATA_POINTS_TARGET: 10,
  COUNTDOWN_INTERVAL_MS: 1000,
  SIMULATION_INTERVAL_MS: 1000,
} as const;
