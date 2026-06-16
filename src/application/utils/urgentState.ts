import { AlertLevel, PlayerState } from '@/domain/types/ai.types';
import { normalizePlayerState } from '@/application/utils/playerState';

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
  if (normalizePlayerState(playerState) === PlayerState.DEPLETED) return true;
  return false;
}
