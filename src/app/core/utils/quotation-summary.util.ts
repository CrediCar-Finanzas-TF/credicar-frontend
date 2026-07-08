import { CURRENCY_SYMBOL, PaymentScheduleItem, Quotation } from '../models/quotation.model';

export function formatMoney(value: number, currency: string): string {
  const symbol = CURRENCY_SYMBOL[currency] ?? currency;
  return `${symbol} ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPercent(value: number): string {
  return `${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
}

export function formatGraceType(graceType: string): string {
  switch (graceType) {
    case 'TOTAL': return 'Total';
    case 'PARTIAL': return 'Parcial';
    default: return 'Sin gracia';
  }
}

// Se deriva íntegramente de la cotización (funciona tanto recién generada como cargada del historial).
export function buildFinancingSummary(q: Quotation) {
  const vehiclePrice = q.financingAmount + q.initialFee;
  const downPaymentPercent = vehiclePrice > 0 ? (q.initialFee / vehiclePrice) * 100 : 0;
  // Notaría/registro no están dentro de financingAmount, así que se suman aparte para el precio total real.
  const totalOperation = vehiclePrice + q.notaryFee + q.registryFee;

  return {
    totalPrice: formatMoney(totalOperation, q.currency),
    downPayment: formatMoney(q.initialFee, q.currency),
    downPaymentPercent: `${downPaymentPercent.toFixed(0)}%`,
    financedAmount: formatMoney(q.financingAmount, q.currency),
    term: `${q.totalQuotas} meses`,
    rateTypeLabel: q.interestRateType === 'NOMINAL' ? 'TNA' : 'TEA',
    rateValue: q.interestRateType === 'NOMINAL'
      ? `${q.interestRatePercentage}% (Cap. ${q.capitalization})`
      : `${q.interestRatePercentage}%`,
    notaryFee: formatMoney(q.notaryFee, q.currency),
    registryFee: formatMoney(q.registryFee, q.currency)
  };
}

// Se excluyen cuotas con additionalExpenses (ej. cuota 1 con notaría/registro) para
// no mostrar un cargo único como si fuera la cuota "regular" del crédito.
export function getRegularInstallmentLabel(q: Quotation): string {
  if (q.schedule.length === 0) return 'S/ 0.00';
  const regular = q.schedule.find((item: PaymentScheduleItem) => item.graceType === 'NONE' && item.additionalExpenses === 0)
    ?? q.schedule.find((item: PaymentScheduleItem) => item.graceType === 'NONE')
    ?? q.schedule[q.schedule.length - 1];
  return formatMoney(regular.monthlyQuota, regular.currency);
}

export function getFinalBalloonLabel(q: Quotation): string {
  if (q.modality !== 'SMART' || q.schedule.length === 0) return '0';
  const last = q.schedule[q.schedule.length - 1];
  return formatMoney(last.monthlyQuota, last.currency);
}
