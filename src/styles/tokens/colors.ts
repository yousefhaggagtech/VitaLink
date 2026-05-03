// ─────────────────────────────────────────────────────────────────────────────
// VitaLink Design Tokens v2
// Theme: Deep Black · Glassmorphism · Semantic · Anti-eye-strain
// Base: #0B0E14  Brand text: #FFFFFF  Accent: #CCFF00 (brand only)
// ─────────────────────────────────────────────────────────────────────────────

export const colors = {

  // ── Backgrounds (layered depth) ───────────────────────────────────────────
  bgPrimary:   '#0B0E14',           // page canvas
  bgSecondary: '#0F1218',           // sidebar / drawer
  bgCard:      'rgba(255,255,255,0.035)',  // glass card fill
  bgCardAlt:   'rgba(255,255,255,0.025)',  // nested glass
  bgInput:     'rgba(255,255,255,0.06)',   // input fields
  bgHover:     'rgba(255,255,255,0.055)',  // hover state

  // ── Brand (CCFF00 used sparingly — buttons, logo only) ────────────────────
  lime:        '#CCFF00',
  limeDim:     'rgba(204,255,0,0.10)',
  limeBorder:  'rgba(204,255,0,0.22)',
  limeHover:   '#D9FF1A',
  primary:     '#CCFF00',

  // ── Typography ────────────────────────────────────────────────────────────
  text:          '#F0F4FF',          // primary — near white, slight cool tint
  textPrimary:   '#F0F4FF',
  textSecondary: '#8B95A8',          // secondary — muted slate
  textMuted:     '#4A5266',          // tertiary — dim
  textDisabled:  '#2E3340',

  // ── Semantic status (low-sat, eye-comfortable) ────────────────────────────
  //   Fit ——— cool green, desaturated
  fit:          '#4DB87A',
  fitBg:        'rgba(77,184,122,0.08)',
  fitBorder:    'rgba(77,184,122,0.18)',
  fitGlass:     'rgba(77,184,122,0.05)',

  //   Moderate ——— warm amber, low chroma
  moderate:     '#D4924A',
  moderateBg:   'rgba(212,146,74,0.08)',
  moderateBorder:'rgba(212,146,74,0.18)',
  moderateGlass: 'rgba(212,146,74,0.05)',

  //   Critical ——— desaturated red, readable not aggressive
  critical:     '#C84B5A',
  criticalBg:   'rgba(200,75,90,0.08)',
  criticalBorder:'rgba(200,75,90,0.20)',
  criticalGlass: 'rgba(200,75,90,0.05)',
  criticalGlow:  'rgba(200,75,90,0.12)',

  // ── Borders (glassmorphism thin lines) ────────────────────────────────────
  border:       'rgba(255,255,255,0.07)',   // default glass border
  borderMed:    'rgba(255,255,255,0.11)',   // focused / active
  borderStrong: 'rgba(255,255,255,0.16)',   // emphasis
  borderColor:  'rgba(255,255,255,0.07)',

  // ── Semantic data colors (vitals & metrics) ───────────────────────────────
  //   Kept intentionally muted to avoid eye fatigue in live monitoring
  heartRate:   '#D4607A',   // warm rose — readable on dark
  spO2:        '#4A96C4',   // steel blue — calm
  fatigue:     '#4DB87A',   // green when low
  fatigueHigh: '#C84B5A',   // red when critical
  fatigueMed:  '#D4924A',   // amber mid-range
  stress:      '#5B7FCC',   // periwinkle blue
  stressHigh:  '#C84B5A',

  // ── Athlete card sub-palette ──────────────────────────────────────────────
  athleteCard: {
    // Surfaces
    canvas:       '#0B0E14',
    shell:        'rgba(255,255,255,0.03)',
    shellDeep:    'rgba(255,255,255,0.015)',
    surface:      'rgba(255,255,255,0.035)',
    surfaceStrong:'rgba(255,255,255,0.055)',
    glass:        'rgba(255,255,255,0.04)',
    glassLight:   'rgba(255,255,255,0.07)',

    // Borders — hairline glass
    border:       'rgba(255,255,255,0.12)',
    borderSoft:   'rgba(255,255,255,0.07)',
    borderDim:    'rgba(255,255,255,0.05)',

    // Data colors (muted for monitoring comfort)
    green:        '#4DB87A',
    greenBright:  '#6DCFA0',
    greenDeep:    'rgba(77,184,122,0.12)',
    cyan:         '#4A96C4',
    cyanBright:   '#6BB4D8',
    blue:         '#5B7FCC',
    blueDeep:     'rgba(91,127,204,0.12)',
    red:          '#D4607A',
    redBright:    '#E07A90',

    // Typography
    white:        '#F0F4FF',
    muted:        '#8B95A8',
    mutedDark:    '#4A5266',

    // Bars & tracks
    track:        'rgba(255,255,255,0.08)',
    trackDark:    'rgba(255,255,255,0.05)',

    // Shadows & glows
    shadow:       'rgba(0,0,0,0.65)',
    glow:         'rgba(77,184,122,0.15)',
    cyanGlow:     'rgba(74,150,196,0.15)',
    blueGlow:     'rgba(91,127,204,0.15)',
    redGlow:      'rgba(212,96,122,0.15)',
  },

} as const;

// ─── Radius ──────────────────────────────────────────────────────────────────
export const radius = {
  xs:   '4px',
  sm:   '8px',
  md:   '12px',
  lg:   '16px',
  xl:   '22px',
  xxl:  '28px',
  card: '20px',
  full: '9999px',
} as const;

// ─── Typography ──────────────────────────────────────────────────────────────
export const font = {
  display: "'Barlow Condensed', sans-serif",
  body:    "'DM Sans', sans-serif",
  mono:    "'JetBrains Mono', monospace",
} as const;

// ─── Glassmorphism helpers ────────────────────────────────────────────────────
export const glass = {
  // Base card
  card: `
    background: rgba(255,255,255,0.035);
    border: 0.5px solid rgba(255,255,255,0.10);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  `,
  // Nested panel inside a card
  panel: `
    background: rgba(255,255,255,0.025);
    border: 0.5px solid rgba(255,255,255,0.07);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  `,
  // Modal / overlay
  modal: `
    background: rgba(11,14,20,0.82);
    border: 0.5px solid rgba(255,255,255,0.12);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
  `,
} as const;

// ─── Status config ────────────────────────────────────────────────────────────
export type StatusType = 'fit' | 'moderate' | 'critical';

export const statusConfig: Record<StatusType, {
  label:  string;
  color:  string;
  bg:     string;
  border: string;
  glow:   string;
}> = {
  fit: {
    label:  'FIT',
    color:  colors.fit,
    bg:     colors.fitBg,
    border: colors.fitBorder,
    glow:   'rgba(77,184,122,0.12)',
  },
  moderate: {
    label:  'MODERATE',
    color:  colors.moderate,
    bg:     colors.moderateBg,
    border: colors.moderateBorder,
    glow:   'rgba(212,146,74,0.12)',
  },
  critical: {
    label:  'CRITICAL',
    color:  colors.critical,
    bg:     colors.criticalBg,
    border: colors.criticalBorder,
    glow:   colors.criticalGlow,
  },
};