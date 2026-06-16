import { BeltPlayer } from '@/domain/entities/BeltPlayer';
import { Player }     from '@/domain/entities/player';

function toImageUrl(profileImage: string | null): string | undefined {
  if (!profileImage) return undefined;
  if (profileImage.startsWith('data:')) return profileImage;
  return `data:image/jpeg;base64,${profileImage}`;
}

export function toPlayer(belt: BeltPlayer): Player {
  return {
    id:           belt.athleteID,
    name:         belt.name,
    initials:     belt.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
    position:     belt.targetSport ?? 'Unknown',
    jerseyNumber: 0,           // مفيش في الـ API — تضيفه لو الـ backend أضافه
    beltId:       belt.beltID,
    weight:       belt.weight,
    imageUrl:     toImageUrl(belt.profileImage),
    status:       'fit',       // هيتحسب من SignalR data لما توصل

    // Vitals — هتتملى من SignalR لما يشتغل
    heartRate:    0,
    spO2:         0,
    temperature:  0,
    hrHistory:    [],
    fatigue:      0,
    stress:       0,
  };
}
