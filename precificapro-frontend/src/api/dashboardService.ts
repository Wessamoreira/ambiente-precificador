import { api } from './axios';
import type { DashboardMetricsDTO, DashboardStats, TopCustomer, TopSale, SaleResponseDTO } from '@/types';

export const getDashboardMetrics = async (): Promise<DashboardMetricsDTO> => {
    const response = await api.get('/dashboard/metrics');
    return response.data;
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
    // Busca métricas e vendas
    const [metrics, salesResponse] = await Promise.all([
        getDashboardMetrics(),
        api.get<SaleResponseDTO[]>('/sales')
    ]);

    const sales = salesResponse.data;

    // Calcula top clientes por compras
    const customerPurchases = new Map<string, { id: string; name: string; purchases: number; spent: number; profit: number }>();
    
    sales.forEach(sale => {
        const existing = customerPurchases.get(sale.customer.id) || {
            id: sale.customer.id,
            name: sale.customer.name,
            purchases: 0,
            spent: 0,
            profit: 0
        };
        
        existing.purchases += 1;
        existing.spent += sale.totalAmount;
        existing.profit += sale.totalNetProfit;
        
        customerPurchases.set(sale.customer.id, existing);
    });

    const topCustomersByPurchases: TopCustomer[] = Array.from(customerPurchases.values())
        .sort((a, b) => b.purchases - a.purchases)
        .slice(0, 5)
        .map(c => ({
            customerId: c.id,
            customerName: c.name,
            totalPurchases: c.purchases,
            totalSpent: c.spent,
            totalProfit: c.profit
        }));

    const topCustomersByProfit: TopCustomer[] = Array.from(customerPurchases.values())
        .sort((a, b) => b.profit - a.profit)
        .slice(0, 5)
        .map(c => ({
            customerId: c.id,
            customerName: c.name,
            totalPurchases: c.purchases,
            totalSpent: c.spent,
            totalProfit: c.profit
        }));

    const topSales: TopSale[] = sales
        .sort((a, b) => b.totalAmount - a.totalAmount)
        .slice(0, 5)
        .map(sale => ({
            saleId: sale.id,
            customerName: sale.customer.name,
            totalAmount: sale.totalAmount,
            netProfit: sale.totalNetProfit,
            saleDate: sale.saleDate,
            itemsCount: sale.items.length
        }));

    return {
        metrics,
        topCustomersByPurchases,
        topCustomersByProfit,
        topSales
    };
};