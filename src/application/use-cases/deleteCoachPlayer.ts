import { coachService } from '@/infrastructure/services/CoachService';

export async function deleteCoachPlayer(beltId: string): Promise<void> {
  const normalizedBeltId = beltId.trim();

  if (!normalizedBeltId) {
    throw new Error('A BeltID is required to remove an athlete.');
  }

  await coachService.deletePlayer(normalizedBeltId);
}
