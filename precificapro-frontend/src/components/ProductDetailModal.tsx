import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { rankingService } from '../api/rankingService';
import { ProductSalesChart } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Package, Calendar, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
}

export const ProductDetailModal = ({ isOpen, onClose, productId, productName }: ProductDetailModalProps) => {
  const [chartData, setChartData] = useState<ProductSalesChart | null>(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    if (isOpen && productId) {
      loadChartData();
    }
  }, [isOpen, productId, period]);

  const loadChartData = async () => {
    try {
      setLoading(true);
      const data = await rankingService.getProductSalesChart(productId, period);
      setChartData(data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={productName} size="xl">
      <div className="space-y-6">
        {/* Period Selector */}
        <div className="flex gap-2 justify-center">
          {[7, 30, 60, 90].map((days) => (
            <button
              key={days}
              onClick={() => setPeriod(days)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                period === days
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {days} dias
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
          </div>
        ) : chartData ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-8 h-8 text-green-400" />
                  <div>
                    <p className="text-xs text-gray-400">Receita Total</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(chartData.totalRevenue)}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-8 h-8 text-cyan-400" />
                  <div>
                    <p className="text-xs text-gray-400">Qtd Vendida</p>
                    <p className="text-2xl font-bold text-white">{chartData.totalQuantitySold}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-8 h-8 text-violet-400" />
                  <div>
                    <p className="text-xs text-gray-400">Média Diária</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(chartData.avgDailyRevenue)}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-violet-400" />
                <h3 className="text-lg font-bold text-white">Evolução de Vendas</h3>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData.dataPoints}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorQuantity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `${value}`}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value: number, name: string) => {
                      if (name === 'revenue' || name === 'profit') {
                        return [formatCurrency(value), name === 'revenue' ? 'Receita' : 'Lucro'];
                      }
                      return [value, 'Quantidade'];
                    }}
                    labelFormatter={(label) => formatDate(label)}
                  />
                  <Legend 
                    wrapperStyle={{ color: '#fff' }}
                    formatter={(value) => {
                      if (value === 'quantitySold') return 'Quantidade';
                      if (value === 'revenue') return 'Receita';
                      if (value === 'profit') return 'Lucro';
                      return value;
                    }}
                  />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="quantitySold" 
                    stroke="#06b6d4" 
                    fillOpacity={1}
                    fill="url(#colorQuantity)"
                  />
                  <Area 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8b5cf6" 
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Data Table */}
            {chartData.dataPoints.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden"
              >
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-bold text-white">Detalhamento por Dia</h3>
                  </div>
                </div>
                <div className="overflow-x-auto max-h-64">
                  <table className="min-w-full">
                    <thead className="bg-white/5 sticky top-0">
                      <tr>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase">Data</th>
                        <th className="py-3 px-4 text-right text-xs font-medium text-gray-300 uppercase">Qtd</th>
                        <th className="py-3 px-4 text-right text-xs font-medium text-gray-300 uppercase">Receita</th>
                        <th className="py-3 px-4 text-right text-xs font-medium text-gray-300 uppercase">Lucro</th>
                        <th className="py-3 px-4 text-right text-xs font-medium text-gray-300 uppercase">Vendas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {chartData.dataPoints.slice().reverse().map((point, index) => (
                        <tr key={index} className="hover:bg-white/5 transition-colors">
                          <td className="py-2 px-4 text-sm text-gray-300">{formatDate(point.date)}</td>
                          <td className="py-2 px-4 text-sm text-right text-cyan-400 font-semibold">{point.quantitySold}</td>
                          <td className="py-2 px-4 text-sm text-right text-green-400">{formatCurrency(point.revenue)}</td>
                          <td className="py-2 px-4 text-sm text-right text-emerald-400">{formatCurrency(point.profit)}</td>
                          <td className="py-2 px-4 text-sm text-right text-gray-300">{point.salesCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <div className="text-center py-10 text-gray-400">
            Nenhum dado disponível para este período
          </div>
        )}
      </div>
    </Modal>
  );
};
