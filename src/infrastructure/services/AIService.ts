import { apiClient } from '@/infrastructure/services/ApiClient';
import { API_ENDPOINTS } from '@/infrastructure/config/api.config';
import {
  AIResponse,
} from '@/domain/types/ai.types';

// ═══════════════════════════════════════════════════════
// Timeline record type (من الـ response)
// ═══════════════════════════════════════════════════════
export interface TimelineRecord {
  timestamp: string;
  power: number | null;
  crampRisk: number | null;
  momentum: number | null;
  playerState: number | null;
  alertLevel: string;
}

export interface TimelineResponse {
  success: boolean;
  count: number;
  data: TimelineRecord[];
}

export interface AIHealthResponse {
  beltId: string;
  status: 'WAITING' | 'ACTIVE' | 'STALE';
  lastUpdate?: string;
  ageSeconds?: number;
  dataPointsLast10Min: number;
  message?: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
}

// ═══════════════════════════════════════════════════════
// AI Service
// ═══════════════════════════════════════════════════════
class AIService {
  /**
   * GET /api/ai/{beltId}/latest
   * المصدر الأساسي للـ Polling
   */
  async getLatest(beltId: string): Promise<AIResponse> {
    const { data } = await apiClient.get<ApiEnvelope<AIResponse>>(
      API_ENDPOINTS.AI_LATEST(beltId)
    );
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to fetch AI data');
    }
    return data.data;
  }

  /**
   * GET /api/ai/{beltId}/timeline
   * للـ charts ومقارنة الـ previous match
   */
  async getTimeline(
    beltId: string,
    startDate: Date,
    endDate: Date,
    limit?: number
  ): Promise<TimelineRecord[]> {
    const { data } = await apiClient.get<TimelineResponse>(
      API_ENDPOINTS.AI_TIMELINE(beltId),
      {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          limit,
        },
      }
    );
    if (!data.success || !data.data) return [];
    return data.data;
  }

  /**
   * GET /api/ai/{beltId}/health
   * Status layer المستقل
   */
  async getHealth(beltId: string): Promise<AIHealthResponse> {
    const { data } = await apiClient.get<ApiEnvelope<AIHealthResponse>>(
      API_ENDPOINTS.AI_HEALTH(beltId)
    );
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to fetch health');
    }
    return data.data;
  }
}

export const aiService = new AIService();
