import { BeltPlayer } from '@/domain/entities/BeltPlayer';

export interface IPlayerRepository {
  /**
   * Fetch a single player's full profile by belt ID.
   * Calls: GET /api/AthleteProfiles/GetPlayerData?id={beltId}
   */
  getPlayerByBeltId(beltId: string): Promise<BeltPlayer>;
}