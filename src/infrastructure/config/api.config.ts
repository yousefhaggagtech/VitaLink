export const API_CONFIG = {
  NEXT_PUBLIC_AI_SERVICE_URL: 'https://vitalink-services.vercel.app',
  TIMEOUT: 10000,
} as const;

export const API_ENDPOINTS = {
  AI_LATEST: (beltId: string) => `/api/ai/${beltId}/latest`,
  AI_TIMELINE: (beltId: string) => `/api/ai/${beltId}/timeline`,
  AI_HEALTH: (beltId: string) => `/api/ai/${beltId}/health`,
} as const;
