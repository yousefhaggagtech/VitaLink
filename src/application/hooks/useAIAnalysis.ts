'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { aiService } from '@/infrastructure/services/AIService';
import { AI_CONFIG } from '@/domain/constants';
import {
  AIResponse,
  isWaitingState,
  isRecommendation,
  AIRecommendation,
} from '@/domain/types/ai.types';
import {
  computeClientStatus,
  ClientStatus,
} from '../utils/statusLayer';

interface UseAIAnalysisResult {
  // البيانات
  recommendation: AIRecommendation | null;    // البيانات الصالحة (Last Known Good)
  waitingState: { message: string; hint: string } | null;
  rawResponse: AIResponse | null;             // الـ response الخام

  // الحالات
  isLoading: boolean;        // أول load
  isFetching: boolean;       // جلب في الخلفية
  isError: boolean;
  error: string | null;

  // الـ Status Layer
  clientStatus: ClientStatus;
  isStale: boolean;
  isInWarmup: boolean;
  isUpdating: boolean;        // alias لـ isFetching && hasValidData

  // Helpers
  hasUsableData: boolean;
  refetch: () => void;
}

/**
 * ⭐ الـ Hook الرئيسي للـ AI Dashboard
 * 
 * - Polling كل 3 ثواني (متوافق مع الـ sensors)
 * - Last Known Good State (يمنع الوميض)
 * - keepPreviousData (ثبات الـ UI)
 * - Auto refetch on reconnect
 * - Query Key: ["analysis", beltId]
 */
export function useAIAnalysis(beltId: string | null): UseAIAnalysisResult {
  // ═══════════════════════════════════════════════════
  // Last Known Good State
  // ═══════════════════════════════════════════════════
  const lastGoodDataRef = useRef<AIRecommendation | null>(null);

  useEffect(() => {
    lastGoodDataRef.current = null;
  }, [beltId]);

  const query = useQuery<AIResponse, Error>({
    queryKey: ['analysis', beltId],  // ⚠️ المواصفات: ["analysis", beltId]
    queryFn: () => aiService.getLatest(beltId!),
    enabled: !!beltId,
    refetchInterval: AI_CONFIG.REFETCH_INTERVAL_MS,  // 3000ms
    refetchOnReconnect: true,
    placeholderData: keepPreviousData,  // ⚠️ keep previous during fetch
    staleTime: 0,  // نعتبر البيانات stale فوراً عشان نـ refetch
  });

  // ═══════════════════════════════════════════════════
  // Anti-Flicker: حفظ آخر بيانات صالحة
  // ═══════════════════════════════════════════════════
  useEffect(() => {
    if (
      query.data &&
      isRecommendation(query.data) &&
      query.data.beltId === beltId &&
      !query.data.isStale &&
      !query.data.isInWarmup &&
      hasUsableMetrics(query.data)
    ) {
      lastGoodDataRef.current = query.data;
    }
  }, [beltId, query.data]);

  // ═══════════════════════════════════════════════════
  // Display Data (اللي هنعرضه فعلاً)
  // ═══════════════════════════════════════════════════
  const displayData = useMemo<AIRecommendation | null>(() => {
    // 1. لو الـ response الحالي فيه metrics صالحة → استخدمه
    if (query.data && isRecommendation(query.data)) {
      return query.data;
    }

    // 2. لو الـ response الحالي null metrics (stale/warmup)
    //    → استخدم آخر بيانات صالحة (Last Known Good)
    if (lastGoodDataRef.current) {
      return lastGoodDataRef.current;
    }

    return null;
  }, [query.data]);

  // ═══════════════════════════════════════════════════
  // Waiting State
  // ═══════════════════════════════════════════════════
  const waitingState = useMemo(() => {
    if (query.data && isWaitingState(query.data)) {
      return {
        message: query.data.message,
        hint: query.data.hint,
      };
    }
    return null;
  }, [query.data]);

  const currentRecommendation = useMemo<AIRecommendation | null>(() => {
    return query.data && isRecommendation(query.data) ? query.data : null;
  }, [query.data]);

  const hasUsableDisplayData = useMemo(() => {
    return Boolean(
      displayData &&
        displayData.beltId === beltId &&
        !displayData.isStale &&
        !displayData.isInWarmup &&
        hasUsableMetrics(displayData)
    );
  }, [beltId, displayData]);

  // ═══════════════════════════════════════════════════
  // Status Layer
  // ═══════════════════════════════════════════════════
  const clientStatus = useMemo<ClientStatus>(() => {
    return computeClientStatus({
      isStale: currentRecommendation?.isStale ?? displayData?.isStale ?? false,
      isInWarmup: currentRecommendation?.isInWarmup ?? displayData?.isInWarmup ?? false,
      isFetching: query.isFetching,
      hasValidData: hasUsableDisplayData,
      ageSinceLastUpdate:
        currentRecommendation?.ageSinceLastUpdate ?? displayData?.ageSinceLastUpdate ?? 0,
    });
  }, [currentRecommendation, displayData, hasUsableDisplayData, query.isFetching]);

  const isUpdating = query.isFetching && hasUsableDisplayData;

  return {
    recommendation: displayData,
    waitingState,
    rawResponse: query.data ?? null,

    isLoading: query.isLoading && !lastGoodDataRef.current,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error?.message ?? null,

    clientStatus,
    isStale: currentRecommendation?.isStale ?? displayData?.isStale ?? false,
    isInWarmup: currentRecommendation?.isInWarmup ?? displayData?.isInWarmup ?? false,
    isUpdating,

    hasUsableData: hasUsableDisplayData,
    refetch: query.refetch,
  };
}

// ═══════════════════════════════════════════════════
// Helper: هل البيانات قابلة للاستخدام (مش null كلها)؟
// ═══════════════════════════════════════════════════
function hasUsableMetrics(ai: AIRecommendation): boolean {
  return (
    ai.metrics.power !== null ||
    ai.metrics.crampRisk !== null ||
    ai.metrics.momentum !== null ||
    ai.metrics.recoveryTimeMin !== null ||
    ai.metrics.timeToFailMin !== null
  );
}
