import { useEffect, useState } from 'react';
import { getCustomers, deleteCustomer } from '@/api/customerService';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { Modal } from '@/components/ui/Modal';
import { CustomerForm } from '@/components/CustomerForm';
import { TableLoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { Edit2, Trash2, Plus, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Customer } from '@/types';

export const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      setError('Falha ao carregar os clientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleSuccess = () => {
    handleModalClose();
    fetchCustomers();
  };

  const handleDelete = async (customerId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente? Todas as vendas associadas a ele podem ser afetadas.')) {
      try {
        await deleteCustomer(customerId);
        fetchCustomers();
      } catch (err) {
        setError('Falha ao excluir o cliente.');
      }
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phoneNumber.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <TableLoadingSkeleton />;
  if (error) return <p className="text-red-400 text-center">{error}</p>;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-aurora-violet-light via-aurora-cyan to-aurora-violet bg-clip-text text-transparent"
        >
          Meus Clientes
        </motion.h1>
        <GlassButton onClick={handleOpenCreateModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Cliente
        </GlassButton>
      </div>
      
      {/* Campo de Busca */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nome, telefone ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-aurora-cyan focus:shadow-neon-cyan transition-all"
          />
        </div>
      </motion.div>
      
      {/* Tabela para Desktop */}
      <div className="hidden md:block">
        <GlassCard className="overflow-hidden p-0" neonColor="rose" enableNeonBorder={true}>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nome</th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Telefone</th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="py-4 px-6 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer, index) => (
                    <motion.tr 
                      key={customer.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-white/5 transition-colors duration-200"
                    >
                      <td className="py-4 px-6 text-sm font-medium text-white">{customer.name}</td>
                      <td className="py-4 px-6 text-sm text-gray-300">{customer.phoneNumber}</td>
                      <td className="py-4 px-6 text-sm text-gray-300">{customer.email}</td>
                      <td className="py-4 px-6 text-sm text-right space-x-2">
                        <button 
                          onClick={() => handleOpenEditModal(customer)} 
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(customer.id)} 
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                          Excluir
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-400">Nenhum cliente encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      {/* Cards para Mobile */}
      <div className="md:hidden space-y-4">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer, index) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="p-4" neonColor="amber" enableNeonBorder={true}>
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white mb-2">{customer.name}</h3>
                  <p className="text-sm text-gray-300 mb-1">📞 {customer.phoneNumber}</p>
                  <p className="text-sm text-gray-300">✉️ {customer.email}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleOpenEditModal(customer)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all border border-blue-500/30"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(customer.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all border border-red-500/30"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))
        ) : (
          <GlassCard className="p-10 text-center text-gray-400" neonColor="violet">
            Nenhum cliente encontrado.
          </GlassCard>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingCustomer ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
      >
        <CustomerForm onSuccess={handleSuccess} initialData={editingCustomer} />
      </Modal>
    </div>
  );
};