'use client';

import { useQuery } from '@tanstack/react-query';
import { aiService, TimelineRecord } from '@/infrastructure/services/AIService';
import { AI_CONFIG } from '@/domain/constants';

export function useAITimeline(
  beltId: string | null,
  startDate: Date,
  endDate: Date,
  limit: number = 100
) {
  return useQuery<TimelineRecord[], Error>({
    queryKey: ['timeline', beltId, startDate.toISOString(), endDate.toISOString()],
    queryFn: () => aiService.getTimeline(beltId!, startDate, endDate, limit),
    enabled: !!beltId,
    refetchInterval: AI_CONFIG.TIMELINE_REFETCH_INTERVAL_MS,
    refetchOnReconnect: true,
    placeholderData: keepPreviousData,
  });
}

// ⚠️ re-export لأن useQuery بيحتاج keepPreviousData
import { keepPreviousData } from '@tanstack/react-query';
