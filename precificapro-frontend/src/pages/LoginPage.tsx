import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axios';
import { GlassCard, GlassButton, GlassInput } from '../components/ui';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, LogIn } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  // Redireciona se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const token = response.data.accessToken;
      login(token);
      // Não precisa mais do navigate aqui, o useEffect vai cuidar disso
    } catch (err) {
      console.error("Falha no login:", err);
      setError('Email ou senha inválidos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden">
      {/* Partículas Aurora decorativas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-aurora-violet/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-aurora-cyan/30 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
        className="relative z-10 w-full max-w-md"
      >
        <GlassCard className="p-8 md:p-10" enableNeonBorder={true} neonColor="violet">
          {/* Logo e Título */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ 
                delay: 0.2, 
                type: "spring", 
                stiffness: 200,
                damping: 15 
              }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-aurora-violet to-aurora-cyan rounded-3xl blur-xl opacity-70 animate-pulse" />
                <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-aurora-violet to-aurora-cyan rounded-3xl flex items-center justify-center shadow-neon-violet">
                  <Sparkles className="w-10 h-10 text-white animate-pulse" />
                </div>
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-bold bg-gradient-to-r from-aurora-violet-light via-aurora-cyan to-aurora-violet bg-clip-text text-transparent mb-2"
            >
              PrecificaPro
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-sm"
            >
              Precifique com inteligência artificial
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <GlassInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              label="Email"
              icon={<Mail className="w-5 h-5" />}
              neonColor="violet"
              required
            />

            <GlassInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              label="Senha"
              icon={<Lock className="w-5 h-5" />}
              neonColor="cyan"
              required
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="relative overflow-hidden rounded-xl p-4 bg-red-500/10 border border-red-500/30 backdrop-blur-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent" />
                <p className="relative text-red-400 text-sm font-medium text-center">
                  {error}
                </p>
              </motion.div>
            )}

            <GlassButton 
              type="submit" 
              className="w-full" 
              variant="primary"
              size="lg"
              disabled={isLoading}
            >
              <LogIn className="w-5 h-5" />
              {isLoading ? 'Entrando...' : 'Entrar'}
            </GlassButton>
          </form>
        </GlassCard>

        {/* Footer */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6 text-xs text-gray-500"
        >
          Aurora Edition · v1.0.0
        </motion.p>
      </motion.div>
    </div>
  );
};