import { BeltPlayer } from '@/domain/entities/BeltPlayer';

export interface ICoachRepository {
  getPlayersByCoach(coachName: string): Promise<BeltPlayer[]>;
  addPlayer(data: FormData):            Promise<void>;
  deletePlayer(beltId: string):          Promise<void>;
}
