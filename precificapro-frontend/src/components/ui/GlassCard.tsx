import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import type { ReactNode } from 'react';
import { useState } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  neonColor?: 'violet' | 'cyan' | 'rose' | 'amber';
  enableNeonBorder?: boolean;
  enable3D?: boolean;
}

export const GlassCard = ({ 
  children, 
  className = '', 
  neonColor = 'violet',
  enableNeonBorder = false,
  enable3D = true
}: GlassCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Mouse tracking para efeito 3D
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enable3D) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  // Cores do neon líquido
  const neonColors = {
    violet: 'shadow-neon-violet border-aurora-violet/50',
    cyan: 'shadow-neon-cyan border-aurora-cyan/50',
    rose: 'shadow-neon-rose border-aurora-rose/50',
    amber: 'shadow-neon-amber border-aurora-amber/50',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={enable3D ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : {}}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`
        relative
        backdrop-blur-3xl
        bg-white/5
        border border-white/10
        rounded-3xl
        shadow-glass
        transition-all duration-500 ease-out
        ${enableNeonBorder && isHovered ? neonColors[neonColor] : ''}
        ${enable3D ? 'hover:shadow-glass-lg' : ''}
        ${className}
      `}
    >
      {/* Neon Líquido - Borda Animada */}
      {enableNeonBorder && (
        <motion.div
          className="absolute inset-0 rounded-3xl opacity-0 pointer-events-none"
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-aurora-violet via-aurora-cyan to-aurora-rose bg-[length:200%_200%] animate-border-flow p-[1px]">
            <div className="w-full h-full rounded-3xl backdrop-blur-3xl bg-aurora-night-deep/90" />
          </div>
        </motion.div>
      )}
      
      {/* Reflexo de luz interno */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-60 pointer-events-none" />
      
      {/* Conteúdo */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};