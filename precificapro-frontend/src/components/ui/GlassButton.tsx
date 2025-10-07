import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
// Importamos o tipo de propriedades correto do Framer Motion
import type { HTMLMotionProps } from 'framer-motion';

// A interface agora estende as propriedades do "motion" para um botão
interface GlassButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
}

export const GlassButton = ({ children, ...props }: GlassButtonProps) => {
  return (
    <motion.button
      // Animação ao passar o mouse
      whileHover={{ scale: 1.05, boxShadow: '0px 0px 12px rgba(139, 92, 246, 0.5)' }}
      // Animação ao clicar
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="px-6 py-2 rounded-lg bg-violet-600/50 text-white font-semibold border border-violet-500/50 backdrop-blur-sm"
      {...props}
    >
      {children}
    </motion.button>
  );
};