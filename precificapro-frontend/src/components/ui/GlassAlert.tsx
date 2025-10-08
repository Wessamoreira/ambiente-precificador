import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';

interface GlassAlertProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const GlassAlert = ({
  isOpen,
  onClose,
  type = 'info',
  title,
  message,
  onConfirm,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
}: GlassAlertProps) => {
  const icons = {
    success: <CheckCircle className="w-16 h-16 text-green-400" />,
    error: <XCircle className="w-16 h-16 text-red-400" />,
    warning: <AlertTriangle className="w-16 h-16 text-yellow-400" />,
    info: <Info className="w-16 h-16 text-blue-400" />,
  };

  const colors = {
    success: 'from-green-500/20 to-emerald-500/20',
    error: 'from-red-500/20 to-rose-500/20',
    warning: 'from-yellow-500/20 to-orange-500/20',
    info: 'from-blue-500/20 to-cyan-500/20',
  };

  const borderColors = {
    success: 'border-green-500/30',
    error: 'border-red-500/30',
    warning: 'border-yellow-500/30',
    info: 'border-blue-500/30',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay com blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200]"
          />

          {/* Alert Card */}
          <div className="fixed inset-0 flex items-center justify-center z-[201] p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{
                type: 'spring',
                damping: 20,
                stiffness: 300,
              }}
              className="w-full max-w-md pointer-events-auto"
            >
              {/* Glass Card Container */}
              <div className={`relative backdrop-blur-3xl bg-gradient-to-br ${colors[type]} border ${borderColors[type]} rounded-2xl shadow-2xl overflow-hidden`}>
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="p-8 text-center">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="flex justify-center mb-6"
                  >
                    {icons[type]}
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold text-white mb-3"
                  >
                    {title}
                  </motion.h3>

                  {/* Message */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-300 mb-8 leading-relaxed"
                  >
                    {message}
                  </motion.p>

                  {/* Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex gap-3 justify-center"
                  >
                    {onConfirm ? (
                      <>
                        <button
                          onClick={onClose}
                          className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-200 border border-white/20"
                        >
                          {cancelText}
                        </button>
                        <button
                          onClick={() => {
                            onConfirm();
                            onClose();
                          }}
                          className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          {confirmText}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={onClose}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        OK
                      </button>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
