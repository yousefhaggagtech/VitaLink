import { AI_CONFIG } from '@/domain/constants';

export type ClientStatus = 'STALE' | 'WARMUP' | 'UPDATING' | 'LIVE';

interface StatusParams {
  isStale: boolean;
  isInWarmup: boolean;
  isFetching: boolean;
  hasValidData: boolean;
  ageSinceLastUpdate: number;
}

/**
 * Status Layer - First-priority wins
 * STALE > WARMUP > UPDATING > LIVE
 */
export function computeClientStatus(params: StatusParams): ClientStatus {
  const {
    isStale,
    isInWarmup,
    isFetching,
    hasValidData,
    ageSinceLastUpdate,
  } = params;

  // 1. STALE (الأولوية القصوى)
  if (isStale || ageSinceLastUpdate > AI_CONFIG.STALE_THRESHOLD_SECONDS) {
    return 'STALE';
  }

  // 2. WARMUP
  if (isInWarmup) {
    return 'WARMUP';
  }

  // 3. UPDATING (background refetch happening)
  if (isFetching && hasValidData) {
    return 'UPDATING';
  }

  // 4. LIVE (default)
  return 'LIVE';
}

export const STATUS_LABELS: Record<ClientStatus, string> = {
  STALE: 'Stale',
  WARMUP: 'Warmup',
  UPDATING: 'Updating',
  LIVE: 'Live',
};

export const STATUS_COLORS: Record<ClientStatus, string> = {
  STALE: '#FF8C42',
  WARMUP: '#60A5FA',
  UPDATING: '#A855F7',
  LIVE: '#B6FF2E',
};
