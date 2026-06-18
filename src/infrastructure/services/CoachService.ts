import axios from 'axios';
import axiosInstance from '@/lib/axiosInstance';
import { ICoachRepository } from '@/domain/interfaces/ICoachRepository';
import { BeltPlayer }       from '@/domain/entities/BeltPlayer';

export class CoachService implements ICoachRepository {

  // GET /api/AthleteProfiles/Getuserbelt?name=ahmed
  async getPlayersByCoach(coachName: string): Promise<BeltPlayer[]> {
    try {
      const res = await axiosInstance.get(
        '/api/AthleteProfiles/Getuserbelt',
        { params: { name: coachName } }
      );
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return [];
      }

      throw err;
    }
  }

  // POST /api/AthleteProfiles/userbilt
  async addPlayer(data: FormData): Promise<void> {
    await axiosInstance.post(
      '/api/AthleteProfiles/userbilt',
      data,
    );
  }

  // DELETE /api/AthleteProfiles/deletebelt?id={beltId}
  async deletePlayer(beltId: string): Promise<void> {
    await axiosInstance.delete(
      '/api/AthleteProfiles/deletebelt',
      { params: { id: beltId } },
    );
  }
}

// Singleton instance
export const coachService = new CoachService();
