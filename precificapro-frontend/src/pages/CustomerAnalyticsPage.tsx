import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Modal } from '@/components/ui/Modal';
import { getCustomerAnalytics } from '@/api/customerAnalyticsService';
import type { CustomerAnalytics } from '@/types';
import { Search, TrendingUp, TrendingDown, ShoppingBag, DollarSign, Package, Phone, Mail, Calendar, Crown, Trophy } from 'lucide-react';
import { TableLoadingSkeleton } from '@/components/ui/LoadingSkeleton';

export const CustomerAnalyticsPage = () => {
  const [customers, setCustomers] = useState<CustomerAnalytics[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerAnalytics | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = customers.filter(c => 
        c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.customerPhone.includes(searchTerm)
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchTerm, customers]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getCustomerAnalytics();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      console.error('Erro ao carregar análise de clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerClick = (customer: CustomerAnalytics) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatDate = (dateString: string) => 
    new Date(dateString).toLocaleDateString('pt-BR');

  if (loading) return <TableLoadingSkeleton />;

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalProfit = customers.reduce((sum, c) => sum + c.totalProfit, 0);
  const avgOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalPurchases, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Crown className="w-10 h-10 text-aurora-amber animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-aurora-amber via-aurora-rose to-aurora-violet bg-clip-text text-transparent">
            Análise de Clientes
          </h1>
        </div>
        <p className="text-gray-400 text-sm md:text-base">Entenda seus melhores clientes e maximize seus lucros</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard neonColor="violet" enableNeonBorder={true} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-semibold uppercase">Clientes</p>
                <p className="text-3xl font-bold text-white mt-2">{totalCustomers}</p>
              </div>
              <div className="p-3 rounded-xl bg-aurora-violet/20">
                <ShoppingBag className="w-8 h-8 text-aurora-violet" />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard neonColor="cyan" enableNeonBorder={true} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-semibold uppercase">Faturamento</p>
                <p className="text-2xl font-bold text-aurora-cyan mt-2">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="p-3 rounded-xl bg-aurora-cyan/20">
                <DollarSign className="w-8 h-8 text-aurora-cyan" />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard neonColor="amber" enableNeonBorder={true} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-semibold uppercase">Lucro Total</p>
                <p className="text-2xl font-bold text-green-400 mt-2">{formatCurrency(totalProfit)}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-500/20">
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <GlassCard neonColor="rose" enableNeonBorder={true} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-semibold uppercase">Ticket Médio</p>
                <p className="text-2xl font-bold text-aurora-rose mt-2">{formatCurrency(avgOrderValue)}</p>
              </div>
              <div className="p-3 rounded-xl bg-aurora-rose/20">
                <Package className="w-8 h-8 text-aurora-rose" />
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Search Bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar cliente por nome, email ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-aurora-amber focus:shadow-neon-amber transition-all"
          />
        </div>
      </motion.div>

      {/* Customer List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <GlassCard neonColor="violet" enableNeonBorder={true} className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-aurora-amber" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-aurora-amber to-aurora-rose bg-clip-text text-transparent">
              Ranking de Clientes (Por Lucro)
            </h2>
          </div>

          <div className="space-y-3">
            {filteredCustomers.length === 0 ? (
              <p className="text-center text-gray-400 py-8">Nenhum cliente encontrado</p>
            ) : (
              filteredCustomers.map((customer, index) => (
                <motion.div
                  key={customer.customerId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  onClick={() => handleCustomerClick(customer)}
                  className="group cursor-pointer p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-aurora-amber/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    {/* Left Side */}
                    <div className="flex items-center gap-4">
                      {/* Ranking Badge */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                        index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                        index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                        'bg-gradient-to-br from-aurora-violet to-aurora-cyan'
                      }`}>
                        {index + 1}
                      </div>

                      {/* Customer Info */}
                      <div>
                        <h3 className="text-white font-bold text-lg group-hover:text-aurora-amber transition-colors">
                          {customer.customerName}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-400 flex items-center gap-1">
                            <ShoppingBag className="w-4 h-4" />
                            {customer.totalPurchases} {customer.totalPurchases === 1 ? 'compra' : 'compras'}
                          </span>
                          <span className="text-sm text-gray-400 flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            {customer.products.length} {customer.products.length === 1 ? 'produto' : 'produtos'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Financial Info */}
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end mb-1">
                        {customer.totalProfit >= 0 ? (
                          <TrendingUp className="w-5 h-5 text-green-400" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-400" />
                        )}
                        <p className={`text-xl font-bold ${customer.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatCurrency(customer.totalProfit)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-400">
                        Faturamento: {formatCurrency(customer.totalSpent)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Ticket médio: {formatCurrency(customer.averageOrderValue)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Modal de Detalhes */}
      <AnimatePresence>
        {isModalOpen && selectedCustomer && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={selectedCustomer.customerName}
          >
            <div className="space-y-6">
              {/* Contact Info */}
              <GlassCard className="p-4">
                <h3 className="text-lg font-bold text-aurora-cyan mb-3">Informações de Contato</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Mail className="w-4 h-4 text-aurora-cyan" />
                    <span>{selectedCustomer.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Phone className="w-4 h-4 text-aurora-cyan" />
                    <span>{selectedCustomer.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4 text-aurora-cyan" />
                    <span>Última compra: {formatDate(selectedCustomer.lastPurchaseDate)}</span>
                  </div>
                </div>
              </GlassCard>

              {/* Financial Summary */}
              <GlassCard className="p-4">
                <h3 className="text-lg font-bold text-aurora-amber mb-3">Resumo Financeiro</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Total Gasto</p>
                    <p className="text-xl font-bold text-aurora-cyan">{formatCurrency(selectedCustomer.totalSpent)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Lucro Gerado</p>
                    <p className="text-xl font-bold text-green-400">{formatCurrency(selectedCustomer.totalProfit)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total de Compras</p>
                    <p className="text-xl font-bold text-white">{selectedCustomer.totalPurchases}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Ticket Médio</p>
                    <p className="text-xl font-bold text-aurora-rose">{formatCurrency(selectedCustomer.averageOrderValue)}</p>
                  </div>
                </div>
              </GlassCard>

              {/* Products Purchased */}
              <GlassCard className="p-4">
                <h3 className="text-lg font-bold text-aurora-violet mb-3">Produtos Comprados</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {selectedCustomer.products.map((product, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold">{product.productName}</h4>
                        <span className="text-aurora-cyan font-bold">{formatCurrency(product.totalSpent)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>Quantidade: {product.totalQuantity}</span>
                        <span>Preço médio: {formatCurrency(product.averagePrice)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Última compra: {formatDate(product.lastPurchaseDate)}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};
