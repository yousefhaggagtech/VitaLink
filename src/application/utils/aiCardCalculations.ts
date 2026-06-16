import {
  AIRecommendation,
  AlertLevel,
  PlayerState,
} from '@/domain/types/ai.types';
import { UI_THRESHOLDS } from '@/domain/constants';
import { normalizePlayerState } from '@/application/utils/playerState';

// ═══════════════════════════════════════════════════════
// Wellness Score
// المصادر: recoveryTimeMin, playerState, alertLevel
// ═══════════════════════════════════════════════════════
export function calculateWellnessScore(ai: AIRecommendation): number {
  let score = 100;
  const playerState = normalizePlayerState(ai.status.playerState);

  // Recovery time penalty
  if (ai.metrics.recoveryTimeMin !== null) {
    score -= ai.metrics.recoveryTimeMin * 1.5;
  }

  // Player state penalties
  if (playerState === PlayerState.DEPLETED) score -= 40;
  if (playerState === PlayerState.INACTIVE) score -= 20;

  // Alert level penalties
  if (ai.status.alertLevel === AlertLevel.WARNING) score -= 25;
  if (ai.status.alertLevel === AlertLevel.CRITICAL) score -= 50;
  if (ai.status.alertLevel === AlertLevel.LOW_CONFIDENCE) score -= 10;

  return Math.max(0, Math.min(100, Math.round(score)));
}

// ═══════════════════════════════════════════════════════
// Performance Score
// المصادر: power, momentum
// يعرض 0 خلال الـ Warmup
// ═══════════════════════════════════════════════════════
export function calculatePerformanceScore(ai: AIRecommendation): number {
  if (ai.isInWarmup) return 0;
  if (ai.metrics.power === null && ai.metrics.momentum === null) return 0;

  let score = 50;

  if (ai.metrics.power !== null) {
    score += (ai.metrics.power / 200) * 30; // assume max 200W → +30
  }

  if (ai.metrics.momentum !== null) {
    score += (ai.metrics.momentum / 100) * 20; // -100 to +100 → -20 to +20
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

// ═══════════════════════════════════════════════════════
// Fatigue (0-100)
// المصادر: crampRisk, timeToFailMin
// يعرض 0% خلال الـ Warmup
// ═══════════════════════════════════════════════════════
export function calculateFatigue(ai: AIRecommendation): number {
  if (ai.isInWarmup) return 0;

  let fatigue = 0;

  if (ai.metrics.crampRisk !== null) {
    fatigue += ai.metrics.crampRisk * 0.7;
  }

  if (ai.metrics.timeToFailMin !== null && ai.metrics.timeToFailMin < 30) {
    fatigue += (30 - ai.metrics.timeToFailMin) * 1.5;
  }

  return Math.max(0, Math.min(100, Math.round(fatigue)));
}

// ═══════════════════════════════════════════════════════
// Stress (0-100)
// المصادر: alertLevel, playerState, crampRisk
// ═══════════════════════════════════════════════════════
export function calculateStress(ai: AIRecommendation): number {
  if (ai.isInWarmup) return 0;

  let stress = 0;
  const playerState = normalizePlayerState(ai.status.playerState);

  if (ai.status.alertLevel === AlertLevel.WARNING) stress += 30;
  if (ai.status.alertLevel === AlertLevel.CRITICAL) stress += 60;
  if (playerState === PlayerState.DEPLETED) stress += 40;
  if (ai.metrics.crampRisk !== null) {
    stress += ai.metrics.crampRisk * 0.3;
  }

  return Math.max(0, Math.min(100, Math.round(stress)));
}

// ═══════════════════════════════════════════════════════
// Load (0-100) - للـ VS Previous Match
// المصادر: power, momentum
// ═══════════════════════════════════════════════════════
export function calculateLoad(ai: AIRecommendation): number {
  if (ai.isInWarmup) return 0;

  let load = 0;

  if (ai.metrics.power !== null) {
    load += (ai.metrics.power / 250) * 50; // assume max 250W → +50
  }

  if (ai.metrics.momentum !== null && ai.metrics.momentum > 0) {
    load += (ai.metrics.momentum / 100) * 50;
  }

  return Math.max(0, Math.min(100, Math.round(load)));
}

// ═══════════════════════════════════════════════════════
// Wellness Level (HIGH, MEDIUM, LOW, CRITICAL)
// ═══════════════════════════════════════════════════════
export function getWellnessLevel(score: number): 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL' {
  if (score >= 80) return 'HIGH';
  if (score >= 60) return 'MEDIUM';
  if (score >= 30) return 'LOW';
  return 'CRITICAL';
}

// ═══════════════════════════════════════════════════════
// Performance Level (EXCELLENT, GOOD, MODERATE, LOW)
// ═══════════════════════════════════════════════════════
export function getPerformanceLevel(score: number): 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'LOW' {
  if (score >= UI_THRESHOLDS.EXCELLENT) return 'EXCELLENT';
  if (score >= UI_THRESHOLDS.GOOD) return 'GOOD';
  if (score >= UI_THRESHOLDS.MODERATE) return 'MODERATE';
  return 'LOW';
}

// ═══════════════════════════════════════════════════════
// Readiness (للـ Gemini Insights)
// ═══════════════════════════════════════════════════════
export function getReadiness(wellnessScore: number): 'High' | 'Medium' | 'Low' {
  if (wellnessScore >= 70) return 'High';
  if (wellnessScore >= 40) return 'Medium';
  return 'Low';
}

// ═══════════════════════════════════════════════════════
// Delta Calculations (للـ VS Previous Match)
// ═══════════════════════════════════════════════════════
export function calculateDelta(
  current: number,
  previous: number
): number {
  return Math.round(current - previous);
}
