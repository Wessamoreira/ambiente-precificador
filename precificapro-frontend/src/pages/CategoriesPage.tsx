import React, { useState, useEffect } from 'react';
import { categoryService } from '../api/categoryService';
import { Category, CategoryCreateData } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { Modal } from '../components/ui/Modal';
import { TableLoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { useGlassAlert } from '../hooks/useGlassAlert';
import { CategoryProductsModal } from '../components/CategoryProductsModal';
import { Plus, Edit2, Trash2, Package, Search, Folder, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export const CategoriesPage: React.FC = () => {
  const { AlertComponent, showSuccess, showError, showConfirm } = useGlassAlert();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<{ id: string; name: string; color: string } | null>(null);
  const [formData, setFormData] = useState<CategoryCreateData>({
    name: '',
    description: '',
    icon: 'Package',
    color: '#6366f1',
  });

  const colors = [
    { name: 'Azul', value: '#3B82F6' },
    { name: 'Verde', value: '#10B981' },
    { name: 'Amarelo', value: '#F59E0B' },
    { name: 'Roxo', value: '#6366F1' },
    { name: 'Rosa', value: '#EC4899' },
    { name: 'Vermelho', value: '#EF4444' },
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Cinza', value: '#6B7280' },
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      showError('Erro', 'Não foi possível carregar as categorias');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, formData);
        showSuccess('Atualizado!', 'Categoria atualizada com sucesso');
      } else {
        await categoryService.create(formData);
        showSuccess('Criado!', 'Categoria criada com sucesso');
      }
      await loadCategories();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      showError('Erro', 'Não foi possível salvar a categoria');
    }
  };

  const handleDelete = async (id: string) => {
    showConfirm(
      'Excluir Categoria',
      'Deseja realmente deletar esta categoria? Os produtos vinculados ficarão sem categoria.',
      async () => {
        try {
          await categoryService.delete(id);
          await loadCategories();
          showSuccess('Deletado!', 'Categoria removida com sucesso');
        } catch (error) {
          console.error('Erro ao deletar categoria:', error);
          showError('Erro', 'Não foi possível deletar a categoria');
        }
      }
    );
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon || 'Package',
      color: category.color || '#6366f1',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      icon: 'Package',
      color: '#6366f1',
    });
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory({
      id: category.id,
      name: category.name,
      color: category.color || '#6366f1'
    });
  };

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          Categorias
        </motion.h1>
        <GlassButton onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nova Categoria
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
            placeholder="Buscar categorias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </div>
      </motion.div>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <GlassCard className="text-center py-16">
          <Folder className="w-24 h-24 mx-auto mb-4 text-gray-400 opacity-50" />
          <h3 className="text-2xl font-bold text-white mb-2">
            {searchTerm ? 'Nenhuma categoria encontrada' : 'Nenhuma categoria cadastrada'}
          </h3>
          <p className="text-gray-400 mb-6">
            {searchTerm ? 'Tente buscar com outros termos' : 'Comece criando sua primeira categoria'}
          </p>
          {!searchTerm && (
            <GlassButton onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Criar Primeira Categoria
            </GlassButton>
          )}
        </GlassCard>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="h-full flex flex-col p-6">
                {/* Header do Card */}
                <div className="flex items-center gap-4 mb-4">
                  {/* Ícone da Categoria */}
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                    style={{ backgroundColor: category.color + '20', border: `2px solid ${category.color}` }}
                  >
                    <Package className="w-8 h-8" style={{ color: category.color }} />
                  </div>
                  
                  {/* Info da Categoria */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white truncate mb-1" title={category.name}>
                      {category.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-gray-400 text-xs truncate">
                        {category.productCount} {category.productCount === 1 ? 'produto' : 'produtos'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Descrição */}
                {category.description && (
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2 flex-grow" title={category.description}>
                    {category.description}
                  </p>
                )}

                {/* Botões de Ação */}
                <div className="grid grid-cols-3 gap-2 mt-auto">
                  {/* Ver Produtos */}
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className="col-span-3 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-lg transition-all font-medium text-sm shadow-lg"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Produtos
                  </button>
                  
                  {/* Editar */}
                  <button
                    onClick={() => handleEdit(category)}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 rounded-lg transition-all text-sm border border-blue-500/30"
                    title="Editar categoria"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                  
                  {/* Adicionar Produto */}
                  <button
                    onClick={() => {
                      // Navegar para página de produtos com filtro de categoria
                      window.location.href = `/products?category=${category.id}`;
                    }}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 hover:text-green-300 rounded-lg transition-all text-sm border border-green-500/30"
                    title="Adicionar produto"
                  >
                    <Plus className="w-4 h-4" />
                    Novo
                  </button>
                  
                  {/* Deletar */}
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-all text-sm border border-red-500/30"
                    title="Deletar categoria"
                  >
                    <Trash2 className="w-4 h-4" />
                    Deletar
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
          <div>
            <label className="block text-white font-medium mb-2">Nome *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Ex: Eletrônicos, Roupas, Alimentos..."
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-white font-medium mb-2">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all h-24 resize-none"
              placeholder="Descreva esta categoria..."
            />
          </div>

          {/* Cor */}
          <div>
            <label className="block text-white font-medium mb-3">Cor da Categoria</label>
            <div className="grid grid-cols-4 gap-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`h-12 rounded-xl transition-all ${
                    formData.color === color.value
                      ? 'ring-4 ring-white ring-offset-2 ring-offset-gray-800 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-2">Cor selecionada: {formData.color}</p>
          </div>

          {/* Preview */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-3">Preview:</p>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: formData.color + '30', border: `2px solid ${formData.color}` }}
              >
                <Package className="w-6 h-6" style={{ color: formData.color }} />
              </div>
              <div>
                <p className="text-white font-bold">{formData.name || 'Nome da categoria'}</p>
                <p className="text-gray-400 text-sm">{formData.description || 'Descrição...'}</p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-6 py-3 text-white hover:bg-white/10 rounded-xl transition-all font-medium"
            >
              Cancelar
            </button>
            <GlassButton type="submit" className="px-6 py-3 font-medium">
              {editingCategory ? 'Atualizar' : 'Criar Categoria'}
            </GlassButton>
          </div>
        </form>
      </Modal>

      {/* Category Products Modal */}
      {selectedCategory && (
        <CategoryProductsModal
          isOpen={!!selectedCategory}
          onClose={() => setSelectedCategory(null)}
          categoryId={selectedCategory.id}
          categoryName={selectedCategory.name}
          categoryColor={selectedCategory.color}
        />
      )}

      {/* GlassAlert Component */}
      <AlertComponent />
    </div>
  );
};
