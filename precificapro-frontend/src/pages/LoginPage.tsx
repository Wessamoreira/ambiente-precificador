import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axios';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      const token = response.data.accessToken;
      auth.login(token);
      navigate('/');
    } catch (err) {
      console.error("Falha no login:", err);
      setError('Email ou senha inválidos.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-violet-900/20 via-gray-900 to-cyan-900/20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <GlassCard className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-4"
            >
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-violet-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              PrecificaPro
            </h1>
            <p className="text-gray-400 mt-2">Precifique com inteligência</p>
          </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6 relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full px-3 py-2 bg-transparent border-b-2 border-white/30 text-white placeholder-transparent focus:outline-none focus:border-violet-400"
              required
              placeholder="Email"
            />
            <label htmlFor="email" className="absolute left-3 -top-5 text-gray-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-violet-400 peer-focus:text-sm">
              Email
            </label>
          </div>

          <div className="mb-8 relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full px-3 py-2 bg-transparent border-b-2 border-white/30 text-white placeholder-transparent focus:outline-none focus:border-violet-400"
              required
              placeholder="Senha"
            />
             <label htmlFor="password" className="absolute left-3 -top-5 text-gray-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-violet-400 peer-focus:text-sm">
              Senha
            </label>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-center mb-4 p-3 bg-red-500/10 rounded-lg border border-red-500/30"
            >
              {error}
            </motion.p>
          )}

          <div className="text-center">
            <GlassButton type="submit" className="w-full">
              Entrar
            </GlassButton>
          </div>
        </form>
        </GlassCard>
      </motion.div>
    </div>
  );
};