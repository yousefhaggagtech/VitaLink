import { BeltPlayer } from '@/domain/entities/BeltPlayer';

export type ProfileAIVisualState =
  | 'no-data'
  | 'loading'
  | 'live'
  | 'updating'
  | 'warmup'
  | 'stale'
  | 'error'
  | 'mismatch';

export interface ProfileAIContext {
  visualState: ProfileAIVisualState;
  selectedBeltId: string;
  snapshotBeltId: string | null;
  timestamp: string | null;
  analysisTimeLabel: string;
  ageSinceLastUpdate: number | null;
  freshnessLabel: string;
  isStale: boolean;
  isInWarmup: boolean;
  alertLevel: string | null;
  playerState: string | null;
  substitutionWindow: string | null;
  isUrgent: boolean;
  recoveryTimeMin: number | null;
  timeToFailMin: number | null;
}

export interface ProfileComparisonMetric {
  value: number | null;
  delta: number | null;
}

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

  // AI presentation metrics are overlaid by the latest AI endpoint.
  fatigue:          number | null;
  stressLoad:       number | null;
  wellnessScore:    number | null;
  performanceScore: number | null;

  // Compact comparison rings are overlaid by latest AI metrics.
  comparison: {
    fatigue: ProfileComparisonMetric;
    load:    ProfileComparisonMetric;
    stress:  ProfileComparisonMetric;
  };

  // AI insight fallback until the latest AI endpoint responds.
  aiInsight: {
    summary:   string;
    highlight: string;
    subDetail: string;
    keyPoints: string[];
    readiness: 'High' | 'Medium' | 'Low';
    context: ProfileAIContext;
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

    // ── Metrics fallback; latest AI endpoint overlays these values ───────────
    fatigue:          null,
    stressLoad:       null,
    wellnessScore:    null,
    performanceScore: null,

    // ── Comparison — placeholder ─────────────────────────────────────────────
    comparison: {
      fatigue: { value: null, delta: null },
      load:    { value: null, delta: null },
      stress:  { value: null, delta: null },
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
      context: {
        visualState: 'no-data',
        selectedBeltId: detail.beltID,
        snapshotBeltId: null,
        timestamp: null,
        analysisTimeLabel: 'No AI analysis yet',
        ageSinceLastUpdate: null,
        freshnessLabel: 'No data yet',
        isStale: false,
        isInWarmup: false,
        alertLevel: null,
        playerState: null,
        substitutionWindow: null,
        isUrgent: false,
        recoveryTimeMin: null,
        timeToFailMin: null,
      },
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
