import { BeltPlayer } from '@/domain/entities/BeltPlayer';

// ─── UI shape (matches what PlayerProfilePage expects) ────────────────────────
export interface PlayerProfileData {
  // Identity
  id:           string;
  name:         string;
  initials:     string;
  position:     string;
  jerseyNumber: number;
  imageUrl:     string | undefined;
  status:       'fit' | 'moderate' | 'critical';

  // Bio
  age:       number;
  weight:    number;
  height:    number;
  foot:      string;
  bloodType: string;
  beltId:    string;

  // Last session — static until session history API is ready
  lastSession: {
    date:     string;
    duration: number;
    opponent: string;
    id:       string;
  };

  // Live vitals — will be overwritten by SignalR when connected
  vitals: {
    heartRate:   { value: number; history: number[] };
    spO2:        { value: number; history: number[] };
    temperature: { value: number; history: number[] };
    stress:      { value: number; history: number[] };
  };

  // Performance metrics — will be overwritten by Node.js metrics service
  fatigue:          number;
  stressLoad:       number;
  wellnessScore:    number;
  performanceScore: number;

  // VS previous match — static until history API is ready
  comparison: {
    fatigue: { value: number; delta: number };
    load:    { value: number; delta: number };
    stress:  { value: number; delta: number };
  };

  // AI insight — static until Gemini API is integrated
  aiInsight: {
    summary:   string;
    highlight: string;
    subDetail: string;
    keyPoints: string[];
    readiness: 'High' | 'Medium' | 'Low';
  };

  // Session stats — static until session history API is ready
  sessionStats: {
    distance:      number;
    topSpeed:      number;
    sprints:       number;
    accelerations: number;
    calories:      number;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** "player1" → "PL" */
function toInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/** "2026-04-30T11:22:49.131" → age in years */
function toAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const now   = new Date();
  let age     = now.getFullYear() - birth.getFullYear();
  const m     = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

/** Base64 binary string → data URL for <img> */
function toImageUrl(profileImage: string | null): string | undefined {
  if (!profileImage) return undefined;
  // Backend returns raw base64 — prefix with data URI scheme
  if (profileImage.startsWith('data:')) return profileImage;
  return `data:image/jpeg;base64,${profileImage}`;
}

/** Flat array of 20 identical values — placeholder until SignalR pushes real data */
function flatHistory(value: number, length = 20): number[] {
  return Array(length).fill(value);
}

// ─── Mapper ───────────────────────────────────────────────────────────────────
export function toPlayerProfile(detail: BeltPlayer): PlayerProfileData {
  const age = toAge(detail.birthDate);

  return {
    // ── Identity ────────────────────────────────────────────────────────────
    id:           detail.athleteID,
    name:         detail.name,
    initials:     toInitials(detail.name),
    position:     detail.targetSport ?? 'Unknown',
    jerseyNumber: 0,              // not in API yet
    imageUrl:     toImageUrl(detail.profileImage),
    status:       'fit',          // computed from live vitals once SignalR connects
    beltId:       detail.beltID,

    // ── Bio ─────────────────────────────────────────────────────────────────
    age,
    weight:   detail.weight,
    height:   0,                  // not in API yet — add when backend provides it
    foot:     'N/A',              // not in API yet
    bloodType: detail.bloodType,

    // ── Last session ─────────────────────────────────────────────────────────
    // Placeholder — replace with real session data when session history API lands
    lastSession: {
      date:     'N/A',
      duration: 0,
      opponent: 'N/A',
      id:       '',
    },

    // ── Vitals — seeded with zeros, SignalR overwrites every second ──────────
    vitals: {
      heartRate:   { value: 0, history: flatHistory(0) },
      spO2:        { value: 0, history: flatHistory(0) },
      temperature: { value: 0, history: flatHistory(0) },
      stress:      { value: 0, history: flatHistory(0) },
    },

    // ── Metrics — zeros until Node.js metrics service pushes values ──────────
    fatigue:          0,
    stressLoad:       0,
    wellnessScore:    0,
    performanceScore: 0,

    // ── Comparison — placeholder ─────────────────────────────────────────────
    comparison: {
      fatigue: { value: 0, delta: 0 },
      load:    { value: 0, delta: 0 },
      stress:  { value: 0, delta: 0 },
    },

    // ── AI insight — placeholder until Gemini is wired ──────────────────────
    aiInsight: {
      summary:   `${detail.name} profile loaded. Live analysis will begin once biometric data streams in.`,
      highlight: '',
      subDetail: 'Connect the belt to start receiving live insights.',
      keyPoints: [
        'Belt assigned: ' + detail.beltID,
        'Target sport: '  + (detail.targetSport ?? 'N/A'),
        'Waiting for live biometric data.',
      ],
      readiness: 'High',
    },

    // ── Session stats — placeholder ──────────────────────────────────────────
    sessionStats: {
      distance:      0,
      topSpeed:      0,
      sprints:       0,
      accelerations: 0,
      calories:      0,
    },
  };
}
