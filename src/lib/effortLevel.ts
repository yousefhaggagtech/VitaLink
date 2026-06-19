import { UI_THRESHOLDS } from '@/domain/constants';

export type EffortLevel = 'Low' | 'Medium' | 'High';

export function getEffortLevel(value: number): EffortLevel {
  if (value > UI_THRESHOLDS.STRESS_HIGH) return 'High';
  if (value > UI_THRESHOLDS.STRESS_MEDIUM) return 'Medium';
  return 'Low';
}
