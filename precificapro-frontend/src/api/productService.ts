import { api } from './axios';
// IMPORTAÇÃO CORRETA
import type { Product, ProductData } from '../types';

// FUNÇÃO EXISTENTE
export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get('/products');
  return response.data;
};

// Buscar produto por ID
export const getById = async (id: string): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// FUNÇÃO EXISTENTE
export const createProduct = async (productData: ProductData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

// FUNÇÃO EXISTENTE
export const updateProduct = async (id: string, productData: ProductData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

// FUNÇÃO EXISTENTE
export const deleteProduct = async (id: string) => {
  await api.delete(`/products/${id}`);
};

// Export como objeto também para compatibilidade
export const productService = {
  getProducts,
  getById,
  createProduct,
  updateProduct,
  deleteProduct
};