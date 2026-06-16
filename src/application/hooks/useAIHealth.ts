'use client';

import { useQuery } from '@tanstack/react-query';
import { aiService, AIHealthResponse } from '@/infrastructure/services/AIService';
import { AI_CONFIG } from '@/domain/constants';

export function useAIHealth(beltId: string | null) {
  return useQuery<AIHealthResponse, Error>({
    queryKey: ['health', beltId],
    queryFn: () => aiService.getHealth(beltId!),
    enabled: !!beltId,
    refetchInterval: AI_CONFIG.HEALTH_REFETCH_INTERVAL_MS,
    refetchOnReconnect: true,
  });
}
