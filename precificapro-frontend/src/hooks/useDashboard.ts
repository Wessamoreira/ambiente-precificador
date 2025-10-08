import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '@/api/dashboardService';

/**
 * Hook para buscar estatísticas do dashboard com cache
 */
export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardStats,
    staleTime: 2 * 60 * 1000, // 2 minutos - dashboard precisa ser mais fresco
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true, // Refetch quando usuário volta para a aba
  });
};
