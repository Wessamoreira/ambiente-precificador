import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ type, message, isVisible, onClose, duration = 5000 }: ToastProps) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const config = {
    success: {
      icon: CheckCircle,
      gradient: 'from-green-500/30 to-emerald-500/20',
      border: 'border-green-500/50',
      iconColor: 'text-green-400',
      shadow: 'shadow-[0_0_30px_rgba(34,197,94,0.3)]',
    },
    error: {
      icon: XCircle,
      gradient: 'from-red-500/30 to-rose-500/20',
      border: 'border-red-500/50',
      iconColor: 'text-red-400',
      shadow: 'shadow-[0_0_30px_rgba(239,68,68,0.3)]',
    },
    warning: {
      icon: AlertTriangle,
      gradient: 'from-amber-500/30 to-yellow-500/20',
      border: 'border-amber-500/50',
      iconColor: 'text-amber-400',
      shadow: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]',
    },
    info: {
      icon: Info,
      gradient: 'from-aurora-cyan/30 to-blue-500/20',
      border: 'border-aurora-cyan/50',
      iconColor: 'text-aurora-cyan',
      shadow: 'shadow-[0_0_30px_rgba(6,182,212,0.3)]',
    },
  };

  const { icon: Icon, gradient, border, iconColor, shadow } = config[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`
            fixed top-6 right-6 z-[9999]
            max-w-md w-full
            backdrop-blur-3xl
            bg-gradient-to-br ${gradient}
            border ${border}
            rounded-2xl
            ${shadow}
            p-4
          `}
        >
          <div className="flex items-start gap-3">
            {/* Ícone */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 400 }}
              className={`flex-shrink-0 ${iconColor}`}
            >
              <Icon className="w-6 h-6" />
            </motion.div>

            {/* Mensagem */}
            <p className="flex-1 text-white font-medium text-sm leading-relaxed">
              {message}
            </p>

            {/* Botão de fechar */}
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Barra de progresso */}
          {duration > 0 && (
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
              className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r ${gradient} origin-left`}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook para usar Toast facilmente
import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
    isVisible: boolean;
  }>({
    type: 'info',
    message: '',
    isVisible: false,
  });

  const showToast = useCallback((type: ToastType, message: string) => {
    setToast({ type, message, isVisible: true });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
};
