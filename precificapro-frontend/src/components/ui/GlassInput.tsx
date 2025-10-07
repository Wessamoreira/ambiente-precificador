import { motion } from 'framer-motion';
import { forwardRef, useState } from 'react';
import type { InputHTMLAttributes } from 'react';

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  neonColor?: 'violet' | 'cyan' | 'rose' | 'amber';
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, icon, neonColor = 'violet', className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const neonColors = {
      violet: 'focus:border-aurora-violet focus:shadow-neon-violet',
      cyan: 'focus:border-aurora-cyan focus:shadow-neon-cyan',
      rose: 'focus:border-aurora-rose focus:shadow-neon-rose',
      amber: 'focus:border-aurora-amber focus:shadow-neon-amber',
    };

    return (
      <div className="w-full">
        {label && (
          <motion.label
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="block text-sm font-semibold text-gray-300 mb-2"
          >
            {label}
          </motion.label>
        )}
        
        <motion.div 
          className="relative"
          animate={{
            scale: isFocused ? 1.01 : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`
              w-full
              ${icon ? 'pl-12' : 'pl-4'}
              pr-4
              py-3
              rounded-xl
              bg-white/5
              backdrop-blur-xl
              border border-white/10
              text-white
              placeholder:text-gray-500
              transition-all duration-300
              outline-none
              ${neonColors[neonColor]}
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.3)]' : ''}
              ${className}
            `}
            {...props}
          />

          {/* Brilho de foco */}
          {isFocused && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-xl pointer-events-none"
            >
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-${neonColor === 'violet' ? 'aurora-violet' : neonColor === 'cyan' ? 'aurora-cyan' : neonColor === 'rose' ? 'aurora-rose' : 'aurora-amber'}/20 to-transparent animate-shimmer bg-[length:200%_100%] opacity-50`} />
            </motion.div>
          )}
        </motion.div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';
