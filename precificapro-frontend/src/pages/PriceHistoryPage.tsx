import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { priceHistoryService } from '../api/priceHistoryService';
import { productService } from '../api/productService';
import { PriceHistory, PriceStatistics, Product } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { TableLoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, DollarSign, Percent, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export const PriceHistoryPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [history, setHistory] = useState<PriceHistory[]>([]);
  const [statistics, setStatistics] = useState<PriceStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (productId) {
      loadData();
    }
  }, [productId, page]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productData, historyData, statsData] = await Promise.all([
        productService.getById(productId!),
        priceHistoryService.getHistory(productId!, page, 10),
        priceHistoryService.getStatistics(productId!)
      ]);
      
      setProduct(productData);
      setHistory(historyData.content || []);
      setTotalPages(historyData.totalPages || 0);
      setStatistics(statsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar histórico de preços');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'INCREASING':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'DECREASING':
        return <TrendingDown className="w-5 h-5 text-red-400" />;
      default:
        return <Minus className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case 'INCREASING':
        return 'text-green-400';
      case 'DECREASING':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return '-';
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  const formatPercent = (value?: number) => {
    if (value === undefined || value === null) return '-';
    return `${value.toFixed(2)}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <TableLoadingSkeleton />;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/products')}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
            >
              Histórico de Preços
            </motion.h1>
            {product && (
              <p className="text-gray-400 mt-1">{product.name}</p>
            )}
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Preço Atual</span>
                <DollarSign className="w-5 h-5 text-cyan-400" />
              </div>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(statistics.currentPrice)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Margem: {formatPercent(statistics.currentMargin)}
              </p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Preço Médio</span>
                <TrendingUp className="w-5 h-5 text-violet-400" />
              </div>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(statistics.avgPrice)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Todos os períodos
              </p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Min / Máx</span>
                <Percent className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold text-green-400">
                  {formatCurrency(statistics.minPrice)}
                </p>
                <span className="text-gray-500">/</span>
                <p className="text-lg font-bold text-red-400">
                  {formatCurrency(statistics.maxPrice)}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Variação histórica
              </p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Registros</span>
                <Calendar className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-2xl font-bold text-white">
                {statistics.totalRecords}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {statistics.lastUpdated 
                  ? `Último: ${formatDate(statistics.lastUpdated)}`
                  : 'Sem atualizações'}
              </p>
            </GlassCard>
          </motion.div>
        </div>
      )}

      {/* Tabela de Histórico */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <GlassCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Data</th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Preço Sugerido</th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Custo Total</th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Lucro/Un</th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Margem %</th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Perfil</th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Por</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {history.length > 0 ? (
                  history.map((record, index) => (
                    <motion.tr 
                      key={record.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-white/5 transition-colors duration-200"
                    >
                      <td className="py-4 px-6 text-sm text-gray-300">
                        {formatDate(record.createdAt)}
                      </td>
                      <td className="py-4 px-6 text-sm font-bold text-cyan-400">
                        {formatCurrency(record.suggestedPrice)}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-300">
                        {formatCurrency(record.totalCost)}
                      </td>
                      <td className="py-4 px-6 text-sm text-green-400">
                        {formatCurrency(record.netProfitPerUnit)}
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <span className={`font-semibold ${
                          record.netProfitPercentage > 30 ? 'text-green-400' :
                          record.netProfitPercentage > 15 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {formatPercent(record.netProfitPercentage)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-300">
                        {record.pricingProfileName || '-'}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-400">
                        {record.createdBy || 'Sistema'}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-400">
                      Nenhum histórico encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 p-4 border-t border-white/10">
              <GlassButton
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2"
              >
                Anterior
              </GlassButton>
              <span className="text-gray-400 text-sm">
                Página {page + 1} de {totalPages}
              </span>
              <GlassButton
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-4 py-2"
              >
                Próxima
              </GlassButton>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
};
