import {
  PlayerProfileData,
  ProfileAIContext,
  ProfileAIVisualState,
} from '@/application/mappers/toPlayerProfile';
import {
  AIRecommendation,
  AIResponse,
  AlertLevel,
  PlayerState,
  isRecommendation,
  isWaitingState,
} from '@/domain/types/ai.types';
import { ClientStatus } from '@/application/utils/statusLayer';

interface AIProfileOverlayInput {
  recommendation: AIRecommendation | null;
  rawResponse?: AIResponse | null;
  waitingState?: { message: string; hint: string } | null;
  clientStatus?: ClientStatus;
  isLoading?: boolean;
  isError?: boolean;
  error?: string | null;
}

export function applyAIAnalysisToProfile(
  profile: PlayerProfileData,
  aiState: AIProfileOverlayInput
): PlayerProfileData {
  const raw = aiState.rawResponse ?? null;
  const current = raw && isRecommendation(raw) ? raw : null;
  const waiting = raw && isWaitingState(raw) ? raw : null;

  if (waiting || aiState.waitingState) {
    const wait = waiting ?? aiState.waitingState!;
    return withAIOverlay(profile, {
      status: 'moderate',
      visualState: aiState.isLoading ? 'loading' : 'no-data',
      summary: wait.message,
      highlight: 'analysis',
      subDetail: wait.hint,
      keyPoints: [
        wait.hint,
        `Selected belt: ${profile.beltId}`,
        'No latest AI metrics have been produced yet.',
      ],
      readiness: 'Medium',
      context: buildFallbackContext(profile, aiState.isLoading ? 'loading' : 'no-data'),
    });
  }

  if (aiState.isError) {
    return withAIOverlay(profile, {
      status: 'moderate',
      visualState: 'error',
      summary: 'AI analysis is temporarily unavailable.',
      highlight: 'unavailable',
      subDetail: aiState.error ?? 'Retrying the latest analysis feed.',
      keyPoints: [
        `Selected belt: ${profile.beltId}`,
        'Latest AI metrics are not available yet.',
        'Live vitals remain connected separately.',
      ],
      readiness: 'Medium',
      context: buildFallbackContext(profile, 'error'),
    });
  }

  const ai = current ?? aiState.recommendation;

  if (!ai) {
    const visualState: ProfileAIVisualState = aiState.isLoading ? 'loading' : 'no-data';

    return withAIOverlay(profile, {
      status: aiState.isLoading ? 'moderate' : profile.status,
      visualState,
      summary: aiState.isLoading
        ? 'Loading latest AI analysis.'
        : profile.aiInsight.summary,
      highlight: aiState.isLoading ? 'AI analysis' : profile.aiInsight.highlight,
      subDetail: aiState.isLoading
        ? 'Polling the latest belt intelligence feed.'
        : profile.aiInsight.subDetail,
      keyPoints: profile.aiInsight.keyPoints,
      readiness: profile.aiInsight.readiness,
      context: buildFallbackContext(profile, visualState),
    });
  }

  const beltMatches = sameBelt(ai.beltId, profile.beltId);
  const effectiveAlert = getEffectiveAlert(ai, aiState.clientStatus);
  const visualState = getVisualState({
    beltMatches,
    effectiveAlert,
    clientStatus: aiState.clientStatus,
  });
  const context = buildAIContext(profile, ai, visualState, effectiveAlert);
  const metricsAreDisplayable = beltMatches && visualState !== 'stale';

  const crampRisk = metricsAreDisplayable ? toPercent(ai.metrics.crampRisk) : null;
  const power = metricsAreDisplayable ? toPercent(ai.metrics.power) : null;
  const momentum = metricsAreDisplayable ? toPercent(ai.metrics.momentum) : null;
  const wellnessScore = metricsAreDisplayable
    ? getRecoveryReadinessScore(ai, effectiveAlert)
    : null;
  const urgent = Boolean(
    ai.recommendation.isUrgent ||
      isCriticalAlert(effectiveAlert) ||
      isDepletedState(ai.status.playerState)
  );

  return {
    ...profile,
    status: getProfileStatus(visualState, effectiveAlert, urgent),
    fatigue: crampRisk,
    stressLoad: momentum,
    wellnessScore,
    performanceScore: power,
    comparison: {
      fatigue: { value: crampRisk, delta: null },
      load: { value: power, delta: null },
      stress: { value: momentum, delta: null },
    },
    aiInsight: {
      summary: getSummary(profile, ai, visualState),
      highlight: getHighlight(ai, visualState, effectiveAlert),
      subDetail: getSubDetail(ai, visualState),
      keyPoints: getKeyPoints(profile, ai, visualState, effectiveAlert),
      readiness: getDisplayReadiness(wellnessScore, visualState, urgent),
      context,
    },
  };
}

function withAIOverlay(
  profile: PlayerProfileData,
  overlay: {
    status: PlayerProfileData['status'];
    visualState: ProfileAIVisualState;
    summary: string;
    highlight: string;
    subDetail: string;
    keyPoints: string[];
    readiness: 'High' | 'Medium' | 'Low';
    context: ProfileAIContext;
  }
): PlayerProfileData {
  return {
    ...profile,
    status: overlay.status,
    fatigue: null,
    stressLoad: null,
    wellnessScore: null,
    performanceScore: null,
    comparison: emptyComparison(),
    aiInsight: {
      summary: overlay.summary,
      highlight: overlay.highlight,
      subDetail: overlay.subDetail,
      keyPoints: overlay.keyPoints,
      readiness: overlay.readiness,
      context: overlay.context,
    },
  };
}

function buildFallbackContext(
  profile: PlayerProfileData,
  visualState: ProfileAIVisualState
): ProfileAIContext {
  return {
    visualState,
    selectedBeltId: profile.beltId,
    snapshotBeltId: null,
    timestamp: null,
    analysisTimeLabel: visualState === 'loading' ? 'Loading latest AI analysis' : 'No AI analysis yet',
    ageSinceLastUpdate: null,
    freshnessLabel: visualState === 'loading' ? 'Analyzing' : 'No data yet',
    isStale: false,
    isInWarmup: false,
    alertLevel: null,
    playerState: null,
    substitutionWindow: null,
    isUrgent: false,
    recoveryTimeMin: null,
    timeToFailMin: null,
  };
}

function buildAIContext(
  profile: PlayerProfileData,
  ai: AIRecommendation,
  visualState: ProfileAIVisualState,
  effectiveAlert: string
): ProfileAIContext {
  return {
    visualState,
    selectedBeltId: profile.beltId,
    snapshotBeltId: ai.beltId,
    timestamp: ai.timestamp,
    analysisTimeLabel: formatAnalysisTime(ai),
    ageSinceLastUpdate: ai.ageSinceLastUpdate,
    freshnessLabel: formatFreshness(ai),
    isStale: visualState === 'stale',
    isInWarmup: visualState === 'warmup',
    alertLevel: effectiveAlert,
    playerState: formatPlayerState(ai.status.playerState),
    substitutionWindow: ai.status.substitutionWindow,
    isUrgent: ai.recommendation.isUrgent ||
      effectiveAlert === AlertLevel.CRITICAL ||
      isDepletedState(ai.status.playerState),
    recoveryTimeMin: ai.metrics.recoveryTimeMin,
    timeToFailMin: ai.metrics.timeToFailMin,
  };
}

function getEffectiveAlert(ai: AIRecommendation, clientStatus?: ClientStatus): string {
  if (ai.isStale || clientStatus === 'STALE') return AlertLevel.STALE;
  if (ai.isInWarmup || clientStatus === 'WARMUP') return AlertLevel.WARMUP;
  return normalizeAlertLevel(ai.status.alertLevel);
}

function getVisualState(params: {
  beltMatches: boolean;
  effectiveAlert: string;
  clientStatus?: ClientStatus;
}): ProfileAIVisualState {
  if (!params.beltMatches) return 'mismatch';
  if (params.effectiveAlert === AlertLevel.STALE) return 'stale';
  if (params.effectiveAlert === AlertLevel.WARMUP) return 'warmup';
  if (params.clientStatus === 'UPDATING') return 'updating';
  return 'live';
}

function getRecoveryReadinessScore(
  ai: AIRecommendation,
  alertLevel: string
): number | null {
  if (ai.metrics.recoveryTimeMin === null) return null;

  const recoveryPenalty = Math.min(85, Math.max(0, ai.metrics.recoveryTimeMin) * 2);
  let score = 100 - recoveryPenalty;

  if (alertLevel === AlertLevel.LOW_CONFIDENCE) score -= 5;
  if (alertLevel === AlertLevel.WARNING) score -= 12;
  if (alertLevel === AlertLevel.CRITICAL) score -= 28;
  if (isDepletedState(ai.status.playerState)) score -= 20;
  if (isInactiveState(ai.status.playerState)) score -= 10;

  return clampPercent(score);
}

function getProfileStatus(
  visualState: ProfileAIVisualState,
  alertLevel: string,
  urgent: boolean
): PlayerProfileData['status'] {
  if (
    urgent ||
    visualState === 'stale' ||
    visualState === 'mismatch' ||
    alertLevel === AlertLevel.CRITICAL
  ) {
    return 'critical';
  }

  if (
    visualState === 'warmup' ||
    visualState === 'updating' ||
    alertLevel === AlertLevel.WARNING ||
    alertLevel === AlertLevel.LOW_CONFIDENCE
  ) {
    return 'moderate';
  }

  return 'fit';
}

function getSummary(
  profile: PlayerProfileData,
  ai: AIRecommendation,
  visualState: ProfileAIVisualState
): string {
  if (visualState === 'mismatch') {
    return `Belt mismatch: AI snapshot belongs to ${ai.beltId}, not ${profile.beltId}. Waiting for the matching latest analysis.`;
  }

  const advice = ai.recommendation.coachAdvice?.trim();

  if (visualState === 'stale') {
    return advice
      ? `Stale data: ${advice}`
      : 'Stale data: AI analysis is outdated. Reconnect the belt stream or wait for a fresh update.';
  }

  if (visualState === 'warmup') {
    return advice
      ? `Warming up: ${advice}`
      : 'Warming up: AI is collecting enough signal for a complete analysis.';
  }

  if (ai.recommendation.isUrgent) {
    return advice ? `Urgent: ${advice}` : 'Urgent: AI recommends immediate coach attention.';
  }

  return advice || 'Latest AI analysis is ready.';
}

function getHighlight(
  ai: AIRecommendation,
  visualState: ProfileAIVisualState,
  alertLevel: string
): string {
  if (visualState === 'mismatch') return 'Belt mismatch';
  if (visualState === 'stale') return 'Stale data';
  if (visualState === 'warmup') return 'Warming up';
  if (ai.recommendation.isUrgent) return 'Urgent';
  return formatAlertLevel(alertLevel);
}

function getSubDetail(ai: AIRecommendation, visualState: ProfileAIVisualState): string {
  if (visualState === 'mismatch') {
    return `Selected belt is different from AI snapshot belt ${ai.beltId}.`;
  }

  if (visualState === 'stale') {
    return `Stale data: last AI update ${formatAge(ai.ageSinceLastUpdate)} ago at ${formatTimestamp(ai.timestamp)}.`;
  }

  if (visualState === 'warmup') {
    return `Warmup active; latest AI update ${formatAge(ai.ageSinceLastUpdate)} ago.`;
  }

  if (ai.status.substitutionWindow) {
    return `Substitution window: ${ai.status.substitutionWindow}`;
  }

  if (ai.metrics.timeToFailMin !== null) {
    return `Time-to-fail estimate: ${formatMinutes(ai.metrics.timeToFailMin)}.`;
  }

  if (ai.metrics.recoveryTimeMin !== null) {
    return `Recovery estimate: ${formatMinutes(ai.metrics.recoveryTimeMin)}.`;
  }

  return `Latest AI analysis: ${formatAnalysisTime(ai)}.`;
}

function getKeyPoints(
  profile: PlayerProfileData,
  ai: AIRecommendation,
  visualState: ProfileAIVisualState,
  alertLevel: string
): string[] {
  if (visualState === 'mismatch') {
    return [
      `Selected belt: ${profile.beltId}`,
      `AI snapshot belt: ${ai.beltId}`,
      `Snapshot time: ${formatAnalysisTime(ai)}`,
    ];
  }

  return [
    `AI snapshot confirmed for ${ai.beltId}; analyzed ${formatAnalysisTime(ai)}.`,
    `Snapshot state: ${ai.isStale ? 'stale' : 'fresh'}; ${ai.isInWarmup ? 'warmup active' : 'analysis ready'}.`,
    `Alert: ${formatAlertLevel(alertLevel)}; player state: ${formatPlayerState(ai.status.playerState) ?? 'pending'}.`,
    `Power: ${formatRawMetric(ai.metrics.power)}; cramp risk: ${formatPercent(ai.metrics.crampRisk)}; momentum: ${formatRawMetric(ai.metrics.momentum)}.`,
    `Recovery: ${formatMinutesOrPending(ai.metrics.recoveryTimeMin)}; time-to-fail: ${formatMinutesOrPending(ai.metrics.timeToFailMin)}.`,
    `Priority: ${ai.recommendation.isUrgent ? 'Urgent' : 'Standard'}${ai.status.substitutionWindow ? `; substitution window: ${ai.status.substitutionWindow}` : ''}.`,
  ];
}

function getDisplayReadiness(
  wellnessScore: number | null,
  visualState: ProfileAIVisualState,
  urgent: boolean
): 'High' | 'Medium' | 'Low' {
  if (urgent || visualState === 'stale' || visualState === 'mismatch') return 'Low';
  if (visualState === 'warmup' || wellnessScore === null) return 'Medium';
  if (wellnessScore >= 70) return 'High';
  if (wellnessScore >= 40) return 'Medium';
  return 'Low';
}

function emptyComparison(): PlayerProfileData['comparison'] {
  return {
    fatigue: { value: null, delta: null },
    load: { value: null, delta: null },
    stress: { value: null, delta: null },
  };
}

function sameBelt(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function toPercent(value: number | null): number | null {
  return value === null || !Number.isFinite(value) ? null : clampPercent(value);
}

function isCriticalAlert(alertLevel: string): boolean {
  return alertLevel === AlertLevel.CRITICAL;
}

function isDepletedState(state: string | null): boolean {
  return normalizeState(state) === PlayerState.DEPLETED;
}

function isInactiveState(state: string | null): boolean {
  return normalizeState(state) === PlayerState.INACTIVE;
}

function normalizeState(state: string | null): string | null {
  return state ? state.trim().toUpperCase().replace(/\s+/g, '_') : null;
}

function normalizeAlertLevel(alertLevel: string): string {
  return alertLevel.trim().toUpperCase().replace(/\s+/g, '_');
}

function formatAlertLevel(alertLevel: string): string {
  return alertLevel.replace(/_/g, ' ');
}

function formatPlayerState(state: string | null): string | null {
  if (state === null) return null;
  return state.replace(/_/g, ' ');
}

function formatAnalysisTime(ai: AIRecommendation): string {
  return `${formatTimestamp(ai.timestamp)} (${formatAge(ai.ageSinceLastUpdate)} old)`;
}

function formatFreshness(ai: AIRecommendation): string {
  if (ai.isStale) return `Stale data, ${formatAge(ai.ageSinceLastUpdate)} old`;
  if (ai.isInWarmup) return `Warming up, ${formatAge(ai.ageSinceLastUpdate)} old`;
  return `${formatAge(ai.ageSinceLastUpdate)} old`;
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;

  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}

function formatAge(seconds: number): string {
  if (seconds < 60) return `${Math.max(0, Math.round(seconds))}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
  return `${Math.round(seconds / 3600)} hr`;
}

function formatMinutes(minutes: number): string {
  if (minutes < 1) return '<1 min';
  return `${Math.round(minutes)} min`;
}

function formatMinutesOrPending(value: number | null): string {
  return value === null ? 'pending' : formatMinutes(value);
}

function formatPercent(value: number | null): string {
  return value === null ? 'pending' : `${Math.round(value)}%`;
}

function formatRawMetric(value: number | null): string {
  return value === null ? 'pending' : String(Math.round(value));
}

function clampPercent(value: number): number {
  return Math.round(clamp(value, 0, 100));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
