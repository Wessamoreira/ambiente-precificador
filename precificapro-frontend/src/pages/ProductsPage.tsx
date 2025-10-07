import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct } from '../api/productService';
import { GlassButton } from '../components/ui/GlassButton';
import { GlassCard } from '../components/ui/GlassCard';
import { Modal } from '../components/ui/Modal';
import { ProductForm } from '../components/ProductForm';
import { TableLoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { Edit2, Trash2, Plus, Search, Image } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '../types';



export const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // NOVO: Estado para guardar o produto que está sendo editado
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError('Falha ao carregar os produtos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Abre o modal para criar um novo produto (sem dados iniciais)
  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  // Abre o modal para editar um produto (com dados iniciais)
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProduct(null); // Limpa o estado de edição ao fechar
  };

  const handleSuccess = () => {
    handleModalClose();
    fetchProducts(); // Recarrega a lista após criar ou editar
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await deleteProduct(productId);
        fetchProducts(); // Recarrega a lista após deletar
      } catch (err) {
        setError('Falha ao excluir o produto.');
      }
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <TableLoadingSkeleton />;
  if (error) return <p className="text-red-400 text-center">{error}</p>;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
        >
          Meus Produtos
        </motion.h1>
        <GlassButton onClick={handleOpenCreateModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Produto
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
            placeholder="Buscar por nome ou SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
          />
        </div>
      </motion.div>
      
      {/* Tabela para Desktop */}
      <div className="hidden md:block">
        <GlassCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Imagem</th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nome</th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">SKU</th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Custo de Compra</th>
                  <th className="py-4 px-6 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => (
                    <motion.tr 
                      key={product.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-white/5 transition-colors duration-200"
                    >
                      <td className="py-4 px-6">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                          {product.primaryImageUrl ? (
                            <img src={product.primaryImageUrl} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Image className="w-6 h-6 text-white" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-white">{product.name}</td>
                      <td className="py-4 px-6 text-sm text-gray-300">{product.sku}</td>
                      <td className="py-4 px-6 text-sm text-gray-300">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.defaultPurchaseCost)}
                      </td>
                      <td className="py-4 px-6 text-sm text-right space-x-2">
                        <button 
                          onClick={() => navigate(`/products/${product.id}/images`)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-all"
                        >
                          <Image className="w-4 h-4" />
                          Imagens
                        </button>
                        <button 
                          onClick={() => handleOpenEditModal(product)} 
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)} 
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
                    <td colSpan={5} className="text-center py-10 text-gray-400">Nenhum produto encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      {/* Cards para Mobile */}
      <div className="md:hidden space-y-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="p-4">
                <div className="flex gap-4 mb-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    {product.primaryImageUrl ? (
                      <img src={product.primaryImageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <Image className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{product.name}</h3>
                    <p className="text-sm text-gray-400">SKU: {product.sku}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-300 mb-1">Custo de Compra</p>
                  <p className="text-xl font-bold text-violet-400">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.defaultPurchaseCost)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/products/${product.id}/images`)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all border border-purple-500/30"
                  >
                    <Image className="w-4 h-4" />
                    Imagens
                  </button>
                  <button 
                    onClick={() => handleOpenEditModal(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all border border-blue-500/30"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
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
          <GlassCard className="p-10 text-center text-gray-400">
            Nenhum produto encontrado.
          </GlassCard>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
      >
        <ProductForm onSuccess={handleSuccess} initialData={editingProduct} />
      </Modal>
    </div>
  );
};