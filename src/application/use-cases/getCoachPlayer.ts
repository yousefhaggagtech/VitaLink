import { coachService } from '@/infrastructure/services/CoachService';
import { BeltPlayer }      from '@/domain/entities/BeltPlayer';

/**
 * Use case: fetch all players (belts) belonging to a specific coach.
 *
 * Responsibilities:
 * - Validate input before hitting the API
 * - Delegate the actual HTTP call to the repository
 * - Return a typed array — empty array if nothing found
 *
 * Does NOT:
 * - Know anything about React state
 * - Know anything about axios or HTTP
 * - Handle loading / error UI
 */
export async function getCoachPlayers(coachName: string): Promise<BeltPlayer[]> {
  // Guard — don't call the API with an empty name
  if (!coachName || coachName.trim() === '') {
    return [];
  }

  const players = await coachService.getPlayersByCoach(coachName.trim());

  // Ensure we always return an array even if the API returns null / undefined
  return Array.isArray(players) ? players : [];
}