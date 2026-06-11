import axiosInstance from '@/lib/axiosInstance';
import { ICoachRepository } from '@/domain/interfaces/ICoachRepository';
import { BeltPlayer }       from '@/domain/entities/BeltPlayer';

export class CoachService implements ICoachRepository {

  // GET /api/AthleteProfiles/Getuserbelt?name=ahmed
  async getPlayersByCoach(coachName: string): Promise<BeltPlayer[]> {
    const res = await axiosInstance.get(
      '/api/AthleteProfiles/Getuserbelt',
      { params: { name: coachName } }
    );
    return res.data;
  }

  // POST /api/AthleteProfiles/userbilt
  async addPlayer(data: FormData): Promise<void> {
    await axiosInstance.post(
      '/api/AthleteProfiles/userbilt',
      data,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }
}

// Singleton instance
export const coachService = new CoachService();