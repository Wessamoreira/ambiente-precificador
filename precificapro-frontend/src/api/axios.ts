import axios from 'axios';

// Cria uma instância do Axios com a URL base da nossa API
export const api = axios.create({
  baseURL: 'http://localhost:8080', // A porta do nosso backend Spring Boot
});

export default api;