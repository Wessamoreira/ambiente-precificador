import { GlassCard } from '@/components/ui/GlassCard';
import { useDashboard } from '@/hooks/useDashboard';
import { DollarSign, TrendingUp, Package, Users, Sparkles, ArrowUpRight, Trophy, ShoppingBag, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardLoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { SalesChart } from '@/components/SalesChart';

export const DashboardPage = () => {
  // React Query gerencia estado, cache e loading automaticamente
  const { data: stats, isLoading: loading, error } = useDashboard();

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  if (loading) return <DashboardLoadingSkeleton />;
  if (error) return (
    <div className="text-center text-red-400 p-8">
      <p className="text-xl font-semibold mb-2">Erro ao carregar dashboard</p>
      <p className="text-sm">{error instanceof Error ? error.message : 'Tente novamente mais tarde'}</p>
    </div>
  );

  const metrics = stats?.metrics;

  const cards = [
    {
      title: 'Faturamento Total',
      value: formatCurrency(metrics?.totalRevenue ?? 0),
      icon: DollarSign,
      neonColor: 'cyan' as const,
      gradient: 'from-aurora-cyan/20 to-blue-500/10',
    },
    {
      title: 'Lucro Líquido Total',
      value: formatCurrency(metrics?.totalNetProfit ?? 0),
      icon: TrendingUp,
      neonColor: 'cyan' as const,
      gradient: 'from-green-500/20 to-emerald-500/10',
    },
    {
      title: 'Produtos Cadastrados',
      value: metrics?.productCount ?? 0,
      icon: Package,
      neonColor: 'violet' as const,
      gradient: 'from-aurora-violet/20 to-purple-500/10',
    },
    {
      title: 'Clientes Cadastrados',
      value: metrics?.customerCount ?? 0,
      icon: Users,
      neonColor: 'amber' as const,
      gradient: 'from-aurora-amber/20 to-orange-500/10',
    }
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Header com brilho */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-10 h-10 text-aurora-violet animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-aurora-violet-light via-aurora-cyan to-aurora-violet bg-clip-text text-transparent">
            Painel Principal
          </h1>
        </div>
        <p className="text-gray-400 mt-2 text-sm md:text-base">Visão geral do seu negócio em tempo real</p>
      </motion.div>
      
      {/* Cards Grid - Mobile First */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.1,
                type: 'spring',
                stiffness: 300,
                damping: 25
              }}
            >
              <GlassCard 
                className={`p-6 bg-gradient-to-br ${card.gradient} cursor-pointer group`}
                neonColor={card.neonColor}
                enableNeonBorder={true}
                enable3D={true}
              >
                <div className="space-y-4">
                  {/* Header do Card */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-xs md:text-sm font-bold text-gray-300 uppercase tracking-wider">
                        {card.title}
                      </h3>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                        className="h-0.5 bg-gradient-to-r from-aurora-violet to-aurora-cyan"
                      />
                    </div>
                    
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 15 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                      className={`p-3 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-lg group-hover:shadow-neon-${card.neonColor}`}
                    >
                      <Icon className={`w-6 h-6 text-aurora-${card.neonColor}`} />
                    </motion.div>
                  </div>

                  {/* Valor */}
                  <div className="flex items-end justify-between">
                    <p className="text-3xl md:text-4xl font-bold text-white">
                      {card.value}
                    </p>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ArrowUpRight className="w-5 h-5 text-aurora-cyan" />
                    </motion.div>
                  </div>

                  {/* Efeito de partículas no hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none overflow-hidden rounded-3xl">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-aurora-cyan/20 rounded-full blur-3xl animate-pulse" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Top Clientes e Vendas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clientes por Compras */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-6" neonColor="violet" enableNeonBorder={true}>
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-6 h-6 text-aurora-violet" />
              <h2 className="text-xl font-bold bg-gradient-to-r from-aurora-violet to-aurora-cyan bg-clip-text text-transparent">
                Top Clientes (Compras)
              </h2>
            </div>
            
            <div className="space-y-3">
              {stats?.topCustomersByPurchases.map((customer, index) => (
                <motion.div
                  key={customer.customerId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-aurora-violet to-aurora-cyan flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{customer.customerName}</p>
                      <p className="text-xs text-gray-400">{customer.totalPurchases} compras</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-aurora-cyan font-bold">{formatCurrency(customer.totalSpent)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Top Clientes por Lucro */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-6" neonColor="amber" enableNeonBorder={true}>
            <div className="flex items-center gap-3 mb-6">
              <Crown className="w-6 h-6 text-aurora-amber" />
              <h2 className="text-xl font-bold bg-gradient-to-r from-aurora-amber to-aurora-rose bg-clip-text text-transparent">
                Top Clientes (Lucro)
              </h2>
            </div>
            
            <div className="space-y-3">
              {stats?.topCustomersByProfit.map((customer, index) => (
                <motion.div
                  key={customer.customerId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-aurora-amber to-aurora-rose flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{customer.customerName}</p>
                      <p className="text-xs text-gray-400">{customer.totalPurchases} compras</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">{formatCurrency(customer.totalProfit)}</p>
                    <p className="text-xs text-gray-400">lucro</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Maiores Vendas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <GlassCard className="p-6" neonColor="rose" enableNeonBorder={true}>
          <div className="flex items-center gap-3 mb-6">
            <ShoppingBag className="w-6 h-6 text-aurora-rose" />
            <h2 className="text-xl font-bold bg-gradient-to-r from-aurora-rose to-aurora-violet bg-clip-text text-transparent">
              Maiores Vendas
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats?.topSales.map((sale, index) => (
              <motion.div
                key={sale.saleId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.05 }}
                className="p-4 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-aurora-rose/50 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-bold text-lg">{formatCurrency(sale.totalAmount)}</p>
                    <p className="text-xs text-gray-400">{new Date(sale.saleDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-aurora-rose/20 flex items-center justify-center text-aurora-rose text-xs font-bold group-hover:scale-110 transition-transform">
                    #{index + 1}
                  </div>
                </div>
                <p className="text-white font-medium mb-2 truncate">{sale.customerName}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">{sale.itemsCount} {sale.itemsCount === 1 ? 'item' : 'itens'}</span>
                  <span className="text-green-400 font-semibold">+{formatCurrency(sale.netProfit)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Gráfico de Faturamento por Cliente */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <GlassCard className="p-6" neonColor="cyan" enableNeonBorder={true}>
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-6 h-6 text-aurora-cyan" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-aurora-cyan to-aurora-violet bg-clip-text text-transparent">
              Faturamento por Cliente
            </h2>
          </div>
          
          <div className="space-y-4">
            {stats?.topCustomersByPurchases.slice(0, 5).map((customer, index) => {
              const maxSpent = stats.topCustomersByPurchases[0]?.totalSpent || 1;
              const percentage = (customer.totalSpent / maxSpent) * 100;
              
              return (
                <motion.div
                  key={customer.customerId}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="group"
                >
                  {/* Nome e valor */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-aurora-cyan to-aurora-violet flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <p className="text-white font-semibold">{customer.customerName}</p>
                    </div>
                    <p className="text-aurora-cyan font-bold">{formatCurrency(customer.totalSpent)}</p>
                  </div>
                  
                  {/* Barra de progresso */}
                  <div className="relative h-8 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 1.2 + index * 0.1, duration: 1, ease: "easeOut" }}
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-aurora-cyan via-aurora-violet to-aurora-cyan bg-[length:200%_100%] animate-shimmer"
                      style={{
                        boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)'
                      }}
                    />
                    
                    {/* Informações dentro da barra */}
                    <div className="relative h-full flex items-center justify-between px-4">
                      <span className="text-xs text-white font-semibold z-10">
                        {customer.totalPurchases} {customer.totalPurchases === 1 ? 'compra' : 'compras'}
                      </span>
                      <span className="text-xs text-white/80 font-semibold z-10">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Legenda */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
            className="mt-8 pt-6 border-t border-white/10"
          >
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-aurora-cyan to-aurora-violet"></div>
                <span>Faturamento Total</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-aurora-cyan"></div>
                <span>Top 5 Clientes</span>
              </div>
            </div>
          </motion.div>
        </GlassCard>
      </motion.div>

      {/* Gráfico de Evolução de Vendas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <SalesChart />
      </motion.div>
    </div>
  );
};