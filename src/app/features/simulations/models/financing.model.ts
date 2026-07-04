export interface Financing {
  currency: 'S/' | 'USD';
  downPayment: number | null;
  installments: string;
  firstPaymentDate: string;
  modality: 'Compra inteligente' | 'Tradicional';
  rateType: 'Efectiva' | 'Nominal';
  rateValue: number | null;
  gracePeriodType: 'Sin gracia' | 'Parcial' | 'Total';
  gracePeriodMonths: number;
  observations: string;
}