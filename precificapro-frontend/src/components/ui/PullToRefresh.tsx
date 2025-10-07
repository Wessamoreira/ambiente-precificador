import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
}

export const PullToRefresh = ({ 
  children, 
  onRefresh,
  threshold = 80
}: PullToRefreshProps) => {
  const y = useMotionValue(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canPull, setCanPull] = useState(false);
  
  const iconRotation = useTransform(y, [0, threshold], [0, 360]);
  const iconOpacity = useTransform(y, [0, threshold], [0.3, 1]);
  const iconScale = useTransform(y, [0, threshold], [0.5, 1]);
  
  const auroraOpacity = useTransform(y, [0, threshold], [0, 0.8]);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // Only allow pull to refresh if at top of page
      if (window.scrollY === 0) {
        setCanPull(true);
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    return () => window.removeEventListener('touchstart', handleTouchStart);
  }, []);

  const handleDragEnd = async (_: any, info: PanInfo) => {
    if (info.offset.y >= threshold && canPull && !isRefreshing) {
      setIsRefreshing(true);
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        y.set(0);
      }
    } else {
      y.set(0);
    }
    
    setCanPull(false);
  };

  return (
    <div className="relative">
      {/* Pull Indicator */}
      <motion.div
        style={{ opacity: auroraOpacity }}
        className="absolute top-0 left-0 right-0 h-20 -mt-20 flex items-center justify-center pointer-events-none z-50"
      >
        <div className="relative">
          {/* Aurora Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-aurora-violet/30 via-aurora-cyan/30 to-transparent blur-2xl" />
          
          {/* Icon */}
          <motion.div
            style={{ 
              rotate: isRefreshing ? 360 : iconRotation,
              opacity: iconOpacity,
              scale: iconScale
            }}
            animate={isRefreshing ? { rotate: 360 } : {}}
            transition={isRefreshing ? { 
              repeat: Infinity, 
              duration: 1, 
              ease: 'linear' 
            } : {}}
            className="relative p-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20"
          >
            <RefreshCw className="w-6 h-6 text-aurora-cyan" />
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        drag={canPull && !isRefreshing ? "y" : false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.3}
        onDragEnd={handleDragEnd}
        style={{ y }}
        className="touch-pan-y"
      >
        {children}
      </motion.div>
    </div>
  );
};
