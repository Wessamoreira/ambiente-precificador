import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { imageService } from '../api/imageService';
import { productService } from '../api/productService';
import { ProductImage, Product } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { TableLoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { Upload, Trash2, Star, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProductImagesPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (productId) {
      loadData();
    }
  }, [productId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productData, imagesData] = await Promise.all([
        productService.getById(productId!),
        imageService.getAll(productId!)
      ]);
      setProduct(productData);
      setImages(imagesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar imagens do produto');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione uma imagem válida');
        return;
      }
      
      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Imagem muito grande! Tamanho máximo: 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !productId) {
      console.log('❌ Upload cancelado - arquivo ou productId ausente');
      return;
    }
    
    console.log('📤 Iniciando upload:', selectedFile.name);
    
    try {
      setUploading(true);
      const result = await imageService.upload(productId, selectedFile);
      console.log('✅ Upload concluído:', result);
      
      // Limpar seleção
      setSelectedFile(null);
      setPreviewUrl(null);
      
      // Resetar input file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Recarregar imagens
      await loadData();
      
      alert('✅ Imagem enviada com sucesso!');
    } catch (error: any) {
      console.error('❌ Erro ao fazer upload:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Erro ao enviar imagem';
      alert('❌ ' + errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!window.confirm('Deseja realmente deletar esta imagem?')) return;
    
    try {
      await imageService.delete(productId!, imageId);
      await loadData();
      alert('Imagem deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert('Erro ao deletar imagem');
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    try {
      await imageService.setPrimary(productId!, imageId);
      await loadData();
      alert('Imagem principal definida!');
    } catch (error) {
      console.error('Erro ao definir primária:', error);
      alert('Erro ao definir imagem principal');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) return <TableLoadingSkeleton />;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/products')}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
            >
              Imagens do Produto
            </motion.h1>
            {product && (
              <p className="text-gray-400 mt-1">{product.name} - {images.length}/10 imagens</p>
            )}
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <GlassCard>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Enviar Nova Imagem
          </h2>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center gap-2 w-full bg-white/10 border-2 border-dashed border-white/20 rounded-xl px-4 py-8 text-white hover:bg-white/20 transition-all cursor-pointer"
              >
                <ImageIcon className="w-6 h-6" />
                <span>Clique para selecionar uma imagem</span>
              </label>
              <p className="text-gray-400 text-sm mt-2">
                Formatos: JPG, PNG, WebP | Tamanho máx: 5MB
              </p>
            </div>

            {previewUrl && (
              <div className="flex-1">
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {selectedFile?.name}
                  </div>
                </div>
                <GlassButton
                  onClick={handleUpload}
                  disabled={uploading || images.length >= 10}
                  className="w-full mt-2"
                >
                  {uploading ? 'Enviando...' : 'Enviar Imagem'}
                </GlassButton>
                {images.length >= 10 && (
                  <p className="text-red-400 text-sm mt-2">Limite de 10 imagens atingido</p>
                )}
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Gallery */}
      {images.length === 0 ? (
        <GlassCard className="text-center py-16">
          <ImageIcon className="w-24 h-24 mx-auto mb-4 text-gray-400 opacity-50" />
          <h3 className="text-2xl font-bold text-white mb-2">Nenhuma imagem cadastrada</h3>
          <p className="text-gray-400">Envie a primeira imagem do produto</p>
        </GlassCard>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="relative group">
                {/* Badge Primária */}
                {image.isPrimary && (
                  <div className="absolute top-2 left-2 z-10 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Principal
                  </div>
                )}

                {/* Imagem */}
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={image.secureUrl}
                    alt={`Imagem ${index + 1}`}
                    className="w-full h-64 object-cover transition-transform group-hover:scale-110"
                  />
                  
                  {/* Overlay com ações */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!image.isPrimary && (
                      <button
                        onClick={() => handleSetPrimary(image.id)}
                        className="p-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-black transition-colors"
                        title="Definir como principal"
                      >
                        <Star className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="p-3 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors"
                      title="Deletar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tamanho:</span>
                    <span className="text-white">{formatFileSize(image.sizeBytes)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Dimensões:</span>
                    <span className="text-white">{image.width} x {image.height}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Formato:</span>
                    <span className="text-white uppercase">{image.format}</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
