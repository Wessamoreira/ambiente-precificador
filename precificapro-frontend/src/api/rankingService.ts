import api from './axios';
import { ProductRanking, ProductSalesChart } from '../types';

export const rankingService = {
  getProductRanking: async (): Promise<ProductRanking[]> => {
    const response = await api.get('/sales/product-ranking');
    return response.data;
  },
  
  getProductSalesChart: async (productId: string, days: number = 30): Promise<ProductSalesChart> => {
    const response = await api.get(`/sales/product-chart/${productId}?days=${days}`);
    return response.data;
  }
};
