import { useState, useEffect } from 'react';
import { rankingService } from '../api/rankingService';
import { ProductRanking } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { TableLoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ProductCompleteModal } from '../components/ProductCompleteModal';
import { TrendingUp, DollarSign, Package, Percent, Trophy, Search, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProductRankingPage = () => {
  const [ranking, setRanking] = useState<ProductRanking[]>([]);
  const [filteredRanking, setFilteredRanking] = useState<ProductRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    loadRanking();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = ranking.filter(item =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productSku.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRanking(filtered);
    } else {
      setFilteredRanking(ranking);
    }
  }, [searchTerm, ranking]);

  const loadRanking = async () => {
    try {
      setLoading(true);
      const data = await rankingService.getProductRanking();
      setRanking(data);
      setFilteredRanking(data);
    } catch (error) {
      console.error('Erro ao carregar ranking:', error);
      alert('Erro ao carregar ranking de produtos');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  if (loading) return <TableLoadingSkeleton />;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl">
            <Trophy className="w-8 h-8 text-yellow-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Ranking de Produtos
          </h1>
        </motion.div>
      </div>

      {/* Busca */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nome ou SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </div>
      </motion.div>

      {/* Tabela Desktop */}
      <div className="hidden md:block">
        <GlassCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Posição</th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Produto</th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">SKU</th>
                  <th className="py-4 px-6 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Qtd Vendida</th>
                  <th className="py-4 px-6 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Receita Total</th>
                  <th className="py-4 px-6 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Lucro Líquido</th>
                  <th className="py-4 px-6 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Margem Média</th>
                  <th className="py-4 px-6 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredRanking.length > 0 ? (
                  filteredRanking.map((item, index) => (
                    <motion.tr 
                      key={item.productId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-white/5 transition-colors duration-200"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {index === 0 && <Trophy className="w-5 h-5 text-yellow-400" />}
                          {index === 1 && <Trophy className="w-5 h-5 text-gray-400" />}
                          {index === 2 && <Trophy className="w-5 h-5 text-orange-600" />}
                          <span className="text-white font-bold text-lg">{index + 1}º</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-white">{item.productName}</td>
                      <td className="py-4 px-6 text-sm text-gray-300">{item.productSku}</td>
                      <td className="py-4 px-6 text-sm text-right">
                        <span className="inline-flex items-center gap-1 text-cyan-400 font-semibold">
                          <Package className="w-4 h-4" />
                          {item.totalQuantitySold}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-right">
                        <span className="inline-flex items-center gap-1 text-green-400 font-semibold">
                          <DollarSign className="w-4 h-4" />
                          {formatCurrency(item.totalRevenue)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-right">
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                          <TrendingUp className="w-4 h-4" />
                          {formatCurrency(item.totalNetProfit)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-right">
                        <span className={`inline-flex items-center gap-1 font-semibold ${
                          item.avgProfitMargin > 30 ? 'text-green-400' :
                          item.avgProfitMargin > 15 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          <Percent className="w-4 h-4" />
                          {formatPercent(item.avgProfitMargin)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => setSelectedProductId(item.productId)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
                        >
                          <Eye className="w-4 h-4" />
                          Ver Detalhes
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-gray-400">
                      {searchTerm ? 'Nenhum produto encontrado' : 'Nenhuma venda registrada ainda'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      {/* Cards Mobile */}
      <div className="md:hidden space-y-4">
        {filteredRanking.length > 0 ? (
          filteredRanking.map((item, index) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {index === 0 && <Trophy className="w-6 h-6 text-yellow-400" />}
                    {index === 1 && <Trophy className="w-6 h-6 text-gray-400" />}
                    {index === 2 && <Trophy className="w-6 h-6 text-orange-600" />}
                    <span className="text-white font-bold text-xl">{index + 1}º</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.avgProfitMargin > 30 ? 'bg-green-500/20 text-green-400' :
                    item.avgProfitMargin > 15 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {formatPercent(item.avgProfitMargin)}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-1">{item.productName}</h3>
                <p className="text-sm text-gray-400 mb-4">SKU: {item.productSku}</p>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Qtd Vendida</p>
                    <p className="text-lg font-bold text-cyan-400">{item.totalQuantitySold}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Receita</p>
                    <p className="text-sm font-bold text-green-400">{formatCurrency(item.totalRevenue)}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 col-span-2">
                    <p className="text-xs text-gray-400 mb-1">Lucro Líquido</p>
                    <p className="text-xl font-bold text-emerald-400">{formatCurrency(item.totalNetProfit)}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedProductId(item.productId)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-lg transition-all shadow-lg"
                >
                  <Eye className="w-4 h-4" />
                  Ver Detalhes Completos
                </button>
              </GlassCard>
            </motion.div>
          ))
        ) : (
          <GlassCard className="p-10 text-center text-gray-400">
            {searchTerm ? 'Nenhum produto encontrado' : 'Nenhuma venda registrada ainda'}
          </GlassCard>
        )}
      </div>
      
      {/* Modal de Detalhes Completo */}
      {selectedProductId && (
        <ProductCompleteModal
          isOpen={!!selectedProductId}
          onClose={() => setSelectedProductId(null)}
          productId={selectedProductId}
        />
      )}
    </div>
  );
};
