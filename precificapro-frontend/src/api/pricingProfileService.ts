import { api } from './axios';
import type { PricingProfile, PricingProfileData } from '@/types';

export const getPricingProfiles = async (): Promise<PricingProfile[]> => {
  const response = await api.get('/pricing-profiles');
  return response.data;
};

export const createPricingProfile = async (data: PricingProfileData) => {
  const response = await api.post('/pricing-profiles', data);
  return response.data;
};

export const updatePricingProfile = async (id: string, data: PricingProfileData) => {
  const response = await api.put(`/pricing-profiles/${id}`, data);
  return response.data;
};

export const deletePricingProfile = async (id: string) => {
  await api.delete(`/pricing-profiles/${id}`);
};