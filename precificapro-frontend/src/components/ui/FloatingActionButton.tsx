import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { Plus, X } from 'lucide-react';

interface FABAction {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  neonColor?: 'violet' | 'cyan' | 'rose' | 'amber';
}

interface FloatingActionButtonProps {
  actions?: FABAction[];
  mainAction?: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
}

export const FloatingActionButton = ({ 
  actions = [],
  mainAction,
  position = 'bottom-right'
}: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
  };

  const neonShadows = {
    violet: 'shadow-neon-violet',
    cyan: 'shadow-neon-cyan',
    rose: 'shadow-neon-rose',
    amber: 'shadow-neon-amber',
  };

  const handleMainClick = () => {
    if (actions.length > 0) {
      setIsOpen(!isOpen);
    } else if (mainAction) {
      mainAction();
    }
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-[90]`}>
      {/* Action Menu */}
      <AnimatePresence>
        {isOpen && actions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 justify-end"
              >
                {/* Label */}
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white text-sm font-semibold whitespace-nowrap"
                >
                  {action.label}
                </motion.span>

                {/* Button */}
                <motion.button
                  onClick={() => {
                    action.onClick();
                    setIsOpen(false);
                  }}
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  className={`
                    w-12 h-12 rounded-2xl
                    bg-gradient-to-br from-white/10 to-white/5
                    backdrop-blur-xl
                    border border-white/20
                    flex items-center justify-center
                    text-white
                    transition-all duration-300
                    hover:${neonShadows[action.neonColor || 'violet']}
                  `}
                >
                  {action.icon}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={handleMainClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        className="
          w-16 h-16 rounded-2xl
          bg-gradient-to-br from-aurora-violet to-aurora-cyan
          backdrop-blur-xl
          border border-white/20
          shadow-neon-violet
          flex items-center justify-center
          text-white
          transition-all duration-300
          hover:shadow-neon-cyan
        "
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-7 h-7" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="w-7 h-7" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Backdrop when open (mobile) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm -z-10 md:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
