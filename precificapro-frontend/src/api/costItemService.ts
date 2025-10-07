import { api } from './axios';
import type { CostItem, CostItemData } from '@/types';

export const getCostItems = async (): Promise<CostItem[]> => {
  const response = await api.get('/cost-items');
  return response.data;
};

export const createCostItem = async (data: CostItemData) => {
  const response = await api.post('/cost-items', data);
  return response.data;
};

export const updateCostItem = async (id: string, data: CostItemData) => {
  const response = await api.put(`/cost-items/${id}`, data);
  return response.data;
};

export const deleteCostItem = async (id: string) => {
  await api.delete(`/cost-items/${id}`);
};