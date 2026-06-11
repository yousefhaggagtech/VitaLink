'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── الاستيرادات الجديدة ───
import { Player }               from '@/domain/entities/player';
import { toPlayer }             from '@/application/mappers/toPlayer';
import { getCoachPlayers }      from '@/application/use-cases/getCoachPlayer';
import { extractUserFromToken } from '@/application/use-cases/extractUserFromToken';

// ─── Return type ──────────────────────────────────────────────────────────────
interface UseCoachPlayersReturn {
  players:   Player[];           // ← أصبحت Player بدلاً من BeltPlayer
  loading:   boolean;
  error:     string | null;
  isEmpty:   boolean;            // true when loaded but no players yet
  refetch:   () => void;         // call after add / delete player
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useCoachPlayers(): UseCoachPlayersReturn {
  const [players, setPlayers] = useState<Player[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error,   setError  ] = useState<string | null>(null);

  // Read coach name once from the JWT — stays stable across renders
  const coachName = extractUserFromToken();

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. استلام البيانات الخام من السيرفر (BeltPlayer[])
      const data = await getCoachPlayers(coachName ?? '');
      
      // 2. ─── استخدام المابّر ───
      // تحويل كل لاعب من شكل الباك إند لشكل الـ UI
      const mappedPlayers = data.map(beltPlayer => toPlayer(beltPlayer));
      
      // 3. تخزين البيانات بعد التحويل في الـ State
      setPlayers(mappedPlayers);

    } catch (err) {
      console.error('[useCoachPlayers]', err);
      setError('Failed to load players. Please try again.');
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }, [coachName]);

  // Fetch on mount and whenever the coach name changes
  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  return {
    players,
    loading,
    error,
    isEmpty: !loading && !error && players.length === 0,
    refetch: fetchPlayers,
  };
}