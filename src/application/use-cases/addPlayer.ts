import { coachService } from '@/infrastructure/services/CoachService';

// ─── Input shape ──────────────────────────────────────────────────────────────
export interface AddPlayerInput {
  name:              string;
  athleteID:         string;
  beltID:            string;
  targetSport:       string;
  birthDate:         string;
  weight:            string;
  bloodType:         string;
  bodyFatPercentage: string;
  profileImage:      File | null;
}

// ─── Validation errors ────────────────────────────────────────────────────────
export interface ValidationError {
  field:   string;
  message: string;
}

function validate(input: AddPlayerInput): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!input.name.trim())
    errors.push({ field: 'name', message: 'Player name is required.' });

  if (!input.athleteID.trim())
    errors.push({ field: 'athleteID', message: 'Athlete ID is required.' });

  if (!input.beltID.trim())
    errors.push({ field: 'beltID', message: 'Belt selection is required.' });

  if (!input.targetSport.trim())
    errors.push({ field: 'targetSport', message: 'Target sport is required.' });

  if (!input.birthDate.trim() || Number.isNaN(Date.parse(input.birthDate)))
    errors.push({ field: 'birthDate', message: 'Birth date must be a valid date.' });

  const weight = Number(input.weight);
  if (!input.weight.trim() || Number.isNaN(weight) || weight <= 0)
    errors.push({ field: 'weight', message: 'Weight must be a positive number.' });

  if (!input.bloodType.trim())
    errors.push({ field: 'bloodType', message: 'Blood type is required.' });

  const bodyFatPercentage = Number(input.bodyFatPercentage);
  if (
    !input.bodyFatPercentage.trim() ||
    Number.isNaN(bodyFatPercentage) ||
    bodyFatPercentage < 0 ||
    bodyFatPercentage > 100
  )
    errors.push({ field: 'bodyFatPercentage', message: 'Body fat must be between 0 and 100.' });

  if (!input.profileImage)
    errors.push({ field: 'profileImage', message: 'Profile image is required.' });

  return errors;
}

function toApiDateTime(date: string): string {
  const trimmed = date.trim();
  return trimmed.includes('T') ? trimmed : `${trimmed}T00:00:00.000Z`;
}

// ─── Use case ─────────────────────────────────────────────────────────────────
/**
 * Use case: add a new player to a coach's squad.
 *
 * Responsibilities:
 * - Validate required fields before calling the API
 * - Build the FormData expected by the backend
 * - Delegate the HTTP call to the service layer
 *
 * Returns:
 * - { success: true }              on success
 * - { success: false, errors }     on validation failure
 * - throws                         on network / server error
 */
export async function addPlayer(
  input: AddPlayerInput,
): Promise<{ success: true } | { success: false; errors: ValidationError[] }> {

  // 1. Validate
  const errors = validate(input);
  if (errors.length > 0) {
    return { success: false, errors };
  }

  const profileImage = input.profileImage;
  if (!profileImage) {
    return {
      success: false,
      errors: [{ field: 'profileImage', message: 'Profile image is required.' }],
    };
  }

  // 2. Build FormData
  const fd = new FormData();
  fd.append('BeltID',            input.beltID.trim());
  fd.append('AthleteID',         input.athleteID.trim());
  fd.append('name',              input.name.trim());
  fd.append('ProfileImage',      profileImage, profileImage.name);
  fd.append('BirthDate',         toApiDateTime(input.birthDate));
  fd.append('Weight',            Number(input.weight).toString());
  fd.append('BloodType',         input.bloodType.trim());
  fd.append('BodyFatPercentage', Number(input.bodyFatPercentage).toString());
  fd.append('TargetSport',       input.targetSport.trim());

  // 3. Delegate to repository
  await coachService.addPlayer(fd);

  return { success: true };
}
