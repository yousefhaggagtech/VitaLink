import { HealthStatus, Theme } from '@/domain/types/types';

export const getHealthStatus = (value: number, min: number, max: number): HealthStatus => {
  if (value < min || value > max) return 'warning';
  return 'optimal';
};

export const getOverallHealthStatus = (...statuses: HealthStatus[]): HealthStatus => {
  if (statuses.includes('danger')) return 'danger';
  if (statuses.includes('warning')) return 'warning';
  return 'optimal';
};

export const getStatusColor = (status: HealthStatus, theme: Theme): string => {
  switch (status) {
    case 'optimal': return theme.status.success;
    case 'warning': return theme.status.warning;
    case 'danger': return theme.status.danger;
    default: return theme.accent.primary;
  }
};
