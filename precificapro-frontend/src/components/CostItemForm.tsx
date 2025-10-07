import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { GlassButton } from './ui/GlassButton';
import { createCostItem, updateCostItem } from '@/api/costItemService';
import { CostItemType } from '@/types';
import type { CostItem } from '@/types';

interface CostItemFormData {
  description: string;
  type: CostItemType;
  amountMonthly: string;
  active: boolean;
}

interface CostItemFormProps {
  onSuccess: () => void;
  initialData?: CostItem | null;
}

export const CostItemForm = ({ onSuccess, initialData }: CostItemFormProps) => {
  const [formData, setFormData] = useState<CostItemFormData>({ description: '', type: CostItemType.OUTRO, amountMonthly: '', active: true });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!initialData;

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        description: initialData.description,
        type: initialData.type,
        amountMonthly: initialData.amountMonthly.toString(),
        active: initialData.active,
      });
    }
  }, [initialData, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const dataToSend = {
        ...formData,
        amountMonthly: parseFloat(formData.amountMonthly) || 0,
      };
      if (isEditing) {
        await updateCostItem(initialData!.id, dataToSend);
      } else {
        await createCostItem(dataToSend);
      }
      onSuccess();
    } catch (err) {
      setError(`Falha ao salvar o custo.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="text" name="description" placeholder="Descrição (Ex: Aluguel)" value={formData.description} onChange={handleChange} className="w-full p-2 bg-white/10 rounded-md text-white placeholder-gray-400 border border-white/20" required />
      <input type="number" name="amountMonthly" placeholder="Valor Mensal (Ex: 1200.00)" value={formData.amountMonthly} onChange={handleChange} className="w-full p-2 bg-white/10 rounded-md text-white placeholder-gray-400 border border-white/20" required step="0.01" />
      <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 bg-white/10 rounded-md text-white border border-white/20">
        {Object.values(CostItemType).map(type => (
          <option key={type} value={type} className="bg-gray-800">{type}</option>
        ))}
      </select>
      <div className="flex items-center gap-2">
        <input type="checkbox" name="active" id="costActive" checked={formData.active} onChange={handleChange} className="h-4 w-4 rounded" />
        <label htmlFor="costActive" className="text-white">Custo Ativo</label>
      </div>

      {error && <p className="text-red-400 text-center">{error}</p>}
      
      <div className="text-right pt-4">
        <GlassButton type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Salvar Custo')}
        </GlassButton>
      </div>
    </form>
  );
};