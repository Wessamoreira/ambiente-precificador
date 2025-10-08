import axios from 'axios';

// Cria uma instância do Axios com a URL base da nossa API
// Usa variável de ambiente ou fallback para desenvolvimento
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 30000, // 30 segundos timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logging em desenvolvimento
if (import.meta.env.DEV) {
  api.interceptors.request.use(
    (config) => {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      console.error('[API Request Error]', error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
      return response;
    },
    (error) => {
      console.error('[API Response Error]', error.response?.status, error.message);
      return Promise.reject(error);
    }
  );
}

export default api;