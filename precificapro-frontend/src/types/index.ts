// =================== PRODUCT ===================
export interface Product {
    id: string;
    name: string;
    sku: string;
    defaultPurchaseCost: number;
    defaultPackagingCost: number;
    defaultOtherVariableCost: number;
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