import { api } from './axios';
import type { Customer, CustomerData } from '@/types'; // Importando nossos tipos centralizados

export const getCustomers = async (): Promise<Customer[]> => {
  const response = await api.get('/customers');
  return response.data;
};

export const createCustomer = async (customerData: CustomerData) => {
  const response = await api.post('/customers', customerData);
  return response.data;
};

export const updateCustomer = async (id: string, customerData: CustomerData) => {
  const response = await api.put(`/customers/${id}`, customerData);
  return response.data;
};

export const deleteCustomer = async (id: string) => {
  await api.delete(`/customers/${id}`);
};