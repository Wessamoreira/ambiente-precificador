import { useState, useRef, useEffect } from 'react';
import { useStockAlerts } from '../hooks/useStockAlerts';
import { Bell, AlertTriangle, XCircle, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const StockNotifications = () => {
  const { alerts, loading } = useStockAlerts();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleProductClick = (_productId: string) => {
    setIsOpen(false);
    navigate(`/inventory`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão de Notificações */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative p-2.5 rounded-xl transition-all duration-300 ${
          alerts.totalAlerts > 0
            ? 'text-yellow-400 bg-yellow-500/20 border border-yellow-500/30 hover:bg-yellow-500/30 hover:shadow-neon-amber'
            : 'text-gray-300 hover:bg-white/10 hover:text-white'
        }`}
        aria-label="Notificações de estoque"
      >
        <Bell className="w-5 h-5" />
        
        {/* Badge com contador */}
        {alerts.totalAlerts > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-gray-900"
          >
            {alerts.totalAlerts > 99 ? '99+' : alerts.totalAlerts}
          </motion.span>
        )}
      </motion.button>

      {/* Dropdown de Notificações */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 md:w-96 backdrop-blur-2xl bg-white/10 border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header do Dropdown */}
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-yellow-500/10 to-red-500/10">
              <h3 className="text-white font-bold flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-400" />
                Alertas de Estoque
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                {alerts.totalAlerts === 0 
                  ? 'Nenhum alerta no momento' 
                  : `${alerts.totalAlerts} produto${alerts.totalAlerts > 1 ? 's' : ''} requer${alerts.totalAlerts > 1 ? 'em' : ''} atenção`
                }
              </p>
            </div>

            {/* Conteúdo */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
                  <p className="mt-2 text-sm">Carregando...</p>
                </div>
              ) : alerts.totalAlerts === 0 ? (
                <div className="p-8 text-center">
                  <Package className="w-12 h-12 text-green-400 mx-auto mb-3 opacity-50" />
                  <p className="text-gray-400">Todos os estoques estão OK!</p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {/* Produtos SEM estoque (crítico) */}
                  {alerts.outOfStock.length > 0 && (
                    <div className="p-3 bg-red-500/10">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span className="text-red-400 font-semibold text-sm">
                          Sem Estoque ({alerts.outOfStock.length})
                        </span>
                      </div>
                      <div className="space-y-2">
                        {alerts.outOfStock.map((item) => (
                          <motion.div
                            key={item.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => handleProductClick(item.productId)}
                            className="bg-white/5 hover:bg-white/10 border border-red-500/30 rounded-lg p-3 cursor-pointer transition-all"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-white font-medium text-sm line-clamp-1">
                                  {item.productName}
                                </p>
                                <p className="text-gray-400 text-xs mt-1">
                                  SKU: {item.productSku}
                                </p>
                              </div>
                              <span className="ml-2 px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded">
                                0 un
                              </span>
                            </div>
                            <div className="mt-2 text-xs text-red-400">
                              ⚠️ Produto indisponível para venda
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Produtos com estoque BAIXO */}
                  {alerts.lowStock.length > 0 && (
                    <div className="p-3 bg-yellow-500/10">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-semibold text-sm">
                          Estoque Baixo ({alerts.lowStock.length})
                        </span>
                      </div>
                      <div className="space-y-2">
                        {alerts.lowStock.map((item) => (
                          <motion.div
                            key={item.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => handleProductClick(item.productId)}
                            className="bg-white/5 hover:bg-white/10 border border-yellow-500/30 rounded-lg p-3 cursor-pointer transition-all"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-white font-medium text-sm line-clamp-1">
                                  {item.productName}
                                </p>
                                <p className="text-gray-400 text-xs mt-1">
                                  SKU: {item.productSku}
                                </p>
                              </div>
                              <div className="ml-2 text-right">
                                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded block">
                                  {item.currentStock} un
                                </span>
                                <span className="text-xs text-gray-500 mt-1 block">
                                  Mín: {item.minStock}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {alerts.totalAlerts > 0 && (
              <div className="p-3 border-t border-white/10 bg-white/5">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/inventory');
                  }}
                  className="w-full text-center text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  Ver todos no Inventário →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
