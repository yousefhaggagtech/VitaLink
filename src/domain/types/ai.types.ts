export const PlayerState = {
  INACTIVE: 'INACTIVE',
  PEAKING: 'PEAKING',
  NORMAL: 'NORMAL',
  DEPLETED: 'DEPLETED',
} as const;

export type PlayerState = string | number;

export const AlertLevel = {
  WARMUP: 'WARMUP',
  NORMAL: 'NORMAL',
  LOW_CONFIDENCE: 'LOW_CONFIDENCE',
  WARNING: 'WARNING',
  CRITICAL: 'CRITICAL',
  STALE: 'STALE',
} as const;

export type AlertLevel = string;

export interface AIMetrics {
  power: number | null;
  crampRisk: number | null;
  momentum: number | null;
  recoveryTimeMin: number | null;
  timeToFailMin: number | null;
}

export interface AIStatus {
  playerState: PlayerState | null;
  alertLevel: AlertLevel;
  substitutionWindow: string | null;
}

export interface AIRecommendationData {
  coachAdvice: string;
  isUrgent: boolean;
}

export interface AIRecommendation {
  beltId: string;
  timestamp: string;
  ageSinceLastUpdate: number;
  isStale: boolean;
  isInWarmup: boolean;
  metrics: AIMetrics;
  status: AIStatus;
  recommendation: AIRecommendationData;
}

export interface AIWaitingState {
  beltId: string;
  status: 'WAITING_FOR_ANALYSIS';
  message: string;
  hint: string;
}

export type AIResponse = AIRecommendation | AIWaitingState;

export function isWaitingState(data: AIResponse): data is AIWaitingState {
  return (data as AIWaitingState).status === 'WAITING_FOR_ANALYSIS';
}

export function isRecommendation(data: AIResponse): data is AIRecommendation {
  return (data as AIRecommendation).metrics !== undefined;
}
