import { useEffect, useState } from 'react';
import { getPricingProfiles, deletePricingProfile } from '@/api/pricingProfileService';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { Modal } from '@/components/ui/Modal';
import { PricingProfileForm } from '@/components/PricingProfileForm';
import { TableLoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { Edit2, Trash2, Plus, Tag, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PricingProfile } from '@/types';

export const PricingProfilesPage = () => {
  const [profiles, setProfiles] = useState<PricingProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<PricingProfile | null>(null);

  const fetchProfiles = async () => {
    try {
      const data = await getPricingProfiles();
      setProfiles(data);
    } catch (err) {
      setError('Falha ao carregar os perfis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingProfile(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (profile: PricingProfile) => {
    setEditingProfile(profile);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProfile(null);
  };

  const handleSuccess = () => {
    handleModalClose();
    fetchProfiles();
  };

  const handleDelete = async (profileId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este perfil?')) {
      try {
        await deletePricingProfile(profileId);
        fetchProfiles();
      } catch (err) {
        setError('Falha ao excluir o perfil.');
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
          <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
            <Tag className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Perfis de Precificação</h1>
        </motion.div>
        <GlassButton onClick={handleOpenCreateModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Perfil
        </GlassButton>
      </div>
      
      {/* Desktop Table */}
      <div className="hidden md:block">
        <GlassCard className="overflow-hidden p-0">
          <table className="min-w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nome</th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Método</th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Markup/Margem</th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Meta de Vendas</th>
                <th className="py-4 px-6 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {profiles.map((profile, index) => (
                <motion.tr 
                  key={profile.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-white/5 transition-colors duration-200"
                >
                  <td className="py-4 px-6 text-sm font-medium text-white">{profile.name}</td>
                  <td className="py-4 px-6 text-sm">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-400 border border-violet-500/30">
                      {profile.method}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-cyan-400 font-semibold">
                    {profile.method === 'MARKUP' ? `${(profile.markup ?? 0) * 100}%` : `${(profile.marginOnPrice ?? 0) * 100}%`}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-300">
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4 text-orange-400" />
                      {profile.monthlySalesTarget} un.
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-right space-x-2">
                    <button 
                      onClick={() => handleOpenEditModal(profile)} 
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(profile.id)} 
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
        {profiles.map((profile, index) => (
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassCard className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-2">{profile.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-400 border border-violet-500/30">
                    {profile.method}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">{profile.method === 'MARKUP' ? 'Markup' : 'Margem'}</p>
                  <p className="text-xl font-bold text-cyan-400">
                    {profile.method === 'MARKUP' ? `${(profile.markup ?? 0) * 100}%` : `${(profile.marginOnPrice ?? 0) * 100}%`}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Meta de Vendas</p>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4 text-orange-400" />
                    <p className="text-xl font-bold text-white">{profile.monthlySalesTarget}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleOpenEditModal(profile)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all border border-blue-500/30"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(profile.id)}
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
        title={editingProfile ? 'Editar Perfil' : 'Cadastrar Novo Perfil'}
      >
        <PricingProfileForm onSuccess={handleSuccess} initialData={editingProfile} />
      </Modal>
    </div>
  );
};