import axiosInstance              from '@/lib/axiosInstance';
import { IPlayerRepository }     from '@/domain/interfaces/IplayerRepository';
import { BeltPlayer }          from '@/domain/entities/BeltPlayer';

// ─── Repository ───────────────────────────────────────────────────────────────
class PlayerRepository implements IPlayerRepository {

  /**
   * GET /api/AthleteProfiles/GetPlayerData?id={beltId}
   *
   * @param beltId  e.g. "BELT_A001"
   * @returns       Full player profile from the backend
   */
  async getPlayerByBeltId(beltId: string): Promise<BeltPlayer> {
    const res = await axiosInstance.get<BeltPlayer>(
      '/api/AthleteProfiles/GetPlayerData',
      { params: { id: beltId } },
    );
    return res.data;
  }
}

// ─── Singleton ────────────────────────────────────────────────────────────────
export const playerService = new PlayerRepository();