import { useEffect, useState } from 'react';
import { getCostItems, deleteCostItem } from '@/api/costItemService';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { Modal } from '@/components/ui/Modal';
import { CostItemForm } from '@/components/CostItemForm';
import { TableLoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { Edit2, Trash2, Plus, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { CostItem } from '@/types';

export const CostItemsPage = () => {
  const [costItems, setCostItems] = useState<CostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCostItem, setEditingCostItem] = useState<CostItem | null>(null);

  const fetchCostItems = async () => {
    try {
      const data = await getCostItems();
      setCostItems(data);
    } catch (err) {
      setError('Falha ao carregar os custos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCostItems();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingCostItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (costItem: CostItem) => {
    setEditingCostItem(costItem);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCostItem(null);
  };

  const handleSuccess = () => {
    handleModalClose();
    fetchCostItems();
  };

  const handleDelete = async (costItemId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este custo?')) {
      try {
        await deleteCostItem(costItemId);
        fetchCostItems();
      } catch (err) {
        setError('Falha ao excluir o custo.');
      }
    }
  };

  if (loading) return <TableLoadingSkeleton />;
  if (error) return <p className="text-red-400 text-center">{error}</p>;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="p-3 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl">
            <DollarSign className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Meus Custos Fixos</h1>
        </motion.div>
        <GlassButton onClick={handleOpenCreateModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Custo
        </GlassButton>
      </div>
      
      {/* Desktop Table */}
      <div className="hidden md:block">
        <GlassCard className="overflow-hidden p-0">
          <table className="min-w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Descrição</th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tipo</th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Valor Mensal</th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {costItems.map((item, index) => (
                <motion.tr 
                  key={item.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-white/5 transition-colors duration-200"
                >
                  <td className="py-4 px-6 text-sm font-medium text-white">{item.description}</td>
                  <td className="py-4 px-6 text-sm text-gray-300">{item.type}</td>
                  <td className="py-4 px-6 text-sm text-violet-400 font-semibold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.amountMonthly)}
                  </td>
                  <td className="py-4 px-6 text-sm">
                    {item.active ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                        <CheckCircle className="w-3 h-3" />
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                        <XCircle className="w-3 h-3" />
                        Inativo
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm text-right space-x-2">
                    <button 
                      onClick={() => handleOpenEditModal(item)} 
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {costItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassCard className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{item.description}</h3>
                  <p className="text-sm text-gray-400">{item.type}</p>
                </div>
                {item.active ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                    <CheckCircle className="w-3 h-3" />
                    Ativo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                    <XCircle className="w-3 h-3" />
                    Inativo
                  </span>
                )}
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-300 mb-1">Valor Mensal</p>
                <p className="text-2xl font-bold text-violet-400">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.amountMonthly)}
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleOpenEditModal(item)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all border border-blue-500/30"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all border border-red-500/30"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingCostItem ? 'Editar Custo Fixo' : 'Cadastrar Novo Custo'}
      >
        <CostItemForm onSuccess={handleSuccess} initialData={editingCostItem} />
      </Modal>
    </div>
  );
};