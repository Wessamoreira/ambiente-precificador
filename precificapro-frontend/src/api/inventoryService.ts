import api from './axios';
import { Inventory, StockAdjustData, StockMovement, InventorySummary } from '../types';

export const inventoryService = {
  // Listar todo o inventário
  getAll: async (): Promise<Inventory[]> => {
    const response = await api.get('/inventory');
    return response.data;
  },

  // Produtos com estoque baixo ou zerado
  getLowStock: async (): Promise<Inventory[]> => {
    const response = await api.get('/inventory/low-stock');
    return response.data;
  },

  // Resumo do inventário
  getSummary: async (): Promise<InventorySummary> => {
    const response = await api.get('/inventory/summary');
    return response.data;
  },

  // Buscar inventário de um produto específico
  getByProduct: async (productId: string): Promise<Inventory> => {
    const response = await api.get(`/inventory/product/${productId}`);
    return response.data;
  },

  // Ajustar estoque (entrada ou saída)
  adjustStock: async (productId: string, data: StockAdjustData): Promise<Inventory> => {
    const response = await api.post(`/inventory/product/${productId}/adjust`, data);
    return response.data;
  },

  // Atualizar estoque mínimo
  updateMinStock: async (productId: string, minStock: number): Promise<Inventory> => {
    const response = await api.put(`/inventory/product/${productId}/min-stock`, null, {
      params: { minStock }
    });
    return response.data;
  },

  // Reservar estoque
  reserveStock: async (productId: string, quantity: number): Promise<Inventory> => {
    const response = await api.post(`/inventory/product/${productId}/reserve`, null, {
      params: { quantity }
    });
    return response.data;
  },

  // Liberar estoque reservado
  releaseStock: async (productId: string, quantity: number): Promise<Inventory> => {
    const response = await api.post(`/inventory/product/${productId}/release`, null, {
      params: { quantity }
    });
    return response.data;
  },

  // Histórico de movimentações (paginado)
  getMovements: async (productId: string, page: number = 0, size: number = 20): Promise<{ content: StockMovement[], totalElements: number }> => {
    const response = await api.get(`/inventory/product/${productId}/movements`, {
      params: { page, size, sort: 'createdAt,desc' }
    });
    return response.data;
  },
};
