import { AlertLevel } from '@/domain/types/ai.types';

/**
 * Effective Alert Level Logic
 * الترتيب: isStale > isInWarmup > dbAlertLevel
 */
export function getEffectiveAlertLevel(
  isStale: boolean,
  isInWarmup: boolean,
  dbAlertLevel: AlertLevel
): AlertLevel {
  if (isStale) return AlertLevel.STALE;
  if (isInWarmup) return AlertLevel.WARMUP;
  return dbAlertLevel;
}

/**
 * Color mapping for alert levels
 */
export const ALERT_COLORS: Record<AlertLevel, string> = {
  [AlertLevel.WARMUP]: '#60A5FA',
  [AlertLevel.NORMAL]: '#B6FF2E',
  [AlertLevel.LOW_CONFIDENCE]: '#94A3B8',
  [AlertLevel.WARNING]: '#FFB800',
  [AlertLevel.CRITICAL]: '#FF5A5F',
  [AlertLevel.STALE]: '#FF8C42',
};
