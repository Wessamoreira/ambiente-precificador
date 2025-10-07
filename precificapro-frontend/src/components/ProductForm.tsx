import { useState, useEffect } from 'react';
import type { FormEvent } from 'react'; // <-- CORREÇÃO DA IMPORTAÇÃO DE TIPO
import { GlassButton } from './ui/GlassButton';
import { createProduct, updateProduct } from '../api/productService'; 
import type { Product } from '../types'; // <-- Vamos importar o tipo centralizado (próximo passo)

interface ProductFormData {
  name: string;
  sku: string;
  defaultPurchaseCost: string;
  defaultPackagingCost: string;
  defaultOtherVariableCost: string;
}

interface ProductFormProps {
  onSuccess: () => void;
  initialData?: Product | null;
}

export const ProductForm = ({ onSuccess, initialData }: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '', sku: '', defaultPurchaseCost: '', defaultPackagingCost: '', defaultOtherVariableCost: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const isEditing = !!initialData;

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        name: initialData.name,
        sku: initialData.sku,
        defaultPurchaseCost: initialData.defaultPurchaseCost.toString(),
        defaultPackagingCost: initialData.defaultPackagingCost.toString(),
        defaultOtherVariableCost: initialData.defaultOtherVariableCost.toString(),
      });
    }
  }, [initialData, isEditing]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const dataToSend = {
        name: formData.name,
        sku: formData.sku,
        defaultPurchaseCost: parseFloat(formData.defaultPurchaseCost) || 0,
        defaultPackagingCost: parseFloat(formData.defaultPackagingCost) || 0,
        defaultOtherVariableCost: parseFloat(formData.defaultOtherVariableCost) || 0,
      };

      if (isEditing) {
        await updateProduct(initialData!.id, dataToSend); // Usamos '!' pois sabemos que initialData existe em modo de edição
      } else {
        await createProduct(dataToSend);
      }
      onSuccess();
    } catch (err) {
      setError(`Falha ao ${isEditing ? 'atualizar' : 'criar'} o produto.`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pt-2">
      <div className="relative">
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="peer w-full p-2 bg-transparent border-b-2 border-white/30 text-white placeholder-transparent focus:outline-none focus:border-violet-400" placeholder="Nome do Produto" required />
        <label htmlFor="name" className="absolute left-2 -top-5 text-gray-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-violet-400 peer-focus:text-sm">Nome do Produto</label>
      </div>
      <div className="relative">
        <input type="text" name="sku" id="sku" value={formData.sku} onChange={handleChange} className="peer w-full p-2 bg-transparent border-b-2 border-white/30 text-white placeholder-transparent focus:outline-none focus:border-violet-400" placeholder="SKU" required />
        <label htmlFor="sku" className="absolute left-2 -top-5 text-gray-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-violet-400 peer-focus:text-sm">SKU</label>
      </div>
      <div className="relative">
        <input type="number" name="defaultPurchaseCost" id="defaultPurchaseCost" value={formData.defaultPurchaseCost} onChange={handleChange} className="peer w-full p-2 bg-transparent border-b-2 border-white/30 text-white placeholder-transparent focus:outline-none focus:border-violet-400" placeholder="Custo de Compra" required step="0.01" />
        <label htmlFor="defaultPurchaseCost" className="absolute left-2 -top-5 text-gray-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-violet-400 peer-focus:text-sm">Custo de Compra (R$)</label>
      </div>
      <div className="relative">
        <input type="number" name="defaultPackagingCost" id="defaultPackagingCost" value={formData.defaultPackagingCost} onChange={handleChange} className="peer w-full p-2 bg-transparent border-b-2 border-white/30 text-white placeholder-transparent focus:outline-none focus:border-violet-400" placeholder="Custo da Embalagem" required step="0.01" />
        <label htmlFor="defaultPackagingCost" className="absolute left-2 -top-5 text-gray-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-violet-400 peer-focus:text-sm">Custo da Embalagem (R$)</label>
      </div>
      <div className="relative">
        <input type="number" name="defaultOtherVariableCost" id="defaultOtherVariableCost" value={formData.defaultOtherVariableCost} onChange={handleChange} className="peer w-full p-2 bg-transparent border-b-2 border-white/30 text-white placeholder-transparent focus:outline-none focus:border-violet-400" placeholder="Outros Custos Variáveis" required step="0.01" />
        <label htmlFor="defaultOtherVariableCost" className="absolute left-2 -top-5 text-gray-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-violet-400 peer-focus:text-sm">Outros Custos Variáveis (R$)</label>
      </div>

      {error && <p className="text-red-400 text-center">{error}</p>}
      
      <div className="text-right pt-4">
        <GlassButton type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Salvar Produto')}
        </GlassButton>
      </div>
    </form>
  );
};