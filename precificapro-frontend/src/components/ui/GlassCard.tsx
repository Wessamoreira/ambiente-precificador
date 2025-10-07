import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export const GlassCard = ({ children, className = '' }: GlassCardProps) => {
  return (
    // Usamos motion.div para adicionar animações de entrada
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Começa invisível e um pouco abaixo
      animate={{ opacity: 1, y: 0 }} // Anima para visível na posição normal
      transition={{ duration: 0.5 }}
      // Classes do Tailwind que criam o efeito Glassmorphism
      className={`
        backdrop-blur-lg
        bg-gray-500/10
        dark:bg-gray-900/10
        border border-solid border-white/20
        rounded-2xl
        shadow-lg
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};