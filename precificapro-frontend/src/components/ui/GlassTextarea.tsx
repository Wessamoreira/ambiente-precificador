import { motion } from 'framer-motion';
import { forwardRef, useState } from 'react';
import type { TextareaHTMLAttributes } from 'react';

interface GlassTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  neonColor?: 'violet' | 'cyan' | 'rose' | 'amber';
}

export const GlassTextarea = forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  ({ label, error, neonColor = 'violet', className = '', ...props }, ref) => {
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
        
        <div className="relative">
          <motion.textarea
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            animate={{
              scale: isFocused ? 1.01 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`
              w-full
              px-4
              py-3
              rounded-xl
              bg-white/5
              backdrop-blur-xl
              border border-white/10
              text-white
              placeholder:text-gray-500
              transition-all duration-300
              outline-none
              resize-y
              min-h-[100px]
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
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-aurora-violet/10 via-aurora-cyan/10 to-transparent animate-shimmer bg-[length:200%_100%] opacity-50" />
            </motion.div>
          )}
        </div>

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

GlassTextarea.displayName = 'GlassTextarea';
