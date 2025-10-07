import { useEffect, useState, useMemo } from 'react';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { getCustomers } from '@/api/customerService';
import { getProducts } from '@/api/productService';
import { recordSale } from '@/api/saleService';
import { motion } from 'framer-motion';
import { ShoppingCart, Users, Package, Plus, X, CheckCircle2 } from 'lucide-react';
import type { Customer, Product, SaleItemData } from '@/types';

export const RecordSalePage = () => {
  // ... (toda a lógica de state e funções handle... continua a mesma)
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [cartItems, setCartItems] = useState<SaleItemData[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unitPrice, setUnitPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [customersData, productsData] = await Promise.all([getCustomers(), getProducts()]);
        setCustomers(customersData);
        setProducts(productsData);
      } catch (err) {
        setError('Falha ao carregar clientes ou produtos.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  
  useEffect(() => {
    if (selectedProductId) {
      const product = products.find(p => p.id === selectedProductId);
      if (product) {
        setUnitPrice(product.defaultPurchaseCost.toString());
      } else {
        setUnitPrice('');
      }
    }
  }, [selectedProductId, products]);

  const handleAddItemToCart = () => {
    const qty = parseInt(quantity);
    const price = parseFloat(unitPrice);
    if (!selectedProductId || !qty || qty <= 0 || !price || price <= 0) {
      alert('Selecione um produto e preencha a quantidade e o preço de venda com valores válidos.');
      return;
    }
    const newCartItem: SaleItemData = { productId: selectedProductId, quantity: qty, unitPrice: price };
    setCartItems(prev => [...prev, newCartItem]);
    setSelectedProductId('');
    setQuantity('1');
    setUnitPrice('');
  };
  
  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const handleSubmitSale = async () => {
    const customer = customers.find(c => c.id === selectedCustomerId);
    if (!customer || cartItems.length === 0) {
      alert('Selecione um cliente e adicione pelo menos um item ao carrinho.');
      return;
    }
    try {
      await recordSale({ customerPhoneNumber: customer.phoneNumber, items: cartItems });
      alert('Venda registrada com sucesso!');
      setSelectedCustomerId('');
      setCartItems([]);
    } catch (err) {
      alert('Erro ao registrar a venda.');
    }
  };

  const totalAmount = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  }, [cartItems]);

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmitSaleWithModal = async () => {
    const customer = customers.find(c => c.id === selectedCustomerId);
    if (!customer || cartItems.length === 0) {
      alert('Selecione um cliente e adicione pelo menos um item ao carrinho.');
      return;
    }
    try {
      await recordSale({ customerPhoneNumber: customer.phoneNumber, items: cartItems });
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        setSelectedCustomerId('');
        setCartItems([]);
      }, 2000);
    } catch (err) {
      alert('Erro ao registrar a venda.');
    }
  };

  if (loading) return <p className="text-white">Carregando...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
          <ShoppingCart className="w-8 h-8 text-green-400" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Registrar Nova Venda</h1>
          <p className="text-gray-400 text-sm mt-1">Adicione produtos e finalize a venda</p>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-violet-500/20 rounded-lg">
                <Users className="w-5 h-5 text-violet-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">1. Selecione o Cliente</h2>
            </div>
            <select 
              value={selectedCustomerId} 
              onChange={e => setSelectedCustomerId(e.target.value)} 
              className="w-full p-3 bg-white/10 rounded-lg text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
            >
              <option value="" className="bg-gray-800">Escolha um cliente</option>
              {customers.map(c => <option key={c.id} value={c.id} className="bg-gray-800">{c.name} - {c.phoneNumber}</option>)}
            </select>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Package className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">2. Adicione Produtos ao Carrinho</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="md:col-span-2 flex flex-col">
                <label htmlFor="product" className="text-sm font-medium text-gray-300 mb-2">Produto</label>
                <select 
                  id="product" 
                  value={selectedProductId} 
                  onChange={e => setSelectedProductId(e.target.value)} 
                  className="w-full p-3 bg-white/10 rounded-lg text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
                >
                  <option value="" className="bg-gray-800">Escolha um produto</option>
                  {products.map(p => <option key={p.id} value={p.id} className="bg-gray-800">{p.name}</option>)}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-300 mb-2">Qtd.</label>
                <input 
                  id="quantity" 
                  type="number" 
                  value={quantity} 
                  onChange={e => setQuantity(e.target.value)} 
                  className="w-full p-3 bg-white/10 rounded-lg text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all" 
                  min="1" 
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="unitPrice" className="text-sm font-medium text-gray-300 mb-2">Preço (R$)</label>
                <input 
                  id="unitPrice" 
                  type="number" 
                  value={unitPrice} 
                  onChange={e => setUnitPrice(e.target.value)} 
                  className="w-full p-3 bg-white/10 rounded-lg text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all" 
                  step="0.01" 
                  min="0" 
                />
              </div>
              <GlassButton onClick={handleAddItemToCart} className="flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Adicionar
              </GlassButton>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-1">
          <GlassCard className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">3. Carrinho</h2>
              {cartItems.length > 0 && (
                <span className="ml-auto bg-green-500/30 text-green-400 text-xs font-bold px-2 py-1 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {cartItems.map((item, index) => {
                const product = products.find(p => p.id === item.productId);
                return (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/5 p-3 rounded-lg border border-white/10"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-bold text-white text-sm">{product?.name}</p>
                        <p className="text-gray-400 text-xs">{item.quantity} x {formatCurrency(item.unitPrice)}</p>
                      </div>
                      <button 
                        onClick={() => handleRemoveItem(item.productId)} 
                        className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-semibold text-violet-400 text-right">{formatCurrency(item.quantity * item.unitPrice)}</p>
                  </motion.div>
                )
              })}
              {cartItems.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Carrinho vazio</p>
                </div>
              )}
            </div>
            <hr className="border-white/10 my-4" />
            <div className="flex justify-between text-2xl font-bold text-white mb-6">
              <span>Total:</span>
              <span className="text-green-400">{formatCurrency(totalAmount)}</span>
            </div>
            <GlassButton 
              onClick={handleSubmitSaleWithModal} 
              className="w-full flex items-center justify-center gap-2"
              disabled={cartItems.length === 0}
            >
              <CheckCircle2 className="w-5 h-5" />
              Registrar Venda
            </GlassButton>
          </GlassCard>
        </div>
      </div>

      {/* Modal de Sucesso */}
      {showSuccessModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border-2 border-green-500/30 rounded-2xl p-8 max-w-md w-full text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle2 className="w-12 h-12 text-green-400" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">Venda Registrada!</h3>
            <p className="text-gray-300">A venda foi registrada com sucesso.</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};