import { api } from './axios';
import type { SimulationRequest, SimulationResponse } from '@/types';

export const calculateSimulation = async (data: SimulationRequest): Promise<SimulationResponse> => {
  const response = await api.post('/simulations/calculate', data);
  return response.data;
};