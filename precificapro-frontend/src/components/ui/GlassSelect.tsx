import { motion } from 'framer-motion';
import { forwardRef, useState } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

interface GlassSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  neonColor?: 'violet' | 'cyan' | 'rose' | 'amber';
}

export const GlassSelect = forwardRef<HTMLSelectElement, GlassSelectProps>(
  ({ label, error, options, neonColor = 'violet', className = '', ...props }, ref) => {
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
          <select
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`
              w-full
              appearance-none
              pl-4
              pr-12
              py-3
              rounded-xl
              bg-white/5
              backdrop-blur-xl
              border border-white/10
              text-white
              transition-all duration-300
              outline-none
              cursor-pointer
              ${neonColors[neonColor]}
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.3)]' : ''}
              ${isFocused ? 'scale-[1.01]' : 'scale-100'}
              ${className}
            `}
            {...props}
          >
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                className="bg-aurora-night-dark text-white"
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Ícone de chevron */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <motion.div
              animate={{ rotate: isFocused ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </motion.div>
          </div>

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

GlassSelect.displayName = 'GlassSelect';
