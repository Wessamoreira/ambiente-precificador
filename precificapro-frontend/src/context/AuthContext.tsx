import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { api } from '../api/axios';

// Define o formato do nosso contexto de autenticação
interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// Cria o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cria o "Provedor", o componente que vai gerenciar o estado
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));

  // Efeito que roda sempre que o 'token' muda
  useEffect(() => {
    if (token) {
      // Salva o token no localStorage para persistir o login entre reloads da página
      localStorage.setItem('authToken', token);
      // Define o token no cabeçalho de todas as futuras requisições do Axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      // Se o token for nulo, remove do localStorage e do cabeçalho do Axios
      localStorage.removeItem('authToken');
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = (newToken: string) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Cria um "hook" customizado para facilitar o uso do contexto em outros componentes
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};