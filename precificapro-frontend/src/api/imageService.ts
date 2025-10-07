import api from './axios';
import { ProductImage } from '../types';

export const imageService = {
  // Upload de imagem
  upload: async (productId: string, file: File): Promise<ProductImage> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/products/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Listar imagens do produto
  getAll: async (productId: string): Promise<ProductImage[]> => {
    const response = await api.get(`/products/${productId}/images`);
    return response.data;
  },

  // Deletar imagem
  delete: async (productId: string, imageId: string): Promise<void> => {
    await api.delete(`/products/${productId}/images/${imageId}`);
  },

  // Definir como primária
  setPrimary: async (productId: string, imageId: string): Promise<ProductImage> => {
    const response = await api.put(`/products/${productId}/images/${imageId}/primary`);
    return response.data;
  },
};
