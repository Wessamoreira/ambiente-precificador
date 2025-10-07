import { api } from './axios';
import type { CustomerAnalytics, SaleResponseDTO } from '@/types';

export const getCustomerAnalytics = async (): Promise<CustomerAnalytics[]> => {
    // Busca todas as vendas
    const response = await api.get<SaleResponseDTO[]>('/sales');
    const sales = response.data;

    // Agrupa por cliente
    const customerMap = new Map<string, {
        id: string;
        name: string;
        email: string;
        phone: string;
        purchases: number;
        spent: number;
        profit: number;
        productMap: Map<string, { name: string; quantity: number; spent: number; dates: string[] }>;
    }>();

    sales.forEach(sale => {
        const existing = customerMap.get(sale.customer.id) || {
            id: sale.customer.id,
            name: sale.customer.name,
            email: sale.customer.email,
            phone: sale.customer.phoneNumber,
            purchases: 0,
            spent: 0,
            profit: 0,
            productMap: new Map()
        };

        existing.purchases += 1;
        existing.spent += sale.totalAmount;
        existing.profit += sale.totalNetProfit;

        // Agrupa produtos
        sale.items.forEach(item => {
            const productData = existing.productMap.get(item.productId) || {
                name: item.productName,
                quantity: 0,
                spent: 0,
                dates: []
            };

            productData.quantity += item.quantity;
            productData.spent += item.unitPrice * item.quantity;
            productData.dates.push(sale.saleDate);

            existing.productMap.set(item.productId, productData);
        });

        customerMap.set(sale.customer.id, existing);
    });

    // Converte para array de CustomerAnalytics
    const analytics: CustomerAnalytics[] = Array.from(customerMap.values()).map(customer => ({
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        totalPurchases: customer.purchases,
        totalSpent: customer.spent,
        totalProfit: customer.profit,
        averageOrderValue: customer.spent / customer.purchases,
        products: Array.from(customer.productMap.entries()).map(([productId, data]) => ({
            productId,
            productName: data.name,
            totalQuantity: data.quantity,
            totalSpent: data.spent,
            averagePrice: data.spent / data.quantity,
            lastPurchaseDate: data.dates.sort().reverse()[0]
        })),
        lastPurchaseDate: sales
            .filter(s => s.customer.id === customer.id)
            .map(s => s.saleDate)
            .sort()
            .reverse()[0]
    }));

    // Ordena por lucro (maior primeiro)
    return analytics.sort((a, b) => b.totalProfit - a.totalProfit);
};

export const getCustomerAnalyticsById = async (customerId: string): Promise<CustomerAnalytics | null> => {
    const allAnalytics = await getCustomerAnalytics();
    return allAnalytics.find(c => c.customerId === customerId) || null;
};
