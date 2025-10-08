import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { productService } from '../api/productService';
import { rankingService } from '../api/rankingService';
import { Product, ProductSalesChart } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  TrendingUp, DollarSign, Package, Calendar, BarChart3, Tag, 
  ShoppingCart, Percent, Box, Image as ImageIcon, Info, AlertTriangle,
  CheckCircle, XCircle, Layers, Folder
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
}

export const ProductCompleteModal = ({ isOpen, onClose, productId }: ProductCompleteModalProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [chartData, setChartData] = useState<ProductSalesChart | null>(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState(30);
  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'details'>('overview');

  useEffect(() => {
    if (isOpen && productId) {
      loadProductData();
      loadChartData();
    }
  }, [isOpen, productId]);

  useEffect(() => {
    if (isOpen && productId && activeTab === 'sales') {
      loadChartData();
    }
  }, [period, activeTab]);

  const loadProductData = async () => {
    try {
      setLoading(true);
      const data = await productService.getById(productId);
      setProduct(data);
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChartData = async () => {
    try {
      const data = await rankingService.getProductSalesChart(productId, period);
      setChartData(data);
    } catch (error) {
      console.error('Erro ao carregar dados de vendas:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading || !product) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Carregando..." size="xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.name} size="xl">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/10">
          {[
            { id: 'overview', label: 'Visão Geral', icon: Info },
            { id: 'sales', label: 'Vendas', icon: BarChart3 },
            { id: 'details', label: 'Detalhes', icon: Package }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-all relative ${
                activeTab === id
                  ? 'text-violet-400 border-b-2 border-violet-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Imagem e Info Principal */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Imagem do Produto */}
                <div className="col-span-1">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/10">
                    {product.primaryImageUrl ? (
                      <img 
                        src={product.primaryImageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-24 h-24 text-gray-500" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Cards de Info */}
                <div className="col-span-2 grid grid-cols-2 gap-4">
                  {/* SKU */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-5 h-5 text-cyan-400" />
                      <p className="text-sm text-gray-400">SKU</p>
                    </div>
                    <p className="text-xl font-bold text-white">{product.sku}</p>
                  </div>

                  {/* Categoria */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Folder className="w-5 h-5 text-violet-400" />
                      <p className="text-sm text-gray-400">Categoria</p>
                    </div>
                    <p className="text-xl font-bold text-white truncate">
                      {product.categoryName || 'Sem categoria'}
                    </p>
                  </div>

                  {/* Custo */}
                  <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-amber-400" />
                      <p className="text-sm text-gray-400">Custo</p>
                    </div>
                    <p className="text-2xl font-bold text-white">{formatCurrency(product.defaultPurchaseCost)}</p>
                  </div>

                  {/* Preço de Venda */}
                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingCart className="w-5 h-5 text-green-400" />
                      <p className="text-sm text-gray-400">Preço Venda</p>
                    </div>
                    <p className="text-2xl font-bold text-white">{formatCurrency(product.defaultSellingPrice || 0)}</p>
                  </div>
                </div>
              </div>

              {/* Métricas Calculadas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Markup */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                    <p className="text-sm text-gray-400">Markup</p>
                  </div>
                  <p className="text-2xl font-bold text-cyan-400">
                    {formatPercent(product.defaultMarkup || 0)}
                  </p>
                </div>

                {/* Margem de Lucro */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Percent className="w-5 h-5 text-violet-400" />
                    <p className="text-sm text-gray-400">Margem de Lucro</p>
                  </div>
                  <p className="text-2xl font-bold text-violet-400">
                    {formatPercent(product.defaultProfitMargin || 0)}
                  </p>
                </div>

                {/* Lucro Unitário */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <p className="text-sm text-gray-400">Lucro Unitário</p>
                  </div>
                  <p className="text-2xl font-bold text-green-400">
                    {formatCurrency((product.defaultSellingPrice || 0) - (product.defaultPurchaseCost || 0))}
                  </p>
                </div>
              </div>

              {/* Descrição */}
              {product.description && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-cyan-400" />
                    Descrição
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{product.description}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* SALES TAB */}
          {activeTab === 'sales' && (
            <motion.div
              key="sales"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
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

              {chartData && chartData.dataPoints.length > 0 ? (
                <>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-8 h-8 text-green-400" />
                        <div>
                          <p className="text-xs text-gray-400">Receita Total</p>
                          <p className="text-2xl font-bold text-white">{formatCurrency(chartData.totalRevenue)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <Package className="w-8 h-8 text-cyan-400" />
                        <div>
                          <p className="text-xs text-gray-400">Qtd Vendida</p>
                          <p className="text-2xl font-bold text-white">{chartData.totalQuantitySold}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-violet-400" />
                        <div>
                          <p className="text-xs text-gray-400">Média Diária</p>
                          <p className="text-2xl font-bold text-white">{formatCurrency(chartData.avgDailyRevenue)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-violet-400" />
                      Evolução de Vendas
                    </h3>
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
                  </div>

                  {/* Tabela Detalhada */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-white/10">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-cyan-400" />
                        Detalhamento por Dia
                      </h3>
                    </div>
                    <div className="overflow-x-auto max-h-64">
                      <table className="min-w-full">
                        <thead className="bg-white/5 sticky top-0">
                          <tr>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase">Data</th>
                            <th className="py-3 px-4 text-right text-xs font-medium text-gray-300 uppercase">Qtd</th>
                            <th className="py-3 px-4 text-right text-xs font-medium text-gray-300 uppercase">Receita</th>
                            <th className="py-3 px-4 text-right text-xs font-medium text-gray-300 uppercase">Lucro</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {chartData.dataPoints.slice().reverse().map((point, index) => (
                            <tr key={index} className="hover:bg-white/5 transition-colors">
                              <td className="py-2 px-4 text-sm text-gray-300">{formatDate(point.date)}</td>
                              <td className="py-2 px-4 text-sm text-right text-cyan-400 font-semibold">{point.quantitySold}</td>
                              <td className="py-2 px-4 text-sm text-right text-green-400">{formatCurrency(point.revenue)}</td>
                              <td className="py-2 px-4 text-sm text-right text-emerald-400">{formatCurrency(point.profit)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-20">
                  <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Nenhuma venda registrada neste período</p>
                  <p className="text-gray-500 text-sm mt-2">Este produto ainda não teve vendas nos últimos {period} dias</p>
                </div>
              )}
            </motion.div>
          )}

          {/* DETAILS TAB */}
          {activeTab === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Informações Técnicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Código de Barras */}
                {product.barcode && (
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Box className="w-5 h-5 text-cyan-400" />
                      <p className="text-sm text-gray-400">Código de Barras</p>
                    </div>
                    <p className="text-lg font-mono font-bold text-white">{product.barcode}</p>
                  </div>
                )}

                {/* Unidade */}
                {product.unit && (
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Layers className="w-5 h-5 text-violet-400" />
                      <p className="text-sm text-gray-400">Unidade</p>
                    </div>
                    <p className="text-lg font-bold text-white uppercase">{product.unit}</p>
                  </div>
                )}

                {/* Status Ativo */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {product.isActive ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <p className="text-sm text-gray-400">Status</p>
                  </div>
                  <p className={`text-lg font-bold ${product.isActive ? 'text-green-400' : 'text-red-400'}`}>
                    {product.isActive ? 'Ativo' : 'Inativo'}
                  </p>
                </div>

                {/* Código Interno */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-5 h-5 text-amber-400" />
                    <p className="text-sm text-gray-400">ID do Sistema</p>
                  </div>
                  <p className="text-xs font-mono text-gray-400 truncate" title={product.id}>{product.id}</p>
                </div>
              </div>

              {/* Observações Internas */}
              {product.internalNotes && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-yellow-400" />
                    Observações Internas
                  </h3>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{product.internalNotes}</p>
                </div>
              )}

              {/* Preços Alternativos */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Precificação
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-gray-400">Custo de Compra</span>
                    <span className="text-white font-bold">{formatCurrency(product.defaultPurchaseCost)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-gray-400">Preço de Venda</span>
                    <span className="text-green-400 font-bold text-lg">{formatCurrency(product.defaultSellingPrice || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-gray-400">Lucro por Unidade</span>
                    <span className="text-emerald-400 font-bold">{formatCurrency((product.defaultSellingPrice || 0) - (product.defaultPurchaseCost || 0))}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400">Margem de Lucro</span>
                    <span className="text-violet-400 font-bold">{formatPercent(product.defaultProfitMargin || 0)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
};
