
export interface CalculatorInputs {
  totalOrders: number;
  cancelledOverCall: number;
  rtoPercentage: number;
  sellingPrice: number;
  productCost: number;
  adCostPerOrder: number;
  adGstPercentage: number;
  shippingCost: number;
  rtoShippingCost: number;
  productDamageRtoPercentage: number;
  packingCost: number;
  miscellaneous: number;
}

export interface CalculatedResults {
  orderToBeShipped: number;
  rtoCount: number;
  deliveredOrders: number;
  totalRevenue: number;
  totalProductCost: number;
  totalAdCost: number;
  totalShippingCost: number;
  totalRtoShipping: number;
  totalDamageLoss: number;
  totalPackingCost: number;
  totalMiscellaneous: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
}
