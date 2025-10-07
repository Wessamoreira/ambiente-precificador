import { api } from './axios';
// CORREÇÃO: Adicionamos SaleResponseDTO à importação
import type { SaleData, SaleResponseDTO } from '@/types'; 

export const recordSale = async (saleData: SaleData) => {
  const response = await api.post('/sales', saleData);
  return response.data;
};

export const getSales = async (): Promise<SaleResponseDTO[]> => {
    const response = await api.get('/sales');
    return response.data;
};