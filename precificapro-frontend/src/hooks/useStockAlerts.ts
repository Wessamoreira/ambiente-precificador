import { useState, useEffect, useCallback } from 'react';
import { inventoryService } from '../api/inventoryService';
import { Inventory } from '../types';

interface StockAlert {
  lowStock: Inventory[];
  outOfStock: Inventory[];
  totalAlerts: number;
}

/**
 * Hook personalizado para gerenciar alertas de estoque
 * Busca automaticamente produtos com estoque baixo ou zerado
 * Atualiza a cada 5 minutos
 */
export const useStockAlerts = () => {
  const [alerts, setAlerts] = useState<StockAlert>({
    lowStock: [],
    outOfStock: [],
    totalAlerts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Buscar todos os produtos com estoque baixo ou zerado
      const lowStockProducts = await inventoryService.getLowStock();
      
      // Separar em categorias
      const outOfStock = lowStockProducts.filter(item => item.currentStock === 0);
      const lowStock = lowStockProducts.filter(item => item.currentStock > 0);
      
      setAlerts({
        lowStock,
        outOfStock,
        totalAlerts: lowStockProducts.length
      });
    } catch (err) {
      console.error('Erro ao carregar alertas de estoque:', err);
      setError('Não foi possível carregar os alertas');
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar alertas na montagem do componente
  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  // Atualizar automaticamente a cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      loadAlerts();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [loadAlerts]);

  return {
    alerts,
    loading,
    error,
    refresh: loadAlerts
  };
};
