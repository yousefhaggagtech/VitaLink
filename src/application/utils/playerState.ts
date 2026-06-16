import { PlayerState } from '@/domain/types/ai.types';

const PLAYER_STATE_BY_CODE: Record<number, string> = {
  0: PlayerState.INACTIVE,
  1: PlayerState.PEAKING,
  2: PlayerState.NORMAL,
  3: PlayerState.DEPLETED,
};

export function normalizePlayerState(state: PlayerState | null): string | null {
  if (state === null) return null;

  if (typeof state === 'number') {
    return PLAYER_STATE_BY_CODE[state] ?? String(state);
  }

  const trimmed = state.trim();
  const numericState = Number(trimmed);
  if (trimmed && Number.isInteger(numericState) && PLAYER_STATE_BY_CODE[numericState]) {
    return PLAYER_STATE_BY_CODE[numericState];
  }

  return trimmed.toUpperCase().replace(/\s+/g, '_');
}

export function formatPlayerState(state: PlayerState | null): string | null {
  return normalizePlayerState(state)?.replace(/_/g, ' ') ?? null;
}
