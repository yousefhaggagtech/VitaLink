import { coachService } from '@/infrastructure/services/CoachService';

// ─── Input shape ──────────────────────────────────────────────────────────────
export interface AddPlayerInput {
  name:              string;
  beltID:            string;
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

  if (!input.beltID.trim())
    errors.push({ field: 'beltID', message: 'Belt selection is required.' });

  if (input.weight && isNaN(Number(input.weight)))
    errors.push({ field: 'weight', message: 'Weight must be a valid number.' });

  if (input.bodyFatPercentage && isNaN(Number(input.bodyFatPercentage)))
    errors.push({ field: 'bodyFatPercentage', message: 'Body fat must be a valid number.' });

  return errors;
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

  // 2. Build FormData
  const fd = new FormData();
  fd.append('name',   input.name.trim());
  fd.append('beltID', input.beltID.trim());

  if (input.birthDate)         fd.append('birthDate',         input.birthDate);
  if (input.weight)            fd.append('weight',            input.weight);
  if (input.bloodType)         fd.append('bloodType',         input.bloodType);
  if (input.bodyFatPercentage) fd.append('bodyFatPercentage', input.bodyFatPercentage);
  if (input.profileImage)      fd.append('profileImage',      input.profileImage);

  // 3. Delegate to repository
  await coachService.addPlayer(fd);

  return { success: true };
}