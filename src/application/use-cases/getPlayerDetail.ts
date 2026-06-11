import { playerService } from '@/infrastructure/services/PlayerService';
import { BeltPlayer }     from '@/domain/entities/BeltPlayer';

/**
 * Use case: fetch a single player's full profile by belt ID.
 *
 * Responsibilities:
 * - Validate the beltId before calling the API
 * - Delegate the HTTP call to the repository
 * - Return a typed BeltPlayer object
 *
 * Does NOT:
 * - Know anything about React state
 * - Know anything about axios or HTTP
 * - Handle loading / error UI
 */
export async function getBeltPlayer(beltId: string): Promise<BeltPlayer> {
  if (!beltId || beltId.trim() === '') {
    throw new Error('Belt ID is required to fetch player details.');
  }

  return playerService.getPlayerByBeltId(beltId.trim());
}
