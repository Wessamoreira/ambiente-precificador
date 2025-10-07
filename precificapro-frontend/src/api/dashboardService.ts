import { api } from './axios';
import type { DashboardMetricsDTO } from '@/types'; // Adicione este tipo em src/types/index.ts

export const getDashboardMetrics = async (): Promise<DashboardMetricsDTO> => {
    const response = await api.get('/dashboard/metrics');
    return response.data;
};