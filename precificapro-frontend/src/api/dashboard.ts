import { api } from './axios';

export interface DashboardMetrics {
  totalRevenue: number;
  totalNetProfit: number;
  productCount: number;
  customerCount: number;
}

export interface ChartDataPoint {
  date: string;
  revenue: number;
  profit: number;
}

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const response = await api.get<DashboardMetrics>('/dashboard/metrics');
  return response.data;
};

export const getChartData = async (days: number = 30): Promise<ChartDataPoint[]> => {
  console.log('📊 Buscando dados do gráfico, dias:', days);
  try {
    const response = await api.get<ChartDataPoint[]>(`/dashboard/chart?days=${days}`);
    console.log('✅ Dados recebidos:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar dados do gráfico:', error);
    throw error;
  }
};
