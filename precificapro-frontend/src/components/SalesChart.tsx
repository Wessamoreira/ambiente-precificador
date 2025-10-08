import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getChartData } from '@/api/dashboard';
import { GlassCard } from './ui/GlassCard';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

type Period = 7 | 30 | 90 | 365;

export const SalesChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(30);

  const { data: chartData, isLoading, error } = useQuery({
    queryKey: ['salesChart', selectedPeriod],
    queryFn: () => getChartData(selectedPeriod),
  });

  // Debug completo
  console.log('🔍 SalesChart Debug:');
  console.log('- Loading:', isLoading);
  console.log('- Error:', error);
  console.log('- Data:', chartData);

  const periods: { label: string; value: Period; days: string }[] = [
    { label: '7 Dias', value: 7, days: 'Semana' },
    { label: '30 Dias', value: 30, days: 'Mês' },
    { label: '90 Dias', value: 90, days: 'Trimestre' },
    { label: '365 Dias', value: 365, days: 'Ano' },
  ];

  // Calcular totais dos dados do gráfico
  const totals = chartData?.reduce((acc, curr) => ({
    revenue: acc.revenue + Number(curr.revenue || 0),
    profit: acc.profit + Number(curr.profit || 0),
  }), { revenue: 0, profit: 0 });

  if (isLoading) {
    return (
      <GlassCard className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-white/20 rounded w-64 mb-6"></div>
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 bg-white/10 rounded-lg flex-1"></div>
            ))}
          </div>
          <div className="h-80 bg-white/10 rounded"></div>
        </div>
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard className="p-6">
        <div className="text-center text-red-400">
          <p className="font-semibold">Erro ao carregar gráfico</p>
          <p className="text-sm mt-2">Tente novamente mais tarde</p>
        </div>
      </GlassCard>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <GlassCard className="p-6">
        <div className="text-center text-gray-400">
          <p className="font-semibold">Nenhum dado encontrado</p>
          <p className="text-sm mt-2">Adicione vendas para ver o gráfico</p>
        </div>
      </GlassCard>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
          <p className="text-white font-semibold mb-2">{payload[0].payload.date}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-aurora-cyan"></div>
              <span className="text-gray-300 text-sm">Faturamento:</span>
              <span className="text-aurora-cyan font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload[0].value)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-gray-300 text-sm">Lucro:</span>
              <span className="text-green-400 font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload[1].value)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <GlassCard className="p-6 md:p-8" neonColor="cyan" enableNeonBorder={true}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-aurora-cyan/20 to-blue-500/10">
            <TrendingUp className="w-6 h-6 text-aurora-cyan" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-aurora-cyan to-aurora-violet bg-clip-text text-transparent">
              Evolução Financeira
            </h2>
            <p className="text-sm text-gray-400">Acompanhe suas vendas e lucros</p>
          </div>
        </div>

        {/* Filtros de Período */}
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl backdrop-blur-sm">
          {periods.map((period) => (
            <motion.button
              key={period.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedPeriod(period.value)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                selectedPeriod === period.value
                  ? 'bg-gradient-to-r from-aurora-cyan to-aurora-violet text-white shadow-lg shadow-aurora-cyan/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {period.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Cards de Totais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-aurora-cyan/10 to-blue-500/5 border border-aurora-cyan/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Faturamento Total</p>
              <p className="text-2xl font-bold text-aurora-cyan">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals?.revenue || 0)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-aurora-cyan/20">
              <DollarSign className="w-6 h-6 text-aurora-cyan" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-400/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Lucro Total</p>
              <p className="text-2xl font-bold text-green-400">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals?.profit || 0)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-400/20">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Gráfico */}
      <div className="mt-6">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.7)"
              style={{ fontSize: '11px' }}
              tick={{ fill: 'rgba(255,255,255,0.7)' }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.7)"
              style={{ fontSize: '11px' }}
              tick={{ fill: 'rgba(255,255,255,0.7)' }}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Faturamento"
              stroke="#06b6d4"
              strokeWidth={3}
              fill="url(#colorRevenue)"
              dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#06b6d4', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="profit"
              name="Lucro"
              stroke="#4ade80"
              strokeWidth={3}
              fill="url(#colorProfit)"
              dot={{ fill: '#4ade80', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#4ade80', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">
              Período: <span className="text-white font-semibold">
                {periods.find(p => p.value === selectedPeriod)?.days}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-gray-400">
              Margem: <span className="text-green-400 font-semibold">
                {totals && totals.revenue > 0 ? ((totals.profit / totals.revenue) * 100).toFixed(1) : 0}%
              </span>
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
