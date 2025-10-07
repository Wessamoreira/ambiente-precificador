import { api } from './axios';

export const askAi = async (question: string): Promise<string> => {
  const response = await api.post('/ai/ask', { question });
  return response.data.answer;
};