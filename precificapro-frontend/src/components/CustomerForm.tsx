import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { GlassButton } from './ui/GlassButton';
import { createCustomer, updateCustomer } from '@/api/customerService';
import type { Customer } from '@/types';

interface CustomerFormData {
  name: string;
  phoneNumber: string;
  email: string;
}

interface CustomerFormProps {
  onSuccess: () => void;
  initialData?: Customer | null;
}

export const CustomerForm = ({ onSuccess, initialData }: CustomerFormProps) => {
  const [formData, setFormData] = useState<CustomerFormData>({ name: '', phoneNumber: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialData;

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        name: initialData.name,
        phoneNumber: initialData.phoneNumber,
        email: initialData.email || '',
      });
    }
  }, [initialData, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (isEditing) {
        await updateCustomer(initialData!.id, formData);
      } else {
        await createCustomer(formData);
      }
      onSuccess();
    } catch (err) {
      setError(`Falha ao ${isEditing ? 'atualizar' : 'salvar'} o cliente.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pt-2">
      <div className="relative">
        <input type="text" name="name" id="customerName" value={formData.name} onChange={handleChange} className="peer w-full p-2 bg-transparent border-b-2 border-white/30 text-white placeholder-transparent focus:outline-none focus:border-violet-400" placeholder="Nome do Cliente" required />
        <label htmlFor="customerName" className="absolute left-2 -top-5 text-gray-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-violet-400 peer-focus:text-sm">Nome do Cliente</label>
      </div>
      <div className="relative">
        <input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="peer w-full p-2 bg-transparent border-b-2 border-white/30 text-white placeholder-transparent focus:outline-none focus:border-violet-400" placeholder="Telefone (com DDD)" required />
        <label htmlFor="phoneNumber" className="absolute left-2 -top-5 text-gray-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-violet-400 peer-focus:text-sm">Telefone (com DDD)</label>
      </div>
      <div className="relative">
        <input type="email" name="email" id="customerEmail" value={formData.email} onChange={handleChange} className="peer w-full p-2 bg-transparent border-b-2 border-white/30 text-white placeholder-transparent focus:outline-none focus:border-violet-400" placeholder="Email (opcional)" />
        <label htmlFor="customerEmail" className="absolute left-2 -top-5 text-gray-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-violet-400 peer-focus:text-sm">Email (opcional)</label>
      </div>

      {error && <p className="text-red-400 text-center">{error}</p>}

      <div className="text-right pt-4">
        <GlassButton type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Salvar Cliente')}
        </GlassButton>
      </div>
    </form>
  );
};