// =================== CATEGORY ===================
export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryCreateData {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

// =================== PRODUCT ===================
export interface Product {
    id: string;
    name: string;
    sku: string;
    defaultPurchaseCost: number;
    defaultPackagingCost: number;
    defaultOtherVariableCost: number;
    primaryImageUrl?: string;
  }
  export interface ProductData {
    name: string;
    sku: string;
    defaultPurchaseCost: number;
    defaultPackagingCost: number;
    defaultOtherVariableCost: number;
  }
  
  // =================== CUSTOMER ===================
  export interface Customer {
    id: string;
    name: string;
    phoneNumber: string;
    email: string;
  }
  export interface CustomerData {
    name: string;
    phoneNumber: string;
    email: string;
  }
  
  // =================== COST ITEM ===================
  export enum CostItemType {
      GASOLINA = "GASOLINA", INTERNET = "INTERNET", ENERGIA = "ENERGIA",
      MARKETING = "MARKETING", PROLABORE = "PROLABORE", ALUGUEL = "ALUGUEL",
      ASSINATURAS = "ASSINATURAS", IMPOSTO_DAS = "IMPOSTO_DAS", OUTRO = "OUTRO"
  }
  export interface CostItem {
    id: string;
    description: string;
    type: CostItemType;
    amountMonthly: number;
    active: boolean;
  }
  export interface CostItemData {
    description: string;
    type: CostItemType;
    amountMonthly: number;
    active: boolean;
  }
  
  // =================== PRICING PROFILE ===================
  export enum PricingMethod { MARKUP = "MARKUP", MARGIN = "MARGIN" }
  export enum RoundingRule { NONE = "NONE", UP_TO_0_50 = "UP_TO_0_50", UP_TO_0_90 = "UP_TO_0_90", UP_TO_0_99 = "UP_TO_0_99" }
  export interface PricingProfile {
      id: string; name: string; method: PricingMethod; markup: number | null;
      marginOnPrice: number | null; machineFeePct: number; marketplaceFeePct: number;
      otherFeesPct: number; monthlySalesTarget: number; roundingRule: RoundingRule;
  }
  export interface PricingProfileData {
      name: string; method: PricingMethod; markup: number | null;
      marginOnPrice: number | null; machineFeePct: number; marketplaceFeePct: number;
      otherFeesPct: number; monthlySalesTarget: number; roundingRule: RoundingRule;
  }
  
  // =================== SALE ===================
  export interface SaleItemData { productId: string; quantity: number; unitPrice: number; }
  export interface SaleData { customerPhoneNumber: string; items: SaleItemData[]; }
  export interface CustomerResponseDTO { id: string; name: string; phoneNumber: string; email: string; }
  export interface SaleResponseDTO {
    id: string; saleDate: string; totalAmount: number; totalNetProfit: number;
    customer: CustomerResponseDTO; items: SaleItemResponseDTO[];
  }
  export interface SaleItemResponseDTO {
    id: string; productId: string; productName: string; quantity: number;
    unitPrice: number; unitCostAtSale: number; netProfit: number;
  }
  
  // =================== SIMULATION & DASHBOARD ===================
  export interface SimulationRequest { productId: string; profileId: string; override?: any | null; }
  export interface SimulationResponse {
    suggestedPrice: number; breakEvenUnits: number;
    costBreakdown: {
      purchaseCost: number; packagingCost: number; otherVariableCost: number;
      freightCostUnit: number; directCostUnit: number; indirectCostUnit: number;
      totalCostUnit: number; feesValue: number; costPlusFees: number;
    };
    profitDetails: {
      netProfitPerUnit: number; netProfitPercentage: number; markupOnTotalCost: number;
    };
    monthlyProjection: {
      revenue: number; totalDirectCost: number; totalIndirectCost: number;
      totalFees: number; netProfit: number;
    };
  }
  
  // NOVA INTERFACE PARA O DASHBOARD
  export interface DashboardMetricsDTO {
      totalRevenue: number;
      totalNetProfit: number;
      productCount: number;
      customerCount: number;
  }

  export interface TopCustomer {
    customerId: string;
    customerName: string;
    totalPurchases: number;
    totalSpent: number;
    totalProfit: number;
  }

  export interface TopSale {
    saleId: string;
    customerName: string;
    totalAmount: number;
    netProfit: number;
    saleDate: string;
    itemsCount: number;
  }

  export interface DashboardStats {
    metrics: DashboardMetricsDTO;
    topCustomersByPurchases: TopCustomer[];
    topCustomersByProfit: TopCustomer[];
    topSales: TopSale[];
  }

  export interface CustomerProductPurchase {
    productId: string;
    productName: string;
    totalQuantity: number;
    totalSpent: number;
    averagePrice: number;
    lastPurchaseDate: string;
  }

  export interface CustomerAnalytics {
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    totalPurchases: number;
    totalSpent: number;
    totalProfit: number;
    averageOrderValue: number;
    products: CustomerProductPurchase[];
    lastPurchaseDate: string;
  }

  // =================== INVENTORY & STOCK ===================
  export enum StockStatus {
    IN_STOCK = "IN_STOCK",
    LOW_STOCK = "LOW_STOCK",
    OUT_OF_STOCK = "OUT_OF_STOCK"
  }

  export interface Inventory {
    id: string;
    productId: string;
    productName: string;
    productSku: string;
    currentStock: number;
    minStock: number;
    reservedStock: number;
    availableStock: number;
    stockStatus: StockStatus;
    stockStatusDescription: string;
    lastStockCheck: string;
    updatedAt: string;
  }

  export interface StockAdjustData {
    type: 'IN' | 'OUT';
    quantity: number;
    reason: string;
    notes?: string;
  }

  export interface StockMovement {
    id: string;
    productId: string;
    productName: string;
    type: string;
    typeDescription: string;
    quantity: number;
    reason: string;
    notes?: string;
    performedBy: string;
    createdAt: string;
  }

  export interface InventorySummary {
    totalProducts: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
    lowStockPercentage: number;
    outOfStockPercentage: number;
  }

  // =================== PRODUCT IMAGES ===================
  export interface ProductImage {
    id: string;
    productId: string;
    cloudinaryPublicId: string;
    imageUrl: string;
    thumbnailUrl: string;
    secureUrl: string;
    format: string;
    width: number;
    height: number;
    sizeBytes: number;
    isPrimary: boolean;
    displayOrder: number;
    uploadedAt: string;
  }

  // =================== PRICE HISTORY ===================
  export interface PriceHistory {
    id: string;
    productId: string;
    suggestedPrice: number;
    actualPrice?: number;
    pricingProfileName?: string;
    totalCost: number;
    netProfitPerUnit: number;
    netProfitPercentage: number;
    markupApplied: number;
    marginOnPrice: number;
    createdAt: string;
    createdBy?: string;
    notes?: string;
  }

  export interface PriceEvolution {
    productId: string;
    productName: string;
    periodDays: number;
    dataPoints: Array<{
      date: string;
      suggestedPrice: number;
      profitMargin: number;
      pricingProfile?: string;
    }>;
    minPrice: number;
    maxPrice: number;
    avgPrice: number;
    priceVariation: number;
    trend: 'INCREASING' | 'DECREASING' | 'STABLE';
    totalRecords: number;
  }

  export interface PriceStatistics {
    productId: string;
    productName: string;
    minPrice: number;
    maxPrice: number;
    avgPrice: number;
    currentPrice?: number;
    currentMargin?: number;
    totalRecords: number;
    lastUpdated?: string;
  }