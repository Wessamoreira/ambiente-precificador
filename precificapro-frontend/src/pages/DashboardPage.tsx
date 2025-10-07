import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { getDashboardMetrics } from '@/api/dashboardService';
import type { DashboardMetricsDTO } from '@/types';
import { DollarSign, TrendingUp, Package, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardLoadingSkeleton } from '@/components/ui/LoadingSkeleton';

export const DashboardPage = () => {
  const [metrics, setMetrics] = useState<DashboardMetricsDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await getDashboardMetrics();
        setMetrics(data);
      } catch (error) {
        console.error("Falha ao carregar métricas do dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    loadMetrics();
  }, []);

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  if (loading) return <DashboardLoadingSkeleton />;

  const cards = [
    {
      title: 'Faturamento Total',
      value: formatCurrency(metrics?.totalRevenue ?? 0),
      icon: DollarSign,
      gradient: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-400',
      textColor: 'text-white'
    },
    {
      title: 'Lucro Líquido Total',
      value: formatCurrency(metrics?.totalNetProfit ?? 0),
      icon: TrendingUp,
      gradient: 'from-green-500/20 to-emerald-500/20',
      iconColor: 'text-green-400',
      textColor: 'text-green-400'
    },
    {
      title: 'Produtos Cadastrados',
      value: metrics?.productCount ?? 0,
      icon: Package,
      gradient: 'from-violet-500/20 to-purple-500/20',
      iconColor: 'text-violet-400',
      textColor: 'text-white'
    },
    {
      title: 'Clientes Cadastrados',
      value: metrics?.customerCount ?? 0,
      icon: Users,
      gradient: 'from-orange-500/20 to-amber-500/20',
      iconColor: 'text-orange-400',
      textColor: 'text-white'
    }
  ];

  return (
    <div>
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-white mb-8 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
      >
        Painel Principal
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className={`p-6 hover:scale-105 transition-transform duration-300 bg-gradient-to-br ${card.gradient} cursor-pointer group`}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">{card.title}</h3>
                  <div className={`p-2 rounded-lg bg-white/10 ${card.iconColor} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <p className={`text-4xl font-bold ${card.textColor} mt-2`}>{card.value}</p>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};