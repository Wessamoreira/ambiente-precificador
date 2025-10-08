import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/api/productService';
import type { Product, ProductData } from '@/types';

/**
 * Hook para buscar produtos com cache automático
 */
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000, // Dados válidos por 5 minutos
    gcTime: 10 * 60 * 1000, // Cache mantido por 10 minutos (antes era cacheTime)
  });
};

/**
 * Hook para criar produto com invalidação de cache
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Invalida cache de produtos para refetch automático
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

/**
 * Hook para atualizar produto com optimistic update
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductData }) => 
      updateProduct(id, data),
    
    // Optimistic update - atualiza UI antes da resposta do servidor
    onMutate: async ({ id, data }) => {
      // Cancela queries em andamento
      await queryClient.cancelQueries({ queryKey: ['products'] });
      
      // Salva estado anterior para rollback
      const previousProducts = queryClient.getQueryData<Product[]>(['products']);
      
      // Atualiza cache otimisticamente
      if (previousProducts) {
        queryClient.setQueryData<Product[]>(
          ['products'],
          previousProducts.map(p => 
            p.id === id ? { ...p, ...data } : p
          )
        );
      }
      
      return { previousProducts };
    },
    
    // Em caso de erro, reverte para estado anterior
    onError: (_err, _variables, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts);
      }
    },
    
    // Sempre refetch após sucesso ou erro
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

/**
 * Hook para deletar produto
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};
