import { useState, useEffect, FormEvent } from 'react';
import { GlassButton } from './ui/GlassButton';
import { createPricingProfile, updatePricingProfile } from '@/api/pricingProfileService';
import { PricingMethod, RoundingRule } from '@/types';
import type { PricingProfile, PricingProfileData } from '@/types';

interface PricingProfileFormProps {
  onSuccess: () => void;
  initialData?: PricingProfile | null;
}

export const PricingProfileForm = ({ onSuccess, initialData }: PricingProfileFormProps) => {
  const [formData, setFormData] = useState<PricingProfileData>({
    name: '',
    method: PricingMethod.MARKUP,
    markup: null,
    marginOnPrice: null,
    machineFeePct: 0,
    marketplaceFeePct: 0,
    otherFeesPct: 0,
    monthlySalesTarget: 100,
    roundingRule: RoundingRule.NONE
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!initialData;

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value === '' ? null : parseFloat(value) }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Garante que o valor não selecionado seja nulo
    const dataToSend = {
        ...formData,
        markup: formData.method === PricingMethod.MARKUP ? formData.markup : null,
        marginOnPrice: formData.method === PricingMethod.MARGIN ? formData.marginOnPrice : null,
    };

    try {
      if (isEditing) {
        await updatePricingProfile(initialData!.id, dataToSend);
      } else {
        await createPricingProfile(dataToSend);
      }
      onSuccess();
    } catch (err) {
      setError(`Falha ao salvar o perfil.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
      <div className="md:col-span-2">
        <input type="text" name="name" placeholder="Nome do Perfil (Ex: Varejo Online)" value={formData.name} onChange={handleChange} className="w-full p-2 bg-white/10 rounded-md text-white placeholder-gray-400" required />
      </div>

      <div>
        <label className="text-sm text-gray-300">Método de Precificação</label>
        <select name="method" value={formData.method} onChange={handleChange} className="w-full p-2 bg-white/10 rounded-md text-white border-none mt-1">
          {Object.values(PricingMethod).map(m => <option key={m} value={m} className="bg-gray-800">{m}</option>)}
        </select>
      </div>

      <div>
        <label className="text-sm text-gray-300">Regra de Arredondamento</label>
        <select name="roundingRule" value={formData.roundingRule} onChange={handleChange} className="w-full p-2 bg-white/10 rounded-md text-white border-none mt-1">
          {Object.values(RoundingRule).map(r => <option key={r} value={r} className="bg-gray-800">{r}</option>)}
        </select>
      </div>

      {/* Campos Condicionais */}
      {formData.method === PricingMethod.MARKUP && (
        <div>
          <label className="text-sm text-gray-300">Markup (Ex: 0.8 para 80%)</label>
          <input type="number" name="markup" value={formData.markup ?? ''} onChange={handleNumberChange} className="w-full p-2 bg-white/10 rounded-md text-white mt-1" required step="0.01" />
        </div>
      )}
      {formData.method === PricingMethod.MARGIN && (
        <div>
          <label className="text-sm text-gray-300">Margem de Lucro (Ex: 0.4 para 40%)</label>
          <input type="number" name="marginOnPrice" value={formData.marginOnPrice ?? ''} onChange={handleNumberChange} className="w-full p-2 bg-white/10 rounded-md text-white mt-1" required step="0.01" />
        </div>
      )}
      
      <div>
        <label className="text-sm text-gray-300">Meta de Vendas (Unidades/Mês)</label>
        <input type="number" name="monthlySalesTarget" value={formData.monthlySalesTarget} onChange={handleNumberChange} className="w-full p-2 bg-white/10 rounded-md text-white mt-1" required />
      </div>
      <div>
        <label className="text-sm text-gray-300">Taxa Maquininha (Ex: 0.04 para 4%)</label>
        <input type="number" name="machineFeePct" value={formData.machineFeePct} onChange={handleNumberChange} className="w-full p-2 bg-white/10 rounded-md text-white mt-1" required step="0.001" />
      </div>
      <div>
        <label className="text-sm text-gray-300">Taxa Marketplace (Ex: 0.12 para 12%)</label>
        <input type="number" name="marketplaceFeePct" value={formData.marketplaceFeePct} onChange={handleNumberChange} className="w-full p-2 bg-white/10 rounded-md text-white mt-1" required step="0.001" />
      </div>

      {error && <p className="text-red-400 text-center md:col-span-2">{error}</p>}
      
      <div className="text-right pt-4 md:col-span-2">
        <GlassButton type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Salvar Perfil')}
        </GlassButton>
      </div>
    </form>
  );
};