import { useState, useEffect } from 'react';
import { inventoryService } from '../api/inventoryService';
import { Inventory, StockAdjustData, StockMovement, InventorySummary, StockStatus } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { Modal } from '../components/ui/Modal';
import { TableLoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { Package, AlertTriangle, CheckCircle, XCircle, Plus, Minus, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

type FilterType = 'all' | 'low' | 'out';

export const InventoryPage = () => {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [summary, setSummary] = useState<InventorySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  
  // Modal de ajuste
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);
  const [adjustData, setAdjustData] = useState<StockAdjustData>({
    type: 'IN',
    quantity: 1,
    reason: '',
    notes: ''
  });

  // Modal de movimentações
  const [isMovementsModalOpen, setIsMovementsModalOpen] = useState(false);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loadingMovements, setLoadingMovements] = useState(false);

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [summaryData, inventoryData] = await Promise.all([
        inventoryService.getSummary(),
        filter === 'low' ? inventoryService.getLowStock() : inventoryService.getAll()
      ]);
      
      setSummary(summaryData);
      
      if (filter === 'out') {
        setInventory(inventoryData.filter(i => i.stockStatus === StockStatus.OUT_OF_STOCK));
      } else {
        setInventory(inventoryData);
      }
    } catch (error) {
      console.error('Erro ao carregar inventário:', error);
      alert('Erro ao carregar inventário');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      await inventoryService.adjustStock(selectedItem.productId, adjustData);
      alert('Estoque ajustado com sucesso!');
      setIsAdjustModalOpen(false);
      setAdjustData({ type: 'IN', quantity: 1, reason: '', notes: '' });
      setSelectedItem(null);
      await loadData();
    } catch (error) {
      console.error('Erro ao ajustar estoque:', error);
      alert('Erro ao ajustar estoque');
    }
  };

  const handleViewMovements = async (item: Inventory) => {
    setSelectedItem(item);
    setIsMovementsModalOpen(true);
    setLoadingMovements(true);
    
    try {
      const response = await inventoryService.getMovements(item.productId, 0, 10);
      setMovements(response.content);
    } catch (error) {
      console.error('Erro ao carregar movimentações:', error);
      alert('Erro ao carregar movimentações');
    } finally {
      setLoadingMovements(false);
    }
  };

  const getStatusColor = (status: StockStatus) => {
    switch (status) {
      case StockStatus.IN_STOCK: return 'text-green-400 bg-green-400/20';
      case StockStatus.LOW_STOCK: return 'text-yellow-400 bg-yellow-400/20';
      case StockStatus.OUT_OF_STOCK: return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = (status: StockStatus) => {
    switch (status) {
      case StockStatus.IN_STOCK: return <CheckCircle className="w-5 h-5" />;
      case StockStatus.LOW_STOCK: return <AlertTriangle className="w-5 h-5" />;
      case StockStatus.OUT_OF_STOCK: return <XCircle className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  if (loading) return <TableLoadingSkeleton />;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
        >
          Gestão de Estoque
        </motion.h1>
      </div>

      {/* Summary Cards */}
      {summary && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total de Produtos</p>
                <p className="text-2xl font-bold text-white">{summary.totalProducts}</p>
              </div>
              <Package className="w-10 h-10 text-blue-400" />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Em Estoque</p>
                <p className="text-2xl font-bold text-green-400">{summary.inStock}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Estoque Baixo</p>
                <p className="text-2xl font-bold text-yellow-400">{summary.lowStock}</p>
                <p className="text-xs text-gray-500">{summary.lowStockPercentage.toFixed(1)}%</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-yellow-400" />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Sem Estoque</p>
                <p className="text-2xl font-bold text-red-400">{summary.outOfStock}</p>
                <p className="text-xs text-gray-500">{summary.outOfStockPercentage.toFixed(1)}%</p>
              </div>
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-2 mb-6"
      >
        <GlassButton 
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-purple-600' : ''}
        >
          Todos
        </GlassButton>
        <GlassButton 
          onClick={() => setFilter('low')}
          className={filter === 'low' ? 'bg-yellow-600' : ''}
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Estoque Baixo
        </GlassButton>
        <GlassButton 
          onClick={() => setFilter('out')}
          className={filter === 'out' ? 'bg-red-600' : ''}
        >
          <XCircle className="w-4 h-4 mr-2" />
          Sem Estoque
        </GlassButton>
      </motion.div>

      {/* Inventory Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-gray-400 font-semibold">Produto</th>
                  <th className="text-left p-4 text-gray-400 font-semibold">SKU</th>
                  <th className="text-center p-4 text-gray-400 font-semibold">Status</th>
                  <th className="text-center p-4 text-gray-400 font-semibold">Atual</th>
                  <th className="text-center p-4 text-gray-400 font-semibold">Disponível</th>
                  <th className="text-center p-4 text-gray-400 font-semibold">Reservado</th>
                  <th className="text-center p-4 text-gray-400 font-semibold">Mínimo</th>
                  <th className="text-right p-4 text-gray-400 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {inventory.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-gray-400">
                      Nenhum produto encontrado
                    </td>
                  </tr>
                ) : (
                  inventory.map((item) => (
                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4">
                        <div className="text-white font-medium">{item.productName}</div>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-400 text-sm">{item.productSku}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(item.stockStatus)}`}>
                            {getStatusIcon(item.stockStatus)}
                            {item.stockStatusDescription}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-white font-bold text-lg">{item.currentStock}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-blue-400 font-semibold">{item.availableStock}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-orange-400">{item.reservedStock}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-gray-400">{item.minStock}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setAdjustData({ ...adjustData, type: 'IN' });
                              setIsAdjustModalOpen(true);
                            }}
                            className="p-2 text-green-400 hover:bg-green-400/20 rounded-lg transition-colors"
                            title="Entrada"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setAdjustData({ ...adjustData, type: 'OUT' });
                              setIsAdjustModalOpen(true);
                            }}
                            className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                            title="Saída"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleViewMovements(item)}
                            className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg transition-colors"
                            title="Histórico"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>

      {/* Modal de Ajuste */}
      <Modal 
        isOpen={isAdjustModalOpen} 
        onClose={() => {
          setIsAdjustModalOpen(false);
          setAdjustData({ type: 'IN', quantity: 1, reason: '', notes: '' });
          setSelectedItem(null);
        }}
        title={`${adjustData.type === 'IN' ? '➕ Entrada' : '➖ Saída'} de Estoque`}
      >
        {selectedItem && (
          <form onSubmit={handleAdjust} className="space-y-4">
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <p className="text-white font-semibold">{selectedItem.productName}</p>
              <p className="text-gray-400 text-sm">Estoque atual: <span className="text-white font-bold">{selectedItem.currentStock}</span></p>
            </div>

            <div>
              <label className="block text-white mb-2">Tipo de Movimentação</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustData({ ...adjustData, type: 'IN' })}
                  className={`flex-1 p-3 rounded-lg border transition-colors ${
                    adjustData.type === 'IN' 
                      ? 'bg-green-500/20 border-green-500 text-green-400' 
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}
                >
                  <TrendingUp className="w-5 h-5 mx-auto mb-1" />
                  Entrada
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustData({ ...adjustData, type: 'OUT' })}
                  className={`flex-1 p-3 rounded-lg border transition-colors ${
                    adjustData.type === 'OUT' 
                      ? 'bg-red-500/20 border-red-500 text-red-400' 
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}
                >
                  <TrendingDown className="w-5 h-5 mx-auto mb-1" />
                  Saída
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white mb-2">Quantidade *</label>
              <input
                type="number"
                required
                min="1"
                value={adjustData.quantity}
                onChange={(e) => setAdjustData({ ...adjustData, quantity: parseInt(e.target.value) })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-white mb-2">Motivo *</label>
              <input
                type="text"
                required
                value={adjustData.reason}
                onChange={(e) => setAdjustData({ ...adjustData, reason: e.target.value })}
                placeholder="Ex: Compra de fornecedor, Venda, Devolução..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-white mb-2">Observações</label>
              <textarea
                value={adjustData.notes || ''}
                onChange={(e) => setAdjustData({ ...adjustData, notes: e.target.value })}
                placeholder="Informações adicionais..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white h-20"
              />
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-blue-400 text-sm">
                Novo estoque: <span className="font-bold">
                  {adjustData.type === 'IN' 
                    ? selectedItem.currentStock + (adjustData.quantity || 0)
                    : Math.max(0, selectedItem.currentStock - (adjustData.quantity || 0))
                  }
                </span>
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAdjustModalOpen(false);
                  setAdjustData({ type: 'IN', quantity: 1, reason: '', notes: '' });
                }}
                className="px-4 py-2 text-white hover:bg-white/10 rounded-lg"
              >
                Cancelar
              </button>
              <GlassButton type="submit">
                Confirmar {adjustData.type === 'IN' ? 'Entrada' : 'Saída'}
              </GlassButton>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal de Movimentações */}
      <Modal
        isOpen={isMovementsModalOpen}
        onClose={() => {
          setIsMovementsModalOpen(false);
          setMovements([]);
          setSelectedItem(null);
        }}
        title="📜 Histórico de Movimentações"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <p className="text-white font-semibold">{selectedItem.productName}</p>
              <p className="text-gray-400 text-sm">SKU: {selectedItem.productSku}</p>
            </div>

            {loadingMovements ? (
              <div className="text-center text-gray-400 py-8">Carregando...</div>
            ) : movements.length === 0 ? (
              <div className="text-center text-gray-400 py-8">Nenhuma movimentação registrada</div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {movements.map((movement) => (
                  <div key={movement.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        movement.type === 'IN' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {movement.typeDescription}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {new Date(movement.createdAt).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(movement.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold">Quantidade: {movement.quantity}</p>
                        <p className="text-gray-400 text-sm">{movement.reason}</p>
                        {movement.notes && <p className="text-gray-500 text-xs mt-1">{movement.notes}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-xs">Por: {movement.performedBy}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
