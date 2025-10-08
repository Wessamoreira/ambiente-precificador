import { motion } from 'framer-motion';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface GlassButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  neonGlow?: boolean;
  style?: React.CSSProperties;
}

export const GlassButton = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  neonGlow = true,
  className = '',
  ...props 
}: GlassButtonProps) => {
  
  const variants = {
    primary: 'bg-aurora-violet/30 border-aurora-violet/50 text-white hover:bg-aurora-violet/40 hover:shadow-neon-violet',
    secondary: 'bg-aurora-cyan/30 border-aurora-cyan/50 text-white hover:bg-aurora-cyan/40 hover:shadow-neon-cyan',
    success: 'bg-green-500/30 border-green-500/50 text-white hover:bg-green-500/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]',
    danger: 'bg-aurora-rose/30 border-aurora-rose/50 text-white hover:bg-aurora-rose/40 hover:shadow-neon-rose',
    ghost: 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/30',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <motion.button
      whileHover={{ 
        scale: 1.03,
        y: -2,
      }}
      whileTap={{ 
        scale: 0.97,
        y: 0,
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 25 
      }}
      className={`
        relative
        group
        ${sizes[size]}
        rounded-xl
        font-semibold
        border
        backdrop-blur-xl
        transition-all duration-300 ease-out
        ${variants[variant]}
        disabled:opacity-50 disabled:cursor-not-allowed
        active:translate-y-0
        ${className}
      `}
      {...props}
    >
      {/* Shimmer effect */}
      {neonGlow && (
        <div className="absolute inset-0 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer bg-[length:200%_100%]" />
        </div>
      )}
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};