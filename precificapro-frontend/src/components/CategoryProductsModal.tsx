import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { productService } from '../api/productService';
import { Product } from '../types';
import { Package, Search, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CategoryProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
}

export const CategoryProductsModal = ({ 
  isOpen, 
  onClose, 
  categoryId, 
  categoryName,
  categoryColor 
}: CategoryProductsModalProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen && categoryId) {
      loadProducts();
    }
  }, [isOpen, categoryId]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductsByCategory(categoryId);
      setProducts(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={categoryName} size="lg">
      <div className="space-y-6">
        {/* Header com Stats */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: categoryColor + '30', border: `2px solid ${categoryColor}` }}
            >
              <Package className="w-6 h-6" style={{ color: categoryColor }} />
            </div>
            <div>
              <p className="text-lg font-bold text-white">{products.length} Produtos</p>
              <p className="text-sm text-gray-400">nesta categoria</p>
            </div>
          </div>
        </div>

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </div>

        {/* Lista de Produtos */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl p-4 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Imagem/Ícone */}
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                        {product.primaryImageUrl ? (
                          <img 
                            src={product.primaryImageUrl} 
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="w-7 h-7 text-white" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-bold text-lg truncate">{product.name}</h4>
                        <p className="text-gray-400 text-sm">SKU: {product.sku}</p>
                      </div>

                      {/* Preço */}
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Custo</p>
                        <p className="text-lg font-bold text-cyan-400">
                          {formatCurrency(product.defaultPurchaseCost)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-500 opacity-50" />
            <p className="text-gray-400 text-lg">
              {searchTerm ? 'Nenhum produto encontrado' : 'Nenhum produto nesta categoria'}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {!searchTerm && 'Adicione produtos ao editar um produto e selecionar esta categoria'}
            </p>
          </div>
        )}

        {/* Footer com Total */}
        {filteredProducts.length > 0 && (
          <div className="p-4 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-violet-500/30 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">
                Mostrando {filteredProducts.length} de {products.length} produtos
              </span>
              <div className="flex items-center gap-2 text-violet-400 font-semibold">
                <DollarSign className="w-5 h-5" />
                Custo Total: {formatCurrency(
                  filteredProducts.reduce((sum, p) => sum + p.defaultPurchaseCost, 0)
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
