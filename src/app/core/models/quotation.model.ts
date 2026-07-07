export interface QuotationRequest {
  clientId: number;
  vehicleId: number;
  financingAmount: number;
  initialFee: number;
  currency: string;
  totalQuotas: number;
  modality: string;
  interestRateType: string;
  interestRatePercentage: number;
  capitalization: string;
  gracePeriodType: string;
  gracePeriodMonths: number;
  desgravamenRate: number;
  vehicularInsuranceMonthly: number;
  roadsideAssistanceMonthly: number;
  extendedWarrantyMonthly: number;
  unemploymentInsuranceMonthly: number;
  additionalExpenses: number;
  balloonPaymentPercentage: number;
  cokPercentage: number;
}

export interface PaymentScheduleItem {
  quotaNumber: number;
  dueDate: string;
  graceType: string;
  initialBalance: number;
  amortization: number;
  interest: number;
  desgravamenInsurance: number;
  vehicularInsurance: number;
  roadsideAssistance: number;
  extendedWarranty: number;
  unemploymentInsurance: number;
  additionalExpenses: number;
  monthlyQuota: number;
  finalBalance: number;
  currency: string;
}

export interface Quotation {
  id: number;
  clientId: number;
  vehicleId: number;
  financingAmount: number;
  initialFee: number;
  currency: string;
  totalQuotas: number;
  modality: string;
  interestRateType: string;
  interestRatePercentage: number;
  capitalization: string;
  gracePeriodType: string;
  gracePeriodMonths: number;
  desgravamenRate: number;
  vehicularInsuranceMonthly: number;
  roadsideAssistanceMonthly: number;
  extendedWarrantyMonthly: number;
  unemploymentInsuranceMonthly: number;
  van: number;
  tir: number;
  tcea: number;
  schedule: PaymentScheduleItem[];
}

// Mapeo entre las etiquetas en español de la UI y los enums que espera el backend.
export const CURRENCY_MAP: Record<string, string> = { 'S/': 'PEN', 'USD': 'USD' };
export const MODALITY_MAP: Record<string, string> = { 'Compra inteligente': 'SMART', 'Tradicional': 'TRADITIONAL' };
export const RATE_TYPE_MAP: Record<string, string> = { 'Nominal': 'NOMINAL', 'Efectiva': 'EFFECTIVE' };
export const CAPITALIZATION_MAP: Record<string, string> = {
  'Diaria': 'DAILY',
  'Mensual': 'MONTHLY',
  'Trimestral': 'QUARTERLY',
  'Semestral': 'SEMI_ANNUALLY',
  'Anual': 'ANNUALLY'
};
export const GRACE_TYPE_MAP: Record<string, string> = { 'Total': 'TOTAL', 'Parcial': 'PARTIAL' };

export const CURRENCY_SYMBOL: Record<string, string> = { PEN: 'S/', USD: '$' };
