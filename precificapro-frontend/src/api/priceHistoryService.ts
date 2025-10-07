import api from './axios';
import { PriceEvolution, PriceStatistics } from '../types';

export const priceHistoryService = {
  // Listar histórico com paginação
  getHistory: async (productId: string, page = 0, size = 10): Promise<any> => {
    const response = await api.get(`/products/${productId}/price-history?page=${page}&size=${size}`);
    return response.data;
  },
  
  // Buscar evolução de preços (para gráfico)
  getEvolution: async (productId: string, days = 30): Promise<PriceEvolution> => {
    const response = await api.get(`/products/${productId}/price-history/evolution?days=${days}`);
    return response.data;
  },
  
  // Buscar estatísticas
  getStatistics: async (productId: string): Promise<PriceStatistics> => {
    const response = await api.get(`/products/${productId}/price-history/statistics`);
    return response.data;
  }
};
