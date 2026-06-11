'use client';

import { useState, useEffect, useCallback } from 'react';
import { BeltPlayer }      from '@/domain/entities/BeltPlayer';
import { getBeltPlayer }   from '@/application/use-cases/getPlayerDetail';

// ─── Return type ──────────────────────────────────────────────────────────────
interface UsePlayerDetailReturn {
  player:  BeltPlayer | null;
  loading: boolean;
  error:   string | null;
  refetch: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function usePlayerDetail(beltId: string): UsePlayerDetailReturn {
  const [player,  setPlayer ] = useState<BeltPlayer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError  ] = useState<string | null>(null);

  const fetchPlayer = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getBeltPlayer(beltId);
      setPlayer(data);
    } catch (err) {
      console.error('[usePlayerDetail]', err);
      setError('Failed to load player data. Please try again.');
      setPlayer(null);
    } finally {
      setLoading(false);
    }
  }, [beltId]);

  useEffect(() => {
    fetchPlayer();
  }, [fetchPlayer]);

  return { player, loading, error, refetch: fetchPlayer };
}
