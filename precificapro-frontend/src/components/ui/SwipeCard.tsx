import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { Trash2, Archive, Check } from 'lucide-react';

interface SwipeCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: {
    icon?: ReactNode;
    color?: string;
    label?: string;
  };
  rightAction?: {
    icon?: ReactNode;
    color?: string;
    label?: string;
  };
  threshold?: number;
}

export const SwipeCard = ({ 
  children, 
  onSwipeLeft, 
  onSwipeRight,
  leftAction = {
    icon: <Trash2 className="w-5 h-5" />,
    color: 'bg-red-500',
    label: 'Excluir'
  },
  rightAction = {
    icon: <Check className="w-5 h-5" />,
    color: 'bg-green-500',
    label: 'Concluir'
  },
  threshold = 100
}: SwipeCardProps) => {
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const leftBgOpacity = useTransform(x, [-threshold, 0], [1, 0]);
  const rightBgOpacity = useTransform(x, [0, threshold], [0, 1]);
  
  const leftIconScale = useTransform(x, [-threshold, 0], [1, 0.5]);
  const rightIconScale = useTransform(x, [0, threshold], [0.5, 1]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    setIsDragging(false);
    
    if (info.offset.x < -threshold && onSwipeLeft) {
      onSwipeLeft();
    } else if (info.offset.x > threshold && onSwipeRight) {
      onSwipeRight();
    }
    
    // Reset position
    x.set(0);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl touch-pan-y">
      {/* Left Action Background */}
      {onSwipeLeft && (
        <motion.div
          style={{ opacity: leftBgOpacity }}
          className={`absolute inset-0 ${leftAction.color} flex items-center justify-end px-6 rounded-2xl`}
        >
          <motion.div 
            style={{ scale: leftIconScale }}
            className="flex flex-col items-center gap-1 text-white"
          >
            {leftAction.icon}
            {leftAction.label && <span className="text-xs font-semibold">{leftAction.label}</span>}
          </motion.div>
        </motion.div>
      )}

      {/* Right Action Background */}
      {onSwipeRight && (
        <motion.div
          style={{ opacity: rightBgOpacity }}
          className={`absolute inset-0 ${rightAction.color} flex items-center justify-start px-6 rounded-2xl`}
        >
          <motion.div 
            style={{ scale: rightIconScale }}
            className="flex flex-col items-center gap-1 text-white"
          >
            {rightAction.icon}
            {rightAction.label && <span className="text-xs font-semibold">{rightAction.label}</span>}
          </motion.div>
        </motion.div>
      )}

      {/* Card Content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className={`relative z-10 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        {children}
      </motion.div>
    </div>
  );
};
