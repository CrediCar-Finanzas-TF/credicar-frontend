export interface FinancingConfig {
  currency: 'S/' | 'USD';
  vehiclePrice: number;
  downPaymentAmount: number;
  downPaymentPercent: number;
  financedAmount: number;
  totalQuotas: number;
  modality: 'Tradicional' | 'Compra inteligente';
  balloonPercent: number;
  rateType: 'Efectiva' | 'Nominal';
  rateValue: number;
  capitalization: string;
  gracePeriodType: 'Parcial' | 'Total';
  gracePeriodMonths: number;
  cok: number;
  notaryFee: number;
  registryFee: number;
}
