import { useEffect, useState } from 'react';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { getProducts } from '@/api/productService';
import { getPricingProfiles } from '@/api/pricingProfileService';
import { calculateSimulation } from '@/api/simulationService';
import type { Product, PricingProfile, SimulationResponse } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign, PieChart, BarChart3, AlertCircle } from 'lucide-react';

export const SimulationPage = () => {
  // Estados para os dados e seleções
  const [products, setProducts] = useState<Product[]>([]);
  const [profiles, setProfiles] = useState<PricingProfile[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('');
  
  // Estados de controle
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResponse | null>(null);

  // Busca os dados para preencher os dropdowns
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [productsData, profilesData] = await Promise.all([
          getProducts(),
          getPricingProfiles(),
        ]);
        setProducts(productsData);
        setProfiles(profilesData);
      } catch (err) {
        setError('Falha ao carregar dados iniciais. Verifique se há produtos e perfis cadastrados.');
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleCalculate = async () => {
    if (!selectedProduct || !selectedProfile) {
      setError('Por favor, selecione um produto e um perfil.');
      return;
    }
    setLoading(true);
    setError(null);
    setSimulationResult(null);
    try {
      const result = await calculateSimulation({
        productId: selectedProduct,
        profileId: selectedProfile,
      });
      setSimulationResult(result);
    } catch (err) {
      setError('Falha ao calcular a simulação.');
    } finally {
      setLoading(false);
    }
  };
  
  // Helper para formatar moeda
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl">
          <Calculator className="w-8 h-8 text-yellow-400" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Simulação de Preços</h1>
          <p className="text-gray-400 text-sm mt-1">Calcule o preço ideal para seus produtos</p>
        </div>
      </motion.div>

      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Seletor de Produtos */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Selecione o Produto
            </label>
            <select 
              value={selectedProduct} 
              onChange={(e) => setSelectedProduct(e.target.value)} 
              className="w-full p-3 bg-white/10 rounded-lg text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
            >
              <option value="" className="bg-gray-800">Escolha um produto</option>
              {products.map(p => <option key={p.id} value={p.id} className="bg-gray-800">{p.name}</option>)}
            </select>
          </div>
          
          {/* Seletor de Perfis */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Selecione o Perfil
            </label>
            <select 
              value={selectedProfile} 
              onChange={(e) => setSelectedProfile(e.target.value)} 
              className="w-full p-3 bg-white/10 rounded-lg text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
            >
              <option value="" className="bg-gray-800">Escolha um perfil</option>
              {profiles.map(p => <option key={p.id} value={p.id} className="bg-gray-800">{p.name}</option>)}
            </select>
          </div>
          
          <GlassButton 
            onClick={handleCalculate} 
            disabled={loading}
            className="flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            {loading ? 'Calculando...' : 'Calcular Preço'}
          </GlassButton>
        </div>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-red-400 mt-4 p-3 bg-red-500/10 rounded-lg border border-red-500/30"
          >
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </motion.div>
        )}
      </GlassCard>

      <AnimatePresence>
        {simulationResult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Card de Preço Sugerido */}
              <GlassCard className="p-8 text-center lg:col-span-3 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border-2 border-violet-500/30">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-6 h-6 text-violet-400" />
                  <h3 className="text-lg font-semibold text-gray-300">Preço de Venda Sugerido</h3>
                </div>
                <motion.p 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-6xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mt-4"
                >
                  {formatCurrency(simulationResult.suggestedPrice)}
                </motion.p>
              </GlassCard>

              {/* Card de Detalhes do Lucro */}
              <GlassCard className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Detalhes do Lucro</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between"><span>Lucro Líquido / Unidade:</span> <span className="font-bold text-green-400">{formatCurrency(simulationResult.profitDetails.netProfitPerUnit)}</span></div>
                  <div className="flex justify-between"><span>Lucro Líquido (%):</span> <span className="font-bold text-green-400">{simulationResult.profitDetails.netProfitPercentage.toFixed(2)}%</span></div>
                  
                  {/* Margem de Lucro - Novo Campo */}
                  <div className="flex justify-between border-t border-white/10 pt-3">
                    <span className="font-bold text-cyan-400">Sua Margem de Lucro (%):</span> 
                    <span className="font-bold text-cyan-400">{simulationResult.profitDetails.margemDeLucro.toFixed(2)}%</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Markup Aplicado (sobre o custo):</span> 
                    <span className="font-bold">{simulationResult.profitDetails.markupOnTotalCost.toFixed(2)}%</span>
                  </div>
                  <hr className="border-white/10 my-2" />
                  <div className="flex justify-between"><span>Ponto de Equilíbrio:</span> <span className="font-bold">{simulationResult.breakEvenUnits} un.</span></div>
                </div>
              </GlassCard>
              
              {/* Card de Análise de Custos */}
              <GlassCard className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <PieChart className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Análise de Custos</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between"><span>Custo Direto / Unidade:</span> <span className="font-bold">{formatCurrency(simulationResult.costBreakdown.directCostUnit)}</span></div>
                  <div className="flex justify-between"><span>Custo Indireto / Unidade:</span> <span className="font-bold">{formatCurrency(simulationResult.costBreakdown.indirectCostUnit)}</span></div>
                  <div className="flex justify-between font-bold text-violet-300"><span>CUSTO TOTAL / UNIDADE:</span> <span>{formatCurrency(simulationResult.costBreakdown.totalCostUnit)}</span></div>
                  <hr className="border-white/10" />
                  <div className="flex justify-between"><span>Valor das Taxas / Unidade:</span> <span className="font-bold">{formatCurrency(simulationResult.costBreakdown.feesValue)}</span></div>
                  <div className="flex justify-between font-bold"><span>Custo Final com Taxas:</span> <span>{formatCurrency(simulationResult.costBreakdown.costPlusFees)}</span></div>
                </div>
              </GlassCard>

              {/* Card de Projeção Mensal */}
              <GlassCard className="p-6 bg-gradient-to-br from-orange-500/10 to-amber-500/10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Projeção Mensal</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between"><span>Faturamento Bruto:</span> <span className="font-bold">{formatCurrency(simulationResult.monthlyProjection.revenue)}</span></div>
                  <div className="flex justify-between"><span>Total Custos Diretos:</span> <span className="text-red-400">-{formatCurrency(simulationResult.monthlyProjection.totalDirectCost)}</span></div>
                  <div className="flex justify-between"><span>Total Custos Fixos:</span> <span className="text-red-400">-{formatCurrency(simulationResult.monthlyProjection.totalIndirectCost)}</span></div>
                  <div className="flex justify-between"><span>Total Taxas:</span> <span className="text-red-400">-{formatCurrency(simulationResult.monthlyProjection.totalFees)}</span></div>
                  <hr className="border-white/10" />
                  <div className="flex justify-between font-bold text-xl"><span>Lucro Líquido Total:</span> <span className="text-green-400">{formatCurrency(simulationResult.monthlyProjection.netProfit)}</span></div>
                </div>
              </GlassCard>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};