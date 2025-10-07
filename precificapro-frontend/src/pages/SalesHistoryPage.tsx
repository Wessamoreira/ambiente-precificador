import { useEffect, useState } from 'react';
import { getSales } from '@/api/saleService';
import { GlassCard } from '@/components/ui/GlassCard';
import type { SaleResponseDTO } from '@/types';
import { motion } from 'framer-motion';
import { History, TrendingUp, Calendar, User, Package } from 'lucide-react';

export const SalesHistoryPage = () => {
  const [sales, setSales] = useState<SaleResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const data = await getSales();
        setSales(data);
      } catch (err) {
        setError('Falha ao carregar o histórico de vendas.');
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  if (loading) return <p className="text-white text-center">Carregando histórico...</p>;
  if (error) return <p className="text-red-400 text-center">{error}</p>;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
          <History className="w-8 h-8 text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Histórico de Vendas</h1>
          <p className="text-gray-400 text-sm mt-1">Acompanhe todas as vendas realizadas</p>
        </div>
      </motion.div>
      
      <div className="space-y-4">
        {sales.length > 0 ? (
          sales.map((sale, index) => (
            <motion.div
              key={sale.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <GlassCard className="p-6 hover:scale-[1.01] transition-transform duration-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {/* Cliente */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-violet-500/20 rounded-lg mt-1">
                      <User className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Cliente</p>
                      <p className="text-lg font-bold text-white">{sale.customer.name}</p>
                    </div>
                  </div>
                  
                  {/* Data */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg mt-1">
                      <Calendar className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Data</p>
                      <p className="text-sm text-gray-300">{formatDate(sale.saleDate)}</p>
                    </div>
                  </div>
                  
                  {/* Valores */}
                  <div className="flex items-start gap-3 md:justify-end">
                    <div className="p-2 bg-green-500/20 rounded-lg mt-1">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Total</p>
                      <p className="text-xl font-bold text-white">{formatCurrency(sale.totalAmount)}</p>
                      <p className="text-sm font-semibold text-green-400">Lucro: {formatCurrency(sale.totalNetProfit)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Itens */}
                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-4 h-4 text-gray-400" />
                    <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wide">Itens Vendidos</h4>
                    <span className="ml-auto bg-white/10 text-gray-300 text-xs font-bold px-2 py-1 rounded-full">
                      {sale.items.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sale.items.map(item => (
                      <div key={item.id} className="bg-white/5 p-3 rounded-lg flex justify-between items-center border border-white/10">
                        <div>
                          <span className="font-semibold text-white text-sm">{item.productName}</span>
                          <p className="text-xs text-gray-400">{item.quantity}x {formatCurrency(item.unitPrice)}</p>
                        </div>
                        <span className="font-bold text-violet-400">{formatCurrency(item.unitPrice * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))
        ) : (
          <GlassCard className="p-10 text-center">
            <History className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Nenhuma venda registrada ainda.</p>
            <p className="text-gray-500 text-sm mt-2">As vendas aparecerão aqui após serem registradas.</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
};