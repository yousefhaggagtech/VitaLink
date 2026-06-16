import { AlertLevel, PlayerState } from '@/domain/types/ai.types';

/**
 * Urgent System State
 * يدخل في الحالة الحرجة لو:
 * - AlertLevel === CRITICAL
 * - PlayerState === DEPLETED
 */
export function isUrgentState(
  alertLevel: AlertLevel,
  playerState: PlayerState | null
): boolean {
  if (alertLevel === AlertLevel.CRITICAL) return true;
  if (playerState?.trim().toUpperCase().replace(/\s+/g, '_') === PlayerState.DEPLETED) return true;
  return false;
}
